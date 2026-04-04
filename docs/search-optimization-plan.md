# Joblit 搜索与平台性能优化方案

**Date:** 2026-03-29
**Branch:** master
**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript strict, Prisma 7.4 + PostgreSQL (Neon Serverless), TanStack Query v5, Tailwind CSS v4, shadcn/ui, framer-motion, next-intl, Zod v4, Vercel

---

## 一、现状分析摘要

### 1.1 架构现状

Joblit 是一个面向 AU/CN 双市场的求职管理平台。搜索为核心交互路径：用户通过关键词 + 筛选器在个人 Job 列表中搜索、浏览、管理职位。

**当前请求链路：**

```
用户输入 → debounce 200ms (仅 q 字段) → URLSearchParams → React Query fetch
  → GET /api/jobs?{params}
  → Zod validation → requireSession()
  → jobListService.listJobs(userId, query)
    → buildWhereClause()  // ILIKE 三字段 OR 匹配
    → Promise.all([prisma.job.findMany(), prisma.job.count()])
    → getCursorPage() → buildJobsListEtag()
  → ETag compare (304 / 200)
  → Client 合并多页结果 + 去重
```

### 1.2 核心问题汇总

| 优先级 | 问题 | 影响 |
|--------|------|------|
| **P0** | `title`/`company`/`location` 无索引 → `ILIKE` 全表扫描 | 数据增长后搜索延迟线性恶化 |
| **P1** | `platform` 参数接受但忽略 | 筛选无效 |
| **P1** | Job 详情独立查询（N+1） | 每次选中多一次 DB roundtrip |
| **P2** | 仅 `q` 有 debounce，其他筛选器无防抖 | 快速切换触发多次 API |
| **P2** | 无相关性排序 | 搜索结果按时间而非匹配度排列 |
| **P2** | Suggestions API 无缓存 | 每次自动补全都查库 |
| **P3** | 无 Error Boundary | 路由错误导致白屏 |
| **P3** | 无虚拟滚动 | 深度加载后 DOM 节点过多 |
| **P3** | 无键盘导航 | Accessibility 不足 |
| **P3** | `JobsClient.tsx` 2,638 行（God Component） | 不可维护 |

### 1.3 数据特征

- 每用户 Job 数量：当前数百条，预期增长到数千条
- 搜索频率：每次输入字符触发 debounce → API 请求
- 双语环境：AU 市场英文为主，CN 市场中文为主
- 个人数据隔离：所有查询都带 `userId` WHERE 前缀

---

## 二、方案对比

### 方案 A: B-tree Index + ILIKE 增量修复（保守渐进）

**核心思路：** 在现有 `ILIKE`/`contains` 搜索架构上，补充 B-tree 索引 + 前端性能优化 + 缓存增强。不引入新的 PostgreSQL 扩展。

**Scope:**
- 添加 `title`/`company`/`location`/`jobLevel` 的 B-tree 复合索引
- 为所有筛选器添加 debounce + AbortController
- Suggestions API 加 ETag + `Cache-Control`
- 前端组件拆分 + React.memo + Skeleton 优化
- Error Boundary 覆盖

**Pros:**
- 改动最小，零回归风险
- 不依赖 PostgreSQL 扩展（Neon 完全兼容）
- 1-2 周可完成全部工作
- 团队理解成本低

**Cons:**
- B-tree 对 `ILIKE '%keyword%'`（中间匹配）**无法加速**，只对前缀 `LIKE 'keyword%'` 有效
- 无法实现相关性排序
- 中文分词完全不支持
- 搜索能力天花板低

**Effort:** 约 5-8 人天
**Risk:** 低

---

### 方案 B: pg_trgm 三字匹配 + GIN 索引（推荐 — 精准平衡）

**核心思路：** 启用 PostgreSQL `pg_trgm` 扩展，使用 trigram GIN 索引加速 `ILIKE` 中间匹配。同时引入 `similarity()` / `word_similarity()` 实现相关性排序。搭配全面的前端性能优化和 UX 改进。

**Scope:**
- 启用 `pg_trgm` 扩展（Neon 原生支持）
- 为 `title`/`company`/`location` 创建 trigram GIN 索引
- 使用 `similarity()` 函数进行相关性排序
- 中文通过 trigram 的 Unicode 三字符窗口获得基础模糊匹配能力
- 全面的前端性能优化（虚拟滚动、组件拆分、prefetch 等）
- Suggestions API 重建（ETag + stale-while-revalidate）
- 搜索历史、高亮、键盘导航等 UX 提升

**Pros:**
- `pg_trgm` GIN 索引可加速 `ILIKE '%keyword%'` 中间匹配 — 直接解决 P0
- `similarity()` 提供 0.0-1.0 相关性评分 — 解决 P2 排序问题
- 对中文的三字符匹配提供基础模糊能力（非精确分词，但覆盖常见搜索场景）
- Neon Serverless 原生支持 `pg_trgm`，无需额外基础设施
- 与 Prisma `$queryRaw` 兼容良好
- 增量迁移 — 现有 `ILIKE` 查询无需修改即可受益于 GIN 索引

**Cons:**
- 需要 Raw SQL 实现相关性排序（Prisma ORM 不支持 `similarity()` 函数）
- Trigram 对极短关键词（1-2 字符）和罕见中文词组效果有限
- GIN 索引增加写入开销（约 10-15%）
- 比方案 A 复杂度高

**Effort:** 约 10-15 人天
**Risk:** 中低

---

### 方案 C: Full-Text Search (tsvector + GIN) + 中文分词（高配）

**核心思路：** 引入 PostgreSQL 原生全文搜索（`tsvector`/`tsquery`），为中文市场配置 `zhparser` 或 `pg_jieba` 分词器，实现 `ts_rank()` 排序、词干提取、停用词过滤。

**Scope:**
- 添加 `search_vector tsvector` 计算列 + GIN 索引
- 用 Trigger 自动维护 tsvector（INSERT/UPDATE）
- 英文使用 `english` 字典，中文使用 `zhparser`/`simple` 字典
- `ts_rank()` 实现相关性排序
- 全部前端优化（同方案 B）

**Pros:**
- 搜索能力最强：词干提取、停用词、phrase 搜索、布尔逻辑
- `ts_rank()` 排序质量最高
- 标准 PostgreSQL 全文搜索，长期生态好

**Cons:**
- **Neon Serverless 不支持 `zhparser`/`pg_jieba`** — 中文全文搜索需要用 `simple` 分词器（按空格分词，对中文基本无效）或付费迁移到支持自定义扩展的 PostgreSQL 托管
- 需要新增 `search_vector` 列 + Trigger + Migration — schema 变动大
- tsvector 不支持中间匹配（只能前缀匹配 `ts_rank` 或精确词匹配）
- Prisma 不原生支持 tsvector — 全部搜索逻辑需 `$queryRaw`
- 开发和调试成本高，回归风险中

**Effort:** 约 20-30 人天
**Risk:** 中高

---

### 方案对比表

| 维度 | 方案 A: B-tree 增量 | 方案 B: pg_trgm (推荐) | 方案 C: Full-Text Search |
|------|-------------------|---------------------|------------------------|
| **搜索质量** | 低（ILIKE 精确匹配） | 中高（模糊匹配 + similarity 排序） | 高（词干 + 排序 + 布尔） |
| **中文支持** | 仅 ILIKE | 基础 trigram（可用） | 需 zhparser（Neon 不支持） |
| **中间匹配加速** | 不支持 | 支持（GIN trigram） | 不支持（词匹配） |
| **相关性排序** | 不支持 | `similarity()` 评分 | `ts_rank()` 评分 |
| **Neon 兼容性** | 完全兼容 | 完全兼容 | 部分兼容（缺 zhparser） |
| **Prisma 兼容** | 完全 ORM | ORM + 少量 Raw SQL | 大量 Raw SQL |
| **Schema 变动** | 仅加索引 | 仅加索引 | 新增列 + Trigger |
| **写入性能影响** | 无 | ~10-15% | ~15-25% |
| **开发工期** | 5-8 天 | 10-15 天 | 20-30 天 |
| **风险等级** | 低 | 中低 | 中高 |
| **可维护性** | 高 | 高 | 中 |
| **扩展性** | 低（天花板明显） | 中高（可后续升级 FTS） | 高 |

### 推荐结论

**推荐方案 B: pg_trgm 三字匹配 + GIN 索引**

理由：
1. **直接解决 P0** — trigram GIN 索引加速 `ILIKE '%keyword%'` 中间匹配，这是方案 A 无法做到的
2. **Neon 完全兼容** — 方案 C 的中文分词需要 Neon 不支持的扩展
3. **渐进式** — 现有 `ILIKE` 查询自动受益于 GIN 索引，再用 `similarity()` 增强排序
4. **中文可用** — trigram 虽非精确分词，但对「三字及以上」的中文搜索有效
5. **成本可控** — 10-15 天完成全部优化，后续可平滑升级到 FTS

---

## 三、推荐方案详细设计

### 3.1 搜索算法优化

#### 3.1.1 启用 pg_trgm 扩展

在 Neon Console 或通过 migration 启用：

```sql
-- Migration: 20260329_enable_pg_trgm.sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

Prisma migration 文件：

```
prisma/migrations/20260329000000_enable_pg_trgm/migration.sql
```

#### 3.1.2 创建 Trigram GIN 索引

```sql
-- Migration: 20260329_add_trigram_indexes.sql

-- 搜索字段 trigram GIN 索引（加速 ILIKE 中间匹配）
CREATE INDEX CONCURRENTLY idx_job_title_trgm
  ON "Job" USING gin (title gin_trgm_ops);

CREATE INDEX CONCURRENTLY idx_job_company_trgm
  ON "Job" USING gin (company gin_trgm_ops);

CREATE INDEX CONCURRENTLY idx_job_location_trgm
  ON "Job" USING gin (location gin_trgm_ops);

-- jobLevel 等值匹配 B-tree 索引
CREATE INDEX CONCURRENTLY idx_job_user_joblevel
  ON "Job" (("userId"), "jobLevel");
```

> **关键点：** `gin_trgm_ops` 操作符类使 `ILIKE '%keyword%'` 查询自动走 GIN 索引扫描而非顺序扫描。无需修改现有 Prisma `contains` 查询代码。

Prisma Schema 中标记索引（文档用途，实际由 Raw SQL migration 创建）：

```prisma
model Job {
  // ... existing fields ...

  @@index([userId, jobUrl])   // existing unique
  @@index([userId, createdAt])
  @@index([userId, updatedAt])
  @@index([userId, status])
  @@index([userId, market, createdAt])
  @@index([userId, jobLevel])  // NEW: B-tree for exact match
  // GIN trigram indexes created via raw SQL migration
}
```

#### 3.1.3 相关性排序搜索查询

当用户提供 `q` 关键词时，使用 `similarity()` 函数计算匹配得分并排序。保留无 `q` 时的时间排序。

**新增 `searchJobsWithRelevance` 函数：**

```typescript
// lib/server/jobs/jobSearchService.ts

import { Prisma } from "@/lib/generated/prisma";
import { prisma } from "@/lib/server/prisma";

type SearchParams = {
  userId: string;
  q: string;
  status?: string;
  market?: string;
  location?: string;
  jobLevel?: string;
  limit: number;
  cursor?: string;
};

export async function searchJobsWithRelevance(params: SearchParams) {
  const { userId, q, status, market, location, jobLevel, limit, cursor } = params;

  const conditions: string[] = [`j."userId" = $1`];
  const values: unknown[] = [userId];
  let paramIdx = 2;

  // q → trigram similarity across title, company, location
  conditions.push(`(
    j."title" ILIKE $${paramIdx}
    OR j."company" ILIKE $${paramIdx}
    OR j."location" ILIKE $${paramIdx}
  )`);
  values.push(`%${q}%`);
  paramIdx++;

  if (status) {
    conditions.push(`j."status" = $${paramIdx}::\"JobStatus\"`);
    values.push(status);
    paramIdx++;
  }

  if (market) {
    conditions.push(`j."market" = $${paramIdx}`);
    values.push(market);
    paramIdx++;
  }

  if (jobLevel) {
    conditions.push(`j."jobLevel" = $${paramIdx}`);
    values.push(jobLevel);
    paramIdx++;
  }

  // Location filter (simplified — state expansion done in calling code)
  if (location) {
    conditions.push(`j."location" ILIKE $${paramIdx}`);
    values.push(`%${location}%`);
    paramIdx++;
  }

  // Cursor pagination
  if (cursor) {
    conditions.push(`j."id" != $${paramIdx}`);
    values.push(cursor);
    paramIdx++;
  }

  const qParamIdx = 2; // q is always $2

  const sql = Prisma.sql`
    SELECT
      j."id", j."jobUrl", j."title", j."company", j."location",
      j."jobType", j."jobLevel", j."status", j."market",
      j."createdAt", j."updatedAt",
      GREATEST(
        similarity(LOWER(j."title"), LOWER(${q})),
        similarity(LOWER(COALESCE(j."company", '')), LOWER(${q})),
        similarity(LOWER(COALESCE(j."location", '')), LOWER(${q}))
      ) AS relevance_score
    FROM "Job" j
    WHERE ${Prisma.raw(conditions.join(" AND "))}
    ORDER BY relevance_score DESC, j."createdAt" DESC
    LIMIT ${limit + 1}
  `;

  // Note: actual implementation uses $queryRawUnsafe with parameterized values
  // The above is conceptual — see section 3.1.5 for production code
}
```

#### 3.1.4 中英文混合搜索策略

| 场景 | 策略 | 说明 |
|------|------|------|
| 英文关键词 3+ 字符 | `ILIKE + similarity()` | trigram 完美覆盖 |
| 英文关键词 1-2 字符 | `ILIKE` only (skip similarity) | trigram 对极短字符串效果差 |
| 中文关键词 3+ 字符 | `ILIKE + similarity()` | Unicode trigram 对三字及以上中文可用 |
| 中文关键词 1-2 字符 | `ILIKE` only | 二字中文仅有一个 trigram，recall 低 |
| 混合中英文 | `ILIKE` + 分别计算 similarity | 取最高 similarity 分数 |

**实现判断：**

```typescript
// lib/server/jobs/searchUtils.ts

export function shouldUseRelevanceSort(q: string): boolean {
  const trimmed = q.trim();
  if (trimmed.length < 3) return false;
  // CJK character detection
  const cjkCount = (trimmed.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
  if (cjkCount > 0 && cjkCount < 2) return false; // 单个汉字不用 similarity
  return true;
}
```

#### 3.1.5 生产级搜索服务改造

改造 `jobListService.ts` 的 `listJobs` 函数，使其在有 `q` 参数时切换到 relevance 排序：

```typescript
// lib/server/jobs/jobListService.ts — listJobs 改造要点

export async function listJobs(userId: string, query: JobListQuery): Promise<JobListResult> {
  const { limit, cursor, sort, q } = query;
  const where = buildWhereClause(userId, query);

  if (q && shouldUseRelevanceSort(q)) {
    // Relevance-ranked search via raw SQL
    return listJobsWithRelevance(userId, query);
  }

  // Existing time-sorted path (unchanged)
  const orderBy = sort === "oldest"
    ? [{ createdAt: "asc" as const }, { id: "asc" as const }]
    : [{ createdAt: "desc" as const }, { id: "desc" as const }];

  const [jobsWithExtra, totalCount] = await Promise.all([
    prisma.job.findMany({ where, orderBy, take: limit + 1, /* ... */ }),
    prisma.job.count({ where }),
  ]);
  // ... rest unchanged
}
```

#### 3.1.6 搜索建议（Autocomplete）改进

当前 suggestions API 查询最近 80 条 `title ILIKE` 匹配，无缓存。改进方案：

```typescript
// app/api/jobs/suggestions/route.ts — 改造

export async function GET(req: Request) {
  // ... auth, validation ...

  const q = parsed.data.q.toLowerCase();

  // 1. 使用 similarity 排序建议结果
  const suggestions = await prisma.$queryRaw<{ title: string; score: number }[]>`
    SELECT DISTINCT ON (title) title,
           similarity(LOWER(title), LOWER(${q})) AS score
    FROM "Job"
    WHERE "userId" = ${userId}::uuid
      AND (title ILIKE ${`%${q}%`} OR similarity(LOWER(title), LOWER(${q})) > 0.1)
    ORDER BY title, score DESC
    LIMIT 15
  `;

  // 2. 合并 fallback 建议
  const fallbackMatches = FALLBACK_SUGGESTIONS
    .filter(s => s.toLowerCase().includes(q))
    .slice(0, 5);

  const combined = [
    ...suggestions.map(s => s.title),
    ...fallbackMatches,
  ].slice(0, 15);

  // 3. ETag + Cache-Control
  const etag = buildSuggestionsEtag(userId, q, combined);
  const ifNoneMatch = req.headers.get("if-none-match");
  if (ifNoneMatch === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: { ETag: etag, "Cache-Control": "private, max-age=30" },
    });
  }

  return NextResponse.json(
    { suggestions: combined },
    { headers: { ETag: etag, "Cache-Control": "private, max-age=30" } },
  );
}
```

---

### 3.2 数据库性能优化

#### 3.2.1 索引策略全览

| 索引 | 类型 | 加速的查询 | 优先级 |
|------|------|-----------|--------|
| `idx_job_title_trgm` | GIN (gin_trgm_ops) | `title ILIKE '%keyword%'` | P0 |
| `idx_job_company_trgm` | GIN (gin_trgm_ops) | `company ILIKE '%keyword%'` | P0 |
| `idx_job_location_trgm` | GIN (gin_trgm_ops) | `location ILIKE '%keyword%'` | P0 |
| `idx_job_user_joblevel` | B-tree | `jobLevel = 'xxx'` | P0 |
| 现有 `userId_createdAt` | B-tree | 时间排序 | 已有 |
| 现有 `userId_status` | B-tree | 状态筛选 | 已有 |
| 现有 `userId_market_createdAt` | B-tree | 市场+排序 | 已有 |

#### 3.2.2 Migration 执行计划

```sql
-- prisma/migrations/20260330000000_search_optimization/migration.sql

-- Step 1: 启用扩展
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Step 2: Trigram GIN 索引（CONCURRENTLY 避免锁表）
-- 注意：Prisma migration 不支持 CONCURRENTLY，生产环境需手动执行
CREATE INDEX idx_job_title_trgm ON "Job" USING gin (title gin_trgm_ops);
CREATE INDEX idx_job_company_trgm ON "Job" USING gin (company gin_trgm_ops);
CREATE INDEX idx_job_location_trgm ON "Job" USING gin (location gin_trgm_ops);

-- Step 3: jobLevel B-tree 索引
CREATE INDEX idx_job_user_joblevel ON "Job" ("userId", "jobLevel");

-- Step 4: 设置 trigram 相似度阈值（全局默认 0.3，可按需调整）
-- 注意：这是 session 级设置，生产环境可在连接池初始化时设置
-- SET pg_trgm.similarity_threshold = 0.1;
```

**Neon Serverless 注意事项：**
- Neon 支持 `pg_trgm` 扩展 — 可通过 `CREATE EXTENSION` 直接启用
- Neon 不支持 `CREATE INDEX CONCURRENTLY` 在 Prisma migration 中 — 对于生产环境应通过 Neon Console SQL Editor 或连接后手动执行
- Neon 的 autoscaling 对 GIN 索引构建有额外冷启动开销 — 建议在写入不密集的时段执行

#### 3.2.3 查询优化：合并 count

当前 `listJobs` 使用 `Promise.all([findMany, count])` 做两次 DB roundtrip。使用 Window Function 可合并为一次：

```sql
-- 优化版本：单次查询返回 items + totalCount
SELECT
  j.*,
  COUNT(*) OVER() AS total_count
FROM "Job" j
WHERE j."userId" = $1
  AND /* ... filters ... */
ORDER BY j."createdAt" DESC, j."id" DESC
LIMIT $2
OFFSET $3;
```

**但 Prisma ORM 不直接支持 Window Function**，需要 `$queryRaw`。建议：

- **Phase 1：** 保持 `Promise.all` 双查询（已并行，延迟影响小）
- **Phase 2：** 当搜索用 `$queryRaw` 实现相关性排序时，顺带合并 count

#### 3.2.4 连接池优化

Neon Serverless Adapter 配置建议：

```typescript
// lib/server/prisma.ts

import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/lib/generated/prisma";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Neon serverless 建议值
  max: 10,                   // Vercel serverless 函数共享
  idleTimeoutMillis: 30_000, // 30s idle 后释放
  connectionTimeoutMillis: 10_000,
});

const adapter = new PrismaNeon(pool);

export const prisma = new PrismaClient({ adapter });
```

---

### 3.3 前端性能优化

#### 3.3.1 组件拆分（解决 God Component）

将 `JobsClient.tsx`（2,638 行）拆分为：

```
app/(app)/jobs/
├── JobsClient.tsx           ← 编排层 (~300 行)
├── components/
│   ├── JobSearchBar.tsx     ← 搜索栏 + 筛选器
│   ├── JobListPanel.tsx     ← 列表面板 + 无限滚动
│   ├── JobListItem.tsx      ← 单条 Job 卡片（React.memo）
│   ├── JobDetailPanel.tsx   ← 右侧详情面板
│   ├── JobDeleteDialog.tsx  ← 删除确认 Dialog
│   ├── JobAddDialog.tsx     ← 新增 Job Dialog
│   └── JobExternalDialog.tsx ← 外部 Prompt Dialog
├── hooks/
│   ├── useJobSearch.ts      ← 搜索状态 + debounce + queryString
│   ├── useJobPagination.ts  ← cursor-based 无限滚动
│   ├── useJobMutations.ts   ← status update, delete, add
│   └── useJobDetail.ts      ← 详情查询 + 缓存
```

#### 3.3.2 React.memo 关键渲染路径

```tsx
// components/jobs/JobListItem.tsx

import { memo } from "react";

type JobListItemProps = {
  job: JobItem;
  isActive: boolean;
  onSelect: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
};

export const JobListItem = memo(function JobListItem({
  job, isActive, onSelect, isUpdating, isDeleting,
}: JobListItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(job.id)}
      className={`w-full text-left rounded-lg border p-3 transition-colors ${
        isActive ? "border-emerald-500 bg-emerald-50/50" : "border-transparent hover:bg-muted/40"
      } ${isDeleting ? "opacity-40" : ""}`}
    >
      <div className="font-medium text-sm truncate">{job.title}</div>
      {job.company && (
        <div className="text-xs text-muted-foreground mt-1">{job.company}</div>
      )}
      {job.location && (
        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
          <MapPin className="h-3 w-3" />
          {job.location}
        </div>
      )}
      <div className="flex items-center gap-2 mt-2">
        <Badge variant={statusVariant(job.status)} className="text-[10px]">
          {job.status}
        </Badge>
        {job.jobLevel && (
          <span className="text-[10px] text-muted-foreground">{job.jobLevel}</span>
        )}
      </div>
    </button>
  );
});
```

#### 3.3.3 虚拟滚动（大列表优化）

当 Job 数量超过 100 条时，DOM 节点过多影响滚动性能。引入 `@tanstack/react-virtual`：

```tsx
// components/jobs/JobListPanel.tsx — 虚拟滚动

import { useVirtualizer } from "@tanstack/react-virtual";

function JobListPanel({ items, selectedId, onSelect }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 88, // 单条 Job 卡片估算高度
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="flex-1 overflow-auto">
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const job = items[virtualRow.index];
          return (
            <div
              key={job.id}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <JobListItem
                job={job}
                isActive={job.id === selectedId}
                onSelect={onSelect}
                isUpdating={false}
                isDeleting={false}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

**触发条件：** 仅当 `items.length > 80` 时启用虚拟滚动，避免小列表的额外复杂度。

#### 3.3.4 Code Splitting + Dynamic Import

```tsx
// 延迟加载重型 Dialog 组件
const JobExternalDialog = dynamic(
  () => import("./components/JobExternalDialog"),
  { ssr: false },
);

// ReactMarkdown + rehype-highlight 延迟加载（Job 详情面板）
const MarkdownRenderer = dynamic(
  () => import("./components/MarkdownRenderer"),
  { ssr: false, loading: () => <Skeleton className="h-48 w-full" /> },
);
```

#### 3.3.5 React Query 优化

```typescript
// hooks/useJobSearch.ts

const pageQueries = useQueries({
  queries: loadedCursors.map((cursor) => ({
    queryKey: ["jobs", queryString, cursor] as const,
    queryFn: async ({ signal }): Promise<JobsResponse> => {
      const sp = new URLSearchParams(queryString);
      if (cursor) sp.set("cursor", cursor);
      const res = await fetch(`/api/jobs?${sp}`, {
        signal, // AbortController — React Query 自动管理
        headers: {
          // 发送 ETag 以支持 304
          ...(cachedEtag ? { "If-None-Match": cachedEtag } : {}),
        },
      });
      if (res.status === 304) return previousData!;
      // ...
    },
    staleTime: 60_000,       // 从 30s 提升到 60s
    gcTime: 5 * 60_000,      // 5 分钟 GC
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })),
});
```

#### 3.3.6 Prefetch 策略

```typescript
// app/(app)/jobs/page.tsx — SSR 阶段预取数据

import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/getQueryClient";

export default async function JobsPage() {
  // ... auth ...
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["jobs", defaultQueryString, null],
    queryFn: () => listJobs(userId, defaultQuery),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JobsClient />
    </HydrationBoundary>
  );
}
```

---

### 3.4 网络层优化

#### 3.4.1 全筛选器 Debounce

当前仅 `q` 有 200ms debounce，`status`/`location`/`jobLevel` 的变更立即触发请求。改为统一 debounce：

```typescript
// hooks/useJobSearch.ts

const [filters, setFilters] = useState<SearchFilters>(initialFilters);

// 所有筛选器统一 debounce 150ms
const debouncedFilters = useDebouncedValue(filters, 150);

// q 额外 debounce（叠加）— 总计 350ms
const debouncedQ = useDebouncedValue(filters.q, 200);

const effectiveFilters = useMemo(
  () => ({ ...debouncedFilters, q: debouncedQ }),
  [debouncedFilters, debouncedQ],
);
```

**设计决策：** Select 类筛选器使用较短的 150ms debounce（用户预期即时反馈），文本输入使用较长的 350ms（减少中间态请求）。

#### 3.4.2 AbortController 请求取消

React Query v5 已自动通过 `signal` 支持请求取消（queryFn 接收 `{ signal }` 参数），但需确保实际传递给 fetch：

```typescript
// 确保 fetch 传递 signal（当前代码已有 signal 但需验证）
queryFn: async ({ signal }): Promise<JobsResponse> => {
  const res = await fetch(`/api/jobs?${sp}`, { signal });
  // ...
},
```

当筛选条件变化时，React Query 自动 abort 上一次请求的 signal。无额外代码。

#### 3.4.3 Suggestions API 缓存策略

```typescript
// React Query 配置
const suggestionsQuery = useQuery({
  queryKey: ["suggestions", debouncedQ] as const,
  queryFn: async ({ signal }) => {
    const res = await fetch(`/api/jobs/suggestions?q=${encodeURIComponent(debouncedQ)}`, { signal });
    return res.json();
  },
  enabled: debouncedQ.length >= 2,  // 至少 2 个字符
  staleTime: 120_000,               // 2 分钟内相同关键词不重新请求
  gcTime: 5 * 60_000,
  placeholderData: keepPreviousData,
});
```

服务端响应头：

```typescript
// suggestions/route.ts 响应头
headers: {
  ETag: etag,
  "Cache-Control": "private, max-age=60, stale-while-revalidate=120",
}
```

#### 3.4.4 ETag 优化

当前 ETag 包含所有 item 的 `id + status + updatedAt + resumePdfUrl + ...`。优化点：

1. **排除空 platform 字段**（当前 `platform=` 始终为空字符串）
2. **简化 ETag 输入**：用 `MAX(updatedAt)` + `count` 代替遍历全部 items（减少序列化开销）

```typescript
// lib/server/jobsListEtag.ts — 简化版 ETag

export function buildJobsListEtag(input: BuildJobsListEtagInput): string {
  const payload = [
    input.userId,
    input.cursor ?? "start",
    input.nextCursor ?? "end",
    input.filtersSignature,
    input.totalCount ?? -1,
    input.items.length,
    // 用最近更新时间 + 首末 ID 代替全遍历
    input.items[0]?.id ?? "",
    input.items[input.items.length - 1]?.id ?? "",
    input.items[0]?.updatedAt ? toIso(input.items[0].updatedAt) : "",
  ].join("::");

  return `W/"jobs:${createHash("sha1").update(payload).digest("base64url")}"`;
}
```

---

### 3.5 用户体验优化

#### 3.5.1 搜索建议 + 关键词高亮

使用 `cmdk`（项目已安装）构建 Command Palette 风格的搜索建议：

```tsx
// components/jobs/JobSearchBar.tsx

import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "cmdk";

function SearchWithSuggestions({ q, onQChange, suggestions }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Command shouldFilter={false}>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <CommandInput
            value={q}
            onValueChange={onQChange}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
            placeholder="Search jobs..."
            className="pl-9"
          />
        </div>
        {open && q.length >= 2 && (
          <CommandList className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-lg border bg-white shadow-lg">
            <CommandEmpty className="p-3 text-sm text-muted-foreground">
              No suggestions found
            </CommandEmpty>
            {suggestions.map((suggestion) => (
              <CommandItem
                key={suggestion}
                value={suggestion}
                onSelect={() => {
                  onQChange(suggestion);
                  setOpen(false);
                }}
                className="cursor-pointer px-3 py-2 text-sm"
              >
                <HighlightMatch text={suggestion} query={q} />
              </CommandItem>
            ))}
          </CommandList>
        )}
      </Command>
    </div>
  );
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-emerald-100 text-emerald-900 rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}
```

#### 3.5.2 搜索历史（Recent Searches）

使用 localStorage 存储最近 10 次搜索，零服务端成本：

```typescript
// hooks/useSearchHistory.ts

const STORAGE_KEY = "joblit:search-history";
const MAX_HISTORY = 10;

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });

  const addToHistory = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return;
    setHistory((prev) => {
      const next = [trimmed, ...prev.filter((h) => h !== trimmed)].slice(0, MAX_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { history, addToHistory, clearHistory };
}
```

在搜索建议 Dropdown 中，当 `q` 为空时展示搜索历史：

```tsx
{q.length < 2 && history.length > 0 && (
  <div className="border-b px-3 py-2">
    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
      <span>Recent searches</span>
      <button onClick={clearHistory} className="hover:underline">Clear</button>
    </div>
    {history.map((h) => (
      <CommandItem key={h} value={h} onSelect={() => onQChange(h)}>
        <Clock className="mr-2 h-3 w-3" />
        {h}
      </CommandItem>
    ))}
  </div>
)}
```

#### 3.5.3 Loading States 优化

**问题：** 当前 `useDebouncedValue(loading, 160)` 导致 debounce 200ms + 延迟 160ms = 360ms 无视觉反馈。

**方案：** 使用三层 Loading 策略：

```tsx
// 1. 输入时立即显示 — subtle 搜索栏指示器
{isTyping && <div className="absolute right-3 top-3">
  <div className="h-3 w-3 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
</div>}

// 2. 请求发出后 — 顶部进度条（已有 edu-loading-bar）
{isFetching && <div className="edu-loading-bar" aria-hidden />}

// 3. 初次加载 / 筛选器切换 — Skeleton 叠加（保持列表结构可见）
{isFilterChanging && (
  <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm transition-opacity duration-150">
    <div className="space-y-3 p-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-lg border p-3 animate-pulse">
          <div className="h-4 w-2/3 bg-muted rounded" />
          <div className="h-3 w-1/2 bg-muted rounded mt-2" />
        </div>
      ))}
    </div>
  </div>
)}
```

#### 3.5.4 键盘导航

```tsx
// hooks/useKeyboardNavigation.ts

export function useKeyboardNavigation(
  items: { id: string }[],
  selectedId: string | null,
  onSelect: (id: string) => void,
) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!items.length) return;
      const currentIndex = items.findIndex((item) => item.id === selectedId);

      switch (e.key) {
        case "ArrowDown":
        case "j": {
          e.preventDefault();
          const nextIndex = Math.min(currentIndex + 1, items.length - 1);
          onSelect(items[nextIndex].id);
          break;
        }
        case "ArrowUp":
        case "k": {
          e.preventDefault();
          const prevIndex = Math.max(currentIndex - 1, 0);
          onSelect(items[prevIndex].id);
          break;
        }
        case "Enter": {
          if (selectedId) {
            // Open detail or trigger primary action
          }
          break;
        }
        case "Escape": {
          // Clear search or close detail
          break;
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [items, selectedId, onSelect]);
}
```

#### 3.5.5 Empty State 与 Error Recovery

```tsx
// components/jobs/EmptyState.tsx

function EmptyState({ hasFilters, onClearFilters }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">
        {hasFilters ? "No matching jobs" : "No jobs yet"}
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        {hasFilters
          ? "Try adjusting your search or filters"
          : "Import jobs from the Fetch page to get started"}
      </p>
      {hasFilters && (
        <Button variant="outline" className="mt-4" onClick={onClearFilters}>
          Clear all filters
        </Button>
      )}
    </div>
  );
}

// Error recovery 组件
function SearchError({ error, onRetry }: Props) {
  return (
    <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="h-4 w-4 text-destructive" />
        <span className="text-sm font-medium text-destructive">Search failed</span>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{error}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
```

#### 3.5.6 移动端响应式改进

当前 `JobsClient` 在移动端 (`< lg`) 使用 44dvh 的固定列表高度。优化：

```tsx
// 移动端：列表 + 详情 Tab 切换模式
<div className="lg:hidden">
  <Tabs value={mobileTab} onValueChange={setMobileTab}>
    <TabsList className="w-full">
      <TabsTrigger value="list" className="flex-1">
        Jobs {totalCount && `(${totalCount})`}
      </TabsTrigger>
      <TabsTrigger value="detail" className="flex-1" disabled={!selectedId}>
        Detail
      </TabsTrigger>
    </TabsList>
  </Tabs>
</div>

// Desktop: 保持 side-by-side 布局
<div className="hidden lg:grid lg:grid-cols-[380px_1fr] lg:gap-3">
  <JobListPanel />
  <JobDetailPanel />
</div>
```

---

### 3.6 页面切换与整体性能

#### 3.6.1 Error Boundary 覆盖

当前 **零** `error.tsx` 文件。为每个路由段添加：

```tsx
// app/(app)/jobs/error.tsx
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function JobsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Jobs page error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
      <p className="text-sm text-muted-foreground mb-4">
        {error.message || "An unexpected error occurred"}
      </p>
      <Button onClick={reset} variant="outline">
        Try again
      </Button>
    </div>
  );
}
```

需添加 `error.tsx` 的路由段：
- `app/(app)/jobs/error.tsx`
- `app/(app)/resume/error.tsx`
- `app/(app)/fetch/error.tsx`
- `app/(app)/resume/rules/error.tsx`
- `app/(app)/error.tsx` （根 layout 级兜底）

#### 3.6.2 Route Prefetch

Next.js 16 App Router 默认对 `<Link>` 组件做 prefetch。但当前 `TopNav` 中的导航是否使用了 `<Link>` 需要验证。确保：

```tsx
// TopNav.tsx — 确保使用 Next.js Link
import Link from "next/link";

<Link href="/jobs" prefetch={true}>Jobs</Link>
<Link href="/resume" prefetch={true}>Resume</Link>
<Link href="/fetch" prefetch={true}>Fetch</Link>
```

Next.js 16 的 `prefetch` 默认行为已优化：
- Static 路由：prefetch 完整页面
- Dynamic 路由（`force-dynamic`）：prefetch 到最近的 `loading.tsx` boundary

当前 Jobs 页面为 `force-dynamic`，prefetch 会预加载到 `loading.tsx` 的 skeleton UI — 已有该文件，无需额外工作。

#### 3.6.3 Streaming SSR

当前 `page.tsx` 的 SSR 查询可使用 React Suspense 实现流式渲染：

```tsx
// app/(app)/jobs/page.tsx — Streaming 改造

import { Suspense } from "react";
import { JobsListSkeleton } from "./components/JobsListSkeleton";

export default async function JobsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/jobs");

  return (
    <main className="flex min-h-0 flex-1 flex-col gap-2 lg:h-full lg:overflow-hidden">
      <Suspense fallback={<JobsListSkeleton />}>
        <JobsContent userId={session.user.id} />
      </Suspense>
    </main>
  );
}

async function JobsContent({ userId }: { userId: string }) {
  const locale = await getLocale();
  const market = locale === "zh" ? "CN" : "AU";
  const items = await fetchInitialJobs(userId, market);
  return <JobsClient initialItems={items} />;
}
```

#### 3.6.4 Bundle Size 优化

当前 `package.json` 分析：

| Package | Size (estimated) | 优化方案 |
|---------|-----------------|----------|
| `react-markdown` + `remark-gfm` + `rehype-highlight` | ~120KB gzipped | Dynamic import (仅详情面板) |
| `highlight.js/styles/github.css` | ~3KB | 同上 |
| `framer-motion` | ~40KB gzipped | Tree-shake: `import { motion } from "framer-motion"` |
| `react-day-picker` | ~20KB gzipped | 检查是否被使用，未使用则移除 |
| `@dnd-kit/*` | ~30KB gzipped | Dynamic import (仅 Resume 页面) |

**next.config.ts 优化配置：**

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
      "@radix-ui/react-dropdown-menu",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};
```

#### 3.6.5 Accessibility 改进清单

| 改进项 | 当前状态 | 目标 |
|--------|---------|------|
| 键盘导航（j/k/Enter/Esc） | 不支持 | 完整支持 |
| ARIA landmarks | 部分 | 完整（search, list, detail） |
| Focus management（筛选器切换后） | 无 | 自动聚焦首条结果 |
| Screen reader announcements | 无 | 搜索结果数量通知 |
| Color contrast | 未验证 | WCAG AA |

```tsx
// ARIA 增强示例
<div role="search" aria-label="Job search">
  {/* search bar */}
</div>

<div role="list" aria-label={`${totalCount} jobs found`} aria-busy={isFetching}>
  {items.map(job => (
    <div role="listitem" key={job.id} aria-selected={job.id === selectedId}>
      <JobListItem job={job} />
    </div>
  ))}
</div>

// Live region for search results count
<div aria-live="polite" className="sr-only">
  {totalCount !== undefined && `${totalCount} jobs found`}
</div>
```

---

## 四、实施路线图

### Phase 1 — 立即可做（第 1 周）

| # | 任务 | 文件 | 预期收益 | 验证方式 |
|---|------|------|----------|----------|
| 1.1 | 启用 `pg_trgm` + 创建 GIN 索引 | `prisma/migrations/` | 搜索从全表扫描 → 索引扫描 | `EXPLAIN ANALYZE` |
| 1.2 | 添加 `jobLevel` B-tree 索引 | `prisma/schema.prisma` | jobLevel 筛选索引加速 | `EXPLAIN ANALYZE` |
| 1.3 | 全筛选器 debounce (150ms) | `hooks/useJobSearch.ts` | 减少 ~60% API 请求量 | Network tab |
| 1.4 | Suggestions API 加 ETag + Cache-Control | `suggestions/route.ts` | 重复建议请求 → 304 | Network tab |
| 1.5 | 添加 Error Boundary 到所有路由段 | `app/(app)/*/error.tsx` | 消除白屏崩溃 | 手动触发异常 |
| 1.6 | `jobLevel` 大小写不敏感匹配 | `jobListService.ts:89-91` | 一致性修复 | Unit test |

### Phase 2 — 短期优化（第 2-3 周）

| # | 任务 | 文件 | 预期收益 | 验证方式 |
|---|------|------|----------|----------|
| 2.1 | `similarity()` 相关性排序 | `jobListService.ts` / `jobSearchService.ts` | 搜索质量提升 | 用户反馈 |
| 2.2 | 搜索建议高亮 + `cmdk` 集成 | `JobSearchBar.tsx` | UX 提升 | 手动测试 |
| 2.3 | 搜索历史 (localStorage) | `hooks/useSearchHistory.ts` | 重复搜索效率 | 手动测试 |
| 2.4 | Loading 三层策略 | `JobsClient.tsx` | 消除 360ms 无反馈 | 视觉测试 |
| 2.5 | `JobsClient.tsx` 组件拆分 | `components/jobs/*`, `hooks/*` | 可维护性 | Test suite |
| 2.6 | `next.config.ts` 添加 `optimizePackageImports` | `next.config.ts` | Bundle size 减少 | `next build` |
| 2.7 | 键盘导航 (j/k/Enter/Esc) | `hooks/useKeyboardNavigation.ts` | Accessibility | 手动测试 |

### Phase 3 — 中期增强（第 4-6 周）

| # | 任务 | 文件 | 预期收益 | 验证方式 |
|---|------|------|----------|----------|
| 3.1 | 虚拟滚动 (`@tanstack/react-virtual`) | `JobListPanel.tsx` | 大列表渲染性能 | Performance tab |
| 3.2 | Streaming SSR + Suspense | `jobs/page.tsx` | TTFB → FCP 缩短 | Lighthouse |
| 3.3 | React Markdown dynamic import | `JobDetailPanel.tsx` | 首屏 JS 减少 ~120KB | Bundle analyzer |
| 3.4 | React Query `HydrationBoundary` | `jobs/page.tsx` | 消除 SSR→CSR 闪烁 | 视觉测试 |
| 3.5 | 移动端 Tab 切换布局 | `JobsClient.tsx` | 移动端体验提升 | 响应式测试 |
| 3.6 | ARIA landmarks + screen reader | 多文件 | WCAG AA 达标 | axe DevTools |
| 3.7 | 合并 count 到单次查询 | `jobSearchService.ts` | 减少 1 次 DB roundtrip | `EXPLAIN` |

---

## 五、性能指标目标

### 搜索性能

| 指标 | 当前估值 | Phase 1 目标 | Phase 3 目标 |
|------|---------|-------------|-------------|
| 空搜索（全量列表） | ~200ms (500条) | <100ms | <80ms |
| 关键词搜索 (ILIKE) | ~300ms (500条) → 线性恶化 | <100ms (GIN 索引) | <80ms |
| 关键词搜索 + similarity 排序 | N/A | <150ms | <120ms |
| Suggestions 响应 | ~200ms (无缓存) | <50ms (304 hit) | <30ms |
| Debounce → 首次响应 | 200ms + 300ms = 500ms | 150ms + 100ms = 250ms | 150ms + 80ms = 230ms |

### 前端性能 (Core Web Vitals)

| 指标 | 当前估值 | Phase 1 目标 | Phase 3 目标 | 行业优秀值 |
|------|---------|-------------|-------------|-----------|
| **LCP** | ~2.5s | <2.0s | <1.5s | <1.2s |
| **FID / INP** | ~150ms | <100ms | <50ms | <50ms |
| **CLS** | ~0.1 | <0.05 | <0.01 | <0.01 |
| **TTFB** | ~800ms | <600ms | <400ms | <200ms |
| **TTI** | ~3.0s | <2.5s | <2.0s | <1.5s |

### Bundle Size

| 资产 | 当前估值 | Phase 3 目标 |
|------|---------|-------------|
| Jobs 页面 JS (initial) | ~350KB gzipped | <200KB gzipped |
| 总 JS 传输量 | ~500KB gzipped | <350KB gzipped |
| CSS 传输量 | ~50KB | <40KB |

### 数据库

| 指标 | 当前 | 目标 |
|------|------|------|
| 搜索查询 P95 | 未测量 (估 300ms) | <100ms |
| GIN 索引写入开销 | 0% | <15% |
| 连接池利用率 | 未监控 | <80% |

---

## 六、风险与缓解

### 6.1 pg_trgm GIN 索引写入性能

**风险：** GIN 索引在 INSERT/UPDATE 时增加约 10-15% 开销。Batch import（FetchRun）一次导入几十条 Job 时可能受影响。

**缓解：**
- Neon 的写入规模目前远未达到瓶颈
- GIN 索引支持 `fastupdate` 参数（默认开启），写入时先写入 pending list 再批量合并
- 监控：`pg_stat_user_indexes` 观察索引使用率

### 6.2 Raw SQL 维护成本

**风险：** `similarity()` 排序需要 `$queryRaw`，丧失 Prisma 的类型安全。

**缓解：**
- 仅搜索路径使用 Raw SQL，其他路径保持 Prisma ORM
- 返回类型用 Zod 或手动 Type Guard 校验
- 单元测试覆盖所有 Raw SQL 路径
- 封装在 `jobSearchService.ts` 单一模块中

### 6.3 中文搜索体验不足

**风险：** Trigram 对中文的覆盖不如专业分词器，用户搜索二字中文词（如「产品」）可能 recall 低。

**缓解：**
- 对 < 3 字符的中文查询 fallback 到纯 `ILIKE`（不使用 similarity 排序）
- 建议列表中补充高频中文职位头衔
- 如后续需求增长，可迁移到 Typesense / Meilisearch 作为专用搜索引擎

### 6.4 God Component 拆分回归

**风险：** `JobsClient.tsx` 拆分涉及大量状态迁移，可能引入回归。

**缓解：**
- 拆分前确保现有测试覆盖率（`JobsClient.test.tsx` 已存在）
- 采用"提取 → 验证 → 删除"三步法，每步验证测试通过
- 拆分为独立 PR，逐步 review

### 6.5 Neon Cold Start

**风险：** Neon Serverless 在 autoscale-to-zero 后首次查询有 ~500ms cold start，加上新的 GIN 索引扫描可能更慢。

**缓解：**
- Neon 支持 `suspend_timeout_seconds` 配置（设置为 300s 以上避免频繁冷启动）
- React Query `staleTime: 60_000` 减少重复请求
- SSR prefetch 确保首屏数据在服务端完成

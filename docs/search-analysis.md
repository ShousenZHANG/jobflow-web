# Search Functionality Analysis

**Date:** 2026-03-29
**Branch:** master
**Scope:** All search, filter, and pagination-related code in the jobs workflow

---

## 1. 涉及文件清单

### 前端（客户端）

| 文件 | 职责 |
|------|------|
| `app/(app)/jobs/JobsClient.tsx` | 主搜索 UI（2400+ 行）：搜索栏、筛选面板、无限滚动、状态管理 |
| `hooks/useDebouncedValue.ts` | 防抖 Hook（默认 200ms），用于搜索关键词 |
| `hooks/useMarket.ts` | 市场检测 Hook（AU/CN），自动加入 market 筛选参数 |

### API 层

| 文件 | 职责 |
|------|------|
| `app/api/jobs/route.ts` | 主搜索接口（GET：列表/筛选；POST：创建） |
| `app/api/jobs/[id]/route.ts` | 单条 Job 接口（GET 详情 / PATCH 状态 / DELETE 删除） |
| `app/api/jobs/suggestions/route.ts` | 搜索建议接口（自动补全） |

### 服务层

| 文件 | 职责 |
|------|------|
| `lib/server/jobs/jobListService.ts` | 核心搜索逻辑：WHERE 子句构建、分页、ETag 计算 |
| `lib/server/jobsListEtag.ts` | ETag 哈希生成（SHA-1 + base64url） |
| `lib/server/jobs/jobStatusService.ts` | Job 状态更新服务 |
| `lib/server/jobs/jobDeleteService.ts` | Job 删除服务（含 Blob 清理） |

### 数据库

| 文件 | 职责 |
|------|------|
| `prisma/schema.prisma` | 数据库 Schema，包含 Job 模型与索引定义 |

### 测试

| 文件 | 职责 |
|------|------|
| `app/(app)/jobs/JobsClient.test.tsx` | 前端集成测试 |
| `test/server/jobsListEtag.test.ts` | ETag 单元测试 |

---

## 2. 搜索逻辑实现

### 请求流程（完整链路）

```
用户输入 → 防抖 200ms → queryString 构建 → React Query fetch
    → GET /api/jobs?{params}
    → Zod 校验
    → requireSession() 验证
    → jobListService.listJobs(userId, query)
        → buildWhereClause()
        → prisma.job.findMany() + prisma.job.count()  // 并行
        → getCursorPage()
        → buildJobsListEtag()
    → ETag 对比（304 / 200）
    → 客户端合并多页结果 + 去重
```

### 参数列表（QuerySchema）

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `limit` | number 1-100 | 10 | 每页数量 |
| `cursor` | UUID? | — | 游标分页起始 ID |
| `status` | NEW/APPLIED/REJECTED? | — | 状态筛选 |
| `q` | string 1-80? | — | 关键词搜索（跨 title/company/location） |
| `location` | string 1-80? | — | 地点筛选（支持 `state:NSW` 展开） |
| `jobLevel` | string 1-80? | — | 职级筛选（精确匹配） |
| `sort` | newest/oldest | newest | 排序方向 |
| `market` | AU/CN? | — | 市场筛选 |
| `platform` | string? | — | **接受但未使用**（见问题 #5） |

### WHERE 子句构建（`jobListService.ts:58-99`）

```typescript
// 1. 基础过滤（始终应用）
{ userId }

// 2. 可选等值过滤
...(status ? { status } : {})
...(market ? { market } : {})

// 3. AND 数组（动态追加）
AND: [
  // q 参数 → 三字段 OR 模糊匹配
  { OR: [
    { title: { contains: q, mode: "insensitive" } },
    { company: { contains: q, mode: "insensitive" } },
    { location: { contains: q, mode: "insensitive" } }
  ]},

  // location 参数 → state: 前缀展开 或 直接 contains
  // state:NSW 展开为 ["NSW", "New South Wales", "Sydney", "Newcastle", "Wollongong"]
  { OR: locationFilters.map(loc => ({ location: { contains: loc, mode: "insensitive" } })) }
  // or: { location: { contains: location, mode: "insensitive" } }

  // jobLevel → 精确匹配（非大小写不敏感）
  { jobLevel: { equals: jobLevel } }
]
```

### 游标分页（`jobListService.ts:101-111`）

```typescript
// 取 limit+1 条，多出 1 条用于判断是否有下一页
take: limit + 1,
cursor: { id: cursor }, skip: 1  // 跳过游标本身

// 返回值
items: normalized.slice(0, limit)
nextCursor: items[limit - 1]?.id ?? null  // null 表示已到最后一页
```

客户端用 `loadedCursors: (string | null)[]` 数组管理多页游标，无限滚动时追加新游标触发下一页请求。

---

## 3. 数据源

**全部数据来自数据库（PostgreSQL via Prisma + Neon Serverless Adapter）**，无前端内存过滤。

### 数据库查询模式

| 查询 | 执行方式 | 说明 |
|------|----------|------|
| 列表 + 总数 | `Promise.all([findMany, count])` | 并行执行，减少延迟 |
| 建议（suggestions） | `findMany` 取最近 80 条 LIKE 匹配 | 无缓存 |
| 单条详情 | `findFirst WHERE id+userId` | 独立查询（非列表携带） |

### Job 模型现有索引

```prisma
@@unique([userId, jobUrl])
@@index([userId, createdAt])         // 按最新排序
@@index([userId, updatedAt])         // 按更新排序
@@index([userId, status])            // 状态筛选
@@index([userId, market, createdAt]) // 市场+排序
```

### 缺失的关键索引

```prisma
// 搜索字段无索引 → PostgreSQL 全表扫描
title    String   // ← ILIKE 无索引
company  String?  // ← ILIKE 无索引
location String?  // ← ILIKE 无索引
jobLevel String?  // ← equals 无索引
```

### ETag 缓存策略

`buildJobsListEtag()` 将以下数据 SHA-1 哈希后作为 HTTP ETag：

- `userId + cursor + nextCursor`
- 所有 filter 参数（序列化为 `|` 分隔字符串）
- 每条 item 的 `id, status, updatedAt, resumePdfUrl, resumePdfName, coverPdfUrl`
- `totalCount` + `jobLevels` facets

命中 ETag 时返回 HTTP 304，避免重复传输响应体。

---

## 4. 性能瓶颈与体验问题

### P0 — 严重

| # | 问题 | 位置 | 影响 |
|---|------|------|------|
| 1 | **文本搜索字段无索引**：`title`/`company`/`location` 均为 `ILIKE`，无 B-tree 或全文索引 | `prisma/schema.prisma` Job 模型 | 用户数据量增大后全表扫描，响应时间线性增长 |

**建议修复**：
```prisma
// 方案 A：B-tree 前缀索引（简单，支持前缀搜索）
@@index([userId, title])
@@index([userId, company])
@@index([userId, location])

// 方案 B：PostgreSQL 全文搜索（更强，支持排名）
// 需迁移至 tsvector 字段 + GIN 索引
```

---

### P1 — 高优先级

| # | 问题 | 位置 | 影响 |
|---|------|------|------|
| 2 | **`platform` 参数接受但完全忽略** | `jobListService.ts:58-99` | 筛选无效，用户无法按平台过滤；ETag filtersSignature 始终含空 platform= |
| 3 | **Job 详情独立查询（N+1 隐患）** | `JobsClient.tsx:1614-1625` | 每次选中 Job 触发额外 GET /api/jobs/[id]，可提前在列表中携带 `description` |

---

### P2 — 中优先级

| # | 问题 | 位置 | 影响 |
|---|------|------|------|
| 4 | **仅 `q` 有防抖，其他筛选器无防抖** | `JobsClient.tsx:2136-2212` | 快速切换 status/location/jobLevel 触发多次 API 请求 |
| 5 | **搜索结果无相关性排序** | `jobListService.ts:115-118` | 只有时间排序，关键词搜索结果不按匹配度排列 |
| 6 | **Suggestions 接口无 ETag/缓存** | `app/api/jobs/suggestions/route.ts` | 自动补全每次都重新查库，相同关键词重复查询 |
| 7 | **Location 筛选为固定下拉框** | `JobsClient.tsx:2130-2155` | 用户无法输入自定义地点，仅限预定义选项 |

---

### P3 — 低优先级

| # | 问题 | 位置 | 影响 |
|---|------|------|------|
| 8 | **列表+总数两次查询** | `jobListService.ts:122-145` | 虽然并行执行，仍是 2 次 DB 往返（可用窗口函数合并） |
| 9 | **防抖期间无 Loading 提示** | `JobsClient.tsx:715, 866` | 200ms 防抖 + 160ms Loading 延迟 = 360ms 无视觉反馈 |
| 10 | **`loadedCursors` 数组无上限** | `JobsClient.tsx:492` | 深度滚动时内存中保留大量游标（个人使用规模下影响有限） |
| 11 | **`jobLevel` 精确匹配非大小写不敏感** | `jobListService.ts:89-91` | `{ equals: jobLevel }` vs 其他字段的 `mode: "insensitive"` 不一致 |
| 12 | **ETag 含空 platform 字段** | `jobListService.ts:169-178` | filtersSignature 始终包含 `platform=`，略微增加哈希计算输入 |

---

## 5. 优化建议汇总（按优先级）

```
立即可做（无破坏性变更）：
  ✓ 添加 prisma migration 增加 title/company/location 索引        [P0]
  ✓ 修复 platform WHERE 子句（补充到 buildWhereClause）            [P1]

短期迭代：
  → 为 Suggestions API 加 ETag + Cache-Control 头                  [P2]
  → listJobs 返回值中包含 description（消除独立详情查询）            [P1]
  → 为状态/地点/职级筛选器加防抖（可复用 useDebouncedValue）        [P2]

中期规划：
  → 引入 PostgreSQL 全文搜索（tsvector + GIN 索引 + ts_rank 排序） [P2]
  → Location 筛选改为输入 + 建议结合模式                           [P2]
```

---

## 附录：关键文件行号索引

| 功能点 | 文件 | 行号 |
|--------|------|------|
| 搜索输入防抖 | `JobsClient.tsx` | 715 |
| queryString 构建 | `JobsClient.tsx` | 738-748 |
| React Query 请求 | `JobsClient.tsx` | 788-830 |
| 无限滚动触发 | `JobsClient.tsx` | 895-924 |
| Zod 参数校验 | `app/api/jobs/route.ts` | 12-22 |
| WHERE 子句构建 | `jobListService.ts` | 58-99 |
| 游标分页逻辑 | `jobListService.ts` | 101-111 |
| 并行 DB 查询 | `jobListService.ts` | 122-146 |
| ETag 计算 | `jobListService.ts` | 169-195 |
| ETag 生成函数 | `lib/server/jobsListEtag.ts` | 28-53 |
| Job 模型 + 索引 | `prisma/schema.prisma` | 120-146 |
| State location 展开表 | `jobListService.ts` | 4-13 |

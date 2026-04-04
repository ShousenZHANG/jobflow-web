# Joblit 全平台性能与用户体验优化 — 实施计划

**Date:** 2026-03-29
**Base doc:** `docs/search-optimization-plan.md`（方案 B: pg_trgm + GIN）
**Branch:** 从 `master` 创建 `feat/platform-optimization`

---

## 需求复述

基于 `search-optimization-plan.md` 推荐方案，对 Joblit 全平台执行大厂级优化：

1. **数据库层** — pg_trgm GIN 索引消除全表扫描 + similarity 相关性排序
2. **前端架构** — God Component 拆分 + React.memo + 虚拟滚动 + Code Splitting
3. **网络层** — 全筛选器防抖 + AbortController + Suggestions ETag 缓存
4. **用户体验** — 搜索建议高亮 + 搜索历史 + 三层 Loading + 键盘导航
5. **平台基础** — Error Boundary + Bundle 优化 + Streaming SSR + ARIA

---

## 当前代码实态（扫描结论）

| 项目 | 现状 |
|------|------|
| `error.tsx` | **0 个**，全平台无 Error Boundary |
| `loading.tsx` | 6 个（marketing, jobs, fetch, resume, rules, auth） |
| `React.memo` | **0 处**使用 |
| `dynamic()` import | **0 处**使用 |
| `Suspense` / Streaming SSR | **0 处**使用 |
| Virtual scrolling | 未安装（仅 allowlist 中有） |
| `pg_trgm` / GIN 索引 | 未启用，未创建 |
| 搜索字段索引 | title/company/location **无索引** |
| Debounce | 仅 `q` 有 200ms，其他筛选器无 |
| `next.config.ts` | 空配置，无 `optimizePackageImports` |
| `JobsClient.tsx` | **2,639 行**，~33 个 useState，单体 |
| Prisma 连接池 | 无自定义参数（Neon adapter 默认） |
| Suggestions API | 无 ETag / 无 Cache-Control |

---

## 风险评估

| 风险 | 等级 | 缓解 |
|------|------|------|
| GIN 索引写入开销 (~15%) | 低 | Neon 写入远未达瓶颈；fastupdate 默认开启 |
| Raw SQL 维护 (`similarity`) | 中低 | 封装在单一 `jobSearchService.ts`，Zod 校验返回值 |
| God Component 拆分回归 | 中 | 现有 `JobsClient.test.tsx` 1,089 行测试覆盖；提取→验证→删除三步法 |
| Neon Cold Start + GIN | 低 | `staleTime: 60s` + SSR prefetch 减少请求频次 |
| 中文 trigram 召回不足 | 低 | < 3 字符 fallback 到 ILIKE；后续可升级 Meilisearch |

---

## 实施计划

> 每个 Step 预计 15-30 分钟。每个 Step 包含：改动文件、做什么、验证命令。
> 按 Phase 顺序执行，Phase 内各 Step 可根据依赖关系串行或并行。

---

### Phase 1 — 平台基础加固（零破坏性，立即可做）

#### Step 1.1 — 添加 Error Boundary 到所有路由段

**文件：**
- 创建 `app/(app)/error.tsx`
- 创建 `app/(app)/jobs/error.tsx`
- 创建 `app/(app)/resume/error.tsx`
- 创建 `app/(app)/fetch/error.tsx`
- 创建 `app/(marketing)/error.tsx`
- 创建 `app/(auth)/error.tsx`

**做什么：**
- 每个 `error.tsx` 导出 `"use client"` 组件，接收 `{ error, reset }` props
- 展示友好错误消息 + "Try again" 按钮调用 `reset()`
- 使用 `useEffect` 记录 `console.error` 便于调试
- 使用 i18n `useTranslations("common")` 做多语言错误提示

**验证：**
```bash
npm run build    # 编译成功
npm run test     # 现有测试不受影响
```

---

#### Step 1.2 — next.config.ts 添加 optimizePackageImports + 图片格式

**文件：**
- 修改 `next.config.ts`

**做什么：**
```typescript
const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-popover",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-toast",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};
```

**验证：**
```bash
npm run build    # 对比 build output 的 JS size
```

---

#### Step 1.3 — Suggestions API 添加 ETag + Cache-Control

**文件：**
- 修改 `app/api/jobs/suggestions/route.ts`

**做什么：**
- 用 `createHash("sha1")` 对 `userId + q + combined.join(",")` 生成 ETag
- 检查 `If-None-Match` header，匹配时返回 304
- 响应添加 `Cache-Control: private, max-age=60, stale-while-revalidate=120`
- 响应添加 `ETag` header

**验证：**
```bash
npm run test     # 现有测试通过
# 手动测试：连续两次相同 q 查询，第二次应返回 304
```

---

#### Step 1.4 — jobLevel 大小写不敏感匹配修复

**文件：**
- 修改 `lib/server/jobs/jobListService.ts` L89-91

**做什么：**
- 将 `{ jobLevel: { equals: jobLevel } }` 改为 `{ jobLevel: { equals: jobLevel, mode: "insensitive" } }`

**验证：**
```bash
npm run test -- --run test/server/ test/api/   # 服务端测试通过
```

---

#### Step 1.5 — 全筛选器统一 Debounce + AbortController

**文件：**
- 修改 `app/(app)/jobs/JobsClient.tsx`

**做什么：**
- 将 Select 类筛选器（status, location, jobLevel, sort）的 onChange 包裹到 debounce 中：
  - 创建 `filters` state 对象（合并 q, status, location, jobLevel, sort, market, pageSize）
  - `debouncedFilters = useDebouncedValue(filters, 120)` 统一防抖
  - `q` 单独叠加 `useDebouncedValue(filters.q, 200)` → 总计 ~320ms
- 确保 React Query `queryFn` 的 `{ signal }` 传递给 `fetch(url, { signal })`
- 现有逻辑中 `staleTime` 从 30_000 提升到 60_000

**验证：**
```bash
npm run test -- --run app/   # 前端测试通过
npm run build                # 编译无报错
```

---

#### Step 1.6 — ETag filtersSignature 清理空 platform

**文件：**
- 修改 `lib/server/jobs/jobListService.ts` L169-178

**做什么：**
- 移除 `platform=\${query.platform ?? ""}` 行（platform 参数当前未使用）

**验证：**
```bash
npm run test -- --run test/server/jobsListEtag   # ETag 测试通过
```

---

### Phase 2 — 数据库搜索优化

#### Step 2.1 — 启用 pg_trgm 扩展 + 创建 GIN 索引

**文件：**
- 创建 `prisma/migrations/20260330000000_search_optimization/migration.sql`

**做什么：**
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_job_title_trgm ON "Job" USING gin (title gin_trgm_ops);
CREATE INDEX idx_job_company_trgm ON "Job" USING gin (company gin_trgm_ops);
CREATE INDEX idx_job_location_trgm ON "Job" USING gin (location gin_trgm_ops);
CREATE INDEX idx_job_user_joblevel ON "Job" ("userId", "jobLevel");
```
- 在 `prisma/schema.prisma` Job 模型添加 `@@index([userId, jobLevel])` 注释标记

**验证：**
```bash
npx prisma migrate deploy   # Migration 执行成功
# 在 Neon Console 执行: EXPLAIN ANALYZE SELECT * FROM "Job" WHERE title ILIKE '%engineer%';
# 应看到 Bitmap Index Scan on idx_job_title_trgm
```

---

#### Step 2.2 — 搜索工具函数 (searchUtils.ts)

**文件：**
- 创建 `lib/server/jobs/searchUtils.ts`
- 创建 `test/server/searchUtils.test.ts`

**做什么：**
- `shouldUseRelevanceSort(q: string): boolean` — 判断是否使用 similarity 排序
  - `q.trim().length < 3` → false
  - CJK 字符数 < 2 → false（单个汉字不用 similarity）
  - 否则 → true
- `escapeLikePattern(q: string): string` — 转义 `%` `_` `\` 防 SQL 注入

**验证：**
```bash
npm run test -- --run test/server/searchUtils   # 新测试通过
```

---

#### Step 2.3 — 相关性排序搜索服务 (jobSearchService.ts)

**文件：**
- 创建 `lib/server/jobs/jobSearchService.ts`
- 创建 `test/server/jobSearchService.test.ts`

**做什么：**
- `searchJobsWithRelevance(params)` 函数：
  - 使用 `prisma.$queryRaw` + `similarity()` 对 title/company/location 计算相关性
  - `ORDER BY relevance_score DESC, "createdAt" DESC`
  - 保持游标分页兼容
  - 返回类型与现有 `JobListItem` 对齐，额外带 `relevanceScore`
  - 用 Zod `z.array(JobListItemSchema)` 校验 Raw SQL 返回值
- 包含 `count` 的并行 Raw SQL 版本

**验证：**
```bash
npm run test -- --run test/server/jobSearchService   # 新测试通过
```

---

#### Step 2.4 — 改造 listJobs 集成相关性排序

**文件：**
- 修改 `lib/server/jobs/jobListService.ts`

**做什么：**
- 在 `listJobs` 顶部判断：`if (q && shouldUseRelevanceSort(q))` → 调用 `searchJobsWithRelevance`
- 无 `q` 或短关键词 → 保持现有 Prisma ORM 路径不变
- 两条路径共享 `getCursorPage` + `buildJobsListEtag` 输出格式

**验证：**
```bash
npm run test -- --run test/server/ test/api/   # 全服务端测试通过
npm run build                                   # 编译无错
```

---

### Phase 3 — 前端架构重构

#### Step 3.1 — 提取搜索 Hook (useJobSearch.ts)

**文件：**
- 创建 `app/(app)/jobs/hooks/useJobSearch.ts`
- 修改 `app/(app)/jobs/JobsClient.tsx`

**做什么：**
- 从 `JobsClient` 提取以下逻辑到 `useJobSearch`：
  - `q`, `statusFilter`, `locationFilter`, `jobLevelFilter`, `sortOrder`, `pageSize` state
  - `debouncedFilters`, `queryString` memo
  - `loadedCursors` state + `resetPagination`
  - `useQueries` 配置（pages fetch + merge）
  - 导出：`{ q, setQ, filters, setFilters, queryString, items, totalCount, isFetching, hasNextPage, loadMore, resetPagination }`
- `JobsClient` 改为调用 `useJobSearch()` 获取以上值

**验证：**
```bash
npm run test -- --run app/(app)/jobs/   # JobsClient 测试通过
```

---

#### Step 3.2 — 提取列表项组件 (JobListItem.tsx) + React.memo

**文件：**
- 创建 `app/(app)/jobs/components/JobListItem.tsx`
- 修改 `app/(app)/jobs/JobsClient.tsx`

**做什么：**
- 从 `JobsClient` 中提取单条 Job 卡片渲染逻辑为独立 `JobListItem` 组件
- 用 `memo()` 包裹，props: `{ job, isActive, onSelect, isUpdating, isDeleting }`
- 使用稳定的 `useCallback` 包裹 `onSelect` 避免不必要重渲染
- 保留所有现有 UI：Badge、location 图标、级别标签

**验证：**
```bash
npm run test -- --run app/(app)/jobs/   # 全测试通过
```

---

#### Step 3.3 — 提取详情面板 (JobDetailPanel.tsx)

**文件：**
- 创建 `app/(app)/jobs/components/JobDetailPanel.tsx`
- 修改 `app/(app)/jobs/JobsClient.tsx`

**做什么：**
- 从 `JobsClient` 提取右侧详情面板（选中 Job 的 description、状态操作、PDF 链接等）
- Props: `{ job, selectedId, onStatusChange, onDelete, isPending }`
- 将 `react-markdown` + `remark-gfm` + `rehype-highlight` 改为 `next/dynamic` 延迟加载
- 添加 Skeleton fallback 在 Markdown 加载前

**验证：**
```bash
npm run test -- --run app/(app)/jobs/   # 全测试通过
npm run build                           # 确认 dynamic import 正确
```

---

#### Step 3.4 — 提取 Dialog 组件

**文件：**
- 创建 `app/(app)/jobs/components/JobDeleteDialog.tsx`
- 创建 `app/(app)/jobs/components/JobAddDialog.tsx`
- 修改 `app/(app)/jobs/JobsClient.tsx`

**做什么：**
- 从 `JobsClient` 提取删除确认 Dialog 和新增 Job Dialog
- 各自管理自己的 state（open/close），通过 props 接收 callbacks
- `JobsClient` 仅传递 `{ onConfirm, jobId }` 等必要参数

**验证：**
```bash
npm run test -- --run app/(app)/jobs/   # 全测试通过
```

---

#### Step 3.5 — 提取 Mutations Hook (useJobMutations.ts)

**文件：**
- 创建 `app/(app)/jobs/hooks/useJobMutations.ts`
- 修改 `app/(app)/jobs/JobsClient.tsx`

**做什么：**
- 提取所有 `useMutation` 调用（status update, delete, add）
- 返回：`{ updateStatus, deleteJob, addJob, updatingIds, deletingIds }`
- 包含乐观更新（optimistic update）和 toast 通知逻辑

**验证：**
```bash
npm run test -- --run app/(app)/jobs/   # 全测试通过
```

---

#### Step 3.6 — JobsClient 最终瘦身验证

**文件：**
- 修改 `app/(app)/jobs/JobsClient.tsx`
- 修改 `app/(app)/jobs/JobsClient.test.tsx`（如断言需调整）

**做什么：**
- 确保 `JobsClient.tsx` 降到 ~300-400 行，仅保留：
  - 布局编排（grid, scroll area 容器）
  - 将 hooks 和子组件组合
  - 无限滚动触发逻辑
- 调整测试中因组件结构变化需要更新的断言
- 运行完整测试套件确认零回归

**验证：**
```bash
npm run test                # 全量测试通过
npm run lint                # 无 lint 错误
npm run build               # 编译成功
wc -l app/(app)/jobs/JobsClient.tsx   # 应 < 500 行
```

---

### Phase 4 — 搜索 UX 提升

#### Step 4.1 — 搜索建议 + cmdk 集成 + 高亮

**文件：**
- 创建 `app/(app)/jobs/components/JobSearchBar.tsx`
- 修改 `app/(app)/jobs/JobsClient.tsx`（引用新组件）

**做什么：**
- 用 `cmdk`（已安装 `cmdk@1.1.1`）构建 Command Palette 风格搜索建议
- 集成 React Query `useQuery` 查询 `/api/jobs/suggestions?q=...`
- `HighlightMatch` 组件：用 `<mark>` 标签高亮匹配文本
- `enabled: debouncedQ.length >= 2` 才发请求
- `staleTime: 120_000`（同一关键词 2 分钟内不重复请求）
- `placeholderData: keepPreviousData` 避免列表闪烁

**验证：**
```bash
npm run test -- --run app/(app)/jobs/   # 测试通过
npm run build                           # 编译成功
```

---

#### Step 4.2 — 搜索历史 (localStorage)

**文件：**
- 创建 `app/(app)/jobs/hooks/useSearchHistory.ts`
- 创建 `test/useSearchHistory.test.tsx`
- 修改 `app/(app)/jobs/components/JobSearchBar.tsx`

**做什么：**
- `useSearchHistory()` hook：
  - 从 localStorage `joblit:search-history` 读取最近 10 条
  - `addToHistory(query)` — 去重 + 插入头部 + 截断到 10
  - `clearHistory()` — 清空
- 当 `q` 为空时，SearchBar Dropdown 展示搜索历史
- 带 Clock 图标 + "Clear" 按钮

**验证：**
```bash
npm run test -- --run test/useSearchHistory   # 新测试通过
```

---

#### Step 4.3 — 三层 Loading 策略

**文件：**
- 修改 `app/(app)/jobs/JobsClient.tsx`（或 `JobListPanel.tsx`）

**做什么：**
1. **输入时** — 搜索栏右侧显示小型 spinner（`isTyping && q !== debouncedQ`）
2. **请求中** — 顶部进度条（已有 `edu-loading-bar` 风格）
3. **筛选器切换** — Skeleton 叠加层（`bg-white/60 backdrop-blur-sm`），不清空现有列表

- 移除 `useDebouncedValue(loading, 160)` 延迟（消除 360ms 无反馈窗口）

**验证：**
```bash
npm run build   # 编译成功
# 手动验证：输入搜索词时看到 spinner → 请求时看到进度条 → 无闪烁
```

---

#### Step 4.4 — 键盘导航

**文件：**
- 创建 `app/(app)/jobs/hooks/useKeyboardNavigation.ts`
- 修改 `app/(app)/jobs/JobsClient.tsx`

**做什么：**
- `j` / `ArrowDown` — 选中下一条 Job
- `k` / `ArrowUp` — 选中上一条 Job
- `Enter` — 打开详情 / 触发主操作
- `Escape` — 清空搜索框 / 关闭详情
- 仅在搜索 Input 不聚焦时激活（避免干扰打字）
- 选中 Job 后自动 `scrollIntoView({ block: "nearest" })`

**验证：**
```bash
npm run build   # 编译成功
# 手动验证：键盘 j/k 上下切换 Job
```

---

### Phase 5 — 高级性能优化

#### Step 5.1 — 安装 @tanstack/react-virtual + 虚拟滚动

**文件：**
- 修改 `package.json`（`npm install @tanstack/react-virtual`）
- 修改 `tools/ci/dependency-allowlist.json`（已有）
- 创建或修改 `app/(app)/jobs/components/JobListPanel.tsx`

**做什么：**
- `useVirtualizer` 配置：`estimateSize: 88px`, `overscan: 5`
- 仅当 `items.length > 80` 时启用虚拟滚动（小列表不加复杂度）
- 与无限滚动整合：虚拟列表底部触发 `loadMore()`

**验证：**
```bash
npm run deps:policy   # 依赖策略通过
npm run build         # 编译成功
# Performance tab 验证：200+ 条 Job 时 DOM 节点数 < 30
```

---

#### Step 5.2 — Streaming SSR + React Query HydrationBoundary

**文件：**
- 修改 `app/(app)/jobs/page.tsx`
- 创建 `lib/getQueryClient.ts`（React Query server-side singleton）

**做什么：**
- 用 `Suspense` 包裹 `JobsContent` 异步组件
- SSR 阶段 `queryClient.prefetchQuery` 预取首页 Job 数据
- `<HydrationBoundary state={dehydrate(queryClient)}>` 传递到客户端
- `loading.tsx` 作为 Suspense fallback 已存在
- `JobsClient` 启动时直接从 hydrated cache 读取，消除 SSR→CSR 数据闪烁

**验证：**
```bash
npm run build         # 编译成功
# Lighthouse: TTFB 和 LCP 应有明显改善
```

---

#### Step 5.3 — ARIA Landmarks + Screen Reader 优化

**文件：**
- 修改 `app/(app)/jobs/JobsClient.tsx`（或拆分后的子组件）

**做什么：**
- 搜索栏包裹 `role="search" aria-label="Job search"`
- 列表容器 `role="list" aria-label="${totalCount} jobs found" aria-busy={isFetching}`
- 每个 JobListItem `role="listitem" aria-selected={isActive}`
- 新增 `<div aria-live="polite" className="sr-only">` 动态播报结果数量
- TopNav 移动端 "..." 按钮添加 `aria-label="More options"`

**验证：**
```bash
npm run build   # 编译成功
# axe DevTools 扫描：0 critical, 0 serious violations
```

---

#### Step 5.4 — 移动端 Tab 切换布局

**文件：**
- 修改 `app/(app)/jobs/JobsClient.tsx`

**做什么：**
- `< lg` 屏幕：列表 / 详情用 Tab 切换（而非固定 44dvh 高度拼挤）
- `TabsList` 顶部：`Jobs (N)` / `Detail`
- 选中 Job 时自动切到 Detail tab
- Desktop (`lg+`) 保持 side-by-side grid 布局不变

**验证：**
```bash
npm run build   # 编译成功
# 手机视口验证：Tab 切换流畅
```

---

### Phase 6 — 最终验证与发布

#### Step 6.1 — 全量测试 + Lint + Build

**文件：** 无新增

**验证：**
```bash
npm run lint            # 0 errors
npm run test            # 全量通过
npm run build           # 编译成功，记录 JS size
npm run deps:policy     # 依赖策略通过
npm run deps:audit      # 无 high/critical 漏洞
```

---

#### Step 6.2 — 性能基准对比

**做什么：**
- 记录优化前后指标：

| 指标 | 优化前 | 优化后 | 目标 |
|------|--------|--------|------|
| 搜索 P95 (500条) | ~300ms | ? | <100ms |
| LCP | ~2.5s | ? | <1.5s |
| INP | ~150ms | ? | <50ms |
| CLS | ~0.1 | ? | <0.01 |
| Jobs 首屏 JS | ~350KB | ? | <200KB |
| DOM 节点 (200条) | ~800+ | ? | <50 |

---

## Step 总览表

| Phase | Step | 任务 | 文件数 | 预计时间 |
|-------|------|------|--------|----------|
| 1 | 1.1 | Error Boundary 全覆盖 | 6 新建 | 15 min |
| 1 | 1.2 | next.config.ts 优化 | 1 修改 | 10 min |
| 1 | 1.3 | Suggestions ETag 缓存 | 1 修改 | 15 min |
| 1 | 1.4 | jobLevel 大小写修复 | 1 修改 | 5 min |
| 1 | 1.5 | 全筛选器 Debounce + Abort | 1 修改 | 20 min |
| 1 | 1.6 | ETag 清理空 platform | 1 修改 | 5 min |
| 2 | 2.1 | pg_trgm + GIN 索引 | 1 新建 + 1 修改 | 15 min |
| 2 | 2.2 | searchUtils.ts | 2 新建 | 15 min |
| 2 | 2.3 | jobSearchService.ts | 2 新建 | 30 min |
| 2 | 2.4 | listJobs 集成 | 1 修改 | 20 min |
| 3 | 3.1 | useJobSearch hook 提取 | 1 新建 + 1 修改 | 25 min |
| 3 | 3.2 | JobListItem + memo | 1 新建 + 1 修改 | 20 min |
| 3 | 3.3 | JobDetailPanel + dynamic | 1 新建 + 1 修改 | 25 min |
| 3 | 3.4 | Dialog 组件提取 | 2 新建 + 1 修改 | 20 min |
| 3 | 3.5 | useJobMutations hook | 1 新建 + 1 修改 | 20 min |
| 3 | 3.6 | 最终瘦身验证 | 2 修改 | 15 min |
| 4 | 4.1 | cmdk 搜索建议 + 高亮 | 1 新建 + 1 修改 | 25 min |
| 4 | 4.2 | 搜索历史 | 2 新建 + 1 修改 | 20 min |
| 4 | 4.3 | 三层 Loading | 1 修改 | 15 min |
| 4 | 4.4 | 键盘导航 | 1 新建 + 1 修改 | 20 min |
| 5 | 5.1 | 虚拟滚动 | 1 新建 + 2 修改 | 25 min |
| 5 | 5.2 | Streaming SSR + Hydration | 2 修改 + 1 新建 | 25 min |
| 5 | 5.3 | ARIA + Screen Reader | 3 修改 | 20 min |
| 5 | 5.4 | 移动端 Tab 布局 | 1 修改 | 20 min |
| 6 | 6.1 | 全量验证 | 0 | 15 min |
| 6 | 6.2 | 性能基准对比 | 0 | 15 min |

**总计：26 个 Step，约 8-10 小时**

---

## 依赖关系

```
Phase 1 (全部独立，可并行)
  ↓
Phase 2 (2.1 → 2.2 → 2.3 → 2.4 串行)
  ↓
Phase 3 (3.1 → 3.2/3.3/3.4/3.5 可并行 → 3.6 最后)
  ↓
Phase 4 (4.1 → 4.2 串行; 4.3/4.4 独立可并行)
  ↓
Phase 5 (5.1/5.2/5.3/5.4 全部独立可并行)
  ↓
Phase 6 (最终验证)
```

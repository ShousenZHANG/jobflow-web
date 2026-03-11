---
title: EN 模式下 Jobs 页「手动添加职位」功能
date: 2026-03-10
status: approved-by-user
scope:
  - Jobs 页入口（Add job 按钮，仅 AU market）
  - POST /api/jobs 新建单条职位 API
  - 添加职位 Modal 表单与提交/错误处理
non_goals:
  - 不实现编辑已有 Job、批量导入、从 URL 自动拉取 JD
  - CN 模式不展示此功能
constraints:
  - jobUrl 必填，重复时拒绝（409），不修改原记录
  - 仅 EN 模式（market AU）显示入口
---

## 背景

当前职位仅通过抓取流程（run_jobspy / run_cn_fetcher）经 POST /api/admin/import 写入。用户希望在 EN 模式下能手动从 Seek 等渠道添加职位：粘贴链接与 JD 信息，落库后出现在 Jobs 列表，并可使用现有 Generate CV / Generate CL。

## 目标

- 在 EN 模式下支持「手动添加一条职位」：必填 jobUrl + title，可选 company / location / jobType / jobLevel / description。
- 重复 jobUrl 时拒绝并提示，不覆盖原记录。
- 新增职位与现有抓取职位一致参与列表展示与 Generate CV/CL，无需改动生成逻辑。

## 设计概览

### 1. 范围与边界

- **功能**：Jobs 页（仅 market AU）提供「Add job」→ Modal 表单 → 提交创建单条 Job → 列表刷新，后续可正常 Generate CV/CL。
- **EN 仅显**：`useMarket() === "AU"` 时显示按钮与相关逻辑；CN 不展示、不调用新建 API。
- **不在此次**：编辑 Job、批量导入、从 URL 拉取 JD。

### 2. API

- **路由**：`POST /api/jobs`
- **鉴权**：`getServerSession(authOptions)`，未登录 401。
- **Body**：
  - `jobUrl` (string, 必填)，合法 URL，提交前用 `canonicalizeJobUrl` 规范化后做唯一性判断。
  - `title` (string, 必填)，trim 后长度 ≥ 1。
  - `company`, `location`, `jobType`, `jobLevel`, `description` (string, 可选)。
- **逻辑**：
  1. 校验通过后，用 `userId` + 规范化后的 `jobUrl` 查是否已存在。
  2. 已存在 → `409 Conflict`，body `{ error: "JOB_URL_EXISTS" }`。
  3. 不存在 → `prisma.job.create`，`market: "AU"`, `status: "NEW"`，返回 `201`，body `{ id: string }`。
- **错误**：400（校验）、401、409、500。

### 3. UI 与交互

- **入口**：Jobs 页 toolbar 最后一列，与 Search 按钮同一行，**Add job 在 Search 左侧**（`[Add job] [Search]`），仅 `market === "AU"` 时渲染。
- **Modal**：
  - 标题："Add job"（或 "Add job from Seek"）。
  - 表单：Job URL（必填）、Title（必填）、Company、Location、Job type、Job level、Description（Textarea，可选）。
  - 底部：Cancel、Add（提交时 loading）。
- **提交后**：
  - 成功：关闭 Modal，清空表单，refetch 列表（或乐观更新）；可选 toaster "Job added"。
  - 409：不关闭 Modal，表单上方或 URL 旁显示 "This job link already exists."
  - 400/401/500：表单错误区或 toaster 提示。
- **实现**：复用现有 Dialog、Input、Textarea、Button；在 toolbar 最后一列 `flex items-end gap-2` 中在 Search 按钮前插入 Add job 按钮。

### 4. 数据流与错误处理

- 表单受控，本地 state；提交 → `POST /api/jobs`。
- 成功：关闭 Modal、清空、invalidate jobs query 或乐观插入。
- 409：展示 JOB_URL_EXISTS 文案，不关 Modal。
- 其他错误：统一错误区或 toaster，不关 Modal（或按需）。

## 验收标准

1. **EN 模式**：Jobs 页 toolbar 中 Search 左侧出现「Add job」按钮；CN 模式不出现。
2. **Modal**：可填写 jobUrl、title 及可选字段；Cancel 关闭，Add 提交。
3. **API**：未登录 401；重复 jobUrl 409；合法 body 创建成功 201。
4. **列表**：新建职位出现在当前用户 Jobs 列表，可点击进入并执行 Generate CV / Generate CL。
5. **重复**：同一用户再次提交相同（规范化后）jobUrl 得到 409，界面提示已存在。

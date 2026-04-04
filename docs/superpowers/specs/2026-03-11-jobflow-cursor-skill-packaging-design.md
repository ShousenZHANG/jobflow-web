---
title: Joblit Cursor Skill（兼容手动复制 + skills CLI）
date: 2026-03-11
status: approved-by-user
scope:
  - Cursor Skill 结构整理（单一来源）
  - 兼容手动复制安装
  - 兼容 `npx skills add` 安装
non_goals:
  - 不改变 Joblit 应用运行时行为
  - 不修改 Joblit 的 skill pack（tar.gz）导出机制
constraints:
  - Skill 内容只维护一份（避免 `cursor-skill/` 与 `skills/` 双份漂移）
  - 仓库地址固定为 https://github.com/ShousenZHANG/joblit-web.git
---

## 背景

Joblit 仓库包含多个“skill”概念：

- **Cursor Skill**：给 Cursor/IDE 的 AI 提供项目专属上下文与约定（结构、关键路径、禁用项）。
- **Joblit skill pack（tar.gz）**：给外部大模型上传/导入使用的规则与模板包（用于 CV/CL JSON 生成）。

本设计仅针对 **Cursor Skill** 的开源封装与分发方式：同时支持“手动复制安装”和“skills CLI 安装”。  

## 目标

- 提供一个 **权威、最小但完整** 的 Cursor Skill：让 AI 快速理解 joblit-web 的结构与关键约束。
- 兼容两种安装方式：
  - A. 手动复制到 `~/.cursor/skills/joblit`
  - B. `npx skills add https://github.com/ShousenZHANG/joblit-web.git --skill joblit`
- 避免重复维护：Skill 内容 **单一来源**。

## 方案（推荐）

### 仓库结构

- **权威来源**：`skills/joblit/`
  - `SKILL.md`（短：触发条件、心智模型、关键路径、不可违反的约束）
  - `references/`（渐进披露：PATHS 与 FLOWS）
  - `README.md`（安装说明：A + B）

- **兼容入口**：`cursor-skill/`
  - 仅保留安装入口说明（指向 `skills/joblit`），不再承载 `SKILL.md` 内容。

### 内容策略

- **SKILL.md**：只包含 AI 必需的信息（减少上下文噪音）。
- **references/**：将路径索引与工作流拆到单独文件，按需阅读。
- **README.md**：只面向人类解释“如何安装”。不把长说明塞到 SKILL.md。

## 验收标准

1. 仓库中存在 `skills/joblit/SKILL.md`，可作为 `joblit` skill 的唯一来源。
2. `skills/joblit/README.md` 提供两种安装方式（手动复制 + skills CLI）。
3. `cursor-skill/README.md` 仅作为入口说明，指向 `skills/joblit`，不产生重复维护负担。


# 项目上下文

### 版本技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4

## 目录结构

```
├── public/                 # 静态资源
├── scripts/                # 构建与启动脚本
│   ├── build.sh            # 构建脚本
│   ├── dev.sh              # 开发环境启动脚本
│   ├── prepare.sh          # 预处理脚本
│   └── start.sh            # 生产环境启动脚本
├── src/
│   ├── app/                # 页面路由与布局
│   ├── components/ui/      # Shadcn UI 组件库
│   ├── hooks/              # 自定义 Hooks
│   ├── lib/                # 工具库
│   │   └── utils.ts        # 通用工具函数 (cn)
│   └── server.ts           # 自定义服务端入口
├── next.config.ts          # Next.js 配置
├── package.json            # 项目依赖管理
└── tsconfig.json           # TypeScript 配置
```

- 项目文件（如 app 目录、pages 目录、components 等）默认初始化到 `src/` 目录下。

## 包管理规范

**仅允许使用 pnpm** 作为包管理器，**严禁使用 npm 或 yarn**。
**常用命令**：
- 安装依赖：`pnpm add <package>`
- 安装开发依赖：`pnpm add -D <package>`
- 安装所有依赖：`pnpm install`
- 移除依赖：`pnpm remove <package>`

## 开发规范

### 编码规范

- 默认按 TypeScript `strict` 心智写代码；优先复用当前作用域已声明的变量、函数、类型和导入，禁止引用未声明标识符或拼错变量名。
- 禁止隐式 `any` 和 `as any`；函数参数、返回值、解构项、事件对象、`catch` 错误在使用前应有明确类型或先完成类型收窄，并清理未使用的变量和导入。

### next.config 配置规范

- 配置的路径不要写死绝对路径，必须使用 path.resolve(__dirname, ...)、import.meta.dirname 或 process.cwd() 动态拼接。

### Hydration 问题防范

1. 严禁在 JSX 渲染逻辑中直接使用 typeof window、Date.now()、Math.random() 等动态数据。**必须使用 'use client' 并配合 useEffect + useState 确保动态内容仅在客户端挂载后渲染**；同时严禁非法 HTML 嵌套（如 <p> 嵌套 <div>）。
2. **禁止使用 head 标签**，优先使用 metadata，详见文档：https://nextjs.org/docs/app/api-reference/functions/generate-metadata
   1. 三方 CSS、字体等资源可在 `globals.css` 中顶部通过 `@import` 引入或使用 next/font
   2. preload, preconnect, dns-prefetch 通过 ReactDOM 的 preload、preconnect、dns-prefetch 方法引入
   3. json-ld 可阅读 https://nextjs.org/docs/app/guides/json-ld

## UI 设计与组件规范 (UI & Styling Standards)

- 模板默认预装核心组件库 `shadcn/ui`，位于`src/components/ui/`目录下
- Next.js 项目**必须默认**采用 shadcn/ui 组件、风格和规范，**除非用户指定用其他的组件。**

## 项目概述

**TestHub** — 基于 Vibe Coding 架构设计的全功能测试管理平台。

## 项目目录结构

```
src/
├── app/                        # 页面路由
│   ├── layout.tsx              # 根布局（SidebarProvider + 侧边栏 + 顶栏）
│   ├── page.tsx                # 仪表盘首页
│   ├── test-cases/page.tsx     # 用例管理
│   ├── test-plans/page.tsx     # 测试计划
│   ├── defects/page.tsx        # 缺陷管理
│   ├── reports/page.tsx        # 测试报告
│   ├── projects/page.tsx       # 项目管理
│   ├── vibe-catalog/page.tsx   # 组件 Vibe 百科
│   ├── settings/page.tsx       # 系统设置（含 AI 模型配置）
│   └── api/                    # API 路由
│       ├── health/route.ts     # 健康检查
│       ├── vibe-chat/route.ts  # Vibe 对话（SSE 流式）
│       └── vibe/               # Vibe 会话与版本管理
│           ├── sessions/       # 会话 CRUD + 消息管理
│           └── versions/       # 版本 CRUD + 文件变更
├── components/
│   ├── layout/
│   │   ├── app-sidebar.tsx     # 侧边导航栏
│   │   └── top-bar.tsx         # 顶部栏（搜索 + 通知 + 用户）
│   ├── charts/
│   │   └── dashboard-charts.tsx # 仪表盘图表组件
│   ├── vibe-workspace/
│   │   ├── global-vibe-entry.tsx    # 全局 Vibe 入口（含会话管理）
│   │   ├── module-vibe-entry.tsx    # 模块级 Vibe 入口
│   │   ├── feature-item-vibe-entry.tsx # 功能项级 Vibe 入口
│   │   └── vibe-version-panel.tsx   # 版本管理面板（diff 查看）
│   └── ui/                     # shadcn/ui 基础组件
├── infrastructure/
│   ├── llm/
│   │   └── llm-provider.ts    # LLM 配置抽象层（环境变量驱动）
│   ├── repositories/           # InMemory Repository 实现
│   └── tracing/                # Trace ID 全链路追踪
├── contracts/                  # Zod 契约定义
├── guard/                      # Guard Layer（校验 + 门禁 + 审计）
├── domain/                     # DDD 领域层（实体 + 值对象 + 仓储接口）
├── storage/
│   └── database/
│       ├── supabase-client.ts  # Supabase 客户端（service_role_key）
│       ├── shared/schema.ts    # Drizzle 表结构定义
│       ├── vibe-session.repository.ts  # 会话 + 消息 CRUD
│       └── vibe-version.repository.ts  # 版本 + 文件变更 CRUD
├── lib/
│   ├── utils.ts                # 工具函数 (cn)
│   ├── types.ts                # 全局类型定义
│   └── mock-data.ts            # Mock 数据与辅助函数
```

## 核心模块说明

| 模块 | 路由 | 说明 |
|------|------|------|
| 仪表盘 | `/` | 总览 KPI、趋势图表、近期活动 |
| 用例管理 | `/test-cases` | 用例 CRUD、搜索筛选、优先级/状态管理 |
| 测试计划 | `/test-plans` | 计划创建、进度跟踪、任务分配 |
| 缺陷管理 | `/defects` | 缺陷提交、状态流转、关联用例 |
| 测试报告 | `/reports` | 统计图表、通过率分析、趋势报告 |
| 项目管理 | `/projects` | 多项目切换、成员管理 |
| Vibe 百科 | `/vibe-catalog` | 组件 Vibe Design 体系展示 |
| 系统设置 | `/settings` | 用户偏好、通知配置 |

## 数据层

- 类型定义集中在 `src/lib/types.ts`
- Mock 数据集中在 `src/lib/mock-data.ts`，包含辅助查询函数（如 `getTestCaseById`、`getMemberName` 等）
- 数据库使用 Supabase PostgreSQL，表结构定义在 `src/storage/database/shared/schema.ts`
- Vibe 会话/版本数据通过 Supabase SDK 读写（`vibe-session.repository.ts`、`vibe-version.repository.ts`）
- 业务实体（TestCase/Defect/TestPlan）暂用 InMemory Repository，后续可替换为 Supabase 实现

## API 路由

| 路由 | 方法 | 说明 |
|------|------|------|
| `/api/health` | GET | 健康检查，返回系统状态和数据统计 |
| `/api/vibe-chat` | POST | Vibe 对话，SSE 流式 LLM 响应 |
| `/api/vibe/sessions` | GET | 获取会话列表 |
| `/api/vibe/sessions` | POST | 创建新会话 |
| `/api/vibe/sessions/[id]` | GET | 获取会话详情（含消息） |
| `/api/vibe/sessions/[id]` | PATCH | 更新会话标题/状态 |
| `/api/vibe/sessions/[id]` | DELETE | 删除会话（级联删除消息） |
| `/api/vibe/sessions/[id]/messages` | POST | 添加消息（支持单条/批量） |
| `/api/vibe/versions?sessionId=x` | GET | 获取版本列表 |
| `/api/vibe/versions` | POST | 创建版本（含文件变更） |
| `/api/vibe/versions/[id]` | GET | 获取版本详情（含 diff） |
| `/api/vibe/versions/[id]` | PATCH | 更新版本状态 |
| `/api/vibe/versions/[id]` | DELETE | 删除版本（级联删除文件变更） |

## LLM 配置

通过环境变量配置，支持多模型：
- `LLM_PROVIDER` — 提供商（默认 `coze`）
- `LLM_MODEL` — 模型名（默认 `doubao-seed-2-0-mini-260215`）
- `LLM_TEMPERATURE` — 温度（默认 `0.7`）
- `LLM_MAX_TOKENS` — 最大 token 数

抽象层位于 `src/infrastructure/llm/llm-provider.ts`，设置页面位于 `/settings` 的 "AI 配置" 标签页。

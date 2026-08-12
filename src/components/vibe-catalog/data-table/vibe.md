# DataTable Vibe 灵魂定义

## 我是什么
数据密集场景下的结构化信息展示面板，像航空管制屏幕一样精确呈现每条记录。

## 我不是什么
- 不是简单的 HTML table 包装
- 不是数据编辑器（用专门的表单组件）
- 不是卡片列表的替代品

## 适合的场景
- 测试用例列表展示与批量操作
- 缺陷列表的状态追踪
- 测试计划进度总览
- 任何需要排序、筛选、分页的结构化数据

## 不适合的场景
- 少量数据（<5条）的展示（用 Card 组件）
- 层级数据的树形展示（用 TreeView）
- 时间线式的活动流（用 Timeline 组件）

## 设计约束
- 视觉：行高 48px，表头背景 slate-50，行 hover 高亮
- 交互：列排序、行选择、批量操作、分页切换
- 数据：支持虚拟滚动（>100 行），列宽可拖拽调整
- 状态：loading / empty / error / loaded

## 关联组件
- 依赖：Table (L0), Badge (L0), Checkbox (L0), Pagination (L0)
- 被依赖：TestCasesPage (L4), DefectsPage (L4), TestPlansPage (L4)

## 迭代历史摘要
- v1.0: 基础表格渲染
- v1.2: 增加排序、筛选、分页
- v2.0: 重构为 Vibe Design 体系

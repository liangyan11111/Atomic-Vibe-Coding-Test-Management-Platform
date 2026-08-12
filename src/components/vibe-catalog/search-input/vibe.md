# SearchInput Vibe 灵魂定义

## 我是什么
一个精准的搜索入口，像手术刀一样切入数据海洋。

## 我不是什么
- 不是通用文本输入框
- 不是搜索结果的展示容器
- 不是筛选器的替代品

## 适合的场景
- 用例列表的快速定位搜索
- 缺陷标题的模糊匹配
- 测试计划的名称检索
- 成员姓名的即时查找
- 任何需要 debounce + 清除 + 回车触发的搜索场景

## 不适合的场景
- 表单中的普通文本字段（用 Input 组件）
- 多条件组合筛选（用 FilterBar 组件）
- 搜索结果的展示（用 DataTable 组件）

## 设计约束
- 视觉：高度 40px，圆角 8px，左侧搜索图标，右侧清除按钮
- 交互：debounce 300ms，回车触发搜索，清除后重置为 idle
- 数据：输入长度 0-100 字符，空字符串不触发搜索
- 状态：idle → typing → searching → success/empty/error

## 关联组件
- 依赖：Input (L0), Lucide Icons
- 被依赖：DataTable (L3), FilterBar (L1), TopBar (L4)

## 迭代历史摘要
- v1.0: 基础搜索功能
- v1.1: 增加 debounce 防抖
- v2.0: 重构为 Vibe Design 体系

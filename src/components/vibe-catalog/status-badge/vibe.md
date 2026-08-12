# StatusBadge Vibe 灵魂定义

## 我是什么
状态信号的精确传达者，用颜色编码让用户在 0.5 秒内识别当前状态。

## 我不是什么
- 不是装饰性标签
- 不是可点击的按钮
- 不是进度指示器

## 适合的场景
- 测试用例状态标记（draft/active/deprecated）
- 缺陷严重程度标识（critical/major/minor/trivial）
- 测试执行结果展示（passed/failed/blocked/skipped）
- 测试计划进度状态（planning/in_progress/completed/cancelled）

## 不适合的场景
- 操作按钮（用 Button）
- 数值展示（用 Stat 组件）
- 长文本描述（用 Tooltip）

## 设计约束
- 视觉：圆角 6px，内边距 4px 10px，字号 12px，字重 500
- 色彩：严格遵循状态色板（Emerald=通过, Rose=失败, Amber=警告, Sky=进行中）
- 交互：纯展示，不可点击，hover 可显示 Tooltip 补充信息
- 无障碍：颜色不是唯一信息载体，必须同时包含文字标签

## 关联组件
- 依赖：Badge (L0)
- 被依赖：DataTable (L3), TestCaseCard (L2), DefectCard (L2)

## 迭代历史摘要
- v1.0: 基础状态标签
- v1.1: 增加颜色编码规范
- v2.0: 重构为 Vibe Design 体系

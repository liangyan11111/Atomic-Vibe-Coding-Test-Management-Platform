# StatusBadge 生成规则

## AI 生成时必须遵循

### 视觉规范
- 圆角 6px，内边距 sm: 2px 6px, md: 4px 10px
- 字号 12px，字重 500，行高 1.2
- 背景色使用对应色系的 100 级别，文字使用 700 级别
- 图标大小 14px，与文字间距 4px

### 状态色板（严格执行）
- 通过/成功：Emerald (bg-emerald-100, text-emerald-700)
- 失败/致命：Rose (bg-rose-100, text-rose-700)
- 警告/阻塞：Amber (bg-amber-100, text-amber-700)
- 进行中：Sky (bg-sky-100, text-sky-700)
- 中性/跳过：Slate (bg-slate-100, text-slate-700)

### 无障碍规范
- 颜色不是唯一信息载体，必须同时包含文字标签
- 图标为装饰性（aria-hidden），文字提供语义

### 禁止行为
- 禁止自定义颜色，必须使用状态映射表
- 禁止添加点击事件（纯展示组件）
- 禁止在 Badge 内放置超过 4 个汉字

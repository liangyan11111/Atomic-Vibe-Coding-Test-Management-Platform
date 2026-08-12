# SearchInput 生成规则

## AI 生成时必须遵循

### 输入处理
- 必须使用 debounce，延迟 `{debounceMs}ms` 后才触发搜索
- 输入长度超过 `{maxLength}` 时截断并提示
- 空字符串不触发搜索（除非 `minLength === 0`）

### 状态管理
- 搜索中（searching）必须显示 loading indicator
- 搜索失败（error）必须显示错误消息，且 3 秒后自动消失
- 无结果（empty）显示"未找到相关结果"的友好提示

### 交互规范
- 回车键触发搜索
- 清除按钮（x）点击清空输入并重置为 idle 状态
- 搜索期间禁止重复触发

### 禁止行为
- 禁止在 debounce 期间触发搜索
- 禁止在没有结果时清空历史输入
- 禁止在组件内部直接调用 API，必须通过传入的 onSearch 回调
- 禁止硬编码搜索 API URL

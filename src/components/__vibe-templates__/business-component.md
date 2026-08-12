# AI 生成模板 - 业务组件 (L2)

## 生成前必须读取
1. components/vibe-catalog/{component}/vibe.md
2. components/vibe-catalog/{component}/contract.ts
3. components/vibe-catalog/{component}/rules.md

## 代码结构要求
- 引用契约 Schema 做输入校验
- 使用 withErrorBoundary 包裹
- 单函数 ≤ 50 行，圈复杂度 ≤ 10
- 所有函数参数必须标注类型
- 禁止隐式 any

## 生成后必须
- [ ] 通过 ESLint vibe 规则
- [ ] 通过组件契约引用检查
- [ ] 包含 Trace ID 传递
- [ ] 有错误边界包裹
- [ ] 有对应的 test.spec.ts

## 模板结构
```tsx
'use client';

import { useState } from 'react';
import { z } from 'zod';
// 引入组件契约
import { XxxPropsSchema } from '@/components/vibe-catalog/xxx/contract';
// 引入 Guard
import { withTrace } from '@/guard';

interface XxxComponentProps {
  // 从契约推导
}

export function XxxComponent(props: XxxComponentProps) {
  // 契约校验
  const validatedProps = XxxPropsSchema.parse(props);
  
  // 业务逻辑
  // ...
  
  return (
    // JSX
  );
}
```

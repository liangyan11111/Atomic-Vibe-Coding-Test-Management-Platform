# AI 生成模板 - 页面编排组件 (L4)

## 生成前必须读取
1. 所有子组件的 vibe.md 和 contract.ts
2. 模块级业务规则契约
3. 页面级 Guard 规则

## 代码结构要求
- 仅负责子组件编排，不包含业务逻辑
- 子组件通过 props 传递数据
- 使用 withObservability 包裹
- 必须校验用户角色（RBAC）

## 模板结构
```tsx
'use client';

import { ModuleVibeEntry } from '@/components/vibe-workspace';
import { SearchInput } from '@/components/vibe-catalog/search-input';
import { DataTable } from '@/components/vibe-catalog/data-table';
import { FilterBar } from '@/components/vibe-catalog/filter-bar';

export default function XxxPage() {
  return (
    <div className="space-y-4 p-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">页面标题</h1>
          <p className="text-sm text-slate-500">页面描述</p>
        </div>
        <ModuleVibeEntry moduleName="模块名" modulePath="/path" />
      </div>

      {/* 搜索 + 筛选 */}
      <div className="flex items-center gap-3">
        <SearchInput placeholder="搜索..." />
        <FilterBar filters={[]} values={{}} onChange={() => {}} />
      </div>

      {/* 数据表格 */}
      <DataTable columns={[]} data={[]} />
    </div>
  );
}
```

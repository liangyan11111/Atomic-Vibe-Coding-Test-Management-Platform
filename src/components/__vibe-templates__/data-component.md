# AI 生成模板 - 数据组件 (L3)

## 生成前必须读取
1. components/vibe-catalog/{component}/vibe.md
2. components/vibe-catalog/{component}/contract.ts
3. components/vibe-catalog/{component}/rules.md

## 代码结构要求
- 列定义通过 columns prop 传入，禁止硬编码
- 支持排序、筛选、分页
- 空状态使用 Empty 组件
- 加载中显示 Skeleton
- 超过 100 行启用虚拟滚动

## 模板结构
```tsx
'use client';

import { useState, useMemo } from 'react';
import { ColumnDefSchema, SortStateSchema, PaginationSchema } from '@/components/vibe-catalog/data-table/contract';
import type { ColumnDef, SortState, Pagination } from '@/components/vibe-catalog/data-table/contract';

interface DataComponentProps<T> {
  columns: z.infer<typeof ColumnDefSchema>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
}

export function XxxTable<T>({ columns, data, loading, onRowClick }: DataComponentProps<T>) {
  const [sort, setSort] = useState<SortState>({ column: '', direction: 'none' });
  const [pagination, setPagination] = useState<Pagination>({ page: 1, pageSize: 20, total: data.length });

  // 排序逻辑
  const sortedData = useMemo(() => { /* ... */ }, [data, sort]);
  
  // 分页逻辑
  const pagedData = useMemo(() => { /* ... */ }, [sortedData, pagination]);

  return (
    // Table JSX
  );
}
```

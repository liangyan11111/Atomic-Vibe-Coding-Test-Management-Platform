import { z } from 'zod';

// ============ DataTable 契约 ============

export const ColumnDefSchema = z.object({
  key: z.string(),
  title: z.string(),
  sortable: z.boolean().default(false),
  filterable: z.boolean().default(false),
  width: z.number().optional(),
  align: z.enum(['left', 'center', 'right']).default('left'),
});
export type ColumnDef = z.infer<typeof ColumnDefSchema>;

export const SortDirectionSchema = z.enum(['asc', 'desc', 'none']);
export type SortDirection = z.infer<typeof SortDirectionSchema>;

export const SortStateSchema = z.object({
  column: z.string(),
  direction: SortDirectionSchema,
});
export type SortState = z.infer<typeof SortStateSchema>;

export const PaginationSchema = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1).max(100),
  total: z.number().int().min(0),
});
export type Pagination = z.infer<typeof PaginationSchema>;

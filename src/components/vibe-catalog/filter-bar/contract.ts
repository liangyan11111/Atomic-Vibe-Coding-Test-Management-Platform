import { z } from 'zod';

// ============ FilterBar 契约 ============

export const FilterOperatorSchema = z.enum(['eq', 'neq', 'in', 'nin', 'gt', 'lt', 'contains', 'startsWith']);
export type FilterOperator = z.infer<typeof FilterOperatorSchema>;

export const FilterConditionSchema = z.object({
  field: z.string(),
  operator: z.enum(['eq', 'neq', 'in', 'nin', 'gt', 'lt', 'contains', 'startsWith']),
  value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
});
export type FilterCondition = z.infer<typeof FilterConditionSchema>;

export const FilterValuesSchema = z.record(z.string(), z.union([z.string(), z.array(z.string())]));
export type FilterValues = z.infer<typeof FilterValuesSchema>;

export const FilterConfigSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: z.enum(['select', 'multi-select', 'date-range', 'search']),
  options: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
});
export type FilterConfig = z.infer<typeof FilterConfigSchema>;

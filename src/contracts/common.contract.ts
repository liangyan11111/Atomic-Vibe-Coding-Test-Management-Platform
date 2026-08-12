/**
 * 通用契约 - 跨模块共享的基础 Zod Schema
 */
import { z } from 'zod';

// ============ 通用枚举 ============
export const PrioritySchema = z.enum(['P0', 'P1', 'P2', 'P3']);
export type Priority = z.infer<typeof PrioritySchema>;

export const SeveritySchema = z.enum(['critical', 'major', 'minor', 'trivial']);
export type Severity = z.infer<typeof SeveritySchema>;

export const TestCaseStatusSchema = z.enum(['active', 'draft', 'deprecated']);
export type TestCaseStatus = z.infer<typeof TestCaseStatusSchema>;

export const DefectStatusSchema = z.enum(['open', 'confirmed', 'in_progress', 'resolved', 'closed', 'rejected']);
export type DefectStatus = z.infer<typeof DefectStatusSchema>;

export const TestPlanStatusSchema = z.enum(['planning', 'in_progress', 'completed', 'cancelled']);
export type TestPlanStatus = z.infer<typeof TestPlanStatusSchema>;

export const TestCaseTypeSchema = z.enum(['functional', 'performance', 'security', 'compatibility', 'api']);
export type TestCaseType = z.infer<typeof TestCaseTypeSchema>;

// ============ 通用类型 ============
export const PaginationParamsSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});
export type PaginationParams = z.infer<typeof PaginationParamsSchema>;

export const SortParamsSchema = z.object({
  field: z.string(),
  order: z.enum(['asc', 'desc']).default('asc'),
});
export type SortParams = z.infer<typeof SortParamsSchema>;

export const DateRangeSchema = z.object({
  start: z.string(),
  end: z.string(),
});
export type DateRange = z.infer<typeof DateRangeSchema>;

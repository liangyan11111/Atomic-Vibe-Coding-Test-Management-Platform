import { z } from 'zod';

// ============ TestCaseForm 契约 ============

export const TestCaseFormSchema = z.object({
  title: z.string().min(1, '标题必填').max(200),
  module: z.string().min(1, '模块必填'),
  priority: z.enum(['P0', 'P1', 'P2', 'P3']),
  type: z.enum(['functional', 'performance', 'security', 'compatibility', 'api']),
  precondition: z.string().optional(),
  steps: z.string().min(1, '步骤必填'),
  expectedResult: z.string().min(1, '预期结果必填'),
  tags: z.array(z.string()).default([]),
});
export type TestCaseFormData = z.infer<typeof TestCaseFormSchema>;

export const TestCaseFormModeSchema = z.enum(['create', 'edit', 'view']);
export type TestCaseFormMode = z.infer<typeof TestCaseFormModeSchema>;

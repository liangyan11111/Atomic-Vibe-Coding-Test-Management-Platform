import { z } from 'zod';

// ============ 测试计划契约 ============

export const TestPlanStatusSchema = z.enum(['planning', 'in_progress', 'completed', 'cancelled']);

export const CreateTestPlanInputSchema = z.object({
  name: z.string().min(1, '计划名称必填').max(200),
  description: z.string().max(2000).optional().default(''),
  projectId: z.string().min(1, '项目必选'),
  startDate: z.string().min(1, '开始日期必填'),
  endDate: z.string().min(1, '结束日期必填'),
  assignedTo: z.array(z.string()).min(1, '至少指派一人'),
  testCaseIds: z.array(z.string()).min(1, '至少选择一个用例'),
});

export const UpdateTestPlanInputSchema = CreateTestPlanInputSchema.partial().extend({
  status: TestPlanStatusSchema.optional(),
});

export const TestPlanQuerySchema = z.object({
  projectId: z.string().optional(),
  status: TestPlanStatusSchema.optional(),
  search: z.string().max(100).optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(20),
});

export const TestPlanOutputSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  name: z.string(),
  description: z.string(),
  status: TestPlanStatusSchema,
  startDate: z.string(),
  endDate: z.string(),
  createdBy: z.string(),
  assignedTo: z.array(z.string()),
  testCaseIds: z.array(z.string()),
  progress: z.number(),
  passCount: z.number(),
  failCount: z.number(),
  blockedCount: z.number(),
  pendingCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const TestPlanErrorCodes = z.enum([
  'TEST_PLAN_NOT_FOUND',
  'TEST_PLAN_DATE_INVALID',
  'TEST_PLAN_NO_CASES',
  'TEST_PLAN_PERMISSION_DENIED',
]);

export type CreateTestPlanInput = z.infer<typeof CreateTestPlanInputSchema>;
export type UpdateTestPlanInput = z.infer<typeof UpdateTestPlanInputSchema>;
export type TestPlanQuery = z.infer<typeof TestPlanQuerySchema>;
export type TestPlanOutput = z.infer<typeof TestPlanOutputSchema>;
export type TestPlanErrorCode = z.infer<typeof TestPlanErrorCodes>;

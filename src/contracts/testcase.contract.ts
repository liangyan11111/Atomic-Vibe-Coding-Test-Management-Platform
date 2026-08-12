import { z } from 'zod';

// ============ 测试用例契约 (Layer 1: 组件级 + Layer 3: 数据级) ============

// 优先级枚举
export const PrioritySchema = z.enum(['P0', 'P1', 'P2', 'P3']);

// 用例类型枚举
export const TestCaseTypeSchema = z.enum(['functional', 'performance', 'security', 'compatibility', 'usability']);

// 用例状态枚举
export const TestCaseStatusSchema = z.enum(['draft', 'active', 'deprecated']);

// 测试步骤契约
export const TestStepContractSchema = z.object({
  order: z.number().min(1),
  action: z.string().min(1, '操作步骤不能为空').max(500),
  expected: z.string().min(1, '预期结果不能为空').max(500),
});

// 创建用例输入契约
export const CreateTestCaseInputSchema = z.object({
  title: z.string().min(1, '标题必填').max(200, '标题不超过200字'),
  description: z.string().max(2000).optional().default(''),
  module: z.string().min(1, '模块必选'),
  priority: PrioritySchema,
  type: TestCaseTypeSchema,
  precondition: z.string().max(1000).optional().default(''),
  steps: z.array(TestStepContractSchema).min(1, '至少需要一个测试步骤'),
  expectedResult: z.string().min(1, '预期结果必填').max(2000),
  tags: z.array(z.string().max(50)).max(10).optional().default([]),
  assignedTo: z.string().optional(),
});

// 更新用例输入契约
export const UpdateTestCaseInputSchema = CreateTestCaseInputSchema.partial();

// 用例查询契约
export const TestCaseQuerySchema = z.object({
  projectId: z.string().optional(),
  module: z.string().optional(),
  priority: PrioritySchema.optional(),
  type: TestCaseTypeSchema.optional(),
  status: TestCaseStatusSchema.optional(),
  search: z.string().max(100).optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional().default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// 用例输出契约
export const TestCaseOutputSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  title: z.string(),
  description: z.string(),
  module: z.string(),
  priority: PrioritySchema,
  type: TestCaseTypeSchema,
  status: TestCaseStatusSchema,
  precondition: z.string(),
  steps: z.array(TestStepContractSchema),
  expectedResult: z.string(),
  tags: z.array(z.string()),
  createdBy: z.string(),
  assignedTo: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  lastExecutedAt: z.string().nullable(),
  passRate: z.number(),
  executionCount: z.number(),
});

// 错误契约
export const TestCaseErrorCodes = z.enum([
  'TEST_CASE_NOT_FOUND',
  'TEST_CASE_TITLE_DUPLICATE',
  'TEST_CASE_INVALID_STEPS',
  'TEST_CASE_MODULE_NOT_FOUND',
  'TEST_CASE_PERMISSION_DENIED',
]);

export type CreateTestCaseInput = z.infer<typeof CreateTestCaseInputSchema>;
export type UpdateTestCaseInput = z.infer<typeof UpdateTestCaseInputSchema>;
export type TestCaseQuery = z.infer<typeof TestCaseQuerySchema>;
export type TestCaseOutput = z.infer<typeof TestCaseOutputSchema>;
export type TestCaseErrorCode = z.infer<typeof TestCaseErrorCodes>;

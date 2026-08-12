import { z } from 'zod';

// ============ 缺陷契约 (Layer 1: 组件级 + Layer 3: 数据级) ============

export const DefectSeveritySchema = z.enum(['critical', 'major', 'minor', 'trivial']);
export const DefectPrioritySchema = z.enum(['urgent', 'high', 'medium', 'low']);
export const DefectStatusSchema = z.enum(['open', 'confirmed', 'in_progress', 'resolved', 'closed', 'rejected']);

// 创建缺陷输入契约
export const CreateDefectInputSchema = z.object({
  title: z.string().min(1, '标题必填').max(200),
  description: z.string().min(1, '描述必填').max(5000),
  severity: DefectSeveritySchema,
  priority: DefectPrioritySchema,
  moduleId: z.string().min(1, '模块必选'),
  relatedTestCaseId: z.string().optional(),
  environment: z.string().max(200).optional().default(''),
  stepsToReproduce: z.string().max(3000).optional().default(''),
  expectedResult: z.string().max(1000).optional().default(''),
  actualResult: z.string().max(1000).optional().default(''),
  assignedTo: z.string().min(1, '指派人必填'),
  attachments: z.array(z.string()).max(10).optional().default([]),
});

// 更新缺陷输入契约
export const UpdateDefectInputSchema = CreateDefectInputSchema.partial().extend({
  status: DefectStatusSchema.optional(),
});

// 缺陷查询契约
export const DefectQuerySchema = z.object({
  projectId: z.string().optional(),
  severity: DefectSeveritySchema.optional(),
  priority: DefectPrioritySchema.optional(),
  status: DefectStatusSchema.optional(),
  assignedTo: z.string().optional(),
  search: z.string().max(100).optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(20),
});

// 缺陷输出契约
export const DefectOutputSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  title: z.string(),
  description: z.string(),
  severity: DefectSeveritySchema,
  priority: DefectPrioritySchema,
  status: DefectStatusSchema,
  moduleId: z.string(),
  relatedTestCaseId: z.string().nullable(),
  environment: z.string(),
  stepsToReproduce: z.string(),
  expectedResult: z.string(),
  actualResult: z.string(),
  createdBy: z.string(),
  assignedTo: z.string(),
  attachments: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
  resolvedAt: z.string().nullable(),
});

export const DefectErrorCodes = z.enum([
  'DEFECT_NOT_FOUND',
  'DEFECT_INVALID_STATUS_TRANSITION',
  'DEFECT_PERMISSION_DENIED',
  'DEFECT_RELATED_CASE_NOT_FOUND',
]);

export type CreateDefectInput = z.infer<typeof CreateDefectInputSchema>;
export type UpdateDefectInput = z.infer<typeof UpdateDefectInputSchema>;
export type DefectQuery = z.infer<typeof DefectQuerySchema>;
export type DefectOutput = z.infer<typeof DefectOutputSchema>;
export type DefectErrorCode = z.infer<typeof DefectErrorCodes>;

import { z } from 'zod';

// ============ 项目契约 ============

export const ProjectStatusSchema = z.enum(['active', 'archived']);

export const CreateProjectInputSchema = z.object({
  name: z.string().min(1, '项目名称必填').max(100),
  description: z.string().max(1000).optional().default(''),
  coverColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, '无效的颜色值').optional().default('#4F46E5'),
});

export const UpdateProjectInputSchema = CreateProjectInputSchema.partial().extend({
  status: ProjectStatusSchema.optional(),
});

export const ProjectOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  status: ProjectStatusSchema,
  memberCount: z.number(),
  coverColor: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ProjectErrorCodes = z.enum([
  'PROJECT_NOT_FOUND',
  'PROJECT_NAME_DUPLICATE',
  'PROJECT_HAS_ACTIVE_PLANS',
  'PROJECT_PERMISSION_DENIED',
]);

export type CreateProjectInput = z.infer<typeof CreateProjectInputSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectInputSchema>;
export type ProjectOutput = z.infer<typeof ProjectOutputSchema>;
export type ProjectErrorCode = z.infer<typeof ProjectErrorCodes>;

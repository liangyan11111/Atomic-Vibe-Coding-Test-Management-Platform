import { z } from 'zod';

// ============ StatusBadge 契约 ============

export const BadgeVariantSchema = z.enum(['default', 'success', 'warning', 'error', 'info', 'neutral']);
export type BadgeVariant = z.infer<typeof BadgeVariantSchema>;

export const StatusBadgePropsSchema = z.object({
  variant: BadgeVariantSchema,
  label: z.string().min(1).max(20),
  showIcon: z.boolean().default(true),
  size: z.enum(['sm', 'md']).default('sm'),
  pulse: z.boolean().default(false),
});
export type StatusBadgeProps = z.infer<typeof StatusBadgePropsSchema>;

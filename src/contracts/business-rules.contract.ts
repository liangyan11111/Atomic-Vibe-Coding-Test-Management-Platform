import { z } from 'zod';

// ============ 业务规则契约 (Layer 2) ============

// 缺陷状态流转规则
export const DefectStatusTransitionSchema = z.record(
  z.string(), // 当前状态
  z.array(z.string()) // 允许流转到的状态
);

export const DEFECT_STATUS_TRANSITIONS: z.infer<typeof DefectStatusTransitionSchema> = {
  open: ['confirmed', 'rejected'],
  confirmed: ['in_progress', 'rejected'],
  in_progress: ['resolved'],
  resolved: ['closed', 'in_progress'], // 可打回重开
  closed: [],
  rejected: ['open'], // 可重新打开
};

// 用例状态流转规则
export const TEST_CASE_STATUS_TRANSITIONS: Record<string, string[]> = {
  draft: ['active', 'deprecated'],
  active: ['deprecated'],
  deprecated: ['active'],
};

// 测试计划状态流转规则
export const TEST_PLAN_STATUS_TRANSITIONS: Record<string, string[]> = {
  planning: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: [],
  cancelled: ['planning'],
};

// 优先级权重规则
export const PRIORITY_WEIGHTS: Record<string, number> = {
  P0: 4,
  P1: 3,
  P2: 2,
  P3: 1,
};

// 严重程度权重规则
export const SEVERITY_WEIGHTS: Record<string, number> = {
  critical: 4,
  major: 3,
  minor: 2,
  trivial: 1,
};

// 通过率计算规则
export const PassRateRuleSchema = z.object({
  total: z.number().min(0),
  passed: z.number().min(0),
  failed: z.number().min(0),
  blocked: z.number().min(0),
  skipped: z.number().min(0),
});

/**
 * 验证状态流转是否合法
 */
export function validateStatusTransition(
  transitions: Record<string, string[]>,
  from: string,
  to: string
): boolean {
  const allowed = transitions[from];
  if (!allowed) return false;
  return allowed.includes(to);
}

/**
 * 计算通过率
 */
export function calculatePassRate(data: z.infer<typeof PassRateRuleSchema>): number {
  const executed = data.passed + data.failed + data.blocked;
  if (executed === 0) return 0;
  return Math.round((data.passed / executed) * 100);
}

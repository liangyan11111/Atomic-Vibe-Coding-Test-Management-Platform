import type { Defect } from '@/lib/types';

/**
 * 缺陷领域实体
 * 封装缺陷的核心业务逻辑与状态流转规则
 */
export class DefectEntity implements Defect {
  id!: string;
  projectId!: string;
  title!: string;
  description!: string;
  severity!: Defect['severity'];
  priority!: Defect['priority'];
  status!: Defect['status'];
  reportedBy!: string;
  assignedTo!: string;
  relatedTestCaseId!: string | null;
  relatedTestPlanId!: string | null;
  environment!: string;
  stepsToReproduce!: string;
  expectedBehavior!: string;
  actualBehavior!: string;
  tags!: string[];
  createdAt!: string;
  updatedAt!: string;
  resolvedAt!: string | null;

  constructor(data?: Partial<Defect>) {
    if (data) Object.assign(this, data);
  }

  /** 状态流转是否合法 */
  canTransitionTo(newStatus: Defect['status']): boolean {
    const transitions: Record<string, string[]> = {
      open: ['confirmed', 'rejected'],
      confirmed: ['in_progress', 'rejected'],
      in_progress: ['resolved'],
      resolved: ['closed', 'in_progress'],
      closed: [],
      rejected: [],
    };
    return transitions[this.status]?.includes(newStatus) ?? false;
  }

  /** 是否为阻塞性缺陷 */
  isBlocking(): boolean {
    return this.severity === 'critical' || this.severity === 'major';
  }

  /** 是否超期未处理 */
  isOverdue(): boolean {
    if (this.status === 'closed' || this.status === 'resolved') return false;
    const created = new Date(this.createdAt).getTime();
    const daysSinceCreated = (Date.now() - created) / (1000 * 60 * 60 * 24);
    return daysSinceCreated > 7;
  }

  toDTO(): Defect {
    return { ...this };
  }
}

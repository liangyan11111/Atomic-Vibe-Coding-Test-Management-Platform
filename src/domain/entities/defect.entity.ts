import type { Defect } from '@/lib/types';

/**
 * Defect 领域实体
 * 封装缺陷的业务逻辑和状态流转规则
 */
export class DefectEntity implements Defect {
  id!: string;
  projectId!: string;
  title!: string;
  description!: string;
  severity!: 'critical' | 'major' | 'minor' | 'trivial';
  priority!: 'urgent' | 'high' | 'medium' | 'low';
  status!: 'open' | 'confirmed' | 'in_progress' | 'resolved' | 'closed' | 'rejected';
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

  constructor(data: Defect) {
    Object.assign(this, data);
  }

  /**
   * 缺陷超期阈值（天）
   */
  private static readonly OVERDUE_THRESHOLD_DAYS = 7;

  /**
   * 状态流转规则
   */
  private static readonly VALID_TRANSITIONS: Record<Defect['status'], Defect['status'][]> = {
    open: ['confirmed', 'in_progress', 'resolved', 'closed'],
    confirmed: ['in_progress', 'resolved', 'closed', 'rejected'],
    in_progress: ['open', 'resolved', 'closed'],
    resolved: ['open', 'closed'],
    closed: [],
    rejected: ['open'],
  };

  /**
   * 判断状态流转是否合法
   */
  canTransitionTo(newStatus: Defect['status']): boolean {
    const allowed = DefectEntity.VALID_TRANSITIONS[this.status];
    return allowed?.includes(newStatus) ?? false;
  }

  /**
   * 是否为阻塞性缺陷
   */
  isBlocking(): boolean {
    return this.severity === 'critical' && this.status !== 'closed' && this.status !== 'rejected';
  }

  /**
   * 是否超期未解决
   */
  isOverdue(): boolean {
    if (this.status === 'closed' || this.status === 'resolved' || this.status === 'rejected') return false;
    const created = new Date(this.createdAt).getTime();
    const daysSinceCreated = (Date.now() - created) / (1000 * 60 * 60 * 24);
    return daysSinceCreated > DefectEntity.OVERDUE_THRESHOLD_DAYS;
  }

  /**
   * 转换为 DTO
   */
  toDTO(): Defect {
    return {
      id: this.id,
      projectId: this.projectId,
      title: this.title,
      description: this.description,
      severity: this.severity,
      priority: this.priority,
      status: this.status,
      reportedBy: this.reportedBy,
      assignedTo: this.assignedTo,
      relatedTestCaseId: this.relatedTestCaseId,
      relatedTestPlanId: this.relatedTestPlanId,
      environment: this.environment,
      stepsToReproduce: this.stepsToReproduce,
      expectedBehavior: this.expectedBehavior,
      actualBehavior: this.actualBehavior,
      tags: this.tags,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      resolvedAt: this.resolvedAt,
    };
  }
}

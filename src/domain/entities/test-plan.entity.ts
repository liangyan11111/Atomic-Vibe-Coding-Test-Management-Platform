import type { TestPlan } from '@/lib/types';

/**
 * 测试计划领域实体
 * 封装测试计划的核心业务逻辑
 */
export class TestPlanEntity implements TestPlan {
  id!: string;
  projectId!: string;
  name!: string;
  description!: string;
  status!: TestPlan['status'];
  startDate!: string;
  endDate!: string;
  createdBy!: string;
  assignedTo!: string[];
  testCaseIds!: string[];
  progress!: number;
  passCount!: number;
  failCount!: number;
  blockedCount!: number;
  pendingCount!: number;
  createdAt!: string;
  updatedAt!: string;

  constructor(data?: Partial<TestPlan>) {
    if (data) Object.assign(this, data);
  }

  /** 计算总用例数 */
  get totalCases(): number {
    return this.passCount + this.failCount + this.blockedCount + this.pendingCount;
  }

  /** 计算通过率 */
  get passRate(): number {
    const total = this.totalCases;
    return total > 0 ? Math.round((this.passCount / total) * 100) : 0;
  }

  /** 计划是否可启动 */
  canStart(): boolean {
    return this.status === 'planning' && this.testCaseIds.length > 0;
  }

  /** 计划是否可完成 */
  canComplete(): boolean {
    return this.status === 'in_progress' && this.pendingCount === 0;
  }

  toDTO(): TestPlan {
    return { ...this };
  }
}

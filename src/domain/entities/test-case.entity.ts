import type { TestCase, TestStep } from '@/lib/types';

/**
 * 测试用例领域实体
 * 封装测试用例的核心业务逻辑与不变量
 */
export class TestCaseEntity implements TestCase {
  id!: string;
  projectId!: string;
  title!: string;
  description!: string;
  module!: string;
  priority!: TestCase['priority'];
  type!: TestCase['type'];
  status!: TestCase['status'];
  precondition!: string;
  steps!: TestStep[];
  expectedResult!: string;
  tags!: string[];
  createdBy!: string;
  assignedTo!: string;
  createdAt!: string;
  updatedAt!: string;
  lastExecutedAt!: string | null;
  passRate!: number;
  executionCount!: number;

  constructor(data?: Partial<TestCase>) {
    if (data) Object.assign(this, data);
  }

  /** 用例是否可执行 */
  canExecute(): boolean {
    return this.status === 'active';
  }

  /** 获取优先级权重（用于排序） */
  getPriorityWeight(): number {
    const weights: Record<string, number> = { P0: 4, P1: 3, P2: 2, P3: 1 };
    return weights[this.priority] ?? 0;
  }

  /** 判断是否需要复审 */
  needsReview(): boolean {
    return this.passRate < 80 && this.executionCount >= 3;
  }

  /** 转换为 DTO */
  toDTO(): TestCase {
    return {
      id: this.id,
      projectId: this.projectId,
      title: this.title,
      description: this.description,
      module: this.module,
      priority: this.priority,
      type: this.type,
      status: this.status,
      precondition: this.precondition,
      steps: this.steps,
      expectedResult: this.expectedResult,
      tags: this.tags,
      createdBy: this.createdBy,
      assignedTo: this.assignedTo,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastExecutedAt: this.lastExecutedAt,
      passRate: this.passRate,
      executionCount: this.executionCount,
    };
  }
}

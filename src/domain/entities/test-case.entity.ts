import type { TestCase, TestStep } from '@/lib/types';

/**
 * TestCase 领域实体
 * 封装测试用例的业务逻辑和行为规则
 */
export class TestCaseEntity implements TestCase {
  id!: string;
  projectId!: string;
  title!: string;
  description!: string;
  module!: string;
  priority!: 'P0' | 'P1' | 'P2' | 'P3';
  type!: 'functional' | 'performance' | 'security' | 'compatibility' | 'usability';
  status!: 'draft' | 'active' | 'deprecated';
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

  constructor(data: TestCase) {
    Object.assign(this, data);
  }

  /**
   * 获取优先级权重（用于排序和统计）
   */
  getPriorityWeight(): number {
    const weights: Record<string, number> = { P0: 4, P1: 3, P2: 2, P3: 1 };
    return weights[this.priority] ?? 0;
  }

  /**
   * 判断是否需要评审（通过率低于 80% 且执行次数超过 3 次）
   */
  needsReview(): boolean {
    return this.executionCount >= 3 && this.passRate < 80;
  }

  /**
   * 判断是否为阻塞状态
   */
  isBlocking(): boolean {
    return this.priority === 'P0' && this.status === 'active';
  }

  /**
   * 转换为 DTO
   */
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

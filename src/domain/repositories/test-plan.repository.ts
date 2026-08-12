/**
 * Repository 接口 - 测试计划
 */

import type { TestPlan } from '@/lib/types';
import type { TestPlanQuery } from '@/contracts/testplan.contract';

export interface ITestPlanRepository {
  findById(id: string): Promise<TestPlan | null>;
  findByQuery(query: TestPlanQuery): Promise<{ items: TestPlan[]; total: number }>;
  create(data: Omit<TestPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<TestPlan>;
  update(id: string, data: Partial<TestPlan>): Promise<TestPlan>;
  delete(id: string): Promise<void>;
  findActiveByProject(projectId: string): Promise<TestPlan[]>;
}

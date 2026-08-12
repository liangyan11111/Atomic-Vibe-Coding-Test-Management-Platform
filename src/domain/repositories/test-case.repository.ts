/**
 * Repository 接口 - 测试用例
 * Repository: 定义数据访问的抽象接口，由基础设施层实现
 */

import type { TestCase } from '@/lib/types';
import type { TestCaseQuery } from '@/contracts/testcase.contract';

export interface ITestCaseRepository {
  findById(id: string): Promise<TestCase | null>;
  findByQuery(query: TestCaseQuery): Promise<{ items: TestCase[]; total: number }>;
  create(data: Omit<TestCase, 'id' | 'createdAt' | 'updatedAt'>): Promise<TestCase>;
  update(id: string, data: Partial<TestCase>): Promise<TestCase>;
  delete(id: string): Promise<void>;
  countByProject(projectId: string): Promise<number>;
  countByStatus(projectId: string): Promise<Record<string, number>>;
}

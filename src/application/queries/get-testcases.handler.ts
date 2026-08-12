/**
 * Query Handler - 获取测试用例列表
 * Query: 不改变系统状态的查询操作
 */

import { TestCaseQuerySchema, type TestCaseQuery } from '@/contracts/testcase.contract';
import { withTrace } from '@/guard';
import { testCases } from '@/lib/mock-data';
import type { TestCase } from '@/lib/types';

export async function handleGetTestCases(
  query: TestCaseQuery,
  traceId?: string
): Promise<{ items: TestCase[]; total: number }> {
  return withTrace('GetTestCasesQuery', async () => {
    const validatedQuery = TestCaseQuerySchema.parse(query);

    let filtered = [...testCases];

    // 筛选
    if (validatedQuery.projectId) {
      filtered = filtered.filter((tc) => tc.projectId === validatedQuery.projectId);
    }
    if (validatedQuery.module) {
      filtered = filtered.filter((tc) => tc.module === validatedQuery.module);
    }
    if (validatedQuery.priority) {
      filtered = filtered.filter((tc) => tc.priority === validatedQuery.priority);
    }
    if (validatedQuery.status) {
      filtered = filtered.filter((tc) => tc.status === validatedQuery.status);
    }
    if (validatedQuery.search) {
      const keyword = validatedQuery.search.toLowerCase();
      filtered = filtered.filter((tc) => tc.title.toLowerCase().includes(keyword));
    }

    // 排序
    const sortBy = validatedQuery.sortBy as keyof TestCase;
    filtered.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return validatedQuery.sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });

    // 分页
    const total = filtered.length;
    const start = (validatedQuery.page - 1) * validatedQuery.pageSize;
    const items = filtered.slice(start, start + validatedQuery.pageSize);

    return { items, total };
  }, traceId);
}

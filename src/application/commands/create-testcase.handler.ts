/**
 * Command Handler - 创建测试用例
 * Command: 改变系统状态的操作
 */

import { CreateTestCaseInputSchema, type CreateTestCaseInput } from '@/contracts/testcase.contract';
import { TestCaseEntity } from '@/domain/entities';
import { withTrace, createAuditLog } from '@/guard';
import type { TestCase } from '@/lib/types';

/**
 * 创建测试用例 Command Handler
 * 遵循契约：输入校验 → 业务规则 → 创建实体 → 审计日志
 */
export async function handleCreateTestCase(
  input: CreateTestCaseInput,
  userId: string,
  projectId: string,
  traceId?: string
): Promise<TestCase> {
  return withTrace('CreateTestCaseHandler', async () => {
    // Step 1: 契约校验
    const validatedInput = CreateTestCaseInputSchema.parse(input);

    // Step 2: 创建实体
    const now = new Date().toISOString();
    const testCase = new TestCaseEntity({
      id: `TC-${Date.now()}`,
      projectId,
      title: validatedInput.title,
      description: validatedInput.description || '',
      module: validatedInput.module,
      priority: validatedInput.priority,
      type: validatedInput.type,
      status: 'draft',
      precondition: validatedInput.precondition || '',
      steps: validatedInput.steps.map((s, i) => ({ order: i + 1, action: s.action, expected: s.expected })),
      expectedResult: validatedInput.expectedResult,
      tags: validatedInput.tags || [],
      createdBy: userId,
      assignedTo: validatedInput.assignedTo || userId,
      createdAt: now,
      updatedAt: now,
      lastExecutedAt: null,
      passRate: 0,
      executionCount: 0,
    });

    // Step 3: 审计日志
    createAuditLog({
      action: 'CREATE_TEST_CASE',
      entityType: 'TestCase',
      entityId: testCase.id,
      userId,
      details: { title: testCase.title, module: testCase.module, priority: testCase.priority },
      traceId,
    });

    return testCase.toDTO();
  }, traceId);
}

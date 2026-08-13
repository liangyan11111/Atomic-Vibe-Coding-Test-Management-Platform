import { CreateTestCaseInputSchema, type CreateTestCaseInput } from '@/contracts/testcase.contract';
import { TestCaseEntity } from '@/domain/entities/test-case.entity';
import { getTestCaseRepository } from '@/infrastructure/repositories';
import { withTrace } from '@/guard';
import type { TestStep } from '@/lib/types';

export type CreateTestCaseCommand = CreateTestCaseInput;

export async function handleCreateTestCase(
  input: CreateTestCaseCommand,
  traceId?: string
) {
  return withTrace('CreateTestCase', async (tid) => {
    const validated = CreateTestCaseInputSchema.parse(input);

    const steps: TestStep[] = validated.steps.map((s, i) => ({
      order: i + 1,
      action: s.action,
      expected: s.expected,
    }));

    const entity = new TestCaseEntity({
      id: `TC-${Date.now()}`,
      projectId: 'default',
      title: validated.title,
      description: validated.description,
      module: validated.module,
      priority: validated.priority,
      type: validated.type,
      status: 'draft',
      precondition: validated.precondition,
      steps,
      expectedResult: validated.expectedResult,
      tags: validated.tags ?? [],
      createdBy: 'current-user',
      assignedTo: validated.assignedTo ?? '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastExecutedAt: null,
      passRate: 0,
      executionCount: 0,
    });

    const repo = getTestCaseRepository();
    const created = await repo.create(entity.toDTO());
    return created;
  });
}

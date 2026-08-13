import { CreateDefectInputSchema, type CreateDefectInput } from '@/contracts/defect.contract';
import { DefectEntity } from '@/domain/entities/defect.entity';
import { getDefectRepository } from '@/infrastructure/repositories';
import { withTrace } from '@/guard';

export type CreateDefectCommand = CreateDefectInput;

export async function handleCreateDefect(
  input: CreateDefectCommand,
  traceId?: string
) {
  return withTrace('CreateDefect', async () => {
    const validated = CreateDefectInputSchema.parse(input);

    const entity = new DefectEntity({
      id: `DEF-${Date.now()}`,
      projectId: 'default',
      title: validated.title,
      description: validated.description,
      severity: validated.severity,
      priority: validated.priority,
      status: 'open',
      environment: validated.environment ?? '',
      stepsToReproduce: validated.stepsToReproduce ?? '',
      expectedBehavior: validated.expectedResult ?? '',
      actualBehavior: validated.actualResult ?? '',
      reportedBy: 'current-user',
      assignedTo: validated.assignedTo,
      relatedTestCaseId: validated.relatedTestCaseId ?? null,
      relatedTestPlanId: null,
      tags: validated.attachments ?? [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resolvedAt: null,
    });

    const repo = getDefectRepository();
    const created = await repo.create(entity.toDTO());
    return created;
  });
}

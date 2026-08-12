/**
 * Command Handler - 创建缺陷
 */

import { CreateDefectInputSchema, type CreateDefectInput } from '@/contracts/defect.contract';
import { DefectEntity } from '@/domain/entities';
import { withTrace, createAuditLog } from '@/guard';
import type { Defect } from '@/lib/types';

export async function handleCreateDefect(
  input: CreateDefectInput,
  userId: string,
  projectId: string,
  traceId?: string
): Promise<Defect> {
  return withTrace('CreateDefectHandler', async () => {
    const validatedInput = CreateDefectInputSchema.parse(input);

    const now = new Date().toISOString();
    const defect = new DefectEntity({
      id: `DEF-${Date.now()}`,
      projectId,
      title: validatedInput.title,
      description: validatedInput.description,
      severity: validatedInput.severity,
      priority: validatedInput.priority,
      status: 'open',
      reportedBy: userId,
      relatedTestCaseId: validatedInput.relatedTestCaseId || null,
      relatedTestPlanId: null,
      environment: validatedInput.environment || '',
      stepsToReproduce: validatedInput.stepsToReproduce || '',
      expectedBehavior: validatedInput.expectedResult || '',
      actualBehavior: validatedInput.actualResult || '',
      tags: [],
      assignedTo: validatedInput.assignedTo,
      createdAt: now,
      updatedAt: now,
      resolvedAt: null,
    });

    createAuditLog({
      action: 'CREATE_DEFECT',
      entityType: 'Defect',
      entityId: defect.id,
      userId,
      details: { title: defect.title, severity: defect.severity, assignedTo: defect.assignedTo },
      traceId,
    });

    return defect.toDTO();
  });
}

import { DefectEntity } from '@/domain/entities/defect.entity';
import type { Defect } from '@/lib/types';
import { withTrace, createAuditLog } from '@/guard';

export async function handleDefectStatusTransition(
  defect: Defect,
  newStatus: Defect['status'],
  userId: string,
  traceId?: string
) {
  return withTrace('handleDefectStatusTransition', async (tid) => {
    const entity = new DefectEntity(defect);

    if (!entity.canTransitionTo(newStatus)) {
      throw new Error(
        `Invalid status transition: ${entity.status} -> ${newStatus}`
      );
    }

    const now = new Date().toISOString();
    const updated = new DefectEntity({
      ...entity.toDTO(),
      status: newStatus,
      updatedAt: now,
      resolvedAt: (newStatus === 'resolved' || newStatus === 'closed') ? now : entity.resolvedAt,
    });

    createAuditLog({
      action: 'transition_defect_status',
      entityType: 'defect',
      entityId: entity.id,
      userId,
      details: { from: entity.status, to: newStatus },
      traceId: tid,
    });

    return updated.toDTO();
  }, traceId);
}

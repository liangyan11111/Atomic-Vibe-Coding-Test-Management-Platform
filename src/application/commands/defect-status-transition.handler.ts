/**
 * Command Handler - 缺陷状态流转
 */

import { DefectEntity } from '@/domain/entities';
import { withTrace, createAuditLog } from '@/guard';
import type { Defect } from '@/lib/types';

export async function handleDefectStatusTransition(
  defect: Defect,
  targetStatus: Defect['status'],
  userId: string,
  traceId?: string
): Promise<Defect> {
  return withTrace('DefectStatusTransitionHandler', async () => {
    const entity = new DefectEntity(defect);
    const fromStatus = entity.status;

    // 状态流转校验
    if (!entity.canTransitionTo(targetStatus)) {
      throw new Error(`Invalid status transition: ${fromStatus} → ${targetStatus}`);
    }

    entity.status = targetStatus;
    entity.updatedAt = new Date().toISOString();
    if (targetStatus === 'resolved') {
      entity.resolvedAt = entity.updatedAt;
    }

    createAuditLog({
      action: 'DEFECT_STATUS_CHANGE',
      entityType: 'Defect',
      entityId: entity.id,
      userId,
      details: { fromStatus, toStatus: targetStatus },
      traceId,
    });

    return entity.toDTO();
  });
}

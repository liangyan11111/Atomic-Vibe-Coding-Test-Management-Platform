/**
 * Repository 接口 - 缺陷
 */

import type { Defect } from '@/lib/types';
import type { DefectQuery } from '@/contracts/defect.contract';

export interface IDefectRepository {
  findById(id: string): Promise<Defect | null>;
  findByQuery(query: DefectQuery): Promise<{ items: Defect[]; total: number }>;
  create(data: Omit<Defect, 'id' | 'createdAt' | 'updatedAt'>): Promise<Defect>;
  update(id: string, data: Partial<Defect>): Promise<Defect>;
  delete(id: string): Promise<void>;
  countBySeverity(projectId: string): Promise<Record<string, number>>;
  countByStatus(projectId: string): Promise<Record<string, number>>;
}

import { describe, it, expect } from 'vitest';
import { DefectEntity } from '@/domain/entities/defect.entity';
import type { Defect } from '@/lib/types';

function makeDefect(overrides: Partial<Defect> = {}): Defect {
  return {
    id: 'DEF-001',
    projectId: 'P1',
    title: 'Test Defect',
    description: 'Test description',
    severity: 'major',
    priority: 'high',
    status: 'open',
    reportedBy: 'user1',
    assignedTo: 'dev1',
    relatedTestCaseId: 'TC-001',
    relatedTestPlanId: null,
    environment: 'Chrome 120',
    stepsToReproduce: 'Step 1',
    expectedBehavior: 'Should work',
    actualBehavior: 'Crashes',
    tags: ['regression'],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    resolvedAt: null,
    ...overrides,
  };
}

describe('DefectEntity', () => {
  it('should create entity from Defect', () => {
    const entity = new DefectEntity(makeDefect());
    expect(entity.id).toBe('DEF-001');
    expect(entity.status).toBe('open');
  });

  it('should transition open -> confirmed', () => {
    const entity = new DefectEntity(makeDefect({ status: 'open' }));
    expect(entity.canTransitionTo('confirmed')).toBe(true);
  });

  it('should transition open -> in_progress', () => {
    const entity = new DefectEntity(makeDefect({ status: 'open' }));
    expect(entity.canTransitionTo('in_progress')).toBe(true);
  });

  it('should transition open -> resolved', () => {
    const entity = new DefectEntity(makeDefect({ status: 'open' }));
    expect(entity.canTransitionTo('resolved')).toBe(true);
  });

  it('should transition open -> closed', () => {
    const entity = new DefectEntity(makeDefect({ status: 'open' }));
    expect(entity.canTransitionTo('closed')).toBe(true);
  });

  it('should NOT transition open -> rejected', () => {
    const entity = new DefectEntity(makeDefect({ status: 'open' }));
    expect(entity.canTransitionTo('rejected')).toBe(false);
  });

  it('should transition in_progress -> resolved', () => {
    const entity = new DefectEntity(makeDefect({ status: 'in_progress' }));
    expect(entity.canTransitionTo('resolved')).toBe(true);
  });

  it('should transition in_progress -> closed', () => {
    const entity = new DefectEntity(makeDefect({ status: 'in_progress' }));
    expect(entity.canTransitionTo('closed')).toBe(true);
  });

  it('should transition resolved -> open (reopen)', () => {
    const entity = new DefectEntity(makeDefect({ status: 'resolved' }));
    expect(entity.canTransitionTo('open')).toBe(true);
  });

  it('should transition resolved -> closed', () => {
    const entity = new DefectEntity(makeDefect({ status: 'resolved' }));
    expect(entity.canTransitionTo('closed')).toBe(true);
  });

  it('should NOT transition closed -> anything', () => {
    const entity = new DefectEntity(makeDefect({ status: 'closed' }));
    expect(entity.canTransitionTo('open')).toBe(false);
    expect(entity.canTransitionTo('in_progress')).toBe(false);
  });

  it('should identify overdue defects', () => {
    const oldDate = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString();
    const entity = new DefectEntity(makeDefect({
      status: 'open',
      createdAt: oldDate,
    }));
    expect(entity.isOverdue()).toBe(true);
  });

  it('should identify blocking defects', () => {
    const entity = new DefectEntity(makeDefect({ severity: 'critical', status: 'open' }));
    expect(entity.isBlocking()).toBe(true);
  });

  it('should convert to DTO', () => {
    const defect = makeDefect();
    const entity = new DefectEntity(defect);
    const dto = entity.toDTO();
    expect(dto.id).toBe('DEF-001');
    expect(dto.title).toBe('Test Defect');
  });
});

import type { TestCase, Defect, TestPlan } from '@/lib/types';
import { testCases, testPlans, defects } from '@/lib/mock-data';
import type { ITestCaseRepository } from '@/domain/repositories/test-case.repository';
import type { IDefectRepository } from '@/domain/repositories/defect.repository';
import type { ITestPlanRepository } from '@/domain/repositories/test-plan.repository';
import type { TestCaseQuery } from '@/contracts/testcase.contract';
import type { DefectQuery } from '@/contracts/defect.contract';
import type { TestPlanQuery } from '@/contracts/testplan.contract';

export class InMemoryTestCaseRepository implements ITestCaseRepository {
  private data: TestCase[] = [...testCases];

  async findById(id: string): Promise<TestCase | null> {
    return this.data.find(t => t.id === id) ?? null;
  }

  async findByQuery(query: TestCaseQuery): Promise<{ items: TestCase[]; total: number }> {
    let items = [...this.data];
    if (query.search) {
      const kw = query.search.toLowerCase();
      items = items.filter(t => t.title.toLowerCase().includes(kw) || t.description.toLowerCase().includes(kw));
    }
    if (query.module) items = items.filter(t => t.module === query.module);
    if (query.priority) items = items.filter(t => t.priority === query.priority);
    if (query.status) items = items.filter(t => t.status === query.status);
    if (query.type) items = items.filter(t => t.type === query.type);
    const total = items.length;
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    items = items.slice((page - 1) * pageSize, page * pageSize);
    return { items, total };
  }

  async create(d: Omit<TestCase, 'id' | 'createdAt' | 'updatedAt'>): Promise<TestCase> {
    const item: TestCase = {
      ...d,
      id: `TC-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as TestCase;
    this.data.push(item);
    return item;
  }

  async update(id: string, data: Partial<TestCase>): Promise<TestCase> {
    const idx = this.data.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('TestCase not found');
    this.data[idx] = { ...this.data[idx], ...data, updatedAt: new Date().toISOString() };
    return this.data[idx];
  }

  async delete(id: string): Promise<void> {
    this.data = this.data.filter(t => t.id !== id);
  }

  async count(): Promise<number> {
    return this.data.length;
  }

  async countByProject(projectId: string): Promise<number> {
    return this.data.filter(t => t.projectId === projectId).length;
  }

  async countByStatus(projectId: string): Promise<Record<string, number>> {
    const filtered = this.data.filter(t => t.projectId === projectId);
    const result: Record<string, number> = {};
    for (const t of filtered) {
      result[t.status] = (result[t.status] || 0) + 1;
    }
    return result;
  }
}

export class InMemoryDefectRepository implements IDefectRepository {
  private data: Defect[] = [...defects];

  async findById(id: string): Promise<Defect | null> {
    return this.data.find(d => d.id === id) ?? null;
  }

  async findByQuery(query: DefectQuery): Promise<{ items: Defect[]; total: number }> {
    let items = [...this.data];
    if (query.search) {
      const kw = query.search.toLowerCase();
      items = items.filter(d => d.title.toLowerCase().includes(kw) || d.description.toLowerCase().includes(kw));
    }
    if (query.status) items = items.filter(d => d.status === query.status);
    if (query.severity) items = items.filter(d => d.severity === query.severity);
    if (query.priority) items = items.filter(d => d.priority === query.priority);
    if (query.assignedTo) items = items.filter(d => d.assignedTo === query.assignedTo);
    const total = items.length;
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    items = items.slice((page - 1) * pageSize, page * pageSize);
    return { items, total };
  }

  async create(d: Omit<Defect, 'id' | 'createdAt' | 'updatedAt'>): Promise<Defect> {
    const item: Defect = {
      ...d,
      id: `DEF-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Defect;
    this.data.push(item);
    return item;
  }

  async update(id: string, data: Partial<Defect>): Promise<Defect> {
    const idx = this.data.findIndex(d => d.id === id);
    if (idx === -1) throw new Error('Defect not found');
    this.data[idx] = { ...this.data[idx], ...data, updatedAt: new Date().toISOString() };
    return this.data[idx];
  }

  async delete(id: string): Promise<void> {
    this.data = this.data.filter(d => d.id !== id);
  }

  async countBySeverity(projectId: string): Promise<Record<string, number>> {
    const filtered = this.data.filter(d => d.projectId === projectId);
    const result: Record<string, number> = {};
    for (const d of filtered) {
      result[d.severity] = (result[d.severity] || 0) + 1;
    }
    return result;
  }

  async count(): Promise<number> {
    return this.data.length;
  }

  async countByStatus(projectId: string): Promise<Record<string, number>> {
    const filtered = this.data.filter(d => d.projectId === projectId);
    const result: Record<string, number> = {};
    for (const d of filtered) {
      result[d.status] = (result[d.status] || 0) + 1;
    }
    return result;
  }
}

export class InMemoryTestPlanRepository implements ITestPlanRepository {
  private data: TestPlan[] = [...testPlans];

  async findById(id: string): Promise<TestPlan | null> {
    return this.data.find(p => p.id === id) ?? null;
  }

  async findByQuery(query: TestPlanQuery): Promise<{ items: TestPlan[]; total: number }> {
    let items = [...this.data];
    if (query.search) {
      const kw = query.search.toLowerCase();
      items = items.filter(p => p.name.toLowerCase().includes(kw) || p.description.toLowerCase().includes(kw));
    }
    if (query.status) items = items.filter(p => p.status === query.status);
    const total = items.length;
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    items = items.slice((page - 1) * pageSize, page * pageSize);
    return { items, total };
  }

  async create(d: Omit<TestPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<TestPlan> {
    const item: TestPlan = {
      ...d,
      id: `TP-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as TestPlan;
    this.data.push(item);
    return item;
  }

  async update(id: string, data: Partial<TestPlan>): Promise<TestPlan> {
    const idx = this.data.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('TestPlan not found');
    this.data[idx] = { ...this.data[idx], ...data, updatedAt: new Date().toISOString() };
    return this.data[idx];
  }

  async delete(id: string): Promise<void> {
    this.data = this.data.filter(p => p.id !== id);
  }

  async findActiveByProject(projectId: string): Promise<TestPlan[]> {
    return this.data.filter(p => p.projectId === projectId && p.status === 'in_progress');
  }

  async countByStatus(projectId: string): Promise<Record<string, number>> {
    const filtered = this.data.filter(p => p.projectId === projectId);
    const result: Record<string, number> = {};
    for (const p of filtered) {
      result[p.status] = (result[p.status] || 0) + 1;
    }
    return result;
  }

  async count(): Promise<number> {
    return this.data.length;
  }

  async countByProgress(projectId: string): Promise<Record<string, number>> {
    const filtered = this.data.filter(p => p.projectId === projectId);
    const result: Record<string, number> = { low: 0, medium: 0, high: 0 };
    for (const p of filtered) {
      if (p.progress < 33) result.low++;
      else if (p.progress < 66) result.medium++;
      else result.high++;
    }
    return result;
  }
}

let tcRepo: InMemoryTestCaseRepository | null = null;
let defRepo: InMemoryDefectRepository | null = null;
let tpRepo: InMemoryTestPlanRepository | null = null;

export function getTestCaseRepository(): InMemoryTestCaseRepository {
  if (!tcRepo) tcRepo = new InMemoryTestCaseRepository();
  return tcRepo;
}
export function getDefectRepository(): InMemoryDefectRepository {
  if (!defRepo) defRepo = new InMemoryDefectRepository();
  return defRepo;
}
export function getTestPlanRepository(): InMemoryTestPlanRepository {
  if (!tpRepo) tpRepo = new InMemoryTestPlanRepository();
  return tpRepo;
}

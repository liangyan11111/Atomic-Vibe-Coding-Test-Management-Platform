/**
 * 领域事件 - 测试用例
 * Event: 记录领域中发生的重要事情
 */

export interface DomainEvent {
  eventId: string;
  eventType: string;
  timestamp: string;
  aggregateId: string;
  aggregateType: string;
  payload: Record<string, unknown>;
  userId: string;
  traceId?: string;
}

// 测试用例事件
export interface TestCaseCreatedEvent extends DomainEvent {
  eventType: 'TestCaseCreated';
  payload: {
    title: string;
    module: string;
    priority: string;
    createdBy: string;
  };
}

export interface TestCaseStatusChangedEvent extends DomainEvent {
  eventType: 'TestCaseStatusChanged';
  payload: {
    fromStatus: string;
    toStatus: string;
    changedBy: string;
  };
}

// 缺陷事件
export interface DefectCreatedEvent extends DomainEvent {
  eventType: 'DefectCreated';
  payload: {
    title: string;
    severity: string;
    priority: string;
    createdBy: string;
    assignedTo: string;
  };
}

export interface DefectStatusChangedEvent extends DomainEvent {
  eventType: 'DefectStatusChanged';
  payload: {
    fromStatus: string;
    toStatus: string;
    changedBy: string;
  };
}

// 测试计划事件
export interface TestPlanCreatedEvent extends DomainEvent {
  eventType: 'TestPlanCreated';
  payload: {
    name: string;
    projectId: string;
    createdBy: string;
    caseCount: number;
  };
}

export interface TestPlanCompletedEvent extends DomainEvent {
  eventType: 'TestPlanCompleted';
  payload: {
    name: string;
    projectId: string;
    passRate: number;
    totalCases: number;
  };
}

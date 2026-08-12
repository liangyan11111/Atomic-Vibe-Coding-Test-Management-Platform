/**
 * 契约校验器
 * 负责校验数据是否符合组件/模块/系统级契约
 */
import { z } from 'zod';

export class ContractValidator {
  /**
   * 校验数据是否符合 Zod Schema
   */
  static validate<T>(schema: z.ZodType<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
    const result = schema.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return {
      success: false,
      errors: result.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`),
    };
  }

  /**
   * 严格校验，失败时抛出异常
   */
  static assertValid<T>(schema: z.ZodType<T>, data: unknown): T {
    return schema.parse(data);
  }
}

/**
 * Trace ID 生成与传递工具
 * 用于全链路追踪
 */

/**
 * 生成唯一的 Trace ID
 */
export function generateTraceId(): string {
  return `trace-${crypto.randomUUID()}`;
}

/**
 * 带 Trace 上下文执行函数
 * @param componentName 组件/处理器名称
 * @param fn 要执行的函数
 * @param parentTraceId 父级 Trace ID（可选）
 */
export async function withTrace<T>(
  componentName: string,
  fn: (traceId: string) => Promise<T>,
  parentTraceId?: string
): Promise<T> {
  const traceId = parentTraceId ?? generateTraceId();
  const startTime = performance.now();

  try {
    const result = await fn(traceId);
    const duration = performance.now() - startTime;

    // 记录成功日志
    console.debug(JSON.stringify({
      level: 'debug',
      traceId,
      component: componentName,
      action: 'execution',
      duration: Math.round(duration),
      success: true,
      timestamp: new Date().toISOString(),
    }));

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;

    // 记录错误日志
    console.error(JSON.stringify({
      level: 'error',
      traceId,
      component: componentName,
      action: 'execution',
      duration: Math.round(duration),
      success: false,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    }));

    throw error;
  }
}

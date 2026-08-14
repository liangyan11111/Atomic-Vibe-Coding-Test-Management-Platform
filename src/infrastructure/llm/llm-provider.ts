/**
 * LLM Provider 抽象层
 * 支持多模型提供商，通过环境变量配置
 */
import { LLMClient } from 'coze-coding-dev-sdk';

/** 支持的模型提供商 */
export type LLMProvider = 'coze' | 'openai' | 'custom';

/** LLM 配置 */
export interface LLMConfig {
  provider: LLMProvider;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

/** 聊天消息 */
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/** 流式响应块 */
export interface StreamChunk {
  content: string;
}

/** 默认配置 */
const DEFAULT_CONFIG: LLMConfig = {
  provider: 'coze',
  model: process.env.LLM_MODEL || 'doubao-seed-2-0-mini-260215',
  temperature: 0.7,
};

/**
 * 获取当前 LLM 配置
 * 从环境变量读取，提供默认值
 */
export function getLLMConfig(): LLMConfig {
  return {
    provider: (process.env.LLM_PROVIDER as LLMProvider) || DEFAULT_CONFIG.provider,
    model: process.env.LLM_MODEL || DEFAULT_CONFIG.model!,
    temperature: process.env.LLM_TEMPERATURE
      ? parseFloat(process.env.LLM_TEMPERATURE)
      : DEFAULT_CONFIG.temperature,
    maxTokens: process.env.LLM_MAX_TOKENS
      ? parseInt(process.env.LLM_MAX_TOKENS, 10)
      : undefined,
  };
}

/**
 * 获取可用的模型列表
 */
export function getAvailableModels(): Array<{ id: string; name: string; provider: string }> {
  return [
    { id: 'doubao-seed-2-0-mini-260215', name: 'Doubao Seed 2.0 Mini', provider: 'coze' },
    { id: 'doubao-seed-2-0-260215', name: 'Doubao Seed 2.0', provider: 'coze' },
    { id: 'deepseek-v3-250324', name: 'DeepSeek V3', provider: 'coze' },
    { id: 'deepseek-r1-250120', name: 'DeepSeek R1', provider: 'coze' },
  ];
}

/**
 * 创建 LLM 客户端
 * 根据配置创建对应的客户端实例
 */
export function createLLMClient(_config?: Partial<LLMConfig>): LLMClient {
  // coze-coding-dev-sdk 的 LLMClient 自动读取环境变量
  return new LLMClient();
}

/**
 * 流式聊天
 * 统一的流式聊天接口，返回 AsyncIterable
 */
export async function* streamChat(
  messages: ChatMessage[],
  options?: { model?: string; temperature?: number }
): AsyncGenerator<StreamChunk> {
  const config = getLLMConfig();
  const client = createLLMClient();

  const model = options?.model || config.model;
  const stream = client.stream(messages, { model });

  for await (const chunk of stream) {
    if (chunk.content && typeof chunk.content === 'string' && chunk.content.length > 0) {
      yield { content: chunk.content };
    }
  }
}

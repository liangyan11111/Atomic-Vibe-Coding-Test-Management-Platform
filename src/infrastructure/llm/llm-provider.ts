/**
 * LLM Provider 抽象层
 * 支持多模型提供商，通过环境变量配置
 * 工厂模式：根据 provider 创建对应的客户端
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
  /** OpenAI/Custom provider 的 API Key */
  apiKey?: string;
  /** OpenAI/Custom provider 的 API Base URL */
  baseUrl?: string;
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
    apiKey: process.env.LLM_API_KEY,
    baseUrl: process.env.LLM_BASE_URL,
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
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai' },
    { id: 'custom', name: '自定义模型', provider: 'custom' },
  ];
}

/**
 * LLM Provider 接口
 * 所有 Provider 必须实现此接口
 */
interface LLMProviderAdapter {
  stream(messages: ChatMessage[], options?: { model?: string }): AsyncIterable<{ content: string }>;
}

/**
 * Coze Provider - 使用 coze-coding-dev-sdk
 */
class CozeProvider implements LLMProviderAdapter {
  private client: LLMClient;

  constructor() {
    this.client = new LLMClient();
  }

  async *stream(messages: ChatMessage[], options?: { model?: string }): AsyncIterable<{ content: string }> {
    const stream = this.client.stream(messages, { model: options?.model });
    for await (const chunk of stream) {
      if (chunk.content && typeof chunk.content === 'string' && chunk.content.length > 0) {
        yield { content: chunk.content };
      }
    }
  }
}

/**
 * OpenAI-compatible Provider
 * 支持 OpenAI API 及兼容接口（如 DeepSeek、Moonshot 等）
 */
class OpenAIProvider implements LLMProviderAdapter {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = 'https://api.openai.com/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async *stream(messages: ChatMessage[], options?: { model?: string }): AsyncIterable<{ content: string }> {
    const model = options?.model || 'gpt-4o-mini';

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error ${response.status}: ${errorText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No reader in response');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6);
        if (data === '[DONE]') return;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) yield { content };
        } catch {
          // skip malformed JSON
        }
      }
    }
  }
}

/**
 * Custom Provider
 * 支持自定义 endpoint，兼容 OpenAI 格式
 */
class CustomProvider extends OpenAIProvider {
  constructor(apiKey: string, baseUrl: string) {
    if (!baseUrl) throw new Error('Custom provider requires LLM_BASE_URL');
    super(apiKey, baseUrl);
  }
}

/**
 * 创建 LLM 客户端
 * 工厂方法：根据 provider 创建对应的适配器
 */
export function createLLMClient(config?: Partial<LLMConfig>): LLMProviderAdapter {
  const resolvedConfig = { ...getLLMConfig(), ...config };

  switch (resolvedConfig.provider) {
    case 'openai':
      return new OpenAIProvider(
        resolvedConfig.apiKey || '',
        resolvedConfig.baseUrl || 'https://api.openai.com/v1'
      );
    case 'custom':
      return new CustomProvider(
        resolvedConfig.apiKey || '',
        resolvedConfig.baseUrl || ''
      );
    case 'coze':
    default:
      return new CozeProvider();
  }
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

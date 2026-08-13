/**
 * Vibe Chat API Route
 * 流式 LLM 响应，用于 Vibe Coding 工作台
 */
import { LLMClient } from 'coze-coding-dev-sdk';

export const runtime = 'nodejs';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface VibeChatRequest {
  messages: ChatMessage[];
  context?: {
    module?: string;
    component?: string;
    action?: string;
  };
}

const SYSTEM_PROMPT = `你是 TestHub 测试管理平台的 AI 助手，专注于帮助用户进行测试管理相关的工作。

你的能力包括：
1. 分析和优化测试用例
2. 生成测试计划和策略
3. 分析缺陷模式和趋势
4. 提供测试覆盖率建议
5. 帮助理解和使用 Vibe Coding 组件体系

回答要求：
- 简洁专业，使用 Markdown 格式
- 给出具体的、可操作的建议
- 引用相关的组件契约和业务规则
- 如果涉及代码变更，提供代码示例`;

export async function POST(request: Request) {
  try {
    const body: VibeChatRequest = await request.json();
    const { messages, context } = body;

    if (!messages || messages.length === 0) {
      return Response.json({ error: '消息列表不能为空' }, { status: 400 });
    }

    const client = new LLMClient();

    // 构建上下文增强的系统提示
    let enhancedSystemPrompt = SYSTEM_PROMPT;
    if (context?.module) {
      enhancedSystemPrompt += `\n\n当前模块：${context.module}`;
    }
    if (context?.component) {
      enhancedSystemPrompt += `\n相关组件：${context.component}`;
    }
    if (context?.action) {
      enhancedSystemPrompt += `\n操作类型：${context.action}`;
    }

    const allMessages = [
      { role: 'system' as const, content: enhancedSystemPrompt },
      ...messages,
    ];

    const stream = client.stream(allMessages, {
      model: 'doubao-seed-2-0-mini-260215',
    });

    // 将 LLM 流转换为 SSE 流
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.content;
            if (content && typeof content === 'string' && content.length > 0) {
              const sseData = `data: ${JSON.stringify({ content })}\n\n`;
              controller.enqueue(encoder.encode(sseData));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : 'Stream error';
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errMsg })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: `服务器内部错误: ${errMsg}` }, { status: 500 });
  }
}

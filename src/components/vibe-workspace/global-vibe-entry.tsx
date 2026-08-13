'use client';

import { useState, useRef, useCallback } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * 全局 Vibe 入口 - 底部悬浮按钮
 * 接入真实 LLM API，支持流式响应
 */

interface VibeMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function GlobalVibeEntry() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<VibeMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: VibeMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // 创建 assistant 消息占位
    const assistantMsgId = `msg-${Date.now()}-ai`;
    const assistantMsg: VibeMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true,
    };
    setMessages((prev) => [...prev, assistantMsg]);

    try {
      // 构建历史消息
      const chatHistory: ChatMessage[] = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      abortRef.current = new AbortController();

      const response = await fetch('/api/vibe-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n').filter((line) => line.startsWith('data: '));

        for (const line of lines) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              accumulated += `\n\n[错误: ${parsed.error}]`;
            } else if (parsed.content) {
              accumulated += parsed.content;
            }
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsgId ? { ...m, content: accumulated } : m
              )
            );
            scrollToBottom();
          } catch {
            // skip malformed JSON
          }
        }
      }

      // 流结束，标记完成
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId ? { ...m, isStreaming: false } : m
        )
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        // 用户取消
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId ? { ...m, isStreaming: false } : m
          )
        );
      } else {
        const errMsg = error instanceof Error ? error.message : '未知错误';
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, content: `请求失败: ${errMsg}。请检查网络连接后重试。`, isStreaming: false }
              : m
          )
        );
      }
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  const handleClose = () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* 悬浮按钮 */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/40"
        >
          <Sparkles className="h-6 w-6" />
        </button>
      )}

      {/* 对话面板 */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[560px] w-[420px] flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Vibe Coding 助手</h3>
                <p className="text-xs text-slate-500">AI 驱动的智能测试管理</p>
              </div>
            </div>
            <button onClick={handleClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
                  <MessageSquare className="h-8 w-8 text-indigo-500" />
                </div>
                <h4 className="mb-2 text-sm font-semibold text-slate-900">你好，我是 Vibe 助手</h4>
                <p className="mb-6 max-w-[260px] text-xs leading-relaxed text-slate-500">
                  我可以帮你优化测试用例、分析缺陷趋势、生成测试计划，或解答任何测试管理问题。
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['分析当前缺陷趋势', '优化测试用例设计', '生成回归测试计划'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setInput(s)}
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                    <div
                      className={cn(
                        'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      )}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      {msg.isStreaming && (
                        <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-indigo-500" />
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="描述你的需求..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:bg-white"
                disabled={isLoading}
              />
              <Button
                size="sm"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="h-10 w-10 rounded-xl p-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

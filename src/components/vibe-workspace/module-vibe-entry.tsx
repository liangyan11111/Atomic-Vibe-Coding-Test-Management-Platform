'use client';

import { useState, useRef } from 'react';
import { X, Send, Sparkles, Wrench, Plus, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * 模块级 Vibe 入口 - 每个模块右上角
 * 接入真实 LLM API，支持流式响应
 */

interface ModuleVibeEntryProps {
  moduleName: string;
  modulePath: string;
  className?: string;
}

interface ModuleMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

const MODULE_ACTIONS = [
  { icon: Plus, label: '新增子功能', key: 'add' },
  { icon: Wrench, label: '优化现有功能', key: 'optimize' },
  { icon: RefreshCw, label: '模块重构', key: 'refactor' },
];

export function ModuleVibeEntry({ moduleName, className }: ModuleVibeEntryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ModuleMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ModuleMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const assistantMsgId = `msg-${Date.now()}-ai`;
    setMessages((prev) => [...prev, {
      id: assistantMsgId,
      role: 'assistant' as const,
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true,
    }]);

    try {
      const chatHistory = [...messages, userMsg].map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

      abortRef.current = new AbortController();

      const response = await fetch('/api/vibe-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistory,
          context: { module: moduleName },
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n').filter((l) => l.startsWith('data: '));

        for (const line of lines) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) accumulated += parsed.content;
            setMessages((prev) =>
              prev.map((m) => m.id === assistantMsgId ? { ...m, content: accumulated } : m)
            );
          } catch { /* skip */ }
        }
      }

      setMessages((prev) =>
        prev.map((m) => m.id === assistantMsgId ? { ...m, isStreaming: false } : m)
      );
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        const errMsg = error instanceof Error ? error.message : '未知错误';
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, content: `请求失败: ${errMsg}`, isStreaming: false }
              : m
          )
        );
      }
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  const handleAction = (key: string) => {
    const labels: Record<string, string> = {
      add: `我想在${moduleName}模块中新增一个功能：`,
      optimize: `帮我优化${moduleName}模块中的：`,
      refactor: `帮我重构${moduleName}模块的：`,
    };
    setInput(labels[key] || '');
  };

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-1.5 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
      >
        <Sparkles className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">Vibe</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[380px] rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <span className="text-sm font-semibold text-slate-900">{moduleName} - Vibe</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="rounded p-1 text-slate-400 hover:bg-slate-100">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-1.5 border-b border-slate-100 px-4 py-2.5">
            {MODULE_ACTIONS.map(({ icon: Icon, label, key }) => (
              <button
                key={key}
                onClick={() => handleAction(key)}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
              >
                <Icon className="h-3 w-3" />
                {label}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="h-[280px] overflow-y-auto px-4 py-3">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center">
                <p className="text-xs text-slate-400">描述你想在{moduleName}中实现的功能</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                    <div className={cn(
                      'max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed',
                      msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                    )}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      {msg.isStreaming && <span className="ml-1 inline-block h-3 w-1 animate-pulse bg-indigo-500" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="描述需求..."
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:border-indigo-400 focus:bg-white"
                disabled={isLoading}
              />
              <Button size="sm" onClick={handleSend} disabled={!input.trim() || isLoading} className="h-7 w-7 rounded-lg p-0">
                {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

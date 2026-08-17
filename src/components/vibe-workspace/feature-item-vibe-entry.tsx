'use client';

import { useState, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, Copy, Trash2, History, Edit3, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

/**
 * 功能项级 Vibe 入口 - 每个功能项的操作菜单
 * 接入真实 LLM API，支持流式响应
 */

interface FeatureItemVibeEntryProps {
  itemId: string;
  itemType: string;
  itemTitle: string;
  onAction?: (action: string) => void;
  className?: string;
}

interface FeatureMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export function FeatureItemVibeEntry({
  itemId,
  itemType,
  itemTitle,
  onAction,
  className,
}: FeatureItemVibeEntryProps) {
  const [showVibeChat, setShowVibeChat] = useState(false);
  const [vibeInput, setVibeInput] = useState('');
  const [messages, setMessages] = useState<FeatureMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleVibeAction = (action: string) => {
    const actionLabels: Record<string, string> = {
      optimize: `优化这个${itemType}：${itemTitle}`,
      fix: `这个${itemType}有个问题：${itemTitle}`,
      history: `查看这个${itemType}的变更历史：${itemTitle}`,
      copy: `复制这个${itemType}并修改：${itemTitle}`,
    };
    setVibeInput(actionLabels[action] || '');
    setShowVibeChat(true);
    onAction?.(action);
  };

  const handleSend = async () => {
    if (!vibeInput.trim() || isLoading) return;

    const userMsg: FeatureMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: vibeInput.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const userInput = vibeInput.trim();
    setVibeInput('');
    setIsLoading(true);

    const assistantMsgId = `msg-${Date.now()}-ai`;
    setMessages((prev) => [...prev, {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
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
          context: {
            featureItem: {
              id: itemId,
              type: itemType,
              title: itemTitle,
            },
          },
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
            if (parsed.error) {
              accumulated += `\n\n[错误: ${parsed.error}]`;
            } else if (parsed.content) {
              accumulated += parsed.content;
            }
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

  return (
    <div className={cn('relative', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-slate-600">
            <MessageSquare className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => handleVibeAction('optimize')}>
            <Edit3 className="mr-2 h-3.5 w-3.5" />
            优化这个{itemType}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleVibeAction('fix')}>
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            修复问题
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleVibeAction('history')}>
            <History className="mr-2 h-3.5 w-3.5" />
            查看历史
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleVibeAction('copy')}>
            <Copy className="mr-2 h-3.5 w-3.5" />
            复制
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onAction?.('delete')}
            className="text-rose-600 focus:bg-rose-50 focus:text-rose-700"
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            删除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 迷你 Vibe 对话 */}
      {showVibeChat && (
        <div className="absolute right-0 top-full z-40 mt-1 w-[320px] rounded-lg border border-slate-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
            <span className="text-xs font-medium text-slate-700">
              Vibe · {itemTitle}
            </span>
            <button onClick={() => { setShowVibeChat(false); setMessages([]); }} className="text-slate-400 hover:text-slate-600">
              <X className="h-3 w-3" />
            </button>
          </div>

          {/* Messages */}
          <div className="max-h-[200px] overflow-y-auto px-3 py-2">
            {messages.length === 0 ? (
              <p className="py-3 text-center text-[11px] text-slate-400">
                描述你想对这个{itemType}做的修改
              </p>
            ) : (
              <div className="space-y-2">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                    <div className={cn(
                      'max-w-[85%] rounded-lg px-2.5 py-1.5 text-[11px] leading-relaxed',
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
          <div className="border-t border-slate-100 px-3 py-2">
            <div className="flex items-center gap-1.5">
              <input
                value={vibeInput}
                onChange={(e) => setVibeInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="描述你的需求..."
                className="flex-1 rounded border border-slate-200 px-2 py-1 text-[11px] outline-none focus:border-indigo-400"
                disabled={isLoading}
                autoFocus
              />
              <Button
                size="sm"
                onClick={handleSend}
                disabled={!vibeInput.trim() || isLoading}
                className="h-6 w-6 rounded p-0 bg-indigo-600 hover:bg-indigo-700"
              >
                {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

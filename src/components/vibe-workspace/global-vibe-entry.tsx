'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageSquare, X, Send, Sparkles, Loader2, Plus, History,
  Trash2, ChevronLeft, Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * 全局 Vibe 入口 - 底部悬浮按钮
 * 支持会话管理 + 流式 LLM 响应
 */

interface VibeMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

interface VibeSession {
  id: string;
  title: string;
  status: string;
  model_used: string | null;
  created_at: string;
  updated_at: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function GlobalVibeEntry() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [sessions, setSessions] = useState<VibeSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<VibeMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // 加载会话列表
  const loadSessions = useCallback(async () => {
    try {
      const res = await fetch('/api/vibe/sessions');
      if (!res.ok) return;
      const json = await res.json();
      if (json.success) setSessions(json.data);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    if (isOpen) loadSessions();
  }, [isOpen, loadSessions]);

  // 加载会话消息
  const loadSessionMessages = useCallback(async (sessionId: string) => {
    try {
      const res = await fetch(`/api/vibe/sessions/${sessionId}`);
      if (!res.ok) return;
      const json = await res.json();
      if (json.success) {
        setCurrentSessionId(sessionId);
        setMessages(
          json.data.messages.map((m: { id: string; role: string; content: string; created_at: string }) => ({
            id: m.id,
            role: m.role as 'user' | 'assistant',
            content: m.content,
            timestamp: m.created_at,
          }))
        );
        setShowHistory(false);
      }
    } catch {
      // silent
    }
  }, []);

  // 创建新会话
  const createNewSession = useCallback(async () => {
    try {
      const res = await fetch('/api/vibe/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: '新对话' }),
      });
      if (!res.ok) return;
      const json = await res.json();
      if (json.success) {
        setCurrentSessionId(json.data.id);
        setMessages([]);
        setShowHistory(false);
        loadSessions();
      }
    } catch {
      // silent
    }
  }, [loadSessions]);

  // 删除会话
  const deleteSession = useCallback(async (sessionId: string) => {
    try {
      const res = await fetch(`/api/vibe/sessions/${sessionId}`, { method: 'DELETE' });
      if (!res.ok) return;
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
        setMessages([]);
      }
      loadSessions();
    } catch {
      // silent
    }
  }, [currentSessionId, loadSessions]);

  // 保存消息到后端
  const saveMessages = useCallback(async (sessionId: string, msgs: Array<{ role: string; content: string }>) => {
    try {
      await fetch(`/api/vibe/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: msgs }),
      });
    } catch {
      // silent
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    let sessionId = currentSessionId;

    // 如果没有当前会话，自动创建
    if (!sessionId) {
      try {
        const res = await fetch('/api/vibe/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: input.trim().slice(0, 30) || '新对话' }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            sessionId = json.data.id;
            setCurrentSessionId(sessionId);
            loadSessions();
          }
        }
      } catch {
        // silent
      }
    }

    const userMsg: VibeMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const userInput = input.trim();
    setInput('');
    setIsLoading(true);

    // 保存用户消息
    if (sessionId) {
      saveMessages(sessionId, [{ role: 'user', content: userInput }]);
    }

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

      // 流结束，标记完成并保存
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId ? { ...m, isStreaming: false } : m
        )
      );

      if (sessionId && accumulated) {
        saveMessages(sessionId, [{ role: 'assistant', content: accumulated }]);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
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

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}小时前`;
    return d.toLocaleDateString('zh-CN');
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
              {showHistory ? (
                <button
                  onClick={() => setShowHistory(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              ) : null}
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500">
                {showHistory ? <History className="h-4 w-4 text-white" /> : <Sparkles className="h-4 w-4 text-white" />}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {showHistory ? '历史会话' : 'Vibe Coding 助手'}
                </h3>
                <p className="text-xs text-slate-500">
                  {showHistory ? `${sessions.length} 个会话` : 'AI 驱动的智能测试管理'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {!showHistory && (
                <>
                  <button
                    onClick={() => setShowHistory(true)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    title="历史会话"
                  >
                    <History className="h-4 w-4" />
                  </button>
                  <button
                    onClick={createNewSession}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    title="新建对话"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </>
              )}
              <button onClick={handleClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 历史会话列表 */}
          {showHistory ? (
            <div className="flex-1 overflow-y-auto px-3 py-3">
              {sessions.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <History className="mb-3 h-10 w-10 text-slate-300" />
                  <p className="text-sm text-slate-500">暂无历史会话</p>
                  <p className="text-xs text-slate-400">开始新对话后将自动保存</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className={cn(
                        'group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors cursor-pointer',
                        session.id === currentSessionId
                          ? 'bg-indigo-50 border border-indigo-200'
                          : 'hover:bg-slate-50'
                      )}
                    >
                      <button
                        onClick={() => loadSessionMessages(session.id)}
                        className="flex flex-1 items-center gap-3 text-left"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                          <MessageSquare className="h-4 w-4 text-slate-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium text-slate-700">{session.title}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Clock className="h-3 w-3 text-slate-400" />
                            <span className="text-[11px] text-slate-400">{formatTime(session.updated_at)}</span>
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                        className="rounded-lg p-1.5 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-500"
                        title="删除会话"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      )}
    </>
  );
}

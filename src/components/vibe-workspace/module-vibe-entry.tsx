'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Sparkles, Wrench, Plus, RefreshCw, Loader2, History, GitBranch, Save, ChevronLeft, Clock, Trash2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VibeVersionPanel } from './vibe-version-panel';

/**
 * 模块级 Vibe 入口 - 每个模块右上角
 * 完整会话管理 + 版本管理 + 模块上下文传递
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

interface VibeSession {
  id: string;
  title: string;
  status: string;
  module_path: string | null;
  created_at: string;
  updated_at: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const MODULE_ACTIONS = [
  { icon: Plus, label: '新增子功能', key: 'add' },
  { icon: Wrench, label: '优化现有功能', key: 'optimize' },
  { icon: RefreshCw, label: '模块重构', key: 'refactor' },
];

export function ModuleVibeEntry({ moduleName, modulePath, className }: ModuleVibeEntryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [sessions, setSessions] = useState<VibeSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ModuleMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingVersion, setIsSavingVersion] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // 加载该模块的会话列表
  const loadSessions = useCallback(async () => {
    try {
      const res = await fetch('/api/vibe/sessions');
      if (!res.ok) return;
      const json = await res.json();
      if (json.success) {
        // 过滤当前模块的会话
        const moduleSessions = json.data.filter(
          (s: VibeSession) => s.module_path === modulePath
        );
        setSessions(moduleSessions);
      }
    } catch {
      // silent
    }
  }, [modulePath]);

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

  // 创建新会话（带 modulePath）
  const createNewSession = useCallback(async () => {
    try {
      const res = await fetch('/api/vibe/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: `${moduleName} - 新对话`, modulePath }),
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
  }, [moduleName, modulePath, loadSessions]);

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

  // 保存消息
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

  // 保存版本
  const saveVersion = useCallback(async () => {
    if (!currentSessionId || isSavingVersion) return;
    setIsSavingVersion(true);
    try {
      const res = await fetch(`/api/vibe/versions?sessionId=${currentSessionId}`);
      const json = await res.json();
      const versionCount = json.success ? json.data.length : 0;
      const nextVersion = `${versionCount + 1}.0.0`;

      const fileChanges: Array<{ filePath: string; action: string; afterContent: string }> = [];
      for (const msg of messages) {
        if (msg.role === 'assistant') {
          const codeBlockRegex = /```(\w+)?\s*\n([\s\S]*?)```/g;
          let match;
          while ((match = codeBlockRegex.exec(msg.content)) !== null) {
            fileChanges.push({
              filePath: `${modulePath}/${match[1] || 'code'}/block-${fileChanges.length + 1}`,
              action: 'create',
              afterContent: match[2].trim(),
            });
          }
        }
      }

      await fetch('/api/vibe/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: currentSessionId,
          version: nextVersion,
          description: `${moduleName} 版本 ${nextVersion}`,
          fileChanges,
        }),
      });
    } catch {
      // silent
    } finally {
      setIsSavingVersion(false);
    }
  }, [currentSessionId, messages, isSavingVersion, modulePath, moduleName]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    let sessionId = currentSessionId;

    // 如果没有当前会话，自动创建（带 modulePath）
    if (!sessionId) {
      try {
        const res = await fetch('/api/vibe/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: `${moduleName} - 对话`, modulePath }),
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

    const userMsg: ModuleMessage = {
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

    const assistantMsgId = `msg-${Date.now()}-ai`;
    setMessages((prev) => [...prev, {
      id: assistantMsgId,
      role: 'assistant' as const,
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true,
    }]);

    try {
      const chatHistory: ChatMessage[] = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      abortRef.current = new AbortController();

      const response = await fetch('/api/vibe-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistory,
          context: {
            module: moduleName,
            modulePath,
            moduleContext: {
              name: moduleName,
              path: modulePath,
              description: `${moduleName}模块`,
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

      // 保存 assistant 消息
      if (sessionId && accumulated) {
        saveMessages(sessionId, [{ role: 'assistant', content: accumulated }]);
      }
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

  const handleClose = () => {
    if (abortRef.current) abortRef.current.abort();
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
        <div className="absolute right-0 top-full z-50 mt-2 w-[400px] rounded-xl border border-slate-200 bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              {(showHistory || showVersions) && (
                <button
                  onClick={() => { setShowHistory(false); setShowVersions(false); }}
                  className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
              )}
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <span className="text-sm font-semibold text-slate-900">
                {showHistory ? '历史会话' : showVersions ? '版本历史' : `${moduleName} - Vibe`}
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              {!showHistory && !showVersions && (
                <>
                  <button
                    onClick={() => setShowHistory(true)}
                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    title="历史会话"
                  >
                    <History className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setShowVersions(true)}
                    disabled={!currentSessionId}
                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="版本历史"
                  >
                    <GitBranch className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={saveVersion}
                    disabled={!currentSessionId || messages.length === 0 || isSavingVersion}
                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="保存版本"
                  >
                    {isSavingVersion ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={createNewSession}
                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    title="新建对话"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
              <button onClick={handleClose} className="rounded p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* 历史会话列表 */}
          {showHistory ? (
            <div className="max-h-[360px] overflow-y-auto px-3 py-2">
              {sessions.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center text-center">
                  <History className="mb-2 h-8 w-8 text-slate-300" />
                  <p className="text-xs text-slate-500">暂无该模块的历史会话</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className={cn(
                        'group flex items-center gap-2 rounded-lg px-2 py-2 transition-colors cursor-pointer',
                        session.id === currentSessionId ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-slate-50'
                      )}
                    >
                      <button
                        onClick={() => loadSessionMessages(session.id)}
                        className="flex flex-1 items-center gap-2 text-left"
                      >
                        <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-xs font-medium text-slate-700">{session.title}</p>
                          <span className="text-[10px] text-slate-400">{formatTime(session.updated_at)}</span>
                        </div>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                        className="rounded p-1 text-slate-300 opacity-0 group-hover:opacity-100 hover:text-rose-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : showVersions && currentSessionId ? (
            <div className="max-h-[360px] overflow-y-auto">
              <VibeVersionPanel sessionId={currentSessionId} />
            </div>
          ) : (
            <>
              {/* Quick Actions */}
              <div className="flex gap-1.5 border-b border-slate-100 px-4 py-2">
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
            </>
          )}
        </div>
      )}
    </div>
  );
}

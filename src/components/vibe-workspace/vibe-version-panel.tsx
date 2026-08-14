'use client';

import { useState, useEffect, useCallback } from 'react';
import { GitBranch, ChevronRight, FileCode, Plus, Minus, Eye, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Vibe 版本管理面板
 * 展示版本历史、文件变更 diff
 */

interface VibeVersion {
  id: string;
  session_id: string;
  version: string;
  description: string;
  status: string;
  parent_version_id: string | null;
  created_at: string;
}

interface VibeFileChange {
  id: string;
  version_id: string;
  file_path: string;
  action: string;
  before_content: string | null;
  after_content: string;
  diff: string | null;
  language: string | null;
  created_at: string;
}

interface VersionDetail {
  version: VibeVersion;
  fileChanges: VibeFileChange[];
}

interface VibeVersionPanelProps {
  sessionId: string;
  className?: string;
}

export function VibeVersionPanel({ sessionId, className }: VibeVersionPanelProps) {
  const [versions, setVersions] = useState<VibeVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<VersionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadVersions = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/vibe/versions?sessionId=${sessionId}`);
      if (!res.ok) return;
      const json = await res.json();
      if (json.success) setVersions(json.data);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) loadVersions();
  }, [sessionId, loadVersions]);

  const loadVersionDetail = useCallback(async (versionId: string) => {
    try {
      const res = await fetch(`/api/vibe/versions/${versionId}`);
      if (!res.ok) return;
      const json = await res.json();
      if (json.success) setSelectedVersion(json.data);
    } catch {
      // silent
    }
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published': return <Badge variant="outline" className="text-[10px] border-emerald-200 text-emerald-700">已发布</Badge>;
      case 'reviewed': return <Badge variant="outline" className="text-[10px] border-sky-200 text-sky-700">已审核</Badge>;
      case 'draft': return <Badge variant="outline" className="text-[10px] border-amber-200 text-amber-700">草稿</Badge>;
      default: return <Badge variant="outline" className="text-[10px]">{status}</Badge>;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return <Plus className="h-3.5 w-3.5 text-emerald-500" />;
      case 'modify': return <FileCode className="h-3.5 w-3.5 text-sky-500" />;
      case 'delete': return <Minus className="h-3.5 w-3.5 text-rose-500" />;
      default: return <FileCode className="h-3.5 w-3.5 text-slate-400" />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'create': return '新增';
      case 'modify': return '修改';
      case 'delete': return '删除';
      default: return action;
    }
  };

  // 简易 diff 渲染
  const renderDiff = (diff: string | null, afterContent: string) => {
    if (diff) {
      const lines = diff.split('\n');
      return (
        <div className="rounded-lg border border-slate-200 bg-slate-950 overflow-x-auto">
          <pre className="p-3 text-xs font-mono leading-relaxed">
            {lines.map((line, i) => (
              <div
                key={i}
                className={cn(
                  'px-2',
                  line.startsWith('+') && !line.startsWith('+++') && 'bg-emerald-500/10 text-emerald-400',
                  line.startsWith('-') && !line.startsWith('---') && 'bg-rose-500/10 text-rose-400',
                  line.startsWith('@@') && 'text-sky-400',
                  !line.startsWith('+') && !line.startsWith('-') && !line.startsWith('@@') && 'text-slate-400'
                )}
              >
                {line}
              </div>
            ))}
          </pre>
        </div>
      );
    }
    // 无 diff 时显示内容
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-950 overflow-x-auto">
        <pre className="p-3 text-xs font-mono leading-relaxed text-slate-300">
          {afterContent}
        </pre>
      </div>
    );
  };

  return (
    <div className={cn('flex flex-col', className)}>
      {/* 版本列表 */}
      <div className="border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2 mb-3">
          <GitBranch className="h-4 w-4 text-indigo-500" />
          <h3 className="text-sm font-semibold text-slate-900">版本历史</h3>
          <Badge variant="outline" className="text-[10px] ml-auto">{versions.length}</Badge>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          </div>
        ) : versions.length === 0 ? (
          <div className="py-6 text-center">
            <Tag className="mx-auto mb-2 h-8 w-8 text-slate-300" />
            <p className="text-xs text-slate-500">暂无版本记录</p>
          </div>
        ) : (
          <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
            {versions.map((v) => (
              <button
                key={v.id}
                onClick={() => loadVersionDetail(v.id)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-colors',
                  selectedVersion?.version.id === v.id
                    ? 'bg-indigo-50 border border-indigo-200'
                    : 'hover:bg-slate-50'
                )}
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100">
                  <Tag className="h-3.5 w-3.5 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-700">v{v.version}</span>
                    {getStatusBadge(v.status)}
                  </div>
                  <p className="truncate text-[11px] text-slate-500 mt-0.5">{v.description}</p>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 文件变更详情 */}
      {selectedVersion && (
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="h-3.5 w-3.5 text-indigo-500" />
              <span className="text-xs font-semibold text-slate-700">
                v{selectedVersion.version.version} 文件变更
              </span>
              <Badge variant="outline" className="text-[10px] ml-auto">
                {selectedVersion.fileChanges.length} 个文件
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            {selectedVersion.fileChanges.map((fc) => (
              <div key={fc.id} className="rounded-lg border border-slate-200 overflow-hidden">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 border-b border-slate-200">
                  {getActionIcon(fc.action)}
                  <span className="text-xs font-mono text-slate-700 flex-1 truncate">{fc.file_path}</span>
                  <Badge variant="outline" className="text-[10px] shrink-0">
                    {getActionLabel(fc.action)}
                  </Badge>
                  {fc.language && (
                    <Badge variant="secondary" className="text-[10px] shrink-0">{fc.language}</Badge>
                  )}
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                  {renderDiff(fc.diff, fc.after_content)}
                </div>
              </div>
            ))}
          </div>

          {/* 操作按钮 */}
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs flex-1"
              onClick={async () => {
                const res = await fetch(`/api/vibe/versions/${selectedVersion.version.id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ status: 'reviewed' }),
                });
                if (res.ok) loadVersionDetail(selectedVersion.version.id);
              }}
            >
              标记已审核
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs flex-1"
              onClick={async () => {
                const res = await fetch(`/api/vibe/versions/${selectedVersion.version.id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ status: 'published' }),
                });
                if (res.ok) {
                  loadVersionDetail(selectedVersion.version.id);
                  loadVersions();
                }
              }}
            >
              发布版本
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

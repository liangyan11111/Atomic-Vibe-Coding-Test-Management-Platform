'use client';

import { useState } from 'react';
import { User, Bell, Shield, Palette, Globe, Key, Bot } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">设置</h1>
        <p className="text-sm text-slate-500">管理个人偏好和系统配置</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="profile" className="text-xs gap-1.5"><User className="h-3.5 w-3.5" />个人信息</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs gap-1.5"><Bell className="h-3.5 w-3.5" />通知</TabsTrigger>
          <TabsTrigger value="security" className="text-xs gap-1.5"><Shield className="h-3.5 w-3.5" />安全</TabsTrigger>
          <TabsTrigger value="appearance" className="text-xs gap-1.5"><Palette className="h-3.5 w-3.5" />外观</TabsTrigger>
          <TabsTrigger value="ai" className="text-xs gap-1.5"><Bot className="h-3.5 w-3.5" />AI 配置</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-sm">个人信息</CardTitle>
              <CardDescription className="text-xs">管理你的账户信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-indigo-100 text-lg font-semibold text-indigo-700">ZM</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" className="text-xs">更换头像</Button>
                  <p className="text-[11px] text-slate-500 mt-1">支持 JPG、PNG 格式，最大 2MB</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">姓名</Label>
                  <Input defaultValue="张明" className="text-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">邮箱</Label>
                  <Input defaultValue="zhangming@test.com" className="text-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">角色</Label>
                  <Input defaultValue="管理员" className="text-sm" disabled />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">部门</Label>
                  <Input defaultValue="质量保障部" className="text-sm" />
                </div>
              </div>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs">保存更改</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-sm">通知设置</CardTitle>
              <CardDescription className="text-xs">配置通知方式和频率</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: '用例分配通知', desc: '当有新用例分配给你时通知', defaultChecked: true },
                { label: '缺陷提交通知', desc: '当有新缺陷提交时通知', defaultChecked: true },
                { label: '测试计划提醒', desc: '测试计划开始和结束时提醒', defaultChecked: true },
                { label: '缺陷状态变更', desc: '你负责的缺陷状态变更时通知', defaultChecked: false },
                { label: '周报汇总', desc: '每周一发送测试周报', defaultChecked: true },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.defaultChecked} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-sm">安全设置</CardTitle>
              <CardDescription className="text-xs">管理密码和认证方式</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">当前密码</Label>
                <Input type="password" placeholder="输入当前密码" className="text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">新密码</Label>
                  <Input type="password" placeholder="输入新密码" className="text-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">确认新密码</Label>
                  <Input type="password" placeholder="再次输入新密码" className="text-sm" />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">两步验证</p>
                  <p className="text-xs text-slate-500">使用验证器应用进行二次验证</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-200">已启用</Badge>
                  <Button variant="outline" size="sm" className="text-xs">配置</Button>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">API Token</p>
                  <p className="text-xs text-slate-500">管理用于 API 访问的令牌</p>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Key className="h-3.5 w-3.5" />管理 Token
                </Button>
              </div>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs">更新密码</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-sm">外观设置</CardTitle>
              <CardDescription className="text-xs">自定义界面显示偏好</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">主题</Label>
                <div className="flex gap-3">
                  {[
                    { label: '浅色', value: 'light', active: true },
                    { label: '深色', value: 'dark', active: false },
                    { label: '跟随系统', value: 'system', active: false },
                  ].map(theme => (
                    <button
                      key={theme.value}
                      className={`flex h-16 w-24 flex-col items-center justify-center rounded-lg border-2 p-2 text-xs transition-colors ${
                        theme.active ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className={`h-6 w-10 rounded ${theme.value === 'dark' ? 'bg-slate-800' : 'bg-white border border-slate-200'} mb-1`} />
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-xs">语言</Label>
                <Select defaultValue="zh-CN">
                  <SelectTrigger className="w-48 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zh-CN">简体中文</SelectItem>
                    <SelectItem value="en-US">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">紧凑模式</p>
                  <p className="text-xs text-slate-500">减少间距，显示更多信息</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-sm">AI 模型配置</CardTitle>
              <CardDescription className="text-xs">配置 Vibe Coding 使用的 LLM 模型</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">模型提供商</Label>
                <Select defaultValue="coze">
                  <SelectTrigger className="w-64 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coze">Coze (豆包/DeepSeek)</SelectItem>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="custom">自定义</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">模型</Label>
                <Select defaultValue="doubao-seed-2-0-mini-260215">
                  <SelectTrigger className="w-64 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doubao-seed-2-0-mini-260215">Doubao Seed 2.0 Mini</SelectItem>
                    <SelectItem value="doubao-seed-2-0-260215">Doubao Seed 2.0</SelectItem>
                    <SelectItem value="deepseek-v3-250324">DeepSeek V3</SelectItem>
                    <SelectItem value="deepseek-r1-250120">DeepSeek R1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Temperature</Label>
                <Input type="number" defaultValue="0.7" min="0" max="2" step="0.1" className="w-32 text-sm" />
                <p className="text-[11px] text-slate-500">控制输出的随机性，0 为确定性输出，2 为最大随机性</p>
              </div>
              <Separator />
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-medium text-slate-700">环境变量配置</p>
                <p className="text-[11px] text-slate-500 mt-1">生产环境请通过环境变量设置：</p>
                <code className="mt-1 block text-[11px] text-slate-600 font-mono">
                  LLM_PROVIDER, LLM_MODEL, LLM_TEMPERATURE, LLM_MAX_TOKENS
                </code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

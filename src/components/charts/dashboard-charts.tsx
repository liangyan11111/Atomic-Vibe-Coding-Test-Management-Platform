'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
} from 'recharts';

interface ExecutionTrendData {
  date: string;
  passed: number;
  failed: number;
  blocked: number;
}

export function ExecutionTrendChart({ data }: { data: ExecutionTrendData[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="colorPassed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
        />
        <Area type="monotone" dataKey="passed" stroke="#10B981" fill="url(#colorPassed)" strokeWidth={2} name="通过" />
        <Area type="monotone" dataKey="failed" stroke="#F43F5E" fill="url(#colorFailed)" strokeWidth={2} name="失败" />
        <Area type="monotone" dataKey="blocked" stroke="#F59E0B" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" name="阻塞" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface DefectTrendData {
  date: string;
  open: number;
  resolved: number;
}

export function DefectTrendChart({ data }: { data: DefectTrendData[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
        />
        <Line type="monotone" dataKey="open" stroke="#F43F5E" strokeWidth={2} dot={{ r: 3 }} name="新增" />
        <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} name="解决" />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface ModuleData {
  module: string;
  count: number;
}

const COLORS = ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6', '#EC4899', '#6366F1'];

export function ModuleDistributionChart({ data }: { data: ModuleData[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={3}
          dataKey="count"
          nameKey="module"
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function PriorityBarChart({ data }: { data: { priority: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis dataKey="priority" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
        />
        <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} name="用例数" />
      </BarChart>
    </ResponsiveContainer>
  );
}

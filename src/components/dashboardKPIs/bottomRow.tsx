"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { recentActivity, alerts } from "@/data/mock/dashboard";

type ActivityByType = { type: string; count: number };

const typeLabel = (t: string) =>
  t.charAt(0).toUpperCase() + t.slice(1);

const buildActivityByType = (): ActivityByType[] => {
  const map: Record<string, number> = {};
  recentActivity.forEach((a) => {
    map[a.type] = (map[a.type] ?? 0) + 1;
  });
  return Object.entries(map).map(([type, count]) => ({ type: typeLabel(type), count }));
};

const severityToColor: Record<string, string> = {
  info: "#6366f1",
  warning: "#f59e0b",
  critical: "#ef4444",
};

const typeToColor: Record<string, string> = {
  Campaign: "#3b82f6",
  Lead: "#22c55e",
  Budget: "#f59e0b",
  Alert: "#ef4444",
};

const BottomRow = () => {
  const activityData = React.useMemo(() => buildActivityByType(), []);

  const severityCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    alerts.forEach((a) => (counts[a.severity] = (counts[a.severity] ?? 0) + 1));
    return Object.entries(counts).map(([severity, value]) => ({ severity, value }));
  }, []);

  const totalAlerts = severityCounts.reduce((a, c) => a + c.value, 0);

  const thousands = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(0)}k` : `${n}`);

  const ActivityTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs shadow-sm">
        <div className="font-medium text-slate-700">{label}</div>
        <div className="text-indigo-600">{payload[0].value} event(s)</div>
      </div>
    );
  };

  const PieLegend: React.FC<any> = ({ payload }) => (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-slate-600">
      {payload?.map((e: any) => (
        <li key={e.value} className="inline-flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full" style={{ background: e.color }} />
          {e.value}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* Activity by type */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="px-1 pb-2">
          <h3 className="text-sm font-medium text-slate-700">Recent Activity by Type</h3>
        </div>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData} margin={{ top: 6, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis dataKey="type" tick={{ fill: "#64748b", fontSize: 11 }} tickMargin={6} tickLine={false} axisLine={false} />
              <YAxis tickFormatter={thousands} tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<ActivityTooltip />} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {activityData.map((d) => (
                  <Cell key={d.type} fill={typeToColor[d.type] || "#94a3b8"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts severity */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="px-1 pb-2">
          <h3 className="text-sm font-medium text-slate-700">Alerts Overview</h3>
        </div>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={severityCounts}
                dataKey="value"
                nameKey="severity"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                label={false}
              >
                {severityCounts.map((item, idx) => (
                  <Cell key={item.severity} fill={severityToColor[item.severity] || "#94a3b8"} />
                ))}
              </Pie>
              <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" fill="#0f172a" fontSize={14} fontWeight={600}>
                {totalAlerts}
              </text>
              <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" fill="#64748b" fontSize={10}>
                Total Alerts
              </text>
              <Legend verticalAlign="bottom" height={26} iconType="circle" content={<PieLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BottomRow;
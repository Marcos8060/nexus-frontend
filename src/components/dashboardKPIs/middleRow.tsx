"use client";

import React from "react";
// Using custom containers instead of shadcn Card
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { performanceOverTime, spendByChannel } from "@/data/mock/dashboard";

const COLORS = ["#2563eb", "#22c55e", "#f59e0b", "#14b8a6", "#9333ea"];

const currency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const thousands = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(0)}k` : `${n}`;

const PieTooltip: React.FC<any> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs shadow-sm">
      <div className="font-medium text-slate-700">{item?.payload?.channel}</div>
      <div className="text-slate-500">Spend: {currency(item?.payload?.spend)}</div>
    </div>
  );
};

const PieLegend: React.FC<any> = ({ payload }) => {
  const total = spendByChannel.reduce((a, c) => a + c.spend, 0);
  return (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-slate-600">
      {payload?.map((e: any) => {
        const d = spendByChannel.find((s) => s.channel === e.value);
        const pct = d ? Math.round((d.spend / total) * 100) : 0;
        return (
          <li key={e.value} className="inline-flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: e.color }} />
            {e.value} {pct}%
          </li>
        );
      })}
    </ul>
  );
};

const LineTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const spend = payload.find((p: any) => p.dataKey === "spend");
  const leads = payload.find((p: any) => p.dataKey === "leads");
  const roi = payload.find((p: any) => p.dataKey === "roi");
  return (
    <div className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs shadow-sm">
      <div className="font-medium text-slate-700">{label}</div>
      {spend && <div className="text-indigo-600">Spend: {currency(spend.value)}</div>}
      {leads && <div className="text-emerald-600">Leads: {leads.value}</div>}
      {roi && <div className="text-amber-600">ROI: {roi.value}</div>}
    </div>
  );
};

const MiddleRow = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  const totalSpend = spendByChannel.reduce((acc, cur) => acc + cur.spend, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* Pie Chart - Spend by Channel (Donut) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="px-1 pb-2">
          <h3 className="text-sm font-medium text-slate-700">Spend by Channel</h3>
        </div>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {spendByChannel.map((_, i) => (
                  <linearGradient key={i} id={`pieGrad-${i}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.6} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={spendByChannel}
                dataKey="spend"
                nameKey="channel"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={2}
                label={false}
              >
                {spendByChannel.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#pieGrad-${index})`} />
                ))}
              </Pie>
              <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" fill="#0f172a" fontSize={16} fontWeight={600}>
                {currency(totalSpend)}
              </text>
              <text x="50%" y="57%" textAnchor="middle" dominantBaseline="middle" fill="#64748b" fontSize={10}>
                Total Spend
              </text>
              <Tooltip content={<PieTooltip />} />
              <Legend verticalAlign="bottom" height={28} iconType="circle" content={<PieLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart - Performance Trend */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="px-1 pb-2">
          <h3 className="text-sm font-medium text-slate-700">Performance Over Time</h3>
        </div>
        <div className="h-56 xs:h-60 sm:h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceOverTime} margin={{ top: 6, right: 8, left: 0, bottom: 6 }}>
              <defs>
                <linearGradient id="gradSpend" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="gradLeads" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="gradRoi" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: isMobile ? 10 : 11 }} tickMargin={6} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" tickFormatter={thousands} tick={{ fill: "#64748b", fontSize: isMobile ? 10 : 11 }} tickLine={false} axisLine={false} width={isMobile ? 28 : 36} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "#64748b", fontSize: isMobile ? 10 : 11 }} tickLine={false} axisLine={false} width={isMobile ? 24 : 32} />
              <Tooltip content={<LineTooltip />} />
              <Legend verticalAlign="bottom" height={isMobile ? 20 : 24} wrapperStyle={{ fontSize: isMobile ? 10 : 11 }} />
              <Line yAxisId="left" type="monotone" dataKey="spend" stroke="url(#gradSpend)" name="Spend ($)" strokeWidth={2.6} dot={false} activeDot={{ r: 4 }} strokeLinecap="round" />
              <Line yAxisId="left" type="monotone" dataKey="leads" stroke="url(#gradLeads)" name="Leads" strokeWidth={2.6} dot={false} activeDot={{ r: 4 }} strokeLinecap="round" />
              <Line yAxisId="right" type="monotone" dataKey="roi" stroke="url(#gradRoi)" name="ROI" strokeWidth={2.4} dot={false} activeDot={{ r: 4 }} strokeLinecap="round" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MiddleRow;

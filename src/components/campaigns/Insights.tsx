"use client";
import React from "react";
import { mockCampaigns } from "@/data/mock/campaigns";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";

const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const Insights = () => {
  const byPlatform = React.useMemo(() => {
    const map: Record<string, { spend: number; leads: number }> = {};
    mockCampaigns.forEach((c) => {
      c.platforms.forEach((p) => {
        map[p] = map[p] || { spend: 0, leads: 0 };
        map[p].spend += c.spendMTD / c.platforms.length;
        map[p].leads += c.leads / c.platforms.length;
      });
    });
    return Object.entries(map).map(([platform, v]) => ({ platform: platform.replace(" Ads", ""), ...v }));
  }, []);

  const statusCounts = React.useMemo(() => {
    const map: Record<string, number> = {};
    mockCampaigns.forEach((c) => (map[c.status] = (map[c.status] ?? 0) + 1));
    return Object.entries(map).map(([status, value]) => ({ status, value }));
  }, []);

  const colors = ["#6366f1", "#f59e0b", "#22c55e", "#ef4444", "#0ea5e9"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="px-1 pb-2"><h3 className="text-sm font-medium text-slate-700">Spend & Leads by Platform</h3></div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byPlatform} margin={{ top: 6, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis dataKey="platform" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip formatter={(v: number, name: string) => name === "spend" ? money(v) : v} />
              <Bar yAxisId="left" dataKey="spend" fill="#6366f1" radius={[6,6,0,0]} name="Spend" />
              <Bar yAxisId="right" dataKey="leads" fill="#22c55e" radius={[6,6,0,0]} name="Leads" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="px-1 pb-2"><h3 className="text-sm font-medium text-slate-700">Campaigns by Status</h3></div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusCounts} dataKey="value" nameKey="status" cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={2}>
                {statusCounts.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={26} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Insights;



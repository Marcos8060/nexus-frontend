"use client";
import React from "react";
import { mockCampaigns } from "@/data/mock/campaigns";

const Planner = () => {
  const min = new Date(Math.min(...mockCampaigns.map(c => new Date(c.startDate).getTime())));
  const max = new Date(Math.max(...mockCampaigns.map(c => new Date(c.endDate).getTime())));
  const rangeDays = Math.max(1, Math.round((+max - +min) / (1000*60*60*24)));

  const calcLeftWidth = (start: string, end: string) => {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const left = ((s - +min) / (+max - +min)) * 100;
    const width = Math.max(2, ((e - s) / (+max - +min)) * 100);
    return { left: `${left}%`, width: `${width}%` };
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
      <div className="px-1 pb-2"><h3 className="text-sm font-medium text-slate-700">Planner (Timeline)</h3></div>
      <div className="space-y-3">
        {mockCampaigns.map(c => (
          <div key={c.id} className="">
            <div className="text-xs text-slate-600 mb-1">{c.name}</div>
            <div className="relative h-6 bg-slate-50 rounded">
              <div className="absolute h-6 rounded bg-slate-900/80" style={calcLeftWidth(c.startDate, c.endDate)} />
            </div>
            <div className="text-[10px] text-slate-500 mt-1">{c.startDate} → {c.endDate}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Planner;



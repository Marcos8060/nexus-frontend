import React from "react";
import { mockCampaigns } from "@/data/mock/campaigns";

const number = (n: number) => n.toLocaleString();
const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const KPIs = () => {
  const totalBudget = mockCampaigns.reduce((a, c) => a + c.budget, 0);
  const spendMTD = mockCampaigns.reduce((a, c) => a + c.spendMTD, 0);
  const avgROAS = mockCampaigns.length ? (mockCampaigns.reduce((a, c) => a + c.roas, 0) / mockCampaigns.length) : 0;
  const totalLeads = mockCampaigns.reduce((a, c) => a + c.leads, 0);

  const items = [
    { label: "Active Campaigns", value: number(mockCampaigns.filter(c => c.status === "Active").length) },
    { label: "Budget (Total)", value: money(totalBudget) },
    { label: "Spend (MTD)", value: money(spendMTD) },
    { label: "Avg ROAS", value: avgROAS.toFixed(2) },
    { label: "Leads", value: number(totalLeads) },
  ];

  return (
    <section className="grid md:grid-cols-5 grid-cols-2 gap-4">
      {items.map((it) => (
        <div key={it.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <p className="text-slate-500 text-xs">{it.label}</p>
          <p className="text-slate-800 text-xl font-semibold mt-1">{it.value}</p>
        </div>
      ))}
    </section>
  );
};

export default KPIs;



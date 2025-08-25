"use client";
import React from "react";
import { mockCampaigns } from "@/data/mock/campaigns";

type FiltersState = {
  platform: string | "All";
  status: string | "All";
  region: string | "All";
};

const unique = (arr: string[]) => Array.from(new Set(arr)).sort();

const Filters: React.FC<{ onChange: (f: FiltersState) => void }> = ({ onChange }) => {
  const [filters, setFilters] = React.useState<FiltersState>({ platform: "All", status: "All", region: "All" });

  const platforms = unique(mockCampaigns.flatMap((c) => c.platforms));
  const statuses = unique(mockCampaigns.map((c) => c.status));
  const regions = unique(mockCampaigns.map((c) => c.region));

  React.useEffect(() => onChange(filters), [filters, onChange]);

  const ChipSelect = ({ label, value, options, onSelect }: { label: string; value: string; options: string[]; onSelect: (v: string) => void }) => (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500">{label}</span>
      <div className="flex flex-wrap gap-1">
        {["All", ...options].map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`px-2.5 py-1 rounded-full text-xs border ${value === opt ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-700"}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3">
      <div className="flex flex-wrap gap-4">
        <ChipSelect label="Platform" value={filters.platform} options={platforms} onSelect={(v) => setFilters((f) => ({ ...f, platform: v }))} />
        <ChipSelect label="Status" value={filters.status} options={statuses} onSelect={(v) => setFilters((f) => ({ ...f, status: v }))} />
        <ChipSelect label="Region" value={filters.region} options={regions} onSelect={(v) => setFilters((f) => ({ ...f, region: v }))} />
      </div>
    </div>
  );
};

export type { FiltersState };
export default Filters;



import { dashboardKPIs } from "@/data/mock/dashboard";
import React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const TopRow = () => {
  const formatValue = (label: string, value: number) => {
    if (label.toLowerCase().includes("spend")) {
      return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      });
    }
    if (label.toLowerCase().includes("roi")) {
      return value.toFixed(1);
    }
    return value.toLocaleString();
  };

  return (
    <section className="grid md:grid-cols-4 grid-cols-1 gap-4">
      {dashboardKPIs.map((data) => {
        const isNegative = `${data.trend}`.includes("-");
        const TrendIcon = isNegative ? ArrowDownRight : ArrowUpRight;
        return (
          <div
            key={data.id}
            className="bg-white rounded-md border border-slate-100 shadow-sm hover:shadow-md transition-all p-5">
            <div className="flex items-start justify-between">
              <div className={`${data.bgColor} rounded-lg p-2 ring-1 ring-inset ring-slate-100`}>
                <p className={`${data.iconColor}`}>
                  {data.icon && <data.icon className="w-5 h-5" />}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  isNegative
                    ? "text-red-600 bg-red-50 ring-1 ring-red-100"
                    : "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-100"
                }`}
              >
                <TrendIcon className="w-3.5 h-3.5" /> {data.trend}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-semibold text-slate-600 tracking-tight">
                {formatValue(data.label, Number(data.value))}
              </p>
              <p className="text-slate-500 text-sm mt-1">{data.label}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default TopRow;

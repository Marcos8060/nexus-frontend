"use client";
import React from "react";
import { Campaign, mockCampaigns, platformColors } from "@/data/mock/campaigns";
import { FiltersState } from "./Filters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Eye,
  MousePointer,
  DollarSign,
  Target,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

const money = (n: number) => n.toLocaleString("en-US", { 
  style: "currency", 
  currency: "USD", 
  maximumFractionDigits: 0 
});

const useFiltered = (filters: FiltersState) => {
  return React.useMemo(() => {
    return mockCampaigns.filter((c) => {
      const byPlatform = filters.platform === "All" || c.platforms.includes(filters.platform as any);
      const byStatus = filters.status === "All" || c.status === filters.status;
      const byRegion = filters.region === "All" || c.region === filters.region;
      return byPlatform && byStatus && byRegion;
    });
  }, [filters]);
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const variants = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    Paused: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    Scheduled: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    Completed: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
    Draft: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
  };

  const icons = {
    Active: <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />,
    Paused: <div className="w-2 h-2 bg-amber-500 rounded-full" />,
    Scheduled: <Calendar className="w-3 h-3" />,
    Completed: <div className="w-2 h-2 bg-slate-400 rounded-full" />,
    Draft: <div className="w-2 h-2 bg-purple-500 rounded-full" />
  };

  return (
    <Badge 
      variant="outline" 
      className={cn("gap-1.5 font-medium transition-colors", variants[status as keyof typeof variants])}
    >
      {icons[status as keyof typeof icons]}
      {status}
    </Badge>
  );
};

const MetricCell: React.FC<{ 
  value: string | number; 
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  suffix?: string;
}> = ({ value, trend, icon, suffix = "" }) => {
  return (
    <div className="flex items-center justify-end gap-2">
      <div className="text-right">
        <div className="font-semibold text-slate-900 flex items-center justify-end gap-1">
          {icon && <span className="text-slate-400">{icon}</span>}
          {value}{suffix}
        </div>
        {trend && (
          <div className={cn("flex items-center justify-end gap-1 text-xs", {
            "text-emerald-600": trend === "up",
            "text-red-600": trend === "down",
            "text-slate-500": trend === "neutral"
          })}>
            {trend === "up" && <TrendingUp className="w-3 h-3" />}
            {trend === "down" && <TrendingDown className="w-3 h-3" />}
            <span>vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

const CampaignTable: React.FC<{ filters: FiltersState }> = ({ filters }) => {
  const data = useFiltered(filters);

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardContent className="p-0 ">
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Table>
            <TableHeader className="">
              <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100/50 hover:bg-slate-50 border-b border-input">
                <TableHead className="font-semibold text-slate-700 pl-6">Campaign</TableHead>
                <TableHead className="font-semibold text-slate-700">Platforms</TableHead>
                <TableHead className="font-semibold text-slate-700">Status</TableHead>
                <TableHead className="font-semibold text-slate-700 text-right">Spend (MTD)</TableHead>
                <TableHead className="font-semibold text-slate-700 text-right">CTR</TableHead>
                <TableHead className="font-semibold text-slate-700 text-right">CPC</TableHead>
                <TableHead className="font-semibold text-slate-700 text-right">CPL</TableHead>
                <TableHead className="font-semibold text-slate-700 text-right">ROAS</TableHead>
                <TableHead className="font-semibold text-slate-700">Duration</TableHead>
                <TableHead className="font-semibold text-slate-700 pr-6">Owner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((c: Campaign, index) => (
                <TableRow 
                  key={c.id} 
                  className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/20 transition-all duration-200 border-slate-100/60 group"
                >
                  <TableCell className="pl-6">
                    <div className="space-y-1">
                      <div className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {c.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                          {c.client}
                        </span>
                        <span>•</span>
                        <span>{c.region}</span>
                        <span>•</span>
                        <span>{c.product}</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {c.platforms.map((p) => (
                        <div 
                          key={p} 
                          className="text-white rounded-md px-3 py-1 text-[10px] border-0 font-medium shadow-sm hover:shadow-sm transition-shadow"
                          style={{ backgroundColor: platformColors[p] }}
                        >
                          {p.replace(" Ads", "")}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <StatusBadge status={c.status} />
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <MetricCell 
                      value={money(c.spendMTD)} 
                      trend={index % 3 === 0 ? "up" : index % 3 === 1 ? "down" : "neutral"}
                      icon={<DollarSign className="w-3 h-3" />}
                    />
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <MetricCell 
                      value={c.ctr} 
                      suffix="%"
                      trend={c.ctr > 2.5 ? "up" : "down"}
                      icon={<MousePointer className="w-3 h-3" />}
                    />
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <MetricCell 
                      value={`$${c.cpc}`}
                      trend={c.cpc < 1.5 ? "up" : "down"}
                      icon={<Target className="w-3 h-3" />}
                    />
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <MetricCell 
                      value={`$${c.cpl}`}
                      trend={c.cpl < 25 ? "up" : "down"}
                      icon={<BarChart3 className="w-3 h-3" />}
                    />
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <MetricCell 
                      value={c.roas}
                      trend={c.roas > 3 ? "up" : "down"}
                      icon={<TrendingUp className="w-3 h-3" />}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-slate-700 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {c.startDate}
                      </div>
                      <div className="text-xs text-slate-500">
                        → {c.endDate}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="pr-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-6 w-6 ring-2 ring-white shadow-sm">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${c.owner}`} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
                          {c.owner.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-slate-700 text-sm">{c.owner}</div>
                        <div className="text-xs text-slate-500">Campaign Manager</div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No campaigns found</h3>
            <p className="text-slate-500 max-w-sm">
              Try adjusting your filters to see more campaigns, or create a new campaign to get started.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignTable;
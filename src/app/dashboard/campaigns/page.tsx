"use client";
import React from "react";
import KPIs from "@/components/campaigns/KPIs";
import Filters, { FiltersState } from "@/components/campaigns/Filters";
import Table from "@/components/campaigns/Table";
import Insights from "@/components/campaigns/Insights";
import Planner from "@/components/campaigns/Planner";
import CreateCampaignDrawer from "@/components/campaigns/CreateCampaignDrawer";

const CampaignsPage = () => {
  const [filters, setFilters] = React.useState<FiltersState>({ platform: "All", status: "All", region: "All" });

  return (
    <div className="space-y-6">
      {/* <div className="flex items-center justify-between"> */}
        <div className="flex-1"><KPIs /></div>
        {/* <div className="ml-4 shrink-0"><CreateCampaignDrawer /></div> */}
      {/* </div> */}
      <Filters onChange={setFilters} />
      <Table filters={filters} />
      <Insights />
      <Planner />
    </div>
  );
};

export default CampaignsPage;
"use client";

import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const CreateCampaignDrawer: React.FC = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="xs" className="gap-2 text-sm">
          <Plus className="w-4 h-4" />
          Create Campaign
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[92vw] sm:w-[520px] md:w-[640px] lg:w-[760px]">
        <SheetHeader>
          <SheetTitle>Create Campaign</SheetTitle>
          <SheetDescription>
            This is a placeholder. The multi-step campaign wizard will live here.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 text-sm text-slate-500">
          {/* Wizard steps will be implemented here (Basics → Targeting → Budget → Review) */}
          <div className="rounded-xl border border-dashed border-input p-6 text-center">
            Empty drawer content
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CreateCampaignDrawer;



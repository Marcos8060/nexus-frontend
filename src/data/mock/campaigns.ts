export type Campaign = {
  id: string;
  name: string;
  platforms: Array<"Google Ads" | "Facebook Ads" | "Instagram Ads" | "LinkedIn Ads" | "TikTok Ads">;
  status: "Draft" | "Active" | "Paused" | "Scheduled" | "Completed";
  objective: "Leads" | "Traffic" | "Sales" | "Awareness";
  owner: string;
  client: string;
  region: string;
  product: string;
  brand: string;
  startDate: string;
  endDate: string;
  budget: number;
  spendMTD: number;
  ctr: number;
  cpc: number;
  cpl: number;
  roas: number;
  leads: number;
  lastUpdated: string;
};

export const mockCampaigns: Campaign[] = [
  {
    id: "CMP-001",
    name: "Q3 Lead Gen - Search Core",
    platforms: ["Google Ads"],
    status: "Active",
    objective: "Leads",
    owner: "Alex M.",
    client: "Acme Corp",
    region: "NA",
    product: "Suite A",
    brand: "Acme",
    startDate: "2025-07-01",
    endDate: "2025-09-30",
    budget: 35000,
    spendMTD: 12800,
    ctr: 1.6,
    cpc: 2.3,
    cpl: 28.5,
    roas: 2.4,
    leads: 448,
    lastUpdated: "2025-08-20 10:22",
  },
  {
    id: "CMP-002",
    name: "Meta Prospecting - Summer",
    platforms: ["Facebook Ads", "Instagram Ads"],
    status: "Active",
    objective: "Awareness",
    owner: "Jess P.",
    client: "Acme Corp",
    region: "EU",
    product: "Suite B",
    brand: "Acme",
    startDate: "2025-06-10",
    endDate: "2025-09-10",
    budget: 42000,
    spendMTD: 15400,
    ctr: 1.1,
    cpc: 1.4,
    cpl: 36.1,
    roas: 1.8,
    leads: 312,
    lastUpdated: "2025-08-19 18:07",
  },
  {
    id: "CMP-003",
    name: "LinkedIn ABM - Tech ICP",
    platforms: ["LinkedIn Ads"],
    status: "Scheduled",
    objective: "Leads",
    owner: "Priya S.",
    client: "Globex",
    region: "NA",
    product: "Enterprise",
    brand: "Globex",
    startDate: "2025-09-05",
    endDate: "2025-12-31",
    budget: 80000,
    spendMTD: 0,
    ctr: 0.0,
    cpc: 0.0,
    cpl: 0.0,
    roas: 0.0,
    leads: 0,
    lastUpdated: "2025-08-18 12:40",
  },
  {
    id: "CMP-004",
    name: "TikTok Remarketing",
    platforms: ["TikTok Ads"],
    status: "Paused",
    objective: "Sales",
    owner: "Sam R.",
    client: "Acme Corp",
    region: "APAC",
    product: "Suite A",
    brand: "Acme",
    startDate: "2025-05-01",
    endDate: "2025-10-31",
    budget: 25000,
    spendMTD: 4200,
    ctr: 1.9,
    cpc: 0.9,
    cpl: 22.4,
    roas: 2.9,
    leads: 146,
    lastUpdated: "2025-08-17 09:03",
  },
];

export const platformColors: Record<string, string> = {
  "Google Ads": "#3b82f6",
  "Facebook Ads": "#1d4ed8",
  "Instagram Ads": "#ec4899",
  "LinkedIn Ads": "#2563eb",
  "TikTok Ads": "#10b981",
};



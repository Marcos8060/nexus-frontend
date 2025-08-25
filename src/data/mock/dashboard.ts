import { Trophy, DollarSign, TrendingUp, UserPlus } from "lucide-react";

export const dashboardKPIs = [
  {
    id: "kpi1",
    label: "Active Campaigns",
    value: 14,
    trend: "+12%",
    icon: Trophy,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "kpi2",
    label: "Total Spend (This Month)",
    value: 24500,
    trend: "+8%",
    icon: DollarSign,
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    id: "kpi3",
    label: "ROI (ROAS)",
    value: 2.4,
    trend: "-0.3",
    icon: TrendingUp,
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    id: "kpi4",
    label: "Qualified Leads",
    value: 368,
    trend: "+15%",
    icon: UserPlus,
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
];

// Performance by channel
export const spendByChannel = [
  { channel: "Google Ads", spend: 9400, roi: 2.3 },
  { channel: "Facebook Ads", spend: 8500, roi: 2.6 },
  { channel: "Instagram Ads", spend: 4600, roi: 2.9 },
  { channel: "LinkedIn Ads", spend: 3500, roi: 2.1 },
  { channel: "TikTok Ads", spend: 2800, roi: 2.8 },
];

// Performance trend over time
export const performanceOverTime = [
  { date: "2025-08-01", spend: 1200, leads: 40, roi: 2.1, cpl: 30, ctr: 1.2, cpc: 2.1 },
  { date: "2025-08-05", spend: 1800, leads: 55, roi: 2.3, cpl: 32.7, ctr: 1.4, cpc: 2.3 },
  { date: "2025-08-10", spend: 2200, leads: 62, roi: 2.0, cpl: 35.5, ctr: 1.1, cpc: 2.5 },
  { date: "2025-08-15", spend: 2000, leads: 70, roi: 2.5, cpl: 28.6, ctr: 1.6, cpc: 2.0 },
  { date: "2025-08-20", spend: 2400, leads: 80, roi: 2.6, cpl: 30, ctr: 1.7, cpc: 2.2 },
];

// Recent campaign activity (richer sample across types)
export const recentActivity = [
  { id: 1, type: "campaign", message: "Launched 'Back to School' on Google", timestamp: "2025-08-20 10:05" },
  { id: 2, type: "lead", message: "Lead score 92 from 'Webinar Signups'", timestamp: "2025-08-20 09:22" },
  { id: 3, type: "budget", message: "Increased budget by $1,500 for 'Brand Awareness'", timestamp: "2025-08-19 14:37" },
  { id: 4, type: "alert", message: "Facebook CPM rose 18% vs last week", timestamp: "2025-08-19 12:08" },
  { id: 5, type: "campaign", message: "Paused low CTR ad group 'Legacy A'", timestamp: "2025-08-19 08:41" },
  { id: 6, type: "lead", message: "New qualified lead from 'Pricing Page'", timestamp: "2025-08-18 17:55" },
  { id: 7, type: "lead", message: "Lead score 88 from 'Product Demo'", timestamp: "2025-08-18 15:16" },
  { id: 8, type: "campaign", message: "A/B test 'Hero Image' variant B started", timestamp: "2025-08-18 11:03" },
  { id: 9, type: "budget", message: "Reduced TikTok spend by $600 due to low ROAS", timestamp: "2025-08-17 19:25" },
  { id: 10, type: "alert", message: "Google Ads CPC spiked by 25%", timestamp: "2025-08-17 13:05" },
  { id: 11, type: "lead", message: "New hot lead scored 95 from 'Product Launch X'", timestamp: "2025-08-17 10:45" },
  { id: 12, type: "campaign", message: "Campaign 'Black Friday Promo' launched on Facebook", timestamp: "2025-08-16 09:32" },
  { id: 13, type: "lead", message: "Lead score 84 from 'Case Study Download'", timestamp: "2025-08-16 08:18" },
  { id: 14, type: "alert", message: "LinkedIn CTR dropped below 0.7%", timestamp: "2025-08-15 16:02" },
  { id: 15, type: "budget", message: "Budget increased by $2,000 for 'Summer Sale'", timestamp: "2025-08-15 11:10" },
  { id: 16, type: "campaign", message: "Refreshed creatives for 'Evergreen Search'", timestamp: "2025-08-14 10:27" },
];

// Alerts/notifications (balanced set for severity donut)
export const alerts = [
  { id: "a1", severity: "info", message: "New creative assets pending approval" },
  { id: "a2", severity: "warning", message: "LinkedIn CTR dropped below 0.7% this week" },
  { id: "a3", severity: "critical", message: "Google Ads account disconnected" },
  { id: "a4", severity: "info", message: "Weekly report available for review" },
  { id: "a5", severity: "warning", message: "High frequency detected on 'Remarketing'" },
  { id: "a6", severity: "critical", message: "Pixel event mismatch detected" },
  { id: "a7", severity: "info", message: "Two audiences reached 80% saturation" },
];

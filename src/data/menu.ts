import { 
  LayoutDashboard,
  Users,
  Briefcase,
  Image,
  Workflow,
  FileText,
  Settings,
  Shield,
  CreditCard,
  KeyRound,
  Link,
  Activity
} from "lucide-react";
import { IconType } from "react-icons";

export type MenuItem = {
  children?: MenuItem[]; 
  label: string;
  path: string;
  icon?: IconType;        
  roles?: string[];        
};

const sidebarMenu: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: ["Admin", "MarketingManager", "SalesRep", "DataAnalyst", "BusinessOwner", "Executive", "Client"],
  },
  {
    label: "Campaigns",
    path: "/campaigns",
    icon: Briefcase,
    roles: ["Admin", "MarketingManager", "SalesRep", "ContentCreator", "Client"],
  },
  {
    label: "Ad Accounts",
    path: "/ad-accounts",
    icon: Link,
    roles: ["Admin", "DataEngineer", "MarketingManager"],
  },
  {
    label: "Leads",
    path: "/leads",
    icon: Users,
    roles: ["Admin", "SalesRep", "MarketingManager"],
  },
  {
    label: "Reports",
    path: "/reports",
    icon: FileText,
    roles: ["Admin", "MarketingManager", "DataAnalyst", "Executive", "BusinessOwner", "Client"],
  },
  {
    label: "Automation",
    path: "/automation/rules",
    icon: Workflow,
    roles: ["Admin", "MarketingManager", "DataEngineer"],
  },
  {
    label: "Assets",
    path: "/assets",
    icon: Image,
    roles: ["Admin", "ContentCreator", "MarketingManager"],
  },
  {
    label: "Users",
    path: "/users",
    icon: Users,
    roles: ["Admin"],
  },
];

export default sidebarMenu;

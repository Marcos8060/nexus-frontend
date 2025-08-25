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
  },
  
];

export default sidebarMenu;

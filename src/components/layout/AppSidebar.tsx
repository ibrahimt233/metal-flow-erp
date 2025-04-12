
import { Link, useLocation } from "react-router-dom";
import { 
  CreditCard, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Truck, 
  Users,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type SidebarItemProps = {
  title: string;
  url: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  isActive: boolean;
};

const SidebarItem = ({ title, url, icon: Icon, isActive }: SidebarItemProps) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link
          to={url}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2",
            isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50"
          )}
        >
          <Icon className="h-5 w-5" />
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export function AppSidebar() {
  const location = useLocation();
  
  // Define main navigation items
  const mainItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Purchase",
      url: "/purchase",
      icon: ShoppingCart,
    },
    {
      title: "Production",
      url: "/production",
      icon: Package,
    },
    {
      title: "Products",
      url: "/products",
      icon: CreditCard,
    },
    {
      title: "Sales",
      url: "/sales",
      icon: Truck,
    },
  ];

  // Define secondary navigation items
  const secondaryItems = [
    {
      title: "Customers",
      url: "/customers",
      icon: Users,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border/30 p-6">
        <div className="flex items-center gap-2 text-sidebar-foreground">
          <Package className="h-6 w-6" />
          <span className="text-xl font-bold">MetalFlow</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarItem
                  key={item.title}
                  title={item.title}
                  url={item.url}
                  icon={item.icon}
                  isActive={location.pathname === item.url}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="pt-6">
          <SidebarGroupLabel>Other</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarItem
                  key={item.title}
                  title={item.title}
                  url={item.url}
                  icon={item.icon}
                  isActive={location.pathname === item.url}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

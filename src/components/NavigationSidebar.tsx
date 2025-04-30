
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  ListTodo, 
  Timer, 
  Images, 
  LogOut, 
  MenuIcon,
  PanelLeft
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NavigationLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface NavigationSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  activeTaskId?: string | null;
}

const NavigationSidebar = ({ currentPage, onNavigate, onLogout, activeTaskId }: NavigationSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  
  const links: NavigationLink[] = [
    { name: "Dashboard", href: "dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Tasks", href: "tasks", icon: <ListTodo size={20} /> },
    { name: "Active Task", href: "active-task", icon: <Timer size={20} /> },
    { name: "Screenshots", href: "screenshots", icon: <Images size={20} /> },
  ];
  
  return (
    <div className={cn(
      "bg-sidebar flex flex-col h-screen transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && <h1 className="text-sidebar-foreground font-bold">Task Manager</h1>}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-sidebar-foreground" 
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <MenuIcon size={20} /> : <PanelLeft size={20} />}
        </Button>
      </div>
      
      <div className="flex flex-col flex-1 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <Button
            key={link.href}
            variant="ghost"
            className={cn(
              "justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
              currentPage === link.href && "bg-sidebar-accent text-sidebar-primary"
            )}
            onClick={() => onNavigate(link.href)}
          >
            <span className="mr-3 relative">
              {link.icon}
              {link.href === "active-task" && activeTaskId && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </span>
            {!collapsed && (
              <div className="flex justify-between items-center w-full">
                <span>{link.name}</span>
                {link.href === "active-task" && activeTaskId && (
                  <Badge variant="destructive" className="ml-auto">Active</Badge>
                )}
              </div>
            )}
          </Button>
        ))}
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
          onClick={onLogout}
        >
          <span className="mr-3"><LogOut size={20} /></span>
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default NavigationSidebar;

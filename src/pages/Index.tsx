
import { useState } from "react";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Tasks from "@/pages/Tasks";
import ActiveTask from "@/pages/ActiveTask";
import Screenshots from "@/pages/Screenshots";
import NavigationSidebar from "@/components/NavigationSidebar";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const { toast } = useToast();
  
  const handleLogin = (email: string, password: string) => {
    // In a real app, this would make an API call
    setIsAuthenticated(true);
    toast({
      title: "Login Successful",
      description: "Welcome to Task Manager",
    });
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };
  
  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "tasks":
        return <Tasks />;
      case "active-task":
        return <ActiveTask />;
      case "screenshots":
        return <Screenshots />;
      default:
        return <Dashboard />;
    }
  };
  
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }
  
  return (
    <div className="flex h-screen overflow-hidden">
      <NavigationSidebar 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
      <div className="flex-1 overflow-y-auto p-6">
        {renderPage()}
      </div>
    </div>
  );
};

export default Index;

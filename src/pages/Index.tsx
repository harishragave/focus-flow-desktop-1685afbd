
import { useState, useEffect } from "react";
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
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Check if there's an active task on mount
  useEffect(() => {
    const savedActiveTaskId = localStorage.getItem('activeTaskId');
    if (savedActiveTaskId) {
      setActiveTaskId(savedActiveTaskId);
    }
  }, []);
  
  // Watch for changes to active task in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const savedActiveTaskId = localStorage.getItem('activeTaskId');
      setActiveTaskId(savedActiveTaskId);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event listener for local changes
    const checkLocalStorage = setInterval(() => {
      const currentActiveTaskId = localStorage.getItem('activeTaskId');
      if (currentActiveTaskId !== activeTaskId) {
        setActiveTaskId(currentActiveTaskId);
      }
    }, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(checkLocalStorage);
    };
  }, [activeTaskId]);
  
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
  
  // If there's an active task and we're not on the active-task page, show a toast
  useEffect(() => {
    if (activeTaskId && currentPage !== "active-task") {
      toast({
        title: "Task in Progress",
        description: "You have an active task running",
        action: (
          <button 
            onClick={() => setCurrentPage("active-task")}
            className="bg-primary text-white px-3 py-1 rounded text-xs"
          >
            View
          </button>
        ),
      });
    }
  }, [activeTaskId, currentPage, toast]);
  
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }
  
  return (
    <div className="flex h-screen overflow-hidden">
      <NavigationSidebar 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        activeTaskId={activeTaskId}
      />
      <div className="flex-1 overflow-y-auto p-6">
        {renderPage()}
      </div>
    </div>
  );
};

export default Index;

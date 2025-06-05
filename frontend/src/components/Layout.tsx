import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import BottomNavigation from "./BottomNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "./ThemeToggle";
import WhatsAppBanner from "./WhatsAppBanner";
import { Menu, Home, Search, Calendar, User, LogOut, Briefcase, LogIn, UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUser } from "@/contexts/UserContext";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Notifications } from "@/components/ui/notifications";

const Layout = () => {
  const isMobile = useIsMobile();
  const { userRole, isAuthenticated, setUserRole, setIsAuthenticated } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    setUserRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAuthenticated");
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
    
    navigate("/onboarding");
  };

  const getUserTypeColor = () => {
    if (userRole === "provider") return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200";
    if (userRole === "customer") return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    return "";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground dark-transition">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border p-4 flex justify-between items-center dark-transition">
        <div className="flex items-center space-x-4">
          {!isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] sm:w-[300px]">
                <div className="py-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Connectify</h2>
                    {userRole && (
                      <Badge variant="outline" className={getUserTypeColor()}>
                        {userRole === "provider" ? "Provider" : "Customer"}
                      </Badge>
                    )}
                  </div>
                  <nav className="flex flex-col space-y-3">
                    {userRole === "provider" ? (
                      // Provider navigation for desktop
                      <>
                        <Link to="/provider-dashboard" className="flex items-center py-2 text-sm hover:text-connectify-blue">
                          <Home className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                        <Link to="/provider-jobs" className="flex items-center py-2 text-sm hover:text-connectify-blue">
                          <Briefcase className="h-4 w-4 mr-2" />
                          Jobs
                        </Link>
                        <Link to="/provider-analytics" className="flex items-center py-2 text-sm hover:text-connectify-blue">
                          <Calendar className="h-4 w-4 mr-2" />
                          Analytics
                        </Link>
                        <Link to="/provider-profile" className="flex items-center py-2 text-sm hover:text-connectify-blue">
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                      </>
                    ) : (
                      // Customer navigation for desktop
                      <>
                        <Link to="/" className="flex items-center py-2 text-sm hover:text-connectify-blue">
                          <Home className="h-4 w-4 mr-2" />
                          Home
                        </Link>
                        <Link to="/search" className="flex items-center py-2 text-sm hover:text-connectify-blue">
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </Link>
                        <Link to="/bookings" className="flex items-center py-2 text-sm hover:text-connectify-blue">
                          <Calendar className="h-4 w-4 mr-2" />
                          Bookings
                        </Link>
                        <Link to="/profile" className="flex items-center py-2 text-sm hover:text-connectify-blue">
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                      </>
                    )}
                    
                    {isAuthenticated ? (
                      <button 
                        onClick={handleLogout}
                        className="flex items-center py-2 text-sm text-red-500 hover:text-red-700"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    ) : (
                      <>
                        <Link to="/login" className="flex items-center py-2 text-sm hover:text-connectify-blue">
                          <LogIn className="h-4 w-4 mr-2" />
                          Login
                        </Link>
                        <Link to="/signup" className="flex items-center py-2 text-sm hover:text-connectify-blue">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Sign Up
                        </Link>
                      </>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          )}
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-bold text-connectify-blue">
              Connectify
            </h1>
          </Link>
          
          {userRole && (
            <Badge variant="outline" className={`${getUserTypeColor()} hidden sm:inline-flex`}>
              {userRole === "provider" ? "Provider" : "Customer"}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {isAuthenticated && <Notifications />}
          {!isAuthenticated ? (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/login")}
                className="hidden sm:flex"
              >
                <LogIn className="mr-1 h-4 w-4" />
                Login
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/signup")}
                className="bg-connectify-blue hover:bg-connectify-darkBlue"
              >
                <UserPlus className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Sign Up</span>
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 hidden sm:flex"
            >
              <LogOut className="mr-1 h-4 w-4" />
              Logout
            </Button>
          )}
          <ThemeToggle />
        </div>
      </header>
      
      <main className="flex-1 container p-4 pb-24 md:pb-6 dark-transition animate-fade-in">
        {userRole === "customer" && <WhatsAppBanner />}
        <Outlet />
      </main>
      
      {isMobile && <BottomNavigation />}
    </div>
  );
};

export default Layout;

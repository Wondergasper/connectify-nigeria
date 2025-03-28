
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, Home, Wrench, LogOut, CreditCard, Bell, ChevronRight, UserCog, BadgeHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userRole, setUserRole, setIsAuthenticated } = useUser();
  const [notifications, setNotifications] = useState(true);
  
  // Mock user profile data
  const user = {
    name: "Chidi Okonkwo",
    email: "chidi.okonkwo@example.com",
    phone: "+234 XXX XXX XXXX",
    location: "Lagos, Nigeria",
  };

  const handleLogout = () => {
    setUserRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAuthenticated");
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
    
    navigate("/select-user-type");
  };

  const handleBecomeProvider = () => {
    navigate("/provider-registration");
  };

  const handleSwitchToCustomer = () => {
    setUserRole("customer");
    toast({
      title: "Account Switched",
      description: "You are now browsing as a customer.",
    });
    navigate("/");
  };

  const handleToggleNotifications = () => {
    setNotifications(!notifications);
    toast({
      title: `Notifications ${!notifications ? "Enabled" : "Disabled"}`,
      description: `You have ${!notifications ? "enabled" : "disabled"} notifications.`
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="w-20 h-20 bg-connectify-blue rounded-full flex items-center justify-center text-white">
            <User className="h-10 w-10" />
          </div>
          
          <div className="ml-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-connectify-darkGray dark:text-white">{user.name}</h1>
              {userRole && (
                <Badge className={`ml-2 ${userRole === "provider" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"}`}>
                  {userRole === "provider" ? "Provider" : "Customer"}
                </Badge>
              )}
            </div>
            <p className="text-connectify-mediumGray dark:text-gray-300">{user.email}</p>
          </div>
        </div>
        
        {userRole === "customer" && (
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-connectify-darkBlue dark:text-blue-300 mb-2">Are you a service provider?</p>
            <Button 
              onClick={handleBecomeProvider}
              className="bg-connectify-blue hover:bg-connectify-darkBlue"
            >
              Become a Provider
            </Button>
          </div>
        )}

        {userRole === "provider" && (
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-connectify-darkBlue dark:text-blue-300 mb-2">Want to browse as a customer?</p>
            <Button 
              onClick={handleSwitchToCustomer}
              variant="outline"
              className="border-connectify-blue text-connectify-blue hover:bg-connectify-blue/10"
            >
              Switch to Customer View
            </Button>
          </div>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-connectify-darkGray dark:text-white mb-2">Personal Information</h2>
        </div>
        
        <Separator />
        
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <User className="h-5 w-5 text-connectify-mediumGray dark:text-gray-400 mr-3" />
              <div>
                <p className="font-medium dark:text-white">Full Name</p>
                <p className="text-sm text-connectify-mediumGray dark:text-gray-400">{user.name}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-connectify-mediumGray dark:text-gray-400" />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Home className="h-5 w-5 text-connectify-mediumGray dark:text-gray-400 mr-3" />
              <div>
                <p className="font-medium dark:text-white">Location</p>
                <p className="text-sm text-connectify-mediumGray dark:text-gray-400">{user.location}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-connectify-mediumGray dark:text-gray-400" />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-connectify-mediumGray dark:text-gray-400 mr-3" />
              <div>
                <p className="font-medium dark:text-white">Payment Methods</p>
                <p className="text-sm text-connectify-mediumGray dark:text-gray-400">Manage your payment options</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-connectify-mediumGray dark:text-gray-400" />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-connectify-darkGray dark:text-white mb-2">Settings</h2>
        </div>
        
        <Separator />
        
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-connectify-mediumGray dark:text-gray-400 mr-3" />
              <p className="font-medium dark:text-white">Notifications</p>
            </div>
            <Switch 
              checked={notifications} 
              onCheckedChange={handleToggleNotifications} 
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Settings className="h-5 w-5 text-connectify-mediumGray dark:text-gray-400 mr-3" />
              <p className="font-medium dark:text-white">App Settings</p>
            </div>
            <ChevronRight className="h-5 w-5 text-connectify-mediumGray dark:text-gray-400" />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Wrench className="h-5 w-5 text-connectify-mediumGray dark:text-gray-400 mr-3" />
              <p className="font-medium dark:text-white">App Support</p>
            </div>
            <ChevronRight className="h-5 w-5 text-connectify-mediumGray dark:text-gray-400" />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <BadgeHelp className="h-5 w-5 text-connectify-mediumGray dark:text-gray-400 mr-3" />
              <p className="font-medium dark:text-white">Help Center</p>
            </div>
            <ChevronRight className="h-5 w-5 text-connectify-mediumGray dark:text-gray-400" />
          </div>
          
          {userRole === "provider" && (
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <UserCog className="h-5 w-5 text-connectify-mediumGray dark:text-gray-400 mr-3" />
                <p className="font-medium dark:text-white">Provider Settings</p>
              </div>
              <ChevronRight className="h-5 w-5 text-connectify-mediumGray dark:text-gray-400" />
            </div>
          )}
        </div>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5 mr-2" />
        Logout
      </Button>
    </div>
  );
};

export default Profile;

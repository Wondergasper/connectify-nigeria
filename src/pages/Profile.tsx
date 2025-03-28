
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, Home, Wrench, LogOut, CreditCard, Bell, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);
  
  // Mock user profile data
  const user = {
    name: "Chidi Okonkwo",
    email: "chidi.okonkwo@example.com",
    phone: "+234 XXX XXX XXXX",
    location: "Lagos, Nigeria",
    isProvider: false
  };

  const handleLogout = () => {
    // Simulate logout
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
    navigate("/");
  };

  const handleBecomeProvider = () => {
    navigate("/provider-registration");
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
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="w-20 h-20 bg-connectify-blue rounded-full flex items-center justify-center text-white">
            <User className="h-10 w-10" />
          </div>
          
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-connectify-darkGray">{user.name}</h1>
            <p className="text-connectify-mediumGray">{user.email}</p>
          </div>
        </div>
        
        {!user.isProvider && (
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <p className="text-connectify-darkBlue mb-2">Are you a service provider?</p>
            <Button 
              onClick={handleBecomeProvider}
              className="bg-connectify-blue hover:bg-connectify-darkBlue"
            >
              Become a Provider
            </Button>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-connectify-darkGray mb-2">Personal Information</h2>
        </div>
        
        <Separator />
        
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <User className="h-5 w-5 text-connectify-mediumGray mr-3" />
              <div>
                <p className="font-medium">Full Name</p>
                <p className="text-sm text-connectify-mediumGray">{user.name}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-connectify-mediumGray" />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Home className="h-5 w-5 text-connectify-mediumGray mr-3" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-connectify-mediumGray">{user.location}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-connectify-mediumGray" />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-connectify-mediumGray mr-3" />
              <div>
                <p className="font-medium">Payment Methods</p>
                <p className="text-sm text-connectify-mediumGray">Manage your payment options</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-connectify-mediumGray" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-connectify-darkGray mb-2">Settings</h2>
        </div>
        
        <Separator />
        
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-connectify-mediumGray mr-3" />
              <p className="font-medium">Notifications</p>
            </div>
            <Switch 
              checked={notifications} 
              onCheckedChange={handleToggleNotifications} 
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Settings className="h-5 w-5 text-connectify-mediumGray mr-3" />
              <p className="font-medium">App Settings</p>
            </div>
            <ChevronRight className="h-5 w-5 text-connectify-mediumGray" />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Wrench className="h-5 w-5 text-connectify-mediumGray mr-3" />
              <p className="font-medium">App Support</p>
            </div>
            <ChevronRight className="h-5 w-5 text-connectify-mediumGray" />
          </div>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full text-red-500 border-red-500 hover:bg-red-50"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5 mr-2" />
        Logout
      </Button>
    </div>
  );
};

export default Profile;

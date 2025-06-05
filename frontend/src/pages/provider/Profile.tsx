import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Plus, Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import Loading from "@/components/Loading";
import { service } from "@/services/serviceFactory";

interface ProviderProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  services: string[];
  rating: number;
  completedJobs: number;
}

const ProviderProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    services: [] as string[]
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await service.getProfile();
      setProfile(data);
      
      // Initialize form with profile data
      setProfileForm({
        name: data.name,
        phone: data.phone,
        services: data.services
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServicesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setProfileForm(prev => ({
      ...prev,
      services: checked 
        ? [...prev.services, value]
        : prev.services.filter(service => service !== value)
    }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    
    try {
      await service.updateProfile(profileForm);
      
      // Refresh profile data
      await fetchProfile();
      
      toast({
        title: "Profile Updated",
        description: "Your provider profile has been updated successfully."
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return <Loading />;
  }

  const availableServices = [
    "Plumbing",
    "Electrical",
    "HVAC",
    "Carpentry",
    "Painting",
    "Cleaning",
    "Gardening",
    "Moving"
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          className="pl-0 mr-4" 
          onClick={() => navigate("/provider/dashboard")}
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Dashboard
        </Button>
        <h1 className="text-2xl font-bold text-connectify-darkGray">Profile Management</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 relative">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random`}
                  alt={profile.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 right-0 bg-connectify-blue text-white rounded-full p-2">
                  <Camera className="h-4 w-4" />
                </div>
              </div>
              <Button variant="link" className="mt-2 text-sm">
                Change Photo
              </Button>
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-4">{profile.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Rating</Label>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold">{profile.rating.toFixed(1)}</span>
                    <span className="text-connectify-mediumGray ml-2">({profile.completedJobs} jobs)</span>
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <Input 
                    value={profile.email}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                />
              </div>
              
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                  />
              </div>
              
              <div>
            <Label>Services Offered</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              {availableServices.map(service => (
                <div key={service} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={service}
                    value={service}
                    checked={profileForm.services.includes(service)}
                    onChange={handleServicesChange}
                    className="rounded border-gray-300 text-connectify-blue focus:ring-connectify-blue"
                  />
                  <Label htmlFor={service} className="text-sm">{service}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSaveProfile}
              disabled={saving}
              className="bg-connectify-blue hover:bg-connectify-darkBlue"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;

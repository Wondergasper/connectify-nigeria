
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Plus, Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Mock provider data
const mockProvider = {
  id: "1",
  name: "John Okafor",
  photo: "https://randomuser.me/api/portraits/men/1.jpg",
  email: "john.okafor@example.com",
  phone: "+234 XXX XXX XXXX",
  location: "Lagos, Nigeria",
  category: "Plumbing",
  bio: "Professional plumber with over 10 years of experience. Specializing in residential and commercial plumbing services including repairs, installations, and maintenance.",
  baseRate: "₦2,500/hr",
  services: [
    "Pipe Installation and Repair",
    "Drain Cleaning",
    "Fixture Installation",
    "Water Heater Service",
    "Leak Detection and Repair"
  ],
  availability: [
    { day: "Monday", available: true, hours: "9AM - 5PM" },
    { day: "Tuesday", available: true, hours: "9AM - 5PM" },
    { day: "Wednesday", available: true, hours: "9AM - 5PM" },
    { day: "Thursday", available: true, hours: "9AM - 5PM" },
    { day: "Friday", available: true, hours: "9AM - 5PM" },
    { day: "Saturday", available: true, hours: "10AM - 2PM" },
    { day: "Sunday", available: false, hours: "" }
  ],
  reviews: [
    { id: 1, user: "Chioma A.", rating: 5, comment: "Excellent service! Fixed my sink very quickly and professionally.", date: "2023-10-15" },
    { id: 2, user: "Emmanuel O.", rating: 4, comment: "Good work on the bathroom pipes. Slightly pricey but worth it.", date: "2023-09-22" },
    { id: 3, user: "Blessing E.", rating: 5, comment: "Very knowledgeable and efficient. Will hire again!", date: "2023-08-05" }
  ]
};

const ProviderProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [provider, setProvider] = useState(mockProvider);
  const [profileForm, setProfileForm] = useState({
    name: provider.name,
    email: provider.email,
    phone: provider.phone,
    location: provider.location,
    category: provider.category,
    bio: provider.bio,
    baseRate: provider.baseRate.replace("/hr", "")
  });
  const [serviceForm, setServiceForm] = useState({
    services: [...provider.services],
    newService: ""
  });
  const [availabilityForm, setAvailabilityForm] = useState({
    availability: [...provider.availability]
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddService = () => {
    if (serviceForm.newService.trim()) {
      setServiceForm(prev => ({
        services: [...prev.services, prev.newService],
        newService: ""
      }));
    }
  };

  const handleRemoveService = (index: number) => {
    setServiceForm(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const handleAvailabilityChange = (index: number, field: string, value: any) => {
    setAvailabilityForm(prev => {
      const newAvailability = [...prev.availability];
      newAvailability[index] = {
        ...newAvailability[index],
        [field]: value
      };
      return { availability: newAvailability };
    });
  };

  const handleSaveProfile = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      
      // Update the provider state with form values
      setProvider(prev => ({
        ...prev,
        ...profileForm,
        baseRate: `${profileForm.baseRate}/hr`,
        services: serviceForm.services,
        availability: availabilityForm.availability
      }));
      
      toast({
        title: "Profile Updated",
        description: "Your provider profile has been updated successfully."
      });
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          className="pl-0 mr-4" 
          onClick={() => navigate("/provider-dashboard")}
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
                  src={provider.photo} 
                  alt={provider.name} 
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
              <h2 className="text-xl font-semibold mb-4">{provider.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Service Category</Label>
                  <Input 
                    id="category"
                    value={provider.category}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="baseRate">Base Rate</Label>
                  <Input 
                    id="baseRate"
                    value={provider.baseRate}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="personal-info">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal-info" className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    name="email"
                    value={profileForm.email}
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
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location"
                  name="location"
                  value={profileForm.location}
                  onChange={handleProfileChange}
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Service Category</Label>
                <select 
                  id="category"
                  name="category"
                  value={profileForm.category}
                  onChange={handleProfileChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Plumbing">Plumbing</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Tailoring">Tailoring</option>
                  <option value="Mechanics">Mechanics</option>
                  <option value="Carpentry">Carpentry</option>
                  <option value="Web Design">Web Design</option>
                  <option value="Catering">Catering</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="IT Support">IT Support</option>
                  <option value="Tutoring">Tutoring</option>
                  <option value="Security">Security</option>
                  <option value="Delivery">Delivery</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="bio">Bio / Description</Label>
                <Textarea 
                  id="bio"
                  name="bio"
                  value={profileForm.bio}
                  onChange={handleProfileChange}
                  className="h-32 resize-none"
                />
              </div>
              
              <div>
                <Label htmlFor="baseRate">Base Rate (₦)</Label>
                <div className="flex">
                  <Input 
                    id="baseRate"
                    name="baseRate"
                    value={profileForm.baseRate}
                    onChange={handleProfileChange}
                  />
                  <span className="ml-2 flex items-center">/hr</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              className="bg-connectify-blue hover:bg-connectify-darkBlue"
              onClick={handleSaveProfile}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="services" className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Services Offered</h3>
            
            <div className="space-y-6">
              <div className="flex">
                <Input 
                  value={serviceForm.newService}
                  onChange={e => setServiceForm(prev => ({ ...prev, newService: e.target.value }))}
                  placeholder="Add a new service..."
                  className="mr-2"
                />
                <Button 
                  onClick={handleAddService}
                  disabled={!serviceForm.newService.trim()}
                  className="bg-connectify-blue hover:bg-connectify-darkBlue"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              
              <div className="space-y-2">
                {serviceForm.services.map((service, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <span>{service}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 h-8 px-2"
                      onClick={() => handleRemoveService(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              className="bg-connectify-blue hover:bg-connectify-darkBlue"
              onClick={handleSaveProfile}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="availability" className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Availability</h3>
            
            <div className="space-y-4">
              {availabilityForm.availability.map((day, index) => (
                <div key={index} className="flex flex-col md:flex-row md:items-center md:space-x-4 p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center mb-2 md:mb-0">
                    <Calendar className="h-5 w-5 text-connectify-mediumGray mr-2" />
                    <span className="font-medium w-24">{day.day}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2 md:mb-0">
                    <Button 
                      type="button" 
                      variant={day.available ? "default" : "outline"} 
                      size="sm"
                      className={day.available ? "bg-green-600 hover:bg-green-700" : ""}
                      onClick={() => handleAvailabilityChange(index, 'available', true)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Available
                    </Button>
                    <Button 
                      type="button" 
                      variant={!day.available ? "default" : "outline"} 
                      size="sm"
                      className={!day.available ? "bg-red-600 hover:bg-red-700" : ""}
                      onClick={() => handleAvailabilityChange(index, 'available', false)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Unavailable
                    </Button>
                  </div>
                  
                  {day.available && (
                    <div className="flex items-center flex-1">
                      <Clock className="h-5 w-5 text-connectify-mediumGray mr-2" />
                      <Input 
                        value={day.hours}
                        onChange={e => handleAvailabilityChange(index, 'hours', e.target.value)}
                        placeholder="e.g. 9AM - 5PM"
                        className="max-w-xs"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              className="bg-connectify-blue hover:bg-connectify-darkBlue"
              onClick={handleSaveProfile}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProviderProfile;

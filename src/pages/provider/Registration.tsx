
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Plus, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const ProviderRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    serviceCategory: "",
    bio: "",
    baseRate: "",
    availableDays: [] as string[],
    profilePhoto: null as File | null,
    certifications: [] as File[]
  });

  const serviceCategories = [
    "Plumbing",
    "Cleaning",
    "Tailoring",
    "Mechanics",
    "Carpentry",
    "Web Design",
    "Catering",
    "Healthcare",
    "IT Support",
    "Tutoring",
    "Security",
    "Delivery"
  ];

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvailabilityChange = (day: string) => {
    setFormData(prev => {
      const newDays = prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day];
      
      return {
        ...prev,
        availableDays: newDays
      };
    });
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        profilePhoto: e.target.files![0]
      }));
    }
  };

  const handleCertificationUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, e.target.files![0]]
      }));
    }
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setFormSubmitting(false);
      toast({
        title: "Registration Successful",
        description: "Your provider account has been created. You can now start managing your services."
      });
      navigate("/provider-dashboard");
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Button 
        variant="ghost" 
        className="mb-4 pl-0" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-5 w-5 mr-1" />
        Back
      </Button>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-connectify-darkGray mb-6">Become a Service Provider</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-connectify-darkGray">Personal Information</h2>
            
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234 XXX XXX XXXX"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, State"
                required
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-connectify-darkGray">Service Information</h2>
            
            <div>
              <Label htmlFor="serviceCategory">Service Category</Label>
              <select 
                id="serviceCategory"
                name="serviceCategory"
                value={formData.serviceCategory}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select a category</option>
                {serviceCategories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="bio">Bio / Description</Label>
              <Textarea 
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about your experience, skills, and services you offer..."
                className="h-32 resize-none"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="baseRate">Base Rate (₦)</Label>
              <Input 
                id="baseRate"
                name="baseRate"
                value={formData.baseRate}
                onChange={handleChange}
                placeholder="Hourly or per service rate"
                required
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-connectify-darkGray">Availability</h2>
            
            <div>
              <Label className="mb-2 block">Available Days</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {daysOfWeek.map((day, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id={`day-${day}`}
                      checked={formData.availableDays.includes(day)}
                      onChange={() => handleAvailabilityChange(day)}
                      className="rounded border-gray-300 text-connectify-blue focus:ring-connectify-blue"
                    />
                    <Label htmlFor={`day-${day}`}>{day}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-connectify-darkGray">Profile & Documents</h2>
            
            <div>
              <Label className="mb-2 block">Profile Photo</Label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                  {formData.profilePhoto ? (
                    <img 
                      src={URL.createObjectURL(formData.profilePhoto)} 
                      alt="Profile Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="h-8 w-8 text-connectify-mediumGray" />
                  )}
                </div>
                <Label 
                  htmlFor="profilePhoto" 
                  className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                  <input 
                    id="profilePhoto"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhotoChange}
                    className="hidden"
                  />
                </Label>
              </div>
            </div>
            
            <div>
              <Label className="mb-2 block">Certifications & Documents</Label>
              <div className="space-y-2">
                {formData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <span className="text-sm truncate max-w-xs">{cert.name}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeCertification(index)}
                      className="text-red-500 h-8 px-2"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                
                <Label 
                  htmlFor="certification" 
                  className="cursor-pointer border border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100"
                >
                  <Plus className="h-6 w-6 text-connectify-blue mb-2" />
                  <span className="text-sm font-medium">Add Certification or Document</span>
                  <span className="text-xs text-connectify-mediumGray mt-1">PDF, JPG, or PNG up to 5MB</span>
                  <input 
                    id="certification"
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleCertificationUpload}
                    className="hidden"
                  />
                </Label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="mr-2"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-connectify-blue hover:bg-connectify-darkBlue"
              disabled={formSubmitting}
            >
              {formSubmitting ? "Submitting..." : "Register as Provider"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProviderRegistration;


import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Calendar, Clock, Phone, MessageCircle, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/Loading";

// Mock provider data
const mockProvider = {
  id: "1",
  name: "John Okafor",
  photo: "https://randomuser.me/api/portraits/men/1.jpg",
  rating: 4.8,
  price: "₦2,500/hr",
  category: "Plumbing",
  location: "Lagos",
  bio: "Professional plumber with over 10 years of experience. Specializing in residential and commercial plumbing services including repairs, installations, and maintenance.",
  services: [
    "Pipe Installation and Repair",
    "Drain Cleaning",
    "Fixture Installation",
    "Water Heater Service",
    "Leak Detection and Repair"
  ],
  availability: [
    { day: "Monday", hours: "9AM - 5PM" },
    { day: "Tuesday", hours: "9AM - 5PM" },
    { day: "Wednesday", hours: "9AM - 5PM" },
    { day: "Thursday", hours: "9AM - 5PM" },
    { day: "Friday", hours: "9AM - 5PM" },
    { day: "Saturday", hours: "10AM - 2PM" },
    { day: "Sunday", hours: "Closed" }
  ],
  reviews: [
    { id: 1, user: "Chioma A.", rating: 5, comment: "Excellent service! Fixed my sink very quickly and professionally.", date: "2023-10-15" },
    { id: 2, user: "Emmanuel O.", rating: 4, comment: "Good work on the bathroom pipes. Slightly pricey but worth it.", date: "2023-09-22" },
    { id: 3, user: "Blessing E.", rating: 5, comment: "Very knowledgeable and efficient. Will hire again!", date: "2023-08-05" }
  ]
};

const ProviderProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    service: "",
    date: "",
    time: "",
    location: "",
    notes: ""
  });

  useEffect(() => {
    // Simulate API call to fetch provider data
    const timer = setTimeout(() => {
      setProvider(mockProvider);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id]);

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call to book service
    setBookingDialogOpen(false);
    toast({
      title: "Booking Successful",
      description: "Your booking request has been sent to the provider.",
    });
    navigate("/bookings");
  };

  if (loading) {
    return <Loading />;
  }

  if (!provider) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-connectify-darkGray">Provider not found</p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

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
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <img 
            src={provider.photo} 
            alt={provider.name} 
            className="w-24 h-24 rounded-full object-cover"
          />
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-connectify-darkGray">{provider.name}</h1>
            <p className="text-connectify-mediumGray">{provider.category}</p>
            
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="ml-1 font-medium">{provider.rating}</span>
              </div>
              <span className="mx-2 text-connectify-mediumGray">•</span>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-connectify-mediumGray" />
                <span className="ml-1">{provider.location}</span>
              </div>
              <span className="mx-2 text-connectify-mediumGray">•</span>
              <span className="font-medium text-connectify-darkGray">{provider.price}</span>
            </div>
          </div>
          
          <Button 
            className="bg-connectify-blue hover:bg-connectify-darkBlue"
            onClick={() => setBookingDialogOpen(true)}
          >
            Book Now
          </Button>
        </div>
      </div>

      <Tabs defaultValue="about">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about" className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-connectify-darkGray">{provider.bio}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Availability</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {provider.availability.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-connectify-blue mr-2" />
                    <span className="font-medium">{item.day}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-connectify-mediumGray mr-2" />
                    <span>{item.hours}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Contact</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Phone className="h-5 w-5 mr-2 text-connectify-blue" />
                Call Provider
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
                Chat on WhatsApp
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="services" className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Services Offered</h2>
            <ul className="space-y-3">
              {provider.services.map((service: string, index: number) => (
                <li key={index} className="flex items-start">
                  <Briefcase className="h-5 w-5 text-connectify-blue mt-0.5 mr-2" />
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="reviews" className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Reviews</h2>
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="ml-1 font-medium">{provider.rating}/5</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {provider.reviews.map((review: any) => (
                <div key={review.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{review.user}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 text-sm">{review.rating}</span>
                    </div>
                  </div>
                  <p className="my-2 text-connectify-darkGray">{review.comment}</p>
                  <p className="text-xs text-connectify-mediumGray">{review.date}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book {provider.name}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Service Type</label>
              <select 
                name="service" 
                value={bookingForm.service} 
                onChange={handleBookingChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select a service</option>
                {provider.services.map((service: string, index: number) => (
                  <option key={index} value={service}>{service}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input 
                type="date" 
                name="date" 
                value={bookingForm.date} 
                onChange={handleBookingChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <input 
                type="time" 
                name="time" 
                value={bookingForm.time} 
                onChange={handleBookingChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input 
                type="text" 
                name="location" 
                value={bookingForm.location} 
                onChange={handleBookingChange}
                placeholder="Enter your address"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Additional Notes</label>
              <textarea 
                name="notes" 
                value={bookingForm.notes} 
                onChange={handleBookingChange}
                placeholder="Any special requirements or details..."
                className="w-full p-2 border rounded-md h-24 resize-none"
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setBookingDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-connectify-blue hover:bg-connectify-darkBlue">
                Submit Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProviderProfile;

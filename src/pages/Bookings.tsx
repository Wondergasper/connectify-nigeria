
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, User, MapPin, CheckCircle, XCircle, Clock3, ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";
import axios from "axios"

// Mock booking data
// const mockBookings = [
//   {
//     id: "1",
//     providerId: "1",
//     providerName: "John Okafor",
//     providerPhoto: "https://randomuser.me/api/portraits/men/1.jpg",
//     service: "Pipe Installation and Repair",
//     date: "2023-11-15",
//     time: "14:00",
//     location: "123 Lagos Street, Victoria Island",
//     status: "completed",
//     cost: "₦5,000",
//     isPaid: false
//   },
//   {
//     id: "2",
//     providerId: "2",
//     providerName: "Amina Ibrahim",
//     providerPhoto: "https://randomuser.me/api/portraits/women/2.jpg",
//     service: "Home Cleaning",
//     date: "2023-11-20",
//     time: "10:00",
//     location: "45 Abuja Road, Wuse Zone 4",
//     status: "pending",
//     cost: "₦8,000",
//     isPaid: false
//   },
//   {
//     id: "3",
//     providerId: "3",
//     providerName: "Emmanuel Nwachukwu",
//     providerPhoto: "https://randomuser.me/api/portraits/men/3.jpg",
//     service: "Furniture Assembly",
//     date: "2023-11-12",
//     time: "11:30",
//     location: "78 Port Harcourt Avenue",
//     status: "confirmed",
//     cost: "₦12,000",
//     isPaid: false
//   },
//   {
//     id: "4",
//     providerId: "4",
//     providerName: "Chioma Eze",
//     providerPhoto: "https://randomuser.me/api/portraits/women/4.jpg",
//     service: "Dress Tailoring",
//     date: "2023-10-30",
//     time: "15:00",
//     location: "34 Enugu Street",
//     status: "completed",
//     cost: "₦7,500",
//     isPaid: true
//   }
// ];

const Bookings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get("http://localhost:5000/api/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            status: "all",
          },
        });

        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch bookings. Please try again.");
        setLoading(false);
      }
    };

    fetchBookings();

    return () => {
      // Cleanup not needed for axios, but kept for consistency
    };
  }, []);
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock3 className="h-5 w-5 text-yellow-500" />;
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock3 className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "pending":
        return "Pending";
      case "confirmed":
        return "Confirmed";
      case "cancelled":
        return "Cancelled";
      default:
        return "Pending";
    }
  };

  const handlePayNow = (bookingId: string) => {
    navigate(`/payment/${bookingId}`);
  };

  const handleViewProvider = (providerId: string) => {
    navigate(`/provider/${providerId}`);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-connectify-darkGray">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4 bg-connectify-blue hover:bg-connectify-darkBlue"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-connectify-darkGray">Your Bookings</h1>
      
      <Tabs defaultValue="all">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-connectify-darkGray">You have no bookings yet.</p>
              <Button 
                onClick={() => navigate("/")} 
                className="mt-4 bg-connectify-blue hover:bg-connectify-darkBlue"
              >
                Find Services
              </Button>
            </div>
          ) : (
            bookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-start gap-4">
                  <img 
                    src={booking.providerPhoto} 
                    alt={booking.providerName} 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{booking.providerName}</h3>
                        <p className="text-connectify-darkGray">{booking.service}</p>
                      </div>
                      <div className="flex items-center">
                        {getStatusIcon(booking.status)}
                        <span className="ml-1 text-sm font-medium">
                          {getStatusText(booking.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-connectify-mediumGray mr-1" />
                        <span className="text-sm">{booking.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-connectify-mediumGray mr-1" />
                        <span className="text-sm">{booking.time}</span>
                      </div>
                      <div className="flex items-center col-span-2">
                        <MapPin className="h-4 w-4 text-connectify-mediumGray mr-1" />
                        <span className="text-sm truncate">{booking.location}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="font-semibold">{booking.cost}</div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewProvider(booking.providerId)}
                        >
                          View Provider
                        </Button>
                        
                        {booking.status === "completed" && !booking.isPaid && (
                          <Button 
                            size="sm" 
                            className="bg-connectify-blue hover:bg-connectify-darkBlue"
                            onClick={() => handlePayNow(booking.id)}
                          >
                            Pay Now
                          </Button>
                        )}
                        
                        {booking.status === "completed" && booking.isPaid && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-green-600 border-green-600"
                            disabled
                          >
                            Paid
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="upcoming" className="space-y-4">
          {bookings.filter(b => b.status === "pending" || b.status === "confirmed").length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-connectify-darkGray">You have no upcoming bookings.</p>
              <Button 
                onClick={() => navigate("/")} 
                className="mt-4 bg-connectify-blue hover:bg-connectify-darkBlue"
              >
                Find Services
              </Button>
            </div>
          ) : (
            bookings
              .filter(b => b.status === "pending" || b.status === "confirmed")
              .map(booking => (
                <div key={booking.id} className="bg-white rounded-lg shadow p-4">
                  {/* Same content as in the "all" tab */}
                  <div className="flex items-start gap-4">
                    <img 
                      src={booking.providerPhoto} 
                      alt={booking.providerName} 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{booking.providerName}</h3>
                          <p className="text-connectify-darkGray">{booking.service}</p>
                        </div>
                        <div className="flex items-center">
                          {getStatusIcon(booking.status)}
                          <span className="ml-1 text-sm font-medium">
                            {getStatusText(booking.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-connectify-mediumGray mr-1" />
                          <span className="text-sm">{booking.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-connectify-mediumGray mr-1" />
                          <span className="text-sm">{booking.time}</span>
                        </div>
                        <div className="flex items-center col-span-2">
                          <MapPin className="h-4 w-4 text-connectify-mediumGray mr-1" />
                          <span className="text-sm truncate">{booking.location}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-between items-center">
                        <div className="font-semibold">{booking.cost}</div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewProvider(booking.providerId)}
                        >
                          View Provider
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {bookings.filter(b => b.status === "completed").length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-connectify-darkGray">You have no completed bookings.</p>
            </div>
          ) : (
            bookings
              .filter(b => b.status === "completed")
              .map(booking => (
                <div key={booking.id} className="bg-white rounded-lg shadow p-4">
                  {/* Same content as in the "all" tab */}
                  <div className="flex items-start gap-4">
                    <img 
                      src={booking.providerPhoto} 
                      alt={booking.providerName} 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{booking.providerName}</h3>
                          <p className="text-connectify-darkGray">{booking.service}</p>
                        </div>
                        <div className="flex items-center">
                          {getStatusIcon(booking.status)}
                          <span className="ml-1 text-sm font-medium">
                            {getStatusText(booking.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-connectify-mediumGray mr-1" />
                          <span className="text-sm">{booking.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-connectify-mediumGray mr-1" />
                          <span className="text-sm">{booking.time}</span>
                        </div>
                        <div className="flex items-center col-span-2">
                          <MapPin className="h-4 w-4 text-connectify-mediumGray mr-1" />
                          <span className="text-sm truncate">{booking.location}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-between items-center">
                        <div className="font-semibold">{booking.cost}</div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewProvider(booking.providerId)}
                          >
                            View Provider
                          </Button>
                          
                          {!booking.isPaid && (
                            <Button 
                              size="sm" 
                              className="bg-connectify-blue hover:bg-connectify-darkBlue"
                              onClick={() => handlePayNow(booking.id)}
                            >
                              Pay Now
                            </Button>
                          )}
                          
                          {booking.isPaid && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-green-600 border-green-600"
                              disabled
                            >
                              Paid
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Bookings;


import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { 
  Users, Briefcase, Calendar, Star, 
  ArrowUp, ArrowDown, DollarSign, BarChart3 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loading from "@/components/Loading";

// Mock provider data
const mockProviderData = {
  name: "John Okafor",
  category: "Plumbing",
  stats: {
    newRequests: 3,
    activeJobs: 2,
    completedJobs: 15,
    totalEarnings: "₦75,000",
    averageRating: 4.8
  },
  recentJobs: [
    {
      id: "job1",
      customer: "Chioma Eze",
      service: "Pipe Installation",
      date: "2023-11-15",
      time: "14:00",
      status: "completed",
      amount: "₦5,000"
    },
    {
      id: "job2",
      customer: "Emmanuel Nwachukwu",
      service: "Drain Cleaning",
      date: "2023-11-17",
      time: "10:00",
      status: "confirmed",
      amount: "₦3,500"
    },
    {
      id: "job3",
      customer: "Blessing Ibrahim",
      service: "Fixture Installation",
      date: "2023-11-20",
      time: "16:30",
      status: "pending",
      amount: "₦4,500"
    }
  ],
  recentEarnings: [
    { day: "Mon", amount: 5000 },
    { day: "Tue", amount: 3500 },
    { day: "Wed", amount: 0 },
    { day: "Thu", amount: 7500 },
    { day: "Fri", amount: 4000 },
    { day: "Sat", amount: 8000 },
    { day: "Sun", amount: 0 }
  ]
};

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [providerData, setProviderData] = useState<any>(null);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setProviderData(mockProviderData);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span>;
      case "confirmed":
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Confirmed</span>;
      case "pending":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>;
      case "cancelled":
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Cancelled</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-connectify-darkGray">{providerData.name}</h1>
          <p className="text-connectify-mediumGray">{providerData.category} Service Provider</p>
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button 
            variant="outline"
            onClick={() => navigate("/provider-profile")}
          >
            Edit Profile
          </Button>
          <Button 
            className="bg-connectify-blue hover:bg-connectify-darkBlue"
            onClick={() => navigate("/provider-jobs")}
          >
            Manage Jobs
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Requests</CardTitle>
            <Briefcase className="h-4 w-4 text-connectify-mediumGray" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providerData.stats.newRequests}</div>
            <p className="text-xs text-connectify-mediumGray">
              <ArrowUp className="h-3 w-3 text-green-500 inline mr-1" />
              <span className="text-green-500 font-medium">+2</span> from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Calendar className="h-4 w-4 text-connectify-mediumGray" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providerData.stats.activeJobs}</div>
            <p className="text-xs text-connectify-mediumGray">
              <ArrowDown className="h-3 w-3 text-red-500 inline mr-1" />
              <span className="text-red-500 font-medium">-1</span> from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-connectify-mediumGray" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providerData.stats.totalEarnings}</div>
            <p className="text-xs text-connectify-mediumGray">
              <ArrowUp className="h-3 w-3 text-green-500 inline mr-1" />
              <span className="text-green-500 font-medium">+₦22,500</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providerData.stats.averageRating}</div>
            <p className="text-xs text-connectify-mediumGray">Based on {providerData.stats.completedJobs} completed jobs</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent-activity">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="recent-activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="earnings">Earnings Overview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent-activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              {providerData.recentJobs.length === 0 ? (
                <p className="text-center py-4 text-connectify-mediumGray">No recent jobs found.</p>
              ) : (
                <div className="space-y-4">
                  {providerData.recentJobs.map((job: any, index: number) => (
                    <div key={index} className="flex justify-between items-center border-b pb-4 last:border-b-0 last:pb-0">
                      <div>
                        <p className="font-medium">{job.service}</p>
                        <p className="text-sm text-connectify-mediumGray">Customer: {job.customer}</p>
                        <p className="text-sm text-connectify-mediumGray">{job.date} at {job.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{job.amount}</p>
                        <div className="mt-1">{getStatusBadge(job.status)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-4 text-center">
                <Button 
                  variant="outline"
                  onClick={() => navigate("/provider-jobs")}
                  className="w-full"
                >
                  View All Jobs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="earnings" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Earnings Overview</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-sm"
                  onClick={() => navigate("/provider-analytics")}
                >
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Detailed Analytics
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-end justify-between pt-6">
                {providerData.recentEarnings.map((day: any, index: number) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="bg-connectify-blue w-8 rounded-t-sm" 
                      style={{ 
                        height: `${day.amount ? (day.amount / 8000) * 150 : 4}px`,
                        backgroundColor: day.amount === 0 ? '#e5e7eb' : undefined
                      }}
                    ></div>
                    <span className="text-xs mt-2">{day.day}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center mt-8 pt-4 border-t">
                <div>
                  <p className="text-sm text-connectify-mediumGray">This Week</p>
                  <p className="text-xl font-bold">₦28,000</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-connectify-blue"
                  onClick={() => navigate("/provider-analytics")}
                >
                  View Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProviderDashboard;

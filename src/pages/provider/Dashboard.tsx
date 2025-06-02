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
import { useToast } from "@/components/ui/use-toast";
import apiService from "@/services/api";

interface ProviderProfile {
  provider: {
    business_name: string;
    service_category: string;
    rating: number;
    total_reviews: number;
  };
  user: {
    name: string;
  };
  jobs: Array<{
    id: string;
    customer_name: string;
    service_type: string;
    scheduled_date: string;
    scheduled_time: string;
    status: string;
    amount: number;
  }>;
}

interface JobStats {
  new_requests: number;
  active_jobs: number;
  completed_jobs: number;
  total_earnings: number;
  earnings_trend: number;
  jobs_trend: number;
  earnings_overview: {
    daily: number[];
    labels: string[];
  };
  max_earnings: number;
}

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [stats, setStats] = useState<JobStats | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, statsData] = await Promise.all([
          apiService.getProviderProfile(),
          apiService.getProviderAnalytics()
        ]);
        
        setProfile(profileData);
        setStats(statsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading || !profile || !stats) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-connectify-darkGray">{profile.user.name}</h1>
          <p className="text-connectify-mediumGray">{profile.provider.service_category} Service Provider</p>
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
            <div className="text-2xl font-bold">{stats.new_requests}</div>
            <p className="text-xs text-connectify-mediumGray">
              {stats.jobs_trend > 0 ? (
                <>
                  <ArrowUp className="h-3 w-3 text-green-500 inline mr-1" />
                  <span className="text-green-500 font-medium">+{stats.jobs_trend}</span>
                </>
              ) : (
                <>
                  <ArrowDown className="h-3 w-3 text-red-500 inline mr-1" />
                  <span className="text-red-500 font-medium">{stats.jobs_trend}</span>
                </>
              )} from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Calendar className="h-4 w-4 text-connectify-mediumGray" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_jobs}</div>
            <p className="text-xs text-connectify-mediumGray">
              {stats.jobs_trend > 0 ? (
                <>
                  <ArrowUp className="h-3 w-3 text-green-500 inline mr-1" />
                  <span className="text-green-500 font-medium">+{stats.jobs_trend}</span>
                </>
              ) : (
                <>
                  <ArrowDown className="h-3 w-3 text-red-500 inline mr-1" />
                  <span className="text-red-500 font-medium">{stats.jobs_trend}</span>
                </>
              )} from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-connectify-mediumGray" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.total_earnings)}</div>
            <p className="text-xs text-connectify-mediumGray">
              {stats.earnings_trend > 0 ? (
                <>
                  <ArrowUp className="h-3 w-3 text-green-500 inline mr-1" />
                  <span className="text-green-500 font-medium">+{formatCurrency(stats.earnings_trend)}</span>
                </>
              ) : (
                <>
                  <ArrowDown className="h-3 w-3 text-red-500 inline mr-1" />
                  <span className="text-red-500 font-medium">{formatCurrency(stats.earnings_trend)}</span>
                </>
              )} from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.provider.rating.toFixed(1)}</div>
            <p className="text-xs text-connectify-mediumGray">Based on {profile.provider.total_reviews} reviews</p>
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
              {profile.jobs.length === 0 ? (
                <p className="text-center py-4 text-connectify-mediumGray">No recent jobs found.</p>
              ) : (
                <div className="space-y-4">
                  {profile.jobs.map((job) => (
                    <div key={job.id} className="flex justify-between items-center border-b pb-4 last:border-b-0 last:pb-0">
                      <div>
                        <p className="font-medium">{job.service_type}</p>
                        <p className="text-sm text-connectify-mediumGray">Customer: {job.customer_name}</p>
                        <p className="text-sm text-connectify-mediumGray">{job.scheduled_date} at {job.scheduled_time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(job.amount)}</p>
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
                {stats.earnings_overview?.map((day: any, index: number) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="bg-connectify-blue w-8 rounded-t-sm" 
                      style={{ 
                        height: `${day.amount ? (day.amount / stats.max_earnings) * 150 : 4}px`,
                        backgroundColor: day.amount === 0 ? '#e5e7eb' : undefined
                      }}
                    ></div>
                    <span className="text-xs mt-2">{day.day}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProviderDashboard;

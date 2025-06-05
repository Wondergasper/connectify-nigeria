import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, TrendingUp, TrendingDown, Users, Clock, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip, Legend } from "recharts";
import { useToast } from "@/components/ui/use-toast";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import apiService from "@/services/api";
import { AnalyticsResponse } from "@/types/api";

const ProviderAnalytics = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [timeRange, setTimeRange] = useState("month");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await apiService.getProviderAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        toast({
          title: "Error",
          description: "Failed to load analytics data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading || !analytics) {
    return <Loading />;
  }

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
        <h1 className="text-2xl font-bold text-connectify-darkGray">Analytics</h1>
      </div>

      <div className="flex justify-between items-center">
        <Tabs value={timeRange} onValueChange={setTimeRange}>
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.total_jobs}</div>
            <p className="text-sm text-connectify-mediumGray">All time jobs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Completed Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.completed_jobs}</div>
            <p className="text-sm text-connectify-mediumGray">Successfully completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(analytics.total_earnings)}</div>
            <p className="text-sm text-connectify-mediumGray">All time earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.average_rating.toFixed(1)}</div>
            <p className="text-sm text-connectify-mediumGray">Based on reviews</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Jobs by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.jobs_by_category.map((category) => (
                <div key={category.category} className="flex justify-between items-center">
                  <span className="text-connectify-mediumGray">{category.category}</span>
                  <span className="font-medium">{category.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Earnings by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.earnings_by_month.map((month) => (
                <div key={month.month} className="flex justify-between items-center">
                  <span className="text-connectify-mediumGray">{month.month}</span>
                  <span className="font-medium">{formatCurrency(month.amount)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Customer Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.customer_ratings.map((rating) => (
              <div key={rating.rating} className="flex items-center gap-2">
                <span className="w-8 text-sm">{rating.rating} stars</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-connectify-primary rounded-full"
                    style={{ width: `${(rating.count / analytics.total_jobs) * 100}%` }}
                  />
                </div>
                <span className="w-12 text-sm text-right">{rating.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderAnalytics;

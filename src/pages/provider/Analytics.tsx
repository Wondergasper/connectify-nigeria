
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Download, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Loading from "@/components/Loading";

// Mock analytics data
const mockAnalytics = {
  earnings: {
    daily: [
      { date: "2023-11-01", amount: 5000 },
      { date: "2023-11-02", amount: 3500 },
      { date: "2023-11-03", amount: 0 },
      { date: "2023-11-04", amount: 7500 },
      { date: "2023-11-05", amount: 4000 },
      { date: "2023-11-06", amount: 8000 },
      { date: "2023-11-07", amount: 0 }
    ],
    weekly: [
      { week: "Oct 30 - Nov 5", amount: 20000 },
      { week: "Nov 6 - Nov 12", amount: 28000 },
      { week: "Nov 13 - Nov 19", amount: 18000 },
      { week: "Nov 20 - Nov 26", amount: 32000 }
    ],
    monthly: [
      { month: "Aug", amount: 75000 },
      { month: "Sep", amount: 85000 },
      { month: "Oct", amount: 95000 },
      { month: "Nov", amount: 66000 }
    ]
  },
  jobs: {
    daily: [
      { date: "2023-11-01", count: 2 },
      { date: "2023-11-02", count: 1 },
      { date: "2023-11-03", count: 0 },
      { date: "2023-11-04", count: 3 },
      { date: "2023-11-05", count: 1 },
      { date: "2023-11-06", count: 2 },
      { date: "2023-11-07", count: 0 }
    ],
    weekly: [
      { week: "Oct 30 - Nov 5", count: 7 },
      { week: "Nov 6 - Nov 12", count: 9 },
      { week: "Nov 13 - Nov 19", count: 5 },
      { week: "Nov 20 - Nov 26", count: 11 }
    ],
    monthly: [
      { month: "Aug", count: 28 },
      { month: "Sep", count: 32 },
      { month: "Oct", count: 35 },
      { month: "Nov", count: 24 }
    ]
  },
  ratings: {
    daily: [
      { date: "2023-11-01", rating: 5.0 },
      { date: "2023-11-02", rating: 4.0 },
      { date: "2023-11-03", rating: 0 },
      { date: "2023-11-04", rating: 4.7 },
      { date: "2023-11-05", rating: 5.0 },
      { date: "2023-11-06", rating: 4.5 },
      { date: "2023-11-07", rating: 0 }
    ],
    weekly: [
      { week: "Oct 30 - Nov 5", rating: 4.7 },
      { week: "Nov 6 - Nov 12", rating: 4.8 },
      { week: "Nov 13 - Nov 19", rating: 4.6 },
      { week: "Nov 20 - Nov 26", rating: 4.9 }
    ],
    monthly: [
      { month: "Aug", rating: 4.6 },
      { month: "Sep", rating: 4.7 },
      { month: "Oct", rating: 4.8 },
      { month: "Nov", rating: 4.8 }
    ]
  }
};

const ProviderAnalytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [timeRange, setTimeRange] = useState("weekly");
  
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const getMaxValue = (data: any[], key: string) => {
    return Math.max(...data.map(item => item[key]));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="pl-0 mr-4" 
            onClick={() => navigate("/provider-dashboard")}
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-connectify-darkGray">Analytics</h1>
        </div>
        
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {timeRange === "daily" ? "Daily" : 
                 timeRange === "weekly" ? "Weekly" : "Monthly"}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTimeRange("daily")}>
                Daily
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange("weekly")}>
                Weekly
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange("monthly")}>
                Monthly
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="earnings">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="jobs">Job Count</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="earnings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-end justify-between pt-6">
                {analytics.earnings[timeRange].map((item: any, index: number) => {
                  const maxAmount = getMaxValue(analytics.earnings[timeRange], "amount");
                  const height = item.amount ? (item.amount / maxAmount) * 250 : 4;
                  
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="bg-connectify-blue w-12 md:w-16 rounded-t-sm" 
                        style={{ 
                          height: `${height}px`,
                          backgroundColor: item.amount === 0 ? '#e5e7eb' : undefined
                        }}
                      ></div>
                      <span className="text-xs mt-2 text-center">
                        {timeRange === "daily" ? item.date.split("-")[2] : 
                         timeRange === "weekly" ? `W${index+1}` : item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-connectify-mediumGray">Total Earnings</p>
                  <p className="text-xl font-bold">
                    ₦
                    {analytics.earnings[timeRange].reduce((sum: number, item: any) => sum + item.amount, 0).toLocaleString()}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-connectify-mediumGray">Average</p>
                  <p className="text-xl font-bold">
                    ₦
                    {Math.round(
                      analytics.earnings[timeRange].reduce((sum: number, item: any) => sum + item.amount, 0) / 
                      analytics.earnings[timeRange].filter((item: any) => item.amount > 0).length
                    ).toLocaleString()}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-connectify-mediumGray">Highest</p>
                  <p className="text-xl font-bold">
                    ₦
                    {Math.max(...analytics.earnings[timeRange].map((item: any) => item.amount)).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Count Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-end justify-between pt-6">
                {analytics.jobs[timeRange].map((item: any, index: number) => {
                  const maxCount = getMaxValue(analytics.jobs[timeRange], "count");
                  const height = item.count ? (item.count / maxCount) * 250 : 4;
                  
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="bg-green-500 w-12 md:w-16 rounded-t-sm" 
                        style={{ 
                          height: `${height}px`,
                          backgroundColor: item.count === 0 ? '#e5e7eb' : undefined
                        }}
                      ></div>
                      <span className="text-xs mt-2 text-center">
                        {timeRange === "daily" ? item.date.split("-")[2] : 
                         timeRange === "weekly" ? `W${index+1}` : item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-connectify-mediumGray">Total Jobs</p>
                  <p className="text-xl font-bold">
                    {analytics.jobs[timeRange].reduce((sum: number, item: any) => sum + item.count, 0)}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-connectify-mediumGray">Average</p>
                  <p className="text-xl font-bold">
                    {Math.round(
                      analytics.jobs[timeRange].reduce((sum: number, item: any) => sum + item.count, 0) / 
                      analytics.jobs[timeRange].length
                    )}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-connectify-mediumGray">Most Jobs</p>
                  <p className="text-xl font-bold">
                    {Math.max(...analytics.jobs[timeRange].map((item: any) => item.count))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ratings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rating Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-end justify-between pt-6">
                {analytics.ratings[timeRange].map((item: any, index: number) => {
                  const height = item.rating ? (item.rating / 5) * 250 : 4;
                  
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="bg-yellow-400 w-12 md:w-16 rounded-t-sm" 
                        style={{ 
                          height: `${height}px`,
                          backgroundColor: item.rating === 0 ? '#e5e7eb' : undefined
                        }}
                      ></div>
                      <span className="text-xs mt-2 text-center">
                        {timeRange === "daily" ? item.date.split("-")[2] : 
                         timeRange === "weekly" ? `W${index+1}` : item.month}
                      </span>
                      {item.rating > 0 && (
                        <span className="text-xs mt-1 font-medium">{item.rating.toFixed(1)}</span>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-connectify-mediumGray">Average Rating</p>
                  <p className="text-xl font-bold">
                    {(
                      analytics.ratings[timeRange]
                        .filter((item: any) => item.rating > 0)
                        .reduce((sum: number, item: any) => sum + item.rating, 0) / 
                      analytics.ratings[timeRange].filter((item: any) => item.rating > 0).length
                    ).toFixed(1)}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-connectify-mediumGray">Highest Rating</p>
                  <p className="text-xl font-bold">
                    {Math.max(...analytics.ratings[timeRange].map((item: any) => item.rating)).toFixed(1)}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-connectify-mediumGray">Rated Jobs</p>
                  <p className="text-xl font-bold">
                    {analytics.ratings[timeRange].filter((item: any) => item.rating > 0).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProviderAnalytics;

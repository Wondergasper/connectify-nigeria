import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip, Legend } from "recharts";
import { CalendarDays, TrendingUp, TrendingDown, Users, Clock, CreditCard } from "lucide-react";

const Analytics = () => {
  // Sample data for charts
  const bookingsData = [
    { name: "Mon", bookings: 4 },
    { name: "Tue", bookings: 3 },
    { name: "Wed", bookings: 5 },
    { name: "Thu", bookings: 7 },
    { name: "Fri", bookings: 6 },
    { name: "Sat", bookings: 10 },
    { name: "Sun", bookings: 8 },
  ];

  const serviceTypeData = [
    { name: "Plumbing", value: 35 },
    { name: "Electrical", value: 25 },
    { name: "Cleaning", value: 20 },
    { name: "Painting", value: 15 },
    { name: "Others", value: 5 },
  ];

  const revenueData = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 5000 },
    { month: "Mar", revenue: 3000 },
    { month: "Apr", revenue: 7000 },
    { month: "May", revenue: 6000 },
    { month: "Jun", revenue: 8000 },
  ];

  const ratingData = [
    { name: "5 Stars", count: 48 },
    { name: "4 Stars", count: 32 },
    { name: "3 Stars", count: 12 },
    { name: "2 Stars", count: 6 },
    { name: "1 Star", count: 2 },
  ];

  const COLORS = ['#1EAEDB', '#0A4975', '#001F3F', '#888888', '#333333'];

  // Calculate statistics
  const totalBookings = bookingsData.reduce((sum, item) => sum + item.bookings, 0);
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  
  const averageRating = (ratingData.reduce((sum, item) => {
    const rating = parseInt(item.name.charAt(0), 10);
    return sum + (rating * item.count);
  }, 0) / ratingData.reduce((sum, item) => sum + item.count, 0)).toFixed(1);

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-connectify-darkGray dark:text-connectify-blue">Analytics Dashboard</h1>
        <p className="text-connectify-mediumGray mt-2">Track your performance metrics and growth</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CalendarDays className="h-4 w-4 text-connectify-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-connectify-darkBlue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating}/5.0</div>
            <p className="text-xs text-muted-foreground">+0.2 from last month</p>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2 hours</div>
            <p className="text-xs text-muted-foreground">-15 min from last week</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bookings" className="space-y-4">
        <TabsList className="grid grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Bookings</CardTitle>
              <CardDescription>View your booking trends for the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="bookings" fill="#1EAEDB" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Client Ratings</CardTitle>
                <CardDescription>Distribution of ratings from clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ratingData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-sm text-muted-foreground">{item.count} reviews</span>
                      </div>
                      <Progress value={(item.count / ratingData.reduce((sum, i) => sum + i.count, 0)) * 100} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest bookings and reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-connectify-blue/20 p-2">
                      <Users className="h-4 w-4 text-connectify-blue" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">New booking from Adebayo</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-green-500/20 p-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">New 5-star review from Chioma</p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-connectify-darkBlue/20 p-2">
                      <CalendarDays className="h-4 w-4 text-connectify-darkBlue" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Completed service for Emeka</p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>Your earnings over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₦${value.toLocaleString()}`, 'Revenue']} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#0A4975" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Breakdown</CardTitle>
              <CardDescription>Analysis of payment methods used</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="h-[200px] w-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Bank Transfer", value: 45 },
                          { name: "Card Payment", value: 35 },
                          { name: "Cash", value: 20 }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#1EAEDB" />
                        <Cell fill="#0A4975" />
                        <Cell fill="#333333" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#1EAEDB]" />
                    <span className="text-sm">Bank Transfer - 45%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#0A4975]" />
                    <span className="text-sm">Card Payment - 35%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#333333]" />
                    <span className="text-sm">Cash - 20%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Type Breakdown</CardTitle>
              <CardDescription>Distribution of your service categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={serviceTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {serviceTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Popular Services</CardTitle>
                <CardDescription>Your most requested services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Pipe Repair</span>
                    <span className="text-sm text-muted-foreground">42 bookings</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Water Heater Installation</span>
                    <span className="text-sm text-muted-foreground">28 bookings</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Leaky Faucet</span>
                    <span className="text-sm text-muted-foreground">19 bookings</span>
                  </div>
                  <Progress value={45} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Drainage Issues</span>
                    <span className="text-sm text-muted-foreground">15 bookings</span>
                  </div>
                  <Progress value={35} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Service Areas</CardTitle>
                <CardDescription>Geographic distribution of your services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Lagos Island</span>
                    <span className="text-sm text-muted-foreground">35%</span>
                  </div>
                  <Progress value={35} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Ikeja</span>
                    <span className="text-sm text-muted-foreground">25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Lekki</span>
                    <span className="text-sm text-muted-foreground">20%</span>
                  </div>
                  <Progress value={20} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Surulere</span>
                    <span className="text-sm text-muted-foreground">15%</span>
                  </div>
                  <Progress value={15} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Yaba</span>
                    <span className="text-sm text-muted-foreground">5%</span>
                  </div>
                  <Progress value={5} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;

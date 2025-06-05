import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loading from "@/components/Loading";
import { useToast } from "@/components/ui/use-toast";
import apiService from "@/services/api";
import { EarningsResponse } from "@/types/api";

const ProviderEarnings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState<EarningsResponse | null>(null);
  const [timeRange, setTimeRange] = useState("month");

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const data = await apiService.getProviderEarnings(timeRange);
        setEarnings(data);
      } catch (error) {
        console.error("Error fetching earnings:", error);
        toast({
          title: "Error",
          description: "Failed to load earnings data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading || !earnings) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-connectify-darkGray">Earnings</h1>
        <Tabs value={timeRange} onValueChange={setTimeRange}>
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(earnings.total_earnings)}</div>
            <p className="text-sm text-connectify-mediumGray">All time earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Period Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(earnings.period_earnings)}</div>
            <p className="text-sm text-connectify-mediumGray">Earnings for selected period</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Earnings Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {earnings.earnings_by_period.map((period) => (
              <div key={period.period} className="flex justify-between items-center">
                <span className="text-connectify-mediumGray">{period.period}</span>
                <span className="font-medium">{formatCurrency(period.amount)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {earnings.recent_payments.map((payment) => (
              <div key={payment.id} className="flex justify-between items-center border-b pb-4 last:border-b-0 last:pb-0">
                <div>
                  <p className="font-medium">Payment #{payment.id}</p>
                  <p className="text-sm text-connectify-mediumGray">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(payment.amount)}</p>
                  <p className="text-sm text-connectify-mediumGray">{payment.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderEarnings; 
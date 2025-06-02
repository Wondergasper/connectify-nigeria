import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loading from "@/components/Loading";
import { useToast } from "@/components/ui/use-toast";
import apiService from "@/services/api";
import { ReviewsResponse } from "@/types/api";

const ProviderReviews = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<ReviewsResponse | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await apiService.getProviderReviews();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast({
          title: "Error",
          description: "Failed to load reviews. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const filteredReviews = reviews?.reviews.filter(review => {
    if (filter === "all") return true;
    if (filter === "positive") return review.rating >= 4;
    if (filter === "negative") return review.rating <= 2;
    return true;
  });

  if (loading || !reviews) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-connectify-darkGray">Reviews</h1>
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="positive">Positive</TabsTrigger>
            <TabsTrigger value="negative">Negative</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{reviews.average_rating.toFixed(1)}</div>
            <p className="text-sm text-connectify-mediumGray">Based on {reviews.total_reviews} reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviews.reviews.filter(r => r.rating === rating).length;
                const percentage = (count / reviews.total_reviews) * 100;
                return (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="w-8 text-sm">{rating} stars</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-connectify-primary rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-12 text-sm text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredReviews?.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{review.customer_name}</h3>
                    <p className="text-sm text-connectify-mediumGray">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{review.rating}</span>
                    <span className="text-yellow-500">★</span>
                  </div>
                </div>
                <p className="text-connectify-mediumGray">{review.comment}</p>
                {review.job_title && (
                  <p className="text-sm text-connectify-mediumGray mt-2">
                    Job: {review.job_title}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderReviews; 
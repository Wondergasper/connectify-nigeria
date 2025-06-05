
import React from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";

const UserTypeSelection = () => {
  const navigate = useNavigate();
  const { setUserRole, setIsAuthenticated } = useUser();
  const { toast } = useToast();

  const handleRoleSelection = (role: "customer" | "provider") => {
    setUserRole(role);
    setIsAuthenticated(true);
    
    toast({
      title: "Welcome!",
      description: `You're now signed in as a ${role}.`,
    });
    
    if (role === "provider") {
      navigate("/provider-dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-connectify-blue/10 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-connectify-darkGray mb-2">Welcome to Connectify</h1>
          <p className="text-connectify-mediumGray">Choose how you want to use our platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-2 hover:border-connectify-blue hover:shadow-lg transition-all">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-connectify-blue" />
              </div>
              <CardTitle>Join as Customer</CardTitle>
              <CardDescription>Find and book services</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="space-y-2 text-sm">
                <li>✓ Discover local service providers</li>
                <li>✓ Book appointments easily</li>
                <li>✓ Read and leave reviews</li>
                <li>✓ Track service history</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-connectify-blue hover:bg-connectify-darkBlue"
                onClick={() => handleRoleSelection("customer")}
              >
                Continue as Customer
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-2 hover:border-connectify-blue hover:shadow-lg transition-all">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="h-8 w-8 text-connectify-blue" />
              </div>
              <CardTitle>Join as Provider</CardTitle>
              <CardDescription>Offer your services</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="space-y-2 text-sm">
                <li>✓ List your professional services</li>
                <li>✓ Manage booking requests</li>
                <li>✓ Track your earnings</li>
                <li>✓ Build your professional profile</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-connectify-blue hover:bg-connectify-darkBlue"
                onClick={() => handleRoleSelection("provider")}
              >
                Continue as Provider
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection;

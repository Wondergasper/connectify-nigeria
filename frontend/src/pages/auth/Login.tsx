import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import AuthCard from "@/components/auth/AuthCard";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";
import api from "@/lib/axios";
import { endpoints } from "@/lib/endpoints";

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUserRole, setIsAuthenticated } = useUser();
  const form = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log('Attempting login with:', { email: data.email });
      const response = await api.post(endpoints.auth.login, {
        email: data.email,
        password: data.password
      });
      
      const result = response.data;
      console.log('Login response:', result);

      if (result.access_token) {
        localStorage.setItem('token', result.access_token);
        
        // Get user info
        const userResponse = await api.get(endpoints.auth.me);
        const userData = userResponse.data;
        console.log('User data:', userData);
        
        setIsAuthenticated(true);
        setUserRole(userData.role);
        
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
        
        navigate(userData.role === "provider" ? "/provider-dashboard" : "/");
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.detail || "Invalid credentials";
      toast({
        title: "Login failed",
        description: typeof errorMessage === 'string' ? errorMessage : "An error occurred during login",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-connectify-blue/10 to-background flex items-center justify-center p-4">
      <AuthCard
        title="Welcome Back"
        description="Enter your credentials to access your account"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link to="/signup" className="text-connectify-blue hover:underline">
            Sign up
          </Link>
        </div>
      </AuthCard>
    </div>
  );
};

export default Login;
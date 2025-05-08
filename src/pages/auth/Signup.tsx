
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AuthCard from "@/components/auth/AuthCard";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  userType: "customer" | "provider";
}

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUserRole, setIsAuthenticated } = useUser();
  const form = useForm<SignupFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      userType: "customer"
    }
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const response = await api.post(endpoints.auth.signup, data);
      const result = response.data;
      
      localStorage.setItem('token', result.token);
      setIsAuthenticated(true);
      setUserRole(result.user.role);
      
      toast({
        title: "Account created!",
        description: "Welcome to Connectify.",
      });

      navigate(data.userType === "provider" ? "/provider-dashboard" : "/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create account",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-connectify-blue/10 to-background flex items-center justify-center p-4">
      <AuthCard
        title="Create an Account"
        description="Join Connectify today and get started"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your full name"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      placeholder="Create a password"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>I want to</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="customer">Find Services</SelectItem>
                      <SelectItem value="provider">Provide Services</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-connectify-blue hover:bg-connectify-darkBlue">
              <UserPlus className="mr-2 h-4 w-4" />
              Create Account
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link to="/login" className="text-connectify-blue hover:underline">
            Sign in
          </Link>
        </div>
      </AuthCard>
    </div>
  );
};

export default Signup;

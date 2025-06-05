import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";
import { UserPlus } from "lucide-react";
import AuthCard from "@/components/auth/AuthCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type UserRole = "USER" | "PROVIDER" | "ADMIN";

const signupSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirm_password: z.string(),
  role: z.enum(["USER", "PROVIDER", "ADMIN"] as const),
  phone_number: z.string().optional()
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type SignupFormData = z.infer<typeof signupSchema>;

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUserRole, setIsAuthenticated } = useUser();
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirm_password: "",
      role: "USER",
      phone_number: ""
    }
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const payload = {
        full_name: data.full_name,
        email: data.email,
        password: data.password,
        confirm_password: data.confirm_password,
        role: data.role,
        phone_number: data.phone_number
      };
      console.log('Registration payload:', payload);
      
      const response = await api.post('/auth/register', payload);
      
      // Get token by logging in after registration
      const loginResponse = await api.post('/auth/token', {
        email: data.email,
        password: data.password
      });
      
      localStorage.setItem('token', loginResponse.data.access_token);
      setIsAuthenticated(true);
      
      // Map the role to match UserContext types
      const mappedRole = data.role === "USER" ? "customer" : "provider";
      setUserRole(mappedRole);
      
      toast({
        title: "Account created!",
        description: "Welcome to Connectify.",
      });

      navigate(data.role === "PROVIDER" ? "/provider-dashboard" : "/");
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.response?.status === 409) {
        toast({
          title: "Email already exists",
          description: "An account with this email already exists. Please try logging in instead.",
          variant: "destructive",
        });
      } else if (error.response?.status === 422) {
        // Log the full error details
        console.error('Validation error details:', error.response.data);
        toast({
          title: "Validation Error",
          description: error.response.data?.detail || "Please check your input and try again",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signup failed",
          description: error.response?.data?.detail || "Could not create account",
          variant: "destructive",
        });
      }
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
              name="full_name"
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
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Confirm your password"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      placeholder="Enter your phone number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
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
                      <SelectItem value="USER">Find Services</SelectItem>
                      <SelectItem value="PROVIDER">Provide Services</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
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
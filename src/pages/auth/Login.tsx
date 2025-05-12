if (result.success) {
  toast({
    description: "You've successfully logged in.",
  });
  navigate(result.user.role === "provider" ? "/provider-dashboard" : "/");
} else {
  const error = await response.json();
  toast({
    title: "Login failed",
    description: error.message,
  });
}
// import React from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import AuthCard from "@/components/auth/AuthCard";
// import { useUser } from "@/contexts/UserContext";
// import { useToast } from "@/hooks/use-toast";
// import { LogIn } from "lucide-react";

// interface LoginFormData {
//   email: string;
//   password: string;
// }

// const Login = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { setUserRole, setIsAuthenticated } = useUser();
//   const form = useForm<LoginFormData>({
//     defaultValues: {
//       email: "",
//       password: ""
//     }
//   });

//   const onSubmit = (data: LoginFormData) => {
//     // For demo purposes, we're using basic validation
//     if (data.email && data.password) {
//       setIsAuthenticated(true);
//       // For demo, determine role from email domain
//       const role = data.email.includes("provider") ? "provider" : "customer";
//       setUserRole(role);
      
//       toast({
//         title: "Welcome back!",
//         description: "You've successfully logged in.",
//       });

//       navigate(role === "provider" ? "/provider-dashboard" : "/");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-connectify-blue/10 to-background flex items-center justify-center p-4">
//       <AuthCard
//         title="Welcome Back"
//         description="Enter your credentials to access your account"
//       >
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       type="email"
//                       placeholder="Enter your email"
//                       required
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Password</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       type="password"
//                       placeholder="Enter your password"
//                       required
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button type="submit" className="w-full bg-connectify-blue hover:bg-connectify-darkBlue">
//               <LogIn className="mr-2 h-4 w-4" />
//               Sign In
//             </Button>
//           </form>
//         </Form>
//         <div className="mt-4 text-center text-sm">
//           <span className="text-muted-foreground">Don't have an account? </span>
//           <Link to="/signup" className="text-connectify-blue hover:underline">
//             Sign up
//           </Link>
//         </div>
//       </AuthCard>
//     </div>
//   );
// };

// export default Login;
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

  // const onSubmit = async (data: LoginFormData) => {
  //   try {
  //     const response = await api.post(endpoints.auth.login, data);
  //     const result = response.data;
  //     localStorage.setItem('token', result.token);
  //     setIsAuthenticated(true);
  //     setUserRole(result.user.role);
  //       toast({
  //         title: "Welcome back!",
  //         description: "You've successfully logged in.",
  //       });
  //       navigate(result.user.role === "provider" ? "/provider-dashboard" : "/");
  //     } else {
  //       const error = await response.json();
  //       toast({
  //         title: "Login failed",
  //         description: error.message || "Invalid credentials",
  //         variant: "destructive",
  //       });
  //     }
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "An unexpected error occurred",
  //       variant: "destructive",
  //     });
  //   }
  // };
  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await api.post(endpoints.auth.login, data);
      const result = response.data;
  
      if (result.success) {
        localStorage.setItem('token', result.token);
        setIsAuthenticated(true);
        setUserRole(result.user.role);
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
        navigate(result.user.role === "provider" ? "/provider-dashboard" : "/");
      } else {
        toast({
          title: "Login failed",
          description: result.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials",
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
            <Button type="submit" className="w-full bg-connectify-blue hover:bg-connectify-darkBlue">
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
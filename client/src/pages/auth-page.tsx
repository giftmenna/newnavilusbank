import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation, useSearch } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertUserSchema, loginUserSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import Footer from "@/components/layout/footer";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const [activeTab, setActiveTab] = useState<string>("login");

  // Parse query parameters for initial tab
  useEffect(() => {
    const params = new URLSearchParams(search);
    const tab = params.get("tab");
    if (tab === "signup") {
      setActiveTab("signup");
    }
  }, [search]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation(user.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [user, setLocation]);

  // Login form
  const loginForm = useForm<z.infer<typeof loginUserSchema>>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onLoginSubmit = (data: z.infer<typeof loginUserSchema>) => {
    loginMutation.mutate(data);
  };

  // Registration form
  const extendedUserSchema = insertUserSchema.extend({
    confirmPassword: z.string(),
    terms: z.boolean().refine(val => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  }).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
  
  const registerForm = useForm<z.infer<typeof extendedUserSchema>>({
    resolver: zodResolver(extendedUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      pin: "",
      confirmPassword: "",
      terms: false,
    },
  });
  useEffect(() => {
    console.log("Form State:", registerForm.watch);
  }, [registerForm.watch]);
  

  const onRegisterSubmit = (formData: any) => {
    const { confirmPassword, terms, ...userData } = formData;
    registerMutation.mutate(userData);
  };

  return (
    <div className="min-h-screen flex flex-col">
    

      <main className="flex-grow">
        <div className="flex min-h-[80vh]">
          {/* Left Side - Auth Forms */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <Card>
                    <CardHeader>
                      <CardTitle>Welcome Back</CardTitle>
                      <CardDescription>Sign in to your Nivalus Bank account</CardDescription>
                    </CardHeader>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input 
                            id="username" 
                            type="text" 
                            {...loginForm.register("username")} 
                            disabled={loginMutation.isPending}
                          />
                          {loginForm.formState.errors.username && (
                            <p className="text-sm text-red-500">{loginForm.formState.errors.username.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input 
                            id="password" 
                            type="password" 
                            {...loginForm.register("password")} 
                            disabled={loginMutation.isPending}
                          />
                          {loginForm.formState.errors.password && (
                            <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="remember" />
                            <Label htmlFor="remember" className="text-sm">Remember me</Label>
                          </div>
                          
                          <Link 
                              to="/forgot-password" 
                              className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                            >
                              Forgot Password?
                            </Link>
                        </div>
                      </CardContent>
                      
                      <CardFooter>
                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Signing in...
                            </>
                          ) : (
                            "Sign in"
                          )}
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </TabsContent>
                
                <TabsContent value="signup">
                  <Card>
                    <CardHeader>
                      <CardTitle>Create an Account</CardTitle>
                      <CardDescription>Join Nivalus Bank today</CardDescription>
                    </CardHeader>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-username">Username</Label>
                          <Input 
                            id="signup-username" 
                            type="text" 
                            {...registerForm.register("username")} 
                            disabled={registerMutation.isPending}
                          />
                          {registerForm.formState.errors.username && (
                            <p className="text-sm text-red-500">{registerForm.formState.errors.username.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            {...registerForm.register("email")} 
                            disabled={registerMutation.isPending}
                          />
                          {registerForm.formState.errors.email && (
                            <p className="text-sm text-red-500">{registerForm.formState.errors.email.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="signup-password">Password</Label>
                          <Input 
                            id="signup-password" 
                            type="password" 
                            {...registerForm.register("password")} 
                            disabled={registerMutation.isPending}
                          />
                          {registerForm.formState.errors.password && (
                            <p className="text-sm text-red-500">{registerForm.formState.errors.password.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm Password</Label>
                          <Input 
                            id="confirm-password" 
                            type="password" 
                            {...registerForm.register("confirmPassword")} 
                            disabled={registerMutation.isPending}
                          />
                          {registerForm.formState.errors.confirmPassword && (
                            <p className="text-sm text-red-500">{registerForm.formState.errors.confirmPassword.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="pin">4-Digit PIN</Label>
                          <Input 
                            id="pin" 
                            type="password" 
                            maxLength={4}
                            placeholder="Enter 4 digits"
                            {...registerForm.register("pin")} 
                            disabled={registerMutation.isPending}
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400">This PIN will be used to confirm transactions</p>
                          {registerForm.formState.errors.pin && (
                            <p className="text-sm text-red-500">{registerForm.formState.errors.pin.message}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="terms" 
                          checked={registerForm.watch("terms")}
                          onCheckedChange={(checked) => registerForm.setValue("terms", checked === true)}
                          disabled={registerMutation.isPending}
                           />
                          <Label htmlFor="terms" className="text-sm">
                            I agree to the{' '}
                            <Link 
                              to="/terms" 
                              className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                            >
                              Terms of Service
                            </Link>
                            {' '}and{' '}
                            <Link 
                              to="/privacypolicy" 
                              className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                            >
                              Privacy Policy
                            </Link>
                          </Label>

                        </div>
                        {registerForm.formState.errors.terms && (
                          <p className="text-sm text-red-500">{registerForm.formState.errors.terms.message}</p>
                        )}
                      </CardContent>
                      
                      <CardFooter>
                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating Account...
                            </>
                          ) : (
                            "Create Account"
                          )}
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Right Side - Hero */}
          <div className="hidden lg:w-1/2 lg:flex flex-col justify-center bg-gradient-to-r from-primary-600 to-primary-800 p-12 text-white">
            <div>
              <h1 className="text-4xl font-bold mb-6">Welcome to Nivalus Bank</h1>
              <p className="text-xl mb-8">Your trusted partner for secure, modern banking solutions.</p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Secure money transfers with PIN verification
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Complete transaction history with receipts
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Multiple transfer methods for your convenience
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  24/7 access to your account from anywhere
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

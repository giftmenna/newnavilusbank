import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminCreateUserPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Form validation
  const form = useForm<z.infer<typeof insertUserSchema>>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      pin: "",
      role: "user",
      status: "active",
      balance: 0,
    },
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: z.infer<typeof insertUserSchema>) => {
      const res = await apiRequest("POST", "/api/admin/users", userData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "User created",
        description: `User ${form.getValues().username} has been created successfully.`,
      });
      setLocation("/admin/users");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof insertUserSchema>) => {
    createUserMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Create New User</CardTitle>
              <CardDescription>Add a new user to the system</CardDescription>
            </CardHeader>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    {...form.register("username")}
                    disabled={createUserMutation.isPending}
                  />
                  {form.formState.errors.username && (
                    <p className="text-sm text-red-500">{form.formState.errors.username.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    {...form.register("email")}
                    disabled={createUserMutation.isPending}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    {...form.register("password")}
                    disabled={createUserMutation.isPending}
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pin">4-Digit PIN</Label>
                  <Input 
                    id="pin" 
                    type="password" 
                    maxLength={4}
                    placeholder="Enter 4 digits"
                    {...form.register("pin")}
                    disabled={createUserMutation.isPending}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">This PIN will be used to confirm transactions</p>
                  {form.formState.errors.pin && (
                    <p className="text-sm text-red-500">{form.formState.errors.pin.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    onValueChange={(value) => form.setValue("role", value as "user" | "admin")}
                    defaultValue="user"
                    disabled={createUserMutation.isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    onValueChange={(value) => form.setValue("status", value as "active" | "inactive" | "deleted")}
                    defaultValue="active"
                    disabled={createUserMutation.isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="balance">Initial Balance</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                    </div>
                    <Input 
                      id="balance" 
                      type="number" 
                      className="pl-7" 
                      step="0.01" 
                      min="0"
                      placeholder="0.00"
                      {...form.register("balance", { valueAsNumber: true })}
                      disabled={createUserMutation.isPending}
                    />
                  </div>
                  {form.formState.errors.balance && (
                    <p className="text-sm text-red-500">{form.formState.errors.balance.message}</p>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setLocation("/admin/users")}
                  disabled={createUserMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createUserMutation.isPending}
                >
                  {createUserMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create User"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

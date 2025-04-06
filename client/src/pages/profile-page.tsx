import { useState, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Camera, User, Settings, Shield, CreditCard, PiggyBank, BarChart, Leaf } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Avatar update mutation
  const avatarMutation = useMutation({
    mutationFn: async (avatarData: { avatar: string }) => {
      const res = await apiRequest("PATCH", "/api/user/avatar", avatarData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Profile Updated",
        description: "Your avatar has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "The maximum file size is 5MB",
        variant: "destructive",
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setAvatarPreview(result);
    };
    reader.readAsDataURL(file);
  };

  // Handle avatar upload
  const handleAvatarUpload = () => {
    if (avatarPreview) {
      avatarMutation.mutate({ avatar: avatarPreview });
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Initial letters for avatar fallback
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Update your account settings and preferences</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="mb-4 relative">
                      <Avatar className="h-24 w-24">
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} alt={user.username} />
                        ) : (
                          <AvatarFallback className="text-lg">
                            {getInitials(user.username)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <Button 
                        size="icon" 
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                        onClick={triggerFileInput}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileChange}
                      />
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.username}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                    
                    {avatarPreview && (
                      <div className="mt-4 space-y-4">
                        <div className="flex justify-center">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={avatarPreview} alt="Preview" />
                          </Avatar>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleAvatarUpload}
                            disabled={avatarMutation.isPending}
                          >
                            {avatarMutation.isPending ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Upload className="h-4 w-4 mr-2" />
                            )}
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setAvatarPreview(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 space-y-1">
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Personal Information
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      Security
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              <Tabs defaultValue="personal">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="tools">Financial Tools</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Update your personal details and contact information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input id="fullName" defaultValue={user.username} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue={user.email} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" placeholder="Enter your phone number" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input id="address" placeholder="Enter your address" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Save Changes</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>
                        Update your password and security preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input id="newPassword" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm Password</Label>
                          <Input id="confirmPassword" type="password" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pin">PIN Code</Label>
                        <Input id="pin" type="password" maxLength={4} />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          This PIN is used for transaction verification
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Update Security</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="tools" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Financial Tools Section */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <BarChart className="h-5 w-5 mr-2 text-primary" />
                          Financial Tools
                        </CardTitle>
                        <CardDescription>
                          Track your spending and manage your finances
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="space-y-4">
                          <Button variant="outline" className="w-full justify-start">
                            <BarChart className="h-4 w-4 mr-2" />
                            Budget Planner
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Expense Tracker
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <PiggyBank className="h-4 w-4 mr-2" />
                            Savings Goals
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Sustainable Banking Section */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Leaf className="h-5 w-5 mr-2 text-green-500" />
                          Sustainable Banking
                        </CardTitle>
                        <CardDescription>
                          Track your carbon footprint and make eco-friendly choices
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="space-y-4">
                          <Button variant="outline" className="w-full justify-start">
                            <Leaf className="h-4 w-4 mr-2" />
                            Carbon Footprint Tracker
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <PiggyBank className="h-4 w-4 mr-2" />
                            Green Investments
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Gamified Savings Section */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Gamified Savings</CardTitle>
                      <CardDescription>
                        Earn rewards and badges as you reach your financial goals
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
                        <h3 className="text-xl font-bold mb-2">Saving Challenge</h3>
                        <p className="mb-4">Save $500 this month and earn the 'Super Saver' badge!</p>
                        <div className="w-full bg-white/20 rounded-full h-2.5 mb-4">
                          <div className="bg-white h-2.5 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>$225 saved</span>
                          <span>$500 goal</span>
                        </div>
                        <div className="mt-4">
                          <Button className="bg-white text-indigo-600 hover:bg-white/90">Join Challenge</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
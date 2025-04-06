import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTransactionSchema, User } from "@shared/schema";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";

export default function AdminCreateTransactionPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Fetch users for dropdown
  const { data: users = [], isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: !!user && user.role === "admin",
  });

  // Form validation
  const form = useForm<z.infer<typeof insertTransactionSchema> & { recipient_details?: string }>({
    resolver: zodResolver(insertTransactionSchema.extend({
      recipient_details: z.string().optional(),
    })),
    defaultValues: {
      user_id: undefined,
      type: undefined,
      amount: undefined,
      timestamp: new Date(),
      memo: "",
      recipient_details: "",
      created_by: user?.id, // Set the created_by field to current admin user
      transaction_id: Math.floor(1000000 + Math.random() * 9000000).toString(), // Generate a random 7-digit transaction ID
    },
  });

  // Create transaction mutation
  const createTransactionMutation = useMutation({
    mutationFn: async (data: any) => {
      // Format data
      let recipientInfo = null;
      try {
        if (data.recipient_details && data.recipient_details.trim() !== '') {
          recipientInfo = JSON.parse(data.recipient_details);
        }
      } catch (error) {
        throw new Error("Invalid JSON in recipient details. Please check the format.");
      }

      const transactionData = {
        ...data,
        recipient_info: recipientInfo,
      };
      delete transactionData.recipient_details;

      const res = await apiRequest("POST", "/api/admin/transactions", transactionData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/transactions"] });
      toast({
        title: "Transaction created",
        description: "The transaction has been created successfully.",
      });
      setLocation("/admin/transactions");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create transaction",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof insertTransactionSchema> & { recipient_details?: string }) => {
    createTransactionMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Create Transaction</CardTitle>
              <CardDescription>Add a new transaction to the system</CardDescription>
            </CardHeader>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user">User</Label>
                  {isLoadingUsers ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading users...
                    </div>
                  ) : (
                    <Select 
                      onValueChange={(value) => form.setValue("user_id", parseInt(value))}
                      disabled={createTransactionMutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users?.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.username} - {user.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {form.formState.errors.user_id && (
                    <p className="text-sm text-red-500">{form.formState.errors.user_id.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Transaction Type</Label>
                  <Select 
                    onValueChange={(value) => form.setValue("type", value as "deposit" | "withdrawal" | "transfer")}
                    disabled={createTransactionMutation.isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deposit">Deposit</SelectItem>
                      <SelectItem value="withdrawal">Withdrawal</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.type && (
                    <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                    </div>
                    <Input 
                      id="amount" 
                      type="number" 
                      className="pl-7" 
                      step="0.01" 
                      min="0.01"
                      placeholder="0.00"
                      {...form.register("amount", { valueAsNumber: true })}
                      disabled={createTransactionMutation.isPending}
                    />
                  </div>
                  {form.formState.errors.amount && (
                    <p className="text-sm text-red-500">{form.formState.errors.amount.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timestamp">Date & Time</Label>
                  <DatePicker
                    date={form.getValues().timestamp}
                    setDate={(date) => form.setValue("timestamp", date)}
                    disabled={createTransactionMutation.isPending}
                  />
                  {form.formState.errors.timestamp && (
                    <p className="text-sm text-red-500">{form.formState.errors.timestamp.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="recipient_details">Recipient Details (JSON format, optional)</Label>
                  <Textarea 
                    id="recipient_details" 
                    placeholder='{"name": "John Doe", "accountNumber": "12345678"}'
                    {...form.register("recipient_details")}
                    disabled={createTransactionMutation.isPending}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Enter details in JSON format for transfers</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="memo">Memo (optional)</Label>
                  <Input 
                    id="memo" 
                    {...form.register("memo")}
                    disabled={createTransactionMutation.isPending}
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setLocation("/admin/transactions")}
                  disabled={createTransactionMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createTransactionMutation.isPending}
                >
                  {createTransactionMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Transaction"
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

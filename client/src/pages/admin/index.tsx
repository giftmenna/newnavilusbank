import { useAuth } from "@/hooks/use-auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import Footer from "@/components/layout/footer";
import AdminDashboard from "@/components/admin/admin-dashboard";
import { Loader2 } from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all users with auto-refresh
  const { 
    data: users, 
    isLoading: isLoadingUsers,
    refetch: refetchUsers
  } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: !!user && user.role === "admin",
    staleTime: 2000, // Consider data stale after 2 seconds
    refetchInterval: 3000, // Auto-refresh every 3 seconds
  });

  // Fetch all transactions with auto-refresh
  const { 
    data: transactions, 
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions
  } = useQuery({
    queryKey: ["/api/admin/transactions"],
    enabled: !!user && user.role === "admin",
    staleTime: 2000, // Consider data stale after 2 seconds
    refetchInterval: 3000, // Auto-refresh every 3 seconds
  });

  // Set up automatic refresh for admin data
  useEffect(() => {
    if (user && user.role === "admin") {
      // Immediately refetch data when admin dashboard loads
      refetchUsers();
      refetchTransactions();
      
      // Set up interval for refreshing admin data
      const refreshInterval = setInterval(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/transactions"] });
      }, 5000);
      
      return () => clearInterval(refreshInterval);
    }
  }, [user, queryClient, refetchUsers, refetchTransactions]);

  const isLoading = isLoadingUsers || isLoadingTransactions;

  // Calculate stats
  const stats = {
    totalUsers: users?.length || 0,
    totalTransactions: transactions?.length || 0,
    systemStatus: "Operational"
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Admin Access Required</h1>
            <p className="text-gray-600 dark:text-gray-300">You need admin privileges to view this page.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-20">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <AdminDashboard 
              stats={stats} 
              users={users || []} 
              transactions={transactions || []} 
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

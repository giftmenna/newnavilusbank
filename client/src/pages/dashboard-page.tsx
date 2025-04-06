import { useAuth } from "@/hooks/use-auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import Footer from "@/components/layout/footer";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import ActionCard from "@/components/dashboard/action-card";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user transactions with frequent refresh
  const { 
    data: transactions, 
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions
  } = useQuery({
    queryKey: ["/api/transactions"],
    enabled: !!user,
    staleTime: 2000, // Consider data stale after 2 seconds
    refetchInterval: 3000, // Auto-refresh every 3 seconds
  });

  // Prefetch data when component mounts
  useEffect(() => {
    if (user) {
      // Immediately refetch transactions when page loads
      refetchTransactions();
      
      // Set up interval for refreshing data
      const refreshInterval = setInterval(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      }, 5000);
      
      return () => clearInterval(refreshInterval);
    }
  }, [user, queryClient, refetchTransactions]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <DashboardHeader 
            username={user.username} 
            balance={user.balance?.toString() || "0"} 
            lastLogin={user.last_login} 
          />

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <ActionCard
              title="New Transfer"
              description="Send money quickly"
              icon="transfer"
              color="primary"
              linkTo="/transfer"
            />
            <ActionCard
              title="Transaction History"
              description="View your recent activity"
              icon="history"
              color="secondary"
              linkTo="/history"
            />
            <ActionCard
              title="Profile Settings"
              description="Update your information"
              icon="profile"
              color="accent"
              linkTo="/profile"
            />
          </div>

          {/* Recent Transactions */}
          {isLoadingTransactions ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 flex items-center justify-center h-20">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <RecentTransactions transactions={transactions || []} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

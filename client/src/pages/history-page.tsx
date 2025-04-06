import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Footer from "@/components/layout/footer";
import TransactionHistory from "@/components/history/transaction-history";
import { Loader2 } from "lucide-react";

export default function HistoryPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState({
    type: "all",
    timeframe: "30days"
  });

  // Fetch transactions with frequent refresh
  const { 
    data: transactions, 
    isLoading,
    refetch: refetchTransactions 
  } = useQuery({
    queryKey: ["/api/transactions"],
    enabled: !!user,
    staleTime: 2000, // Consider data stale after 2 seconds
    refetchInterval: 3000, // Auto-refresh every 3 seconds
  });

  // Prefetch data when component mounts and refresh regularly
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

  const handleFilterChange = (newFilter: any) => {
    setFilter({ ...filter, ...newFilter });
  };

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
          {isLoading ? (
            <div className="flex items-center justify-center h-20">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <TransactionHistory 
              transactions={transactions || []} 
              filter={filter}
              onFilterChange={handleFilterChange}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

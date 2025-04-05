import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import TransactionHistory from "@/components/history/transaction-history";
import { Loader2 } from "lucide-react";

export default function HistoryPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState({
    type: "all",
    timeframe: "30days"
  });

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["/api/transactions"],
    enabled: !!user,
  });

  const handleFilterChange = (newFilter: any) => {
    setFilter({ ...filter, ...newFilter });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
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

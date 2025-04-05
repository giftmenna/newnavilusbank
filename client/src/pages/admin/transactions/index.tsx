import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import TransactionTable from "@/components/admin/transaction-table";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";

export default function AdminTransactionsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState({
    type: "all",
    timeframe: "all"
  });

  // Fetch users for dropdown
  const { data: users } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: !!user && user.role === "admin",
  });

  // Fetch transactions
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["/api/admin/transactions"],
    enabled: !!user && user.role === "admin",
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilter({ ...filter, [key]: value });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 md:mb-0">Transaction History</h2>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <Select
                  value={filter.type}
                  onValueChange={(value) => handleFilterChange("type", value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Transaction Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="deposit">Deposits</SelectItem>
                    <SelectItem value="withdrawal">Withdrawals</SelectItem>
                    <SelectItem value="transfer">Transfers</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={filter.timeframe}
                  onValueChange={(value) => handleFilterChange("timeframe", value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Time Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
                
                <Link href="/admin/transactions/create">
                  <Button>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Transaction
                  </Button>
                </Link>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <TransactionTable 
                transactions={transactions || []} 
                users={users || []}
                filter={filter}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

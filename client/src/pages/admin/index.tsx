import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import AdminDashboard from "@/components/admin/admin-dashboard";
import { Loader2 } from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  // Fetch all users
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: !!user && user.role === "admin",
  });

  // Fetch all transactions
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["/api/admin/transactions"],
    enabled: !!user && user.role === "admin",
  });

  const isLoading = isLoadingUsers || isLoadingTransactions;

  // Calculate stats
  const stats = {
    totalUsers: users?.length || 0,
    totalTransactions: transactions?.length || 0,
    systemStatus: "Operational"
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
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

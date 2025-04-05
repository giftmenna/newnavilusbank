import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import ActionCard from "@/components/dashboard/action-card";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  // Fetch user transactions
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["/api/transactions"],
    enabled: !!user,
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {user ? (
            <>
              <DashboardHeader username={user.username} balance={user.balance?.toString() || "0"} lastLogin={user.last_login} />

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
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <RecentTransactions transactions={transactions || []} />
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

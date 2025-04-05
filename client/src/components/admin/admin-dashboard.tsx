import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import ActionCard from "@/components/dashboard/action-card";
import { User, Transaction } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserTable from "@/components/admin/user-table";
import TransactionTable from "@/components/admin/transaction-table";

interface AdminDashboardProps {
  stats: {
    totalUsers: number;
    totalTransactions: number;
    systemStatus: string;
  };
  users: User[];
  transactions: Transaction[];
}

export default function AdminDashboard({ stats, users, transactions }: AdminDashboardProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admin Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white dark:bg-gray-800 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Users</h3>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalUsers}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-secondary-100 dark:bg-secondary-900 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Transactions</h3>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalTransactions}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">System Status</h3>
              <p className="text-lg font-medium text-green-600 dark:text-green-400">{stats.systemStatus}</p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <ActionCard
          title="Create User"
          description="Add a new user to the system"
          icon="createUser"
          color="primary"
          linkTo="/admin/users/create"
        />
        
        <ActionCard
          title="Manage Users"
          description="View and edit user accounts"
          icon="manageUsers"
          color="secondary"
          linkTo="/admin/users"
        />
        
        <ActionCard
          title="Create Transaction"
          description="Add a new transaction"
          icon="transfer"
          color="accent"
          linkTo="/admin/transactions/create"
        />
        
        <ActionCard
          title="View Transactions"
          description="Browse all transactions"
          icon="transactions"
          color="blue"
          linkTo="/admin/transactions"
        />
      </div>
      
      {/* Admin Tabs for Users and Transactions */}
      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Manage Users</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Users</h3>
              <Link href="/admin/users">
                <div className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium cursor-pointer">
                  View All
                </div>
              </Link>
            </div>
            <UserTable users={users.slice(0, 5)} compact />
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions">
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Transactions</h3>
              <Link href="/admin/transactions">
                <div className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium cursor-pointer">
                  View All
                </div>
              </Link>
            </div>
            <TransactionTable 
              transactions={transactions.slice(0, 5)} 
              users={users}
              filter={{ type: "all", timeframe: "all" }}
              compact
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import UserTable from "@/components/admin/user-table";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all users
  const { data: users, isLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: !!user && user.role === "admin",
  });

  // Filter users based on search term
  const filteredUsers = users?.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Manage Users</h2>
              <div className="flex space-x-3">
                <div className="relative">
                  <Input
                    type="text"
                    className="pl-10"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <Link href="/admin/users/create">
                  <Button>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    New User
                  </Button>
                </Link>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <UserTable users={filteredUsers || []} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

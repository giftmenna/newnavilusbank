import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Link, Redirect } from "wouter";
import { BanknoteIcon, PieChartIcon, CreditCardIcon, BellIcon, ShieldIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

// Define User type (same as in App.tsx)
interface User {
  username: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
  balance?: string;
}

export default function OnlineBankingPage() {
  const { user } = useAuth() as { user: User | null };

  if (!user) {
    return <Redirect to="/auth" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Online Banking</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your accounts, transfer funds, and access financial tools all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BanknoteIcon className="h-5 w-5 text-primary-500" />
                Account Overview
              </CardTitle>
              <CardDescription>View balances and recent activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Current Balance</span>
                    <span className="font-bold text-gray-900 dark:text-white">${user?.balance || "0.00"}</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  <p className="text-sm text-gray-500 mt-2">Monthly spending limit: 65%</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/transfer">
                      <Button variant="outline" className="w-full" size="sm">
                        Transfer
                      </Button>
                    </Link>
                    <Link href="/history">
                      <Button variant="outline" className="w-full" size="sm">
                        History
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-primary-500" />
                Financial Insights
              </CardTitle>
              <CardDescription>Understand your spending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-medium mb-3">Monthly Overview</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Income</span>
                      <span className="text-green-600">+$3,240.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expenses</span>
                      <span className="text-red-600">-$2,140.00</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  View Detailed Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldIcon className="h-5 w-5 text-primary-500" />
                Security Center
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-green-600 dark:text-green-400">Account Protected</span>
                  <ShieldIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <BellIcon className="mr-2 h-4 w-4" /> Manage Alerts
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCardIcon className="mr-2 h-4 w-4" /> Card Security
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
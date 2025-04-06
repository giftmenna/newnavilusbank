import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { BanknoteIcon, PieChartIcon, CreditCardIcon, BellIcon, CalendarIcon, ClockIcon, ArrowRightIcon } from "lucide-react";

export default function OnlineBankingPage() {
  const { user } = useAuth();

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
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BanknoteIcon className="h-5 w-5 text-primary-500" />
              Account Overview
            </CardTitle>
            <CardDescription>View all your account balances and recent transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Checking</span>
                <span className="font-bold">${user?.balance || "0.00"}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Savings</span>
                <span className="font-bold">$5,250.00</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Credit Card</span>
                <span className="font-bold text-red-500">-$750.25</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" size="sm">
              View All Accounts <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary-500" />
              Financial Insights
            </CardTitle>
            <CardDescription>Understand your spending habits and patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Top Spending Category</p>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Dining Out</span>
                  <span className="font-bold">$342.87</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Monthly Budget</p>
                <div className="flex justify-between items-center">
                  <span className="font-medium">75% Used</span>
                  <span className="font-bold">$1,500/$2,000</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Savings Goal</p>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Vacation Fund</span>
                  <span className="font-bold">$2,500/$5,000</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" size="sm">
              View Financial Dashboard <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCardIcon className="h-5 w-5 text-primary-500" />
              Payments & Transfers
            </CardTitle>
            <CardDescription>Send money and pay bills quickly and securely</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <BanknoteIcon className="mr-2 h-4 w-4" /> Transfer Between Accounts
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BellIcon className="mr-2 h-4 w-4" /> Pay Bills
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" /> Schedule Future Payments
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ClockIcon className="mr-2 h-4 w-4" /> View Payment History
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" size="sm">
              More Payment Options <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8 p-6 bg-primary-50 dark:bg-gray-800 rounded-xl">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Digital Banking Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Secure Your Account</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Enable two-factor authentication and create a strong, unique password to protect your financial information.
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Monitor Your Accounts</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Review your accounts regularly to spot any unauthorized transactions and report them immediately.
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Set Up Alerts</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Configure account alerts to receive notifications about large transactions, low balances, or suspicious activity.
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Go Paperless</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Switch to electronic statements to reduce paper waste and keep your financial documents organized digitally.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
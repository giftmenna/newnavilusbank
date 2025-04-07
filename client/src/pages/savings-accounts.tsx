import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { PiggyBankIcon, TrendingUpIcon, BarChartIcon, ArrowRightIcon, ShieldIcon, LineChartIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function SavingsAccountsPage() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect to="/auth" />;
  }

  // Example savings accounts data
  const savingsAccounts = [
    {
      id: 1,
      name: "High-Yield Savings",
      balance: 5250.75,
      interestRate: 3.25,
      lastInterestPaid: 14.23,
      accountNumber: "****7890",
    },
    {
      id: 2,
      name: "Emergency Fund",
      balance: 12750.50,
      interestRate: 2.75,
      lastInterestPaid: 29.17,
      accountNumber: "****4321",
    },
    {
      id: 3,
      name: "Vacation Savings",
      balance: 2500.00,
      interestRate: 2.50,
      lastInterestPaid: 5.21,
      accountNumber: "****6543",
      goal: 5000,
    },
  ];

  // Example savings goals
  const savingsGoals = [
    { id: 1, name: "Dream Vacation", current: 2500, target: 5000, deadline: "Dec 2025" },
    { id: 2, name: "New Car", current: 8500, target: 20000, deadline: "Jun 2026" },
    { id: 3, name: "Home Down Payment", current: 25000, target: 60000, deadline: "Jan 2028" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Savings Accounts</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Build your savings and reach your financial goals with our competitive interest rates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Savings Accounts</h2>
          <div className="space-y-4">
            {savingsAccounts.map((account) => (
              <Card key={account.id} className="overflow-hidden">
                <CardHeader className="bg-primary-50 dark:bg-gray-800">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <PiggyBankIcon className="h-5 w-5 text-primary-500" />
                      {account.name}
                    </CardTitle>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Account: {account.accountNumber}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Current Balance</div>
                      <div className="text-2xl font-bold">${account.balance.toFixed(2)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Interest Rate</div>
                      <div className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                        {account.interestRate}% APY
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <div>Last Interest Paid: ${account.lastInterestPaid.toFixed(2)}</div>
                    {account.goal && (
                      <div className="flex items-center">
                        <span className="mr-2">Goal Progress:</span>
                        <span className="font-medium">${account.balance.toFixed(0)}/${account.goal}</span>
                      </div>
                    )}
                  </div>
                  
                  {account.goal && (
                    <Progress 
                      value={(account.balance / account.goal) * 100} 
                      className="h-2 mt-2" 
                    />
                  )}
                </CardContent>
                <CardFooter className="border-t bg-gray-50 dark:bg-gray-800">
                  <div className="flex justify-between items-center w-full">
                    <Button variant="ghost" size="sm">
                      View Transactions
                    </Button>
                    <Button size="sm">
                      Deposit Funds
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-end mt-4">
            <Button className="gap-2">
              <PiggyBankIcon className="h-4 w-4" />
              Open New Savings Account
            </Button>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUpIcon className="h-5 w-5 text-primary-500" />
                Savings Goals
              </CardTitle>
              <CardDescription>Track progress toward your financial objectives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {savingsGoals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{goal.name}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        By {goal.deadline}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>${goal.current.toLocaleString()}</span>
                      <span className="font-medium">${goal.target.toLocaleString()}</span>
                    </div>
                    <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                    <div className="text-xs text-right text-gray-500 dark:text-gray-400">
                      {Math.round((goal.current / goal.target) * 100)}% Complete
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <ArrowRightIcon className="mr-2 h-4 w-4" /> Set a New Goal
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChartIcon className="h-5 w-5 text-primary-500" />
                Interest Calculator
              </CardTitle>
              <CardDescription>See how your savings can grow over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-primary-50 dark:bg-gray-800 rounded-lg text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  If you save $100 monthly for 5 years:
                </p>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  $6,450
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  (Includes $450 in interest at 3.25% APY)
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">
                <LineChartIcon className="mr-2 h-4 w-4" /> Full Calculator
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldIcon className="h-5 w-5 text-primary-500" />
                FDIC Insurance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Your savings are federally insured up to $250,000 per depositor by the FDIC. Learn more about how your money is protected.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="px-0">
                Learn More
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <div className="mt-10 p-6 bg-primary-50 dark:bg-gray-800 rounded-xl">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Savings Strategies</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-white dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Automatic Savings Plan</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Set up automatic transfers from your checking account to your savings accounts on a regular schedule.
            </p>
            <Button variant="outline" size="sm">Set Up Auto-Save</Button>
          </div>
          <div className="p-4 bg-white dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Round-Up Savings</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Round up your debit card purchases to the nearest dollar and save the difference automatically.
            </p>
            <Button variant="outline" size="sm">Enable Round-Ups</Button>
          </div>
          <div className="p-4 bg-white dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Savings Booster</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Analyze your spending habits to find opportunities to save more without affecting your lifestyle.
            </p>
            <Button variant="outline" size="sm">Get Personalized Tips</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
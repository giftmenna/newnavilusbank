import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { 
  LineChartIcon, 
  TrendingUpIcon, 
  PieChartIcon, 
  ArrowRightIcon, 
  AlertCircleIcon,
  RefreshCcwIcon,
  InfoIcon,
  BarChart3Icon
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function InvestmentsPage() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect to="/auth" />;
  }

  // Example investment portfolio data
  const portfolioSummary = {
    totalValue: 157342.68,
    totalReturn: 21569.44,
    totalReturnPercentage: 15.9,
    dailyChange: 1248.75,
    dailyChangePercentage: 0.8,
  };

  // Example asset allocation
  const assetAllocation = [
    { type: "Stocks", percentage: 65, value: 102272.74 },
    { type: "Bonds", percentage: 20, value: 31468.54 },
    { type: "Cash", percentage: 10, value: 15734.27 },
    { type: "Alternative", percentage: 5, value: 7867.13 },
  ];

  // Example investment accounts
  const investmentAccounts = [
    {
      id: 1,
      name: "Individual Brokerage",
      value: 78250.45,
      returnPercentage: 17.2,
      returnValue: 11489.32,
    },
    {
      id: 2,
      name: "Retirement Account (401k)",
      value: 64215.33,
      returnPercentage: 12.4,
      returnValue: 7078.21,
    },
    {
      id: 3,
      name: "Roth IRA",
      value: 14876.90,
      returnPercentage: 21.8,
      returnValue: 2667.97,
    },
  ];

  // Example stock holdings
  const stockHoldings = [
    { symbol: "AAPL", name: "Apple Inc.", shares: 25, price: 184.92, value: 4623.00, change: 1.25 },
    { symbol: "MSFT", name: "Microsoft Corp.", shares: 15, price: 417.88, value: 6268.20, change: 0.75 },
    { symbol: "AMZN", name: "Amazon.com Inc.", shares: 12, price: 178.15, value: 2137.80, change: -0.41 },
    { symbol: "GOOGL", name: "Alphabet Inc.", shares: 8, price: 165.98, value: 1327.84, change: 0.92 },
    { symbol: "TSLA", name: "Tesla Inc.", shares: 10, price: 175.54, value: 1755.40, change: -1.23 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Investments</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Monitor and manage your investment portfolio for long-term financial growth.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <LineChartIcon className="h-5 w-5 text-primary-500" />
                Portfolio Summary
              </CardTitle>
              <Button variant="ghost" size="sm" className="gap-1">
                <RefreshCcwIcon className="h-4 w-4" /> Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Value</div>
                <div className="text-xl font-bold">${portfolioSummary.totalValue.toLocaleString()}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Return</div>
                <div className="text-xl font-bold text-green-600">
                  +${portfolioSummary.totalReturn.toLocaleString()} ({portfolioSummary.totalReturnPercentage}%)
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Daily Change</div>
                <div className={`text-xl font-bold ${portfolioSummary.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {portfolioSummary.dailyChange >= 0 ? '+' : ''}${portfolioSummary.dailyChange.toLocaleString()} ({portfolioSummary.dailyChangePercentage}%)
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Accounts</div>
                <div className="text-xl font-bold">{investmentAccounts.length}</div>
              </div>
            </div>

            <div className="h-[200px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <BarChart3Icon className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400">Portfolio Performance Chart</p>
                <Button variant="link" size="sm" className="mt-1">View Detailed Analytics</Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between items-center w-full">
              <Button variant="ghost" size="sm">Investment History</Button>
              <Button variant="outline" size="sm">Manage Investments</Button>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary-500" />
              Asset Allocation
            </CardTitle>
            <CardDescription>How your investments are distributed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <PieChartIcon className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400">Asset Allocation Chart</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {assetAllocation.map((asset) => (
                <div key={asset.type} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{asset.type}</span>
                    <span className="text-sm">{asset.percentage}%</span>
                  </div>
                  <Progress value={asset.percentage} className="h-2" />
                  <div className="text-xs text-right text-gray-500 dark:text-gray-400">
                    ${asset.value.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <ArrowRightIcon className="mr-2 h-4 w-4" /> Rebalance Portfolio
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="accounts" className="mb-8">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="accounts">Investment Accounts</TabsTrigger>
          <TabsTrigger value="holdings">Stock Holdings</TabsTrigger>
        </TabsList>
        <TabsContent value="accounts" className="space-y-4">
          {investmentAccounts.map((account) => (
            <Card key={account.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{account.name}</CardTitle>
                  <Button variant="ghost" size="sm">View Details</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Current Value</div>
                    <div className="text-2xl font-bold">${account.value.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Return</div>
                    <div className="text-lg font-semibold text-green-600">
                      +${account.returnValue.toLocaleString()} ({account.returnPercentage}%)
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Trade</Button>
                  <Button size="sm" variant="outline">Deposit</Button>
                  <Button size="sm" variant="outline">Withdraw</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="holdings">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Your Stock Holdings</CardTitle>
                <Button variant="outline" size="sm">Trade Stocks</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-2">Symbol</th>
                      <th className="text-left py-3 px-2">Company</th>
                      <th className="text-right py-3 px-2">Shares</th>
                      <th className="text-right py-3 px-2">Price</th>
                      <th className="text-right py-3 px-2">Value</th>
                      <th className="text-right py-3 px-2">Daily Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockHoldings.map((stock) => (
                      <tr key={stock.symbol} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="font-medium py-3 px-2">{stock.symbol}</td>
                        <td className="py-3 px-2">{stock.name}</td>
                        <td className="text-right py-3 px-2">{stock.shares}</td>
                        <td className="text-right py-3 px-2">${stock.price.toFixed(2)}</td>
                        <td className="text-right py-3 px-2">${stock.value.toFixed(2)}</td>
                        <td className={`text-right py-3 px-2 ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.change}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUpIcon className="h-5 w-5 text-primary-500" />
              Investment Opportunities
            </CardTitle>
            <CardDescription>Personalized recommendations based on your goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-primary-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Diversification Opportunity</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Your portfolio is heavily weighted in technology stocks. Consider adding exposure to other sectors.
                </p>
                <Button size="sm">View Recommendations</Button>
              </div>
              <div className="p-4 bg-primary-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Tax-Loss Harvesting</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Opportunity to optimize your tax position by selling certain investments.
                </p>
                <Button size="sm">Explore Tax Strategies</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircleIcon className="h-5 w-5 text-primary-500" />
              Investment Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4 p-4 bg-amber-50 dark:bg-gray-800 rounded-lg">
              <InfoIcon className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Past performance is not indicative of future results.</strong> The value of investments and the income from them can go down as well as up and investors may not get back the amount originally invested.
                </p>
                <p>
                  Before making any investment decisions, please consult with a qualified financial advisor to ensure the investment aligns with your goals and risk tolerance.
                </p>
                <p>
                  Investment products are not FDIC insured, may lose value, and are not bank guaranteed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button size="lg" className="gap-2">
          <LineChartIcon className="h-5 w-5" />
          Schedule Investment Consultation
        </Button>
      </div>
    </div>
  );
}
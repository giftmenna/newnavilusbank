import { Link } from "wouter";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/date-utils";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@shared/schema";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  // Get the 5 most recent transactions
  const recentTransactions = transactions.slice(0, 5);

  // Get transaction type badge
  const getTransactionBadge = (type: string) => {
    switch (type) {
      case "deposit":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-none">
            Deposit
          </Badge>
        );
      case "withdrawal":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-none">
            Withdrawal
          </Badge>
        );
      case "transfer":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-none">
            Transfer
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border-none">
            Unknown
          </Badge>
        );
    }
  };

  // Format amount with color based on type
  const formatAmount = (type: string, amount: number | string) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    const formattedAmount = formatCurrency(numAmount);
    
    if (type === "deposit") {
      return <span className="text-green-600 dark:text-green-400">+{formattedAmount}</span>;
    } else {
      return <span className="text-red-600 dark:text-red-400">-{formattedAmount}</span>;
    }
  };

  // Get description based on transaction data
  const getDescription = (transaction: Transaction) => {
    const { type, recipient_info } = transaction;
    
    switch (type) {
      case "deposit":
        return "Deposit";
      case "withdrawal":
        return "Withdrawal";
      case "transfer":
        if (recipient_info) {
          const info = typeof recipient_info === "string" 
            ? JSON.parse(recipient_info) 
            : recipient_info;
            
          if (info.name) return `To: ${info.name}`;
          if (info.username) return `To: ${info.username}`;
        }
        return "Transfer";
      default:
        return type;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
        <Link href="/history">
          <Button variant="link">View All</Button>
        </Link>
      </div>
      
      <div className="overflow-hidden">
        {recentTransactions.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(new Date(transaction.timestamp))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTransactionBadge(transaction.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {getDescription(transaction)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                    {formatAmount(transaction.type, transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No recent transactions</p>
          </div>
        )}
      </div>
    </div>
  );
}

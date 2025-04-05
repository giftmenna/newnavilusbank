import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/date-utils";
import { Transaction } from "@shared/schema";
import { ArrowDownToLine, Eye } from "lucide-react";

interface TransactionHistoryProps {
  transactions: Transaction[];
  filter: {
    type: string;
    timeframe: string;
  };
  onFilterChange: (filter: any) => void;
}

export default function TransactionHistory({ transactions, filter, onFilterChange }: TransactionHistoryProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter transactions based on type and timeframe
  const filterTransactions = () => {
    let filtered = [...transactions];
    
    // Filter by type
    if (filter.type !== "all") {
      filtered = filtered.filter(t => t.type === filter.type);
    }
    
    // Filter by timeframe
    const now = new Date();
    if (filter.timeframe === "30days") {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(t => new Date(t.timestamp) >= thirtyDaysAgo);
    } else if (filter.timeframe === "90days") {
      const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(t => new Date(t.timestamp) >= ninetyDaysAgo);
    } else if (filter.timeframe === "year") {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      filtered = filtered.filter(t => new Date(t.timestamp) >= startOfYear);
    }
    
    return filtered;
  };
  
  const filteredTransactions = filterTransactions();
  
  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
    const { type, recipient_info, memo } = transaction;
    
    switch (type) {
      case "deposit":
        return memo || "Deposit";
      case "withdrawal":
        return memo || "Withdrawal";
      case "transfer":
        if (recipient_info) {
          const info = typeof recipient_info === "string" 
            ? JSON.parse(recipient_info) 
            : recipient_info;
            
          if (info.name) return `To: ${info.name}`;
          if (info.username) return `To: ${info.username}`;
          if (info.accountNumber) return `To Account: ${info.accountNumber}`;
        }
        return memo || "Transfer";
      default:
        return memo || type;
    }
  };

  // Generate receipt for download
  const generateReceipt = (transaction: Transaction) => {
    // Format transaction data for receipt
    const receiptData = `
      Transaction Receipt
      -------------------
      Transaction ID: ${transaction.id}
      Date & Time: ${formatDate(new Date(transaction.timestamp))}
      Type: ${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
      Amount: ${formatCurrency(parseFloat(transaction.amount.toString()))}
      ${transaction.memo ? `Memo: ${transaction.memo}` : ''}
      ${transaction.recipient_info ? `Recipient: ${JSON.stringify(transaction.recipient_info, null, 2)}` : ''}
      
      THANK YOU FOR USING NIVALUS BANK!
    `;
    
    // Create a Blob with the receipt data
    const blob = new Blob([receiptData], { type: 'text/plain' });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a link element
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${transaction.id}.txt`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Render pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="py-3 flex items-center justify-between mt-4">
        {/* Mobile pagination */}
        <div className="flex-1 flex justify-between sm:hidden">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
        
        {/* Desktop pagination */}
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, filteredTransactions.length)}
              </span>{" "}
              of <span className="font-medium">{filteredTransactions.length}</span> results
            </p>
          </div>
          <div>
            <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <Button
                variant="outline"
                className="relative inline-flex items-center px-2 py-2 rounded-l-md text-gray-500 dark:text-gray-400"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </Button>
              
              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  className={`relative inline-flex items-center px-4 py-2 ${
                    currentPage === page
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="outline"
                className="relative inline-flex items-center px-2 py-2 rounded-r-md text-gray-500 dark:text-gray-400"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 md:mb-0">Transaction History</h2>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <Select
            value={filter.type}
            onValueChange={(value) => onFilterChange({ type: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Types" />
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
            onValueChange={(value) => onFilterChange({ timeframe: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Last 30 Days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <ArrowDownToLine className="h-5 w-5 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {paginatedTransactions.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date & Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedTransactions.map((transaction) => (
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                    <Button 
                      variant="link" 
                      onClick={() => generateReceipt(transaction)}
                      className="text-primary hover:text-primary/80"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
          </div>
        )}
      </div>
      
      {renderPagination()}
    </div>
  );
}

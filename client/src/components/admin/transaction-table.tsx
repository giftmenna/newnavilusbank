import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Transaction, User } from "@shared/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, FileDown, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { formatDate } from "@/utils/date-utils";
import { formatCurrency } from "@/utils/format-currency";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TransactionTableProps {
  transactions: Transaction[];
  users: User[];
  filter: {
    type: string;
    timeframe: string;
  };
  compact?: boolean;
}

export default function TransactionTable({ transactions, users, filter, compact = false }: TransactionTableProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  
  // Find user by ID
  const getUserById = (id: number) => {
    return users.find(u => u.id === id);
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
    const { type, recipient_info, memo, user_id } = transaction;
    const user = getUserById(user_id);
    
    let userPrefix = user ? `${user.username}: ` : "";
    
    switch (type) {
      case "deposit":
        return userPrefix + (memo || "Deposit");
      case "withdrawal":
        return userPrefix + (memo || "Withdrawal");
      case "transfer":
        if (recipient_info) {
          const info = typeof recipient_info === "string" 
            ? JSON.parse(recipient_info) 
            : recipient_info;
            
          if (info.name) return userPrefix + `To: ${info.name}`;
          if (info.username) return userPrefix + `To: ${info.username}`;
          if (info.accountNumber) return userPrefix + `To Account: ${info.accountNumber}`;
        }
        return userPrefix + (memo || "Transfer");
      default:
        return userPrefix + (memo || type);
    }
  };

  // View receipt
  const viewReceipt = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowReceiptDialog(true);
  };

  // Generate receipt for download
  const generateReceipt = (transaction: Transaction) => {
    // Format transaction data for receipt
    const user = getUserById(transaction.user_id);
    const userName = user ? user.username : "Unknown User";
    
    const receiptData = `
      Transaction Receipt
      -------------------
      Transaction ID: ${transaction.id}
      User: ${userName} (ID: ${transaction.user_id})
      Date & Time: ${formatDate(new Date(transaction.timestamp))}
      Type: ${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
      Amount: ${formatCurrency(parseFloat(transaction.amount.toString()))}
      ${transaction.memo ? `Memo: ${transaction.memo}` : ''}
      ${transaction.recipient_info ? `Recipient: ${JSON.stringify(transaction.recipient_info, null, 2)}` : ''}
      ${transaction.created_by ? `Created By: Admin (ID: ${transaction.created_by})` : ''}
      
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
  
  // Confirm transaction deletion
  const confirmDelete = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDeleteDialog(true);
  };
  
  // Delete transaction
  const deleteTransaction = async () => {
    if (!selectedTransaction) return;
    
    try {
      setIsDeleting(true);
      
      const response = await apiRequest(
        "DELETE", 
        `/api/admin/transactions/${selectedTransaction.id}`
      );
      
      if (response.ok) {
        // Invalidate transactions queries to refresh the data
        queryClient.invalidateQueries({ queryKey: ["/api/admin/transactions"] });
        queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
        
        toast({
          title: "Transaction deleted",
          description: `Transaction #${selectedTransaction.id} was successfully deleted.`,
          variant: "default",
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete transaction");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete transaction",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
              {!compact && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
              )}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date & Time</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{transaction.id}</td>
                {!compact && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {getUserById(transaction.user_id)?.username || `ID: ${transaction.user_id}`}
                  </td>
                )}
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => viewReceipt(transaction)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View Receipt</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => generateReceipt(transaction)}>
                        <FileDown className="mr-2 h-4 w-4" />
                        <span>Download Receipt</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => confirmDelete(transaction)} 
                        className="text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Receipt Dialog */}
      {selectedTransaction && (
        <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Transaction Receipt</DialogTitle>
              <DialogDescription>
                Details for transaction #{selectedTransaction.id}
              </DialogDescription>
            </DialogHeader>
            
            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4">
              <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction ID</dt>
                  <dd className="text-sm font-mono text-gray-900 dark:text-white">{selectedTransaction.id}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">User</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">
                    {getUserById(selectedTransaction.user_id)?.username || `ID: ${selectedTransaction.user_id}`}
                  </dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Date & Time</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">
                    {formatDate(new Date(selectedTransaction.timestamp))}
                  </dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">
                    {selectedTransaction.type.charAt(0).toUpperCase() + selectedTransaction.type.slice(1)}
                  </dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">
                    {formatCurrency(parseFloat(selectedTransaction.amount.toString()))}
                  </dd>
                </div>
                {selectedTransaction.memo && (
                  <div className="py-3 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Memo</dt>
                    <dd className="text-sm text-gray-900 dark:text-white">{selectedTransaction.memo}</dd>
                  </div>
                )}
                {selectedTransaction.recipient_info && (
                  <div className="py-3 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Recipient Info</dt>
                    <dd className="text-sm text-right font-mono text-gray-900 dark:text-white">
                      {JSON.stringify(
                        typeof selectedTransaction.recipient_info === 'string'
                          ? JSON.parse(selectedTransaction.recipient_info)
                          : selectedTransaction.recipient_info,
                        null,
                        2
                      )}
                    </dd>
                  </div>
                )}
                {selectedTransaction.created_by && (
                  <div className="py-3 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created By</dt>
                    <dd className="text-sm text-gray-900 dark:text-white">
                      Admin (ID: {selectedTransaction.created_by})
                    </dd>
                  </div>
                )}
              </dl>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => generateReceipt(selectedTransaction)}
                className="flex items-center"
              >
                <FileDown className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
              <Button onClick={() => setShowReceiptDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Confirmation Dialog */}
      {selectedTransaction && (
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center text-red-600 dark:text-red-400">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Delete Transaction
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete transaction #{selectedTransaction.id}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteTransaction}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Transaction"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/date-utils";
import { useLocation } from "wouter";

interface SuccessModalProps {
  isOpen: boolean;
  transactionDetails: any;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, transactionDetails, onClose }: SuccessModalProps) {
  const [, setLocation] = useLocation();

  // Generate receipt for download
  const generateReceipt = () => {
    if (!transactionDetails) return;
    
    const { transaction } = transactionDetails;
    
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

  const handleDone = () => {
    onClose();
    setLocation("/dashboard");
  };

  const getRecipientName = () => {
    if (!transactionDetails || !transactionDetails.transaction.recipient_info) return "N/A";
    
    const info = typeof transactionDetails.transaction.recipient_info === "string"
      ? JSON.parse(transactionDetails.transaction.recipient_info)
      : transactionDetails.transaction.recipient_info;
      
    if (info.name) return info.name;
    if (info.username) return info.username;
    if (info.cardHolder) return info.cardHolder;
    
    return "Recipient";
  };

  useEffect(() => {
    // When modal is closed, reset transactionDetails
    if (!isOpen && transactionDetails) {
      onClose();
    }
  }, [isOpen, transactionDetails, onClose]);

  if (!transactionDetails) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-300" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Transfer Successful!</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your money is on its way.</p>
        </div>
        
        <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-6">
          <dl className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="py-3 flex justify-between">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction ID</dt>
              <dd className="text-sm font-mono text-gray-900 dark:text-white">
                {transactionDetails.transaction.id}
              </dd>
            </div>
            <div className="py-3 flex justify-between">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Date & Time</dt>
              <dd className="text-sm text-gray-900 dark:text-white">
                {formatDate(new Date(transactionDetails.transaction.timestamp))}
              </dd>
            </div>
            <div className="py-3 flex justify-between">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount</dt>
              <dd className="text-sm text-gray-900 dark:text-white">
                {formatCurrency(parseFloat(transactionDetails.transaction.amount.toString()))}
              </dd>
            </div>
            <div className="py-3 flex justify-between">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Recipient</dt>
              <dd className="text-sm text-gray-900 dark:text-white">
                {getRecipientName()}
              </dd>
            </div>
            {transactionDetails.transaction.memo && (
              <div className="py-3 flex justify-between">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Memo</dt>
                <dd className="text-sm text-gray-900 dark:text-white">
                  {transactionDetails.transaction.memo}
                </dd>
              </div>
            )}
            <div className="py-3 flex justify-between">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">New Balance</dt>
              <dd className="text-sm text-gray-900 dark:text-white">
                {formatCurrency(parseFloat(transactionDetails.newBalance.toString()))}
              </dd>
            </div>
          </dl>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={generateReceipt}
          >
            View Receipt
          </Button>
          <Button 
            className="flex-1" 
            onClick={handleDone}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

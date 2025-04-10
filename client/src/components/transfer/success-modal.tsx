import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, FileText } from "lucide-react";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/date-utils";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface SuccessModalProps {
  isOpen: boolean;
  transactionDetails: any;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, transactionDetails, onClose }: SuccessModalProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Mask account number function
  const maskAccountNumber = (accountNumber: string) => {
    if (!accountNumber) return "N/A";
    const lastFour = accountNumber.slice(-4);
    return `${"*".repeat(Math.max(0, accountNumber.length - 4))}${lastFour}`;
  };

  // Generate PDF-style receipt for download
  const generateReceipt = () => {
    if (!transactionDetails) return;
    
    const { transaction } = transactionDetails;
    const transactionId = transaction.transaction_id || transaction.id;
    const senderAccount = transaction.sender_account || "Unknown";
    const receiverAccount = transaction.recipient_info?.accountNumber || "N/A";
    
    try {
      const receiptData = `
NIVALUS BANK - TRANSACTION RECEIPT
----------------------------------
Transaction ID: ${transactionId}
Date & Time: ${formatDate(new Date(transaction.timestamp))}
Type: ${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
Amount: ${formatCurrency(parseFloat(transaction.amount.toString()))}
Sender's Account: ${maskAccountNumber(senderAccount)}
Recipient's Account: ${receiverAccount}
Recipient: ${getRecipientName()}
${transaction.memo ? `Memo: ${transaction.memo}` : ''}

Thank you for using Nivalus Bank!
This is an official receipt for your records.
Transaction reference: ${transactionId}
Generated on: ${formatDate(new Date())}
      `;
      
      const blob = new Blob([receiptData], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${transactionId}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Receipt Downloaded",
        description: "The receipt has been downloaded to your device.",
      });
    } catch (error) {
      console.error("Error generating receipt:", error);
      toast({
        title: "Error",
        description: "There was an error generating the receipt. Please try again.",
        variant: "destructive",
      });
    }
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
    if (!isOpen && transactionDetails) {
      onClose();
    }
  }, [isOpen, transactionDetails, onClose]);

  if (!transactionDetails) return null;

  const { transaction } = transactionDetails;
  const senderAccount = transaction.sender_account || "Unknown";
  const receiverAccount = transaction.recipient_info?.accountNumber || "N/A";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md" aria-describedby="transfer-success-description">
        <DialogTitle className="sr-only">Transfer Successful</DialogTitle>
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-300" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Transfer Successful!</h3>
          <p id="transfer-success-description" className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your money is on its way.</p>
        </div>
        
        <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-6">
          <dl className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="py-3 flex justify-between">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction ID</dt>
              <dd className="text-sm font-mono text-gray-900 dark:text-white">
                {transaction.transaction_id || transaction.id}
              </dd>
            </div>
            <div className="py-3 flex justify-between">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Date & Time</dt>
              <dd className="text-sm text-gray-900 dark:text-white">
                {formatDate(new Date(transaction.timestamp))}
              </dd>
            </div>
            <div className="py-3 flex justify-between">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount</dt>
              <dd className="text-sm text-gray-900 dark:text-white">
                {formatCurrency(parseFloat(transaction.amount.toString()))}
              </dd>
            </div>
            <div className="py-3 flex justify-between">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">From Account</dt>
              <dd className="text-sm text-gray-900 dark:text-white">
                {maskAccountNumber(senderAccount)}
              </dd>
            </div>
            <div className="py-3 flex justify-between">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">To Account</dt>
              <dd className="text-sm text-gray-900 dark:text-white">
                {receiverAccount}
              </dd>
            </div>
            <div className="py-3 flex justify-between">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Recipient</dt>
              <dd className="text-sm text-gray-900 dark:text-white">
                {getRecipientName()}
              </dd>
            </div>
            {transaction.memo && (
              <div className="py-3 flex justify-between">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Memo</dt>
                <dd className="text-sm text-gray-900 dark:text-white">
                  {transaction.memo}
                </dd>
              </div>
            )}
            <div className="py-3 flex justify-between">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Transfer Type</dt>
              <dd className="text-sm text-gray-900 dark:text-white">
                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
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
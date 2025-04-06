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

interface SuccessModalProps {
  isOpen: boolean;
  transactionDetails: any;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, transactionDetails, onClose }: SuccessModalProps) {
  const [, setLocation] = useLocation();

  // Generate PDF-style receipt for download
  const generateReceipt = () => {
    if (!transactionDetails) return;
    
    const { transaction } = transactionDetails;
    const transactionId = transaction.transaction_id || transaction.id;
    
    // Create HTML for the receipt
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Transaction Receipt</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          color: #333;
        }
        .receipt {
          border: 1px solid #ddd;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          background-color: #fff;
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 2px solid #eee;
          margin-bottom: 20px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #4f46e5;
          margin-bottom: 10px;
        }
        .title {
          font-size: 18px;
          color: #555;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .label {
          font-weight: bold;
          color: #555;
        }
        .value {
          text-align: right;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 14px;
          color: #888;
        }
        .success-mark {
          text-align: center;
          font-size: 18px;
          color: #10b981;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <div class="logo">NIVALUS BANK</div>
          <div class="title">Transaction Receipt</div>
        </div>
        
        <div class="success-mark">✓ Transaction Completed Successfully</div>
        
        <div class="info-row">
          <div class="label">Transaction ID:</div>
          <div class="value">${transactionId}</div>
        </div>
        
        <div class="info-row">
          <div class="label">Date & Time:</div>
          <div class="value">${formatDate(new Date(transaction.timestamp))}</div>
        </div>
        
        <div class="info-row">
          <div class="label">Transaction Type:</div>
          <div class="value">${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</div>
        </div>
        
        <div class="info-row">
          <div class="label">Amount:</div>
          <div class="value">${formatCurrency(parseFloat(transaction.amount.toString()))}</div>
        </div>
        
        ${transaction.memo ? `
        <div class="info-row">
          <div class="label">Memo:</div>
          <div class="value">${transaction.memo}</div>
        </div>
        ` : ''}
        
        <div class="info-row">
          <div class="label">Recipient:</div>
          <div class="value">${getRecipientName()}</div>
        </div>
        
        <div class="footer">
          <p>Thank you for using Nivalus Bank!</p>
          <p>This is an official receipt for your records.</p>
          <p>Transaction reference: ${transactionId}</p>
        </div>
      </div>
    </body>
    </html>
    `;
    
    // Create a Blob with the HTML receipt
    const blob = new Blob([html], { type: 'text/html' });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Open the receipt in a new window (like a print preview)
    const receiptWindow = window.open(url, '_blank');
    
    // Automatically print the receipt once it's loaded
    if (receiptWindow) {
      receiptWindow.addEventListener('load', () => {
        receiptWindow.print();
      });
    }
    
    // URL will be automatically revoked when the page is unloaded
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
                {transactionDetails.transaction.transaction_id || transactionDetails.transaction.id}
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

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Footer from "@/components/layout/footer";
import TransferForm from "@/components/transfer/transfer-form";
import PinModal from "@/components/transfer/pin-modal";
import LoadingModal from "@/components/transfer/loading-modal";
import SuccessModal from "@/components/transfer/success-modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type TransferData = {
  amount: number;
  recipientInfo: Record<string, any>;
  transferType: string;
  memo?: string;
};

export default function TransferPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [transferData, setTransferData] = useState<TransferData | null>(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<any>(null);

  const transferMutation = useMutation({
    mutationFn: async (data: any) => {
      // Make sure recipientInfo is stringified correctly if it's an object
      if (data.recipientInfo && typeof data.recipientInfo === 'object') {
        data.recipientInfo = JSON.stringify(data.recipientInfo);
      }
      
      console.log("Sending transfer data:", data);
      const res = await apiRequest("POST", "/api/transfer", data);
      return await res.json();
    },
    onSuccess: (data) => {
      console.log("Transfer success:", data);
      setTransactionDetails(data);
      setIsLoadingModalOpen(false);
      setIsSuccessModalOpen(true);
      
      // Immediately invalidate transactions cache to show the new transaction
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      
      // Also refresh user data to get the updated balance
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: Error) => {
      console.error("Transfer error:", error);
      setIsLoadingModalOpen(false);
      toast({
        title: "Transfer failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleTransferSubmit = (data: TransferData) => {
    setTransferData(data);
    setIsPinModalOpen(true);
  };

  const handlePinSubmit = (pin: string) => {
    if (!transferData) return;
    
    setIsPinModalOpen(false);
    setIsLoadingModalOpen(true);
    
    // Start progress animation
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 1000);
    
    // Submit transfer after 20 seconds (or can be reduced to make it faster)
    setTimeout(() => {
      clearInterval(interval);
      transferMutation.mutate({
        ...transferData,
        pin,
      });
    }, 20000); // This can be reduced if needed
  };

  const handlePinCancel = () => {
    setIsPinModalOpen(false);
  };

  const handleSuccessClose = () => {
    setIsSuccessModalOpen(false);
    // Refresh transactions when modal is closed
    queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <TransferForm 
            onSubmit={handleTransferSubmit} 
            userBalance={user?.balance?.toString() || "0"} 
          />
          
          <PinModal 
            isOpen={isPinModalOpen} 
            onSubmit={handlePinSubmit} 
            onCancel={handlePinCancel} 
          />
          
          <LoadingModal 
            isOpen={isLoadingModalOpen} 
            progress={progress} 
          />
          
          <SuccessModal 
            isOpen={isSuccessModalOpen} 
            transactionDetails={transactionDetails} 
            onClose={handleSuccessClose} 
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

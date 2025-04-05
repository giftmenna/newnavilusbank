import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatCurrency } from "@/utils/format-currency";

// Transfer types with their icons
const transferTypes = [
  { id: "direct", label: "Direct", icon: "user" },
  { id: "wire", label: "Wire", icon: "building" },
  { id: "bank", label: "Bank", icon: "bank" },
  { id: "card", label: "Card", icon: "credit-card" },
  { id: "p2p", label: "P2P", icon: "smartphone" },
];

interface TransferFormProps {
  onSubmit: (data: any) => void;
  userBalance: string;
}

export default function TransferForm({ onSubmit, userBalance }: TransferFormProps) {
  const [transferType, setTransferType] = useState("direct");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [recipientInfo, setRecipientInfo] = useState({
    username: "",
    swift: "",
    bankName: "",
    accountNumber: "",
    cardNumber: "",
    cardHolder: "",
    phoneNumber: "",
    platform: "",
  });

  const handleTransferTypeChange = (value: string) => {
    setTransferType(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare recipient info based on transfer type
    let formattedRecipientInfo = {};
    
    switch (transferType) {
      case "direct":
        formattedRecipientInfo = {
          type: "direct",
          username: recipientInfo.username,
        };
        break;
      case "wire":
        formattedRecipientInfo = {
          type: "wire",
          swift: recipientInfo.swift,
          bankName: recipientInfo.bankName,
          accountNumber: recipientInfo.accountNumber,
        };
        break;
      case "bank":
        formattedRecipientInfo = {
          type: "bank",
          bankName: recipientInfo.bankName,
          accountNumber: recipientInfo.accountNumber,
        };
        break;
      case "card":
        formattedRecipientInfo = {
          type: "card",
          cardNumber: recipientInfo.cardNumber,
          cardHolder: recipientInfo.cardHolder,
        };
        break;
      case "p2p":
        formattedRecipientInfo = {
          type: "p2p",
          phoneNumber: recipientInfo.phoneNumber,
          platform: recipientInfo.platform,
        };
        break;
    }
    
    // Submit data
    onSubmit({
      amount: parseFloat(amount),
      transferType,
      recipientInfo: formattedRecipientInfo,
      memo,
    });
  };

  // Function to update recipient info
  const updateRecipientInfo = (field: string, value: string) => {
    setRecipientInfo({
      ...recipientInfo,
      [field]: value,
    });
  };

  // Form field based on transfer type
  const renderTransferFields = () => {
    switch (transferType) {
      case "direct":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="recipient-username">Recipient Username or Email</Label>
              <Input
                id="recipient-username"
                value={recipientInfo.username}
                onChange={(e) => updateRecipientInfo("username", e.target.value)}
                placeholder="Enter username or email"
                required
              />
            </div>
          </div>
        );
      case "wire":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="swift-code">SWIFT Code</Label>
              <Input
                id="swift-code"
                value={recipientInfo.swift}
                onChange={(e) => updateRecipientInfo("swift", e.target.value)}
                placeholder="Enter SWIFT code"
                required
              />
            </div>
            <div>
              <Label htmlFor="bank-name">Bank Name</Label>
              <Input
                id="bank-name"
                value={recipientInfo.bankName}
                onChange={(e) => updateRecipientInfo("bankName", e.target.value)}
                placeholder="Enter bank name"
                required
              />
            </div>
            <div>
              <Label htmlFor="account-number">Account Number</Label>
              <Input
                id="account-number"
                value={recipientInfo.accountNumber}
                onChange={(e) => updateRecipientInfo("accountNumber", e.target.value)}
                placeholder="Enter account number"
                required
              />
            </div>
          </div>
        );
      case "bank":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="routing-number">Routing Number</Label>
              <Input
                id="routing-number"
                placeholder="Enter routing number"
                required
              />
            </div>
            <div>
              <Label htmlFor="account-number">Account Number</Label>
              <Input
                id="account-number"
                value={recipientInfo.accountNumber}
                onChange={(e) => updateRecipientInfo("accountNumber", e.target.value)}
                placeholder="Enter account number"
                required
              />
            </div>
            <div>
              <Label htmlFor="bank-name">Bank Name</Label>
              <Input
                id="bank-name"
                value={recipientInfo.bankName}
                onChange={(e) => updateRecipientInfo("bankName", e.target.value)}
                placeholder="Enter bank name"
                required
              />
            </div>
          </div>
        );
      case "card":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="card-number">Card Number</Label>
              <Input
                id="card-number"
                value={recipientInfo.cardNumber}
                onChange={(e) => updateRecipientInfo("cardNumber", e.target.value)}
                placeholder="Enter card number"
                required
              />
            </div>
            <div>
              <Label htmlFor="card-holder">Cardholder Name</Label>
              <Input
                id="card-holder"
                value={recipientInfo.cardHolder}
                onChange={(e) => updateRecipientInfo("cardHolder", e.target.value)}
                placeholder="Enter cardholder name"
                required
              />
            </div>
          </div>
        );
      case "p2p":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone-number">Phone Number</Label>
              <Input
                id="phone-number"
                value={recipientInfo.phoneNumber}
                onChange={(e) => updateRecipientInfo("phoneNumber", e.target.value)}
                placeholder="Enter phone number"
                required
              />
            </div>
            <div>
              <Label htmlFor="platform">Platform</Label>
              <Input
                id="platform"
                value={recipientInfo.platform}
                onChange={(e) => updateRecipientInfo("platform", e.target.value)}
                placeholder="e.g., PayPal, Venmo"
                required
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Money</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="transfer-form" onSubmit={handleSubmit}>
          {/* Transfer Type Selection */}
          <div className="mb-6">
            <Label className="block mb-2">Transfer Type</Label>
            <RadioGroup
              value={transferType}
              onValueChange={handleTransferTypeChange}
              className="grid grid-cols-2 md:grid-cols-5 gap-4"
            >
              {transferTypes.map((type) => (
                <div key={type.id} className="relative">
                  <RadioGroupItem
                    value={type.id}
                    id={`type-${type.id}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`type-${type.id}`}
                    className="flex flex-col items-center p-3 border rounded-md text-center cursor-pointer border-gray-300 dark:border-gray-600 
                      peer-data-[state=checked]:border-primary-500 peer-data-[state=checked]:bg-primary-50 peer-data-[state=checked]:text-primary-700 
                      dark:peer-data-[state=checked]:bg-primary-900 dark:peer-data-[state=checked]:text-primary-200 
                      hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {type.id === "direct" && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                    {type.id === "wire" && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    )}
                    {type.id === "bank" && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                      </svg>
                    )}
                    {type.id === "card" && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    )}
                    {type.id === "p2p" && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    )}
                    <span className="text-sm">{type.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          {/* Dynamic form fields based on transfer type */}
          {renderTransferFields()}
          
          {/* Common fields for all transfer types */}
          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                </div>
                <Input
                  type="number"
                  id="amount"
                  className="pl-7"
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Available balance: {formatCurrency(parseFloat(userBalance))}
              </p>
            </div>
            
            <div>
              <Label htmlFor="memo">Memo (Optional)</Label>
              <Textarea
                id="memo"
                placeholder="Add a note for this transfer"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mt-8">
            <Button type="submit" className="w-full">
              Continue to Verification
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

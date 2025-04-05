import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface PinModalProps {
  isOpen: boolean;
  onSubmit: (pin: string) => void;
  onCancel: () => void;
}

export default function PinModal({ isOpen, onSubmit, onCancel }: PinModalProps) {
  const [pin, setPin] = useState(["", "", "", ""]);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  
  // Focus the first input when the modal opens
  useEffect(() => {
    if (isOpen && inputRefs[0].current) {
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Reset PIN when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPin(["", "", "", ""]);
    }
  }, [isOpen]);
  
  // Handle input change
  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    
    // Update the PIN array
    const newPin = [...pin];
    newPin[index] = value.slice(0, 1); // Only take the first character
    setPin(newPin);
    
    // If a digit was entered and there's a next input, focus it
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };
  
  // Handle key down event
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // If backspace is pressed and the input is empty, focus the previous input
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };
  
  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedDigits = pastedData.replace(/\D/g, "").slice(0, 4);
    
    // Fill the PIN array with pasted digits
    const newPin = [...pin];
    for (let i = 0; i < pastedDigits.length; i++) {
      if (i < 4) {
        newPin[i] = pastedDigits[i];
      }
    }
    
    setPin(newPin);
    
    // Focus the appropriate input
    if (pastedDigits.length < 4 && pastedDigits.length > 0) {
      inputRefs[pastedDigits.length].current?.focus();
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredPin = pin.join("");
    
    // Only submit if all digits are entered
    if (enteredPin.length === 4) {
      onSubmit(enteredPin);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm with PIN</DialogTitle>
          <DialogDescription>
            Please enter your 4-digit PIN to confirm this transaction.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="flex justify-center space-x-2">
              {pin.map((digit, index) => (
                <Input
                  key={index}
                  ref={inputRefs[index]}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-12 text-center text-xl"
                  required
                  autoComplete="off"
                />
              ))}
            </div>
          </div>
          
          <DialogFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={pin.some(digit => !digit)}
            >
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

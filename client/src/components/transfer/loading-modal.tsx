import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface LoadingModalProps {
  isOpen: boolean;
  progress: number;
}

export default function LoadingModal({ isOpen, progress }: LoadingModalProps) {
  return (
    <Dialog open={isOpen} modal>
      <DialogContent className="bg-gray-900 bg-opacity-90 border-none max-w-md text-white" showX={false}>
        <div className="text-center py-6">
          <div className="relative inline-flex">
            <svg className="w-32 h-32" viewBox="0 0 100 100">
              <circle 
                className="text-gray-700" 
                strokeWidth="4" 
                stroke="currentColor" 
                fill="transparent" 
                r="45" 
                cx="50" 
                cy="50" 
              />
              <circle 
                className="text-primary" 
                strokeWidth="4" 
                stroke="currentColor" 
                fill="transparent" 
                r="45" 
                cx="50" 
                cy="50" 
                strokeDasharray="283" 
                strokeDashoffset={283 - (283 * progress) / 100}
                style={{
                  transition: "stroke-dashoffset 0.5s ease-in-out"
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-semibold text-white">{Math.round(progress)}%</span>
            </div>
          </div>
          <p className="mt-4 text-white text-lg">Processing your transfer...</p>
          <p className="text-sm text-gray-400 mt-2">Please do not close this window</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

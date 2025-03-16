import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface MollieCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkoutUrl?: string;
}

export function MollieCheckoutModal({ isOpen, onClose, checkoutUrl }: MollieCheckoutModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] sm:h-[600px] p-0">
        {checkoutUrl ? (
          <iframe
            src={checkoutUrl}
            className="w-full h-full border-none rounded-lg"
            title="Mollie Checkout"
            allow="payment"
            sandbox="allow-same-origin allow-scripts allow-forms allow-modals"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
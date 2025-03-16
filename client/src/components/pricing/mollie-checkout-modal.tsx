import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface MollieCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkoutUrl?: string;
}

export function MollieCheckoutModal({ isOpen, onClose, checkoutUrl }: MollieCheckoutModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] sm:h-[600px] p-0">
        {checkoutUrl && (
          <iframe
            src={checkoutUrl}
            className="w-full h-full border-none"
            title="Mollie Checkout"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

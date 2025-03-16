import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { MolliePaymentForm } from "./mollie-payment-form";
import { useToast } from "@/hooks/use-toast";

interface MollieCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
}

export function MollieCheckoutModal({ isOpen, onClose, amount }: MollieCheckoutModalProps) {
  const { toast } = useToast();

  const handleSuccess = () => {
    toast({
      title: "Erfolg",
      description: "Ihre Zahlung wurde erfolgreich verarbeitet",
    });
    onClose();
  };

  const handleError = (error: Error) => {
    toast({
      title: "Fehler",
      description: "Bei der Zahlung ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
      variant: "destructive"
    });
    console.error('Payment error:', error);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <MolliePaymentForm
          amount={amount}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </DialogContent>
    </Dialog>
  );
}
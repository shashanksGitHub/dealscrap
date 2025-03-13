import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookiesAccepted");
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Diese Website verwendet Cookies, um Ihr Surferlebnis zu verbessern. Durch die Nutzung unserer Website stimmen Sie allen Cookies gemäß unserer Datenschutzrichtlinie zu.
        </p>
        <Button onClick={acceptCookies} className="whitespace-nowrap">
          Akzeptieren
        </Button>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Link } from "wouter";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Überprüfen, ob das Einverständnis bereits gegeben wurde
    const cookieConsent = localStorage.getItem("cookie-consent");
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cookie-consent", "all");
    setIsVisible(false);
  };

  const acceptEssential = () => {
    localStorage.setItem("cookie-consent", "essential");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-muted/20 p-4 shadow-lg z-50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Wir verwenden Cookies</h3>
            <p className="text-muted-foreground text-sm mb-2">
              Diese Website verwendet Cookies, um Ihr Browsererlebnis zu verbessern und personalisierte Inhalte bereitzustellen.
              Mehr Informationen finden Sie in unserer <Link href="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</Link>.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={acceptEssential}>
              Nur essenzielle Cookies
            </Button>
            <Button size="sm" onClick={acceptAll}>
              Alle akzeptieren
            </Button>
          </div>
          <button 
            onClick={() => setIsVisible(false)} 
            className="absolute top-2 right-2 md:relative md:top-0 md:right-0 p-1 rounded-full hover:bg-muted"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}

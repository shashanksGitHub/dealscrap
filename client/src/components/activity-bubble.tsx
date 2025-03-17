import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Aktivitätsdaten mit realen Firmennamen und 50er Schritten bei den Leads
const activities = [
  { name: "Müller & Partner GmbH", leads: 50, city: "München" },
  { name: "Schneider IT Solutions KG", leads: 100, city: "Hamburg" },
  { name: "Weber Consulting GmbH", leads: 150, city: "Berlin" },
  { name: "Bergmann Logistik AG", leads: 200, city: "Frankfurt" },
  { name: "Krause Engineering GmbH", leads: 250, city: "Köln" },
  { name: "Schmidt Immobilien AG", leads: 300, city: "Stuttgart" },
  { name: "Bachmann Software Solutions AG", leads: 350, city: "Düsseldorf" },
  { name: "Huber Energie GmbH", leads: 400, city: "Leipzig" },
  { name: "Becker Optik GmbH", leads: 450, city: "Dresden" },
  { name: "Hoffmann Elektronik GmbH", leads: 500, city: "Nürnberg" },
  { name: "Maier Medizintechnik KG", leads: 600, city: "München" },
  { name: "Pfeiffer Chemie GmbH", leads: 700, city: "Hamburg" },
  { name: "Keller & Partner AG", leads: 800, city: "Berlin" },
  { name: "Voigt Transport GmbH", leads: 900, city: "Frankfurt" },
  { name: "Roth Pharma KG", leads: 1000, city: "Köln" }
];

export function ActivityBubble() {
  const [currentActivity, setCurrentActivity] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentActivity((prev) => (prev + 1) % activities.length);
        setIsVisible(true);
      }, 500);
    }, 15000); // Längere Anzeigedauer

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed max-w-[1200px] mx-auto left-1/2 -translate-x-1/2 bottom-6 px-6 lg:px-8 w-full">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="bg-background/80 backdrop-blur-lg border border-primary/10 rounded-lg p-4 shadow-lg w-full sm:max-w-sm"
          >
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Schließen</span>
            </button>

            <div>
              <p className="text-sm font-medium">
                Scrapingvorgang abgeschlossen
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {activities[currentActivity].name} hat gerade {activities[currentActivity].leads} Leads gescraped.
              </p>
              <div className="flex items-center gap-1 mt-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100/20 text-emerald-700 text-xs font-medium">
                  <Check className="w-3 h-3" />
                  Verifiziert
                </span>
                <span className="text-xs text-muted-foreground">
                  • vor {Math.floor(Math.random() * 10) + 1} Minuten
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
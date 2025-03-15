import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Aktivitätsdaten mit realen Firmennamen
const activities = [
  { name: "Müller & Partner GmbH", leads: 125, city: "München" },
  { name: "Schneider IT Solutions KG", leads: 80, city: "Hamburg" },
  { name: "Weber Consulting GmbH", leads: 200, city: "Berlin" },
  { name: "Bergmann Logistik AG", leads: 150, city: "Frankfurt" },
  { name: "Krause Engineering GmbH", leads: 95, city: "Köln" },
  { name: "Schmidt Immobilien AG", leads: 175, city: "Stuttgart" },
  { name: "Bachmann Software Solutions AG", leads: 130, city: "Düsseldorf" },
  { name: "Huber Energie GmbH", leads: 110, city: "Leipzig" },
  { name: "Becker Optik GmbH", leads: 85, city: "Dresden" },
  { name: "Hoffmann Elektronik GmbH", leads: 160, city: "Nürnberg" },
  { name: "Maier Medizintechnik KG", leads: 95, city: "München" },
  { name: "Pfeiffer Chemie GmbH", leads: 140, city: "Hamburg" },
  { name: "Keller & Partner AG", leads: 170, city: "Berlin" },
  { name: "Voigt Transport GmbH", leads: 120, city: "Frankfurt" },
  { name: "Roth Pharma KG", leads: 190, city: "Köln" }
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
    <div className="fixed bottom-4 left-4 z-50">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="bg-background/80 backdrop-blur-lg border border-primary/10 rounded-lg p-4 shadow-lg max-w-sm"
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
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100/20 text-emerald-500 text-xs font-medium">
                  <Check className="w-3 h-3" />
                  Verifiziert
                </span>
                <span className="text-xs text-muted-foreground">
                  • Gerade eben
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
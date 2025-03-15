import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
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
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {activities[currentActivity].name} aus {activities[currentActivity].city}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Hat gerade {activities[currentActivity].leads} Leads gefunden
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    <CheckCircle className="w-3 h-3" />
                    Verifiziert
                  </span>
                  <span className="text-xs text-muted-foreground">
                    • Gerade eben
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
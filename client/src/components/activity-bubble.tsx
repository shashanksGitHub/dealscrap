import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Beispielhafte Aktivitätsdaten - in der echten Implementierung würden diese von der API kommen
const activities = [
  { name: "Max M. aus München", leads: 150, company: "Tech GmbH" },
  { name: "Sarah K. aus Hamburg", leads: 75, company: "Marketing AG" },
  { name: "Thomas B. aus Berlin", leads: 200, company: "Consulting UG" },
  { name: "Lisa F. aus Frankfurt", leads: 100, company: "Sales GmbH" },
  { name: "Michael R. aus Köln", leads: 125, company: "Digital GmbH" },
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
                  {activities[currentActivity].name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Hat gerade {activities[currentActivity].leads} Leads für {activities[currentActivity].company} gefunden
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
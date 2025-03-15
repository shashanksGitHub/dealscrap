import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Using the same companies as in activity-bubble.tsx
const testimonials = [
  {
    name: "Thomas Wagner",
    position: "Geschäftsführer",
    company: "Müller & Partner GmbH",
    text: "Mit LeadScraper konnten wir unsere Leadgenerierung um 125% steigern. Ein unverzichtbares Tool für modernes B2B-Marketing."
  },
  {
    name: "Julia Becker",
    position: "Head of Sales",
    company: "Schneider IT Solutions KG",
    text: "Endlich ein Tool, das hält was es verspricht. Die Qualität der generierten Leads ist erstklassig."
  },
  {
    name: "Markus Schmidt",
    position: "Marketing Director",
    company: "Weber Consulting GmbH",
    text: "LeadScraper hat unseren Sales-Prozess revolutioniert. Die Integration war einfach, die Ergebnisse überzeugend."
  },
  {
    name: "Christina Bergmann",
    position: "CEO",
    company: "Bergmann Logistik AG",
    text: "Die besten Leads, die wir je hatten. Der ROI war bereits nach wenigen Wochen deutlich positiv."
  },
  {
    name: "Stefan Krause",
    position: "Vertriebsleiter",
    company: "Krause Engineering GmbH",
    text: "Perfekt für den deutschen B2B-Markt. Die DSGVO-Konformität war für uns ein wichtiges Entscheidungskriterium."
  }
];

export function TestimonialCarousel() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const nextTestimonial = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      setIsVisible(true);
    }, 300);
  };

  const previousTestimonial = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setIsVisible(true);
    }, 300);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 max-w-2xl mx-auto"> {/* Added max-width here */}
      <Button
        variant="ghost"
        size="sm"
        onClick={previousTestimonial}
        className="h-8 w-8 p-0 opacity-50 hover:opacity-100 transition-opacity rounded-full shrink-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="w-full">
        <AnimatePresence mode="wait">
          {isVisible && (
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-background/80 backdrop-blur-sm px-8 py-6 rounded-lg border"
            >
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <blockquote className="text-base mb-4"> {/* Changed from text-lg to text-base */}
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              <div>
                <p className="font-medium">
                  {testimonials[currentTestimonial].name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonials[currentTestimonial].position}, {testimonials[currentTestimonial].company}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={nextTestimonial}
        className="h-8 w-8 p-0 opacity-50 hover:opacity-100 transition-opacity rounded-full shrink-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
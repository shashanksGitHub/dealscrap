import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

export function VideoTutorialDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    // Auto-play the video
    const video = document.getElementById("tutorial-video") as HTMLVideoElement;
    if (video) {
      video.play();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            In weniger als 1 Minute zu passenden B2B-Leads
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Unser Geschäftsführer zeigt Ihnen, wie einfach Sie mit unserem AI-Scraper passende Geschäftskontakte finden.
          </DialogDescription>
        </DialogHeader>
        <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
          {!isPlaying && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20"
              onClick={handlePlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <PlayCircle className="w-20 h-20 text-white" />
              </motion.div>
            </motion.div>
          )}
          <video
            id="tutorial-video"
            className="w-full h-full"
            src="/Testvid.mp4"
            controls={isPlaying}
            onClick={handlePlay}
            style={{ cursor: !isPlaying ? 'pointer' : 'default' }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
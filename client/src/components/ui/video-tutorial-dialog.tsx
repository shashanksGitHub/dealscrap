import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";
import { PlayCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export function VideoTutorialDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showTutorial, setShowTutorial] = useState(() => {
    return user && localStorage.getItem("tutorialWatched") !== "true";
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Debug video element status
  useEffect(() => {
    if (videoRef.current && open) {
      console.log('Video element:', videoRef.current);
      console.log('Video ready state:', videoRef.current.readyState);
      console.log('Video network state:', videoRef.current.networkState);
      console.log('Video src:', videoRef.current.src);
      console.log('Video paused:', videoRef.current.paused);
    }
  }, [open, isVideoLoaded]);

  // Reset states when dialog opens
  useEffect(() => {
    if (open) {
      setIsPlaying(false);
      setLoadError(false);
      setIsVideoLoaded(false);
      setShowControls(false);
    }
  }, [open]);
  
  // If dialog closes, pause the video
  useEffect(() => {
    if (!open && videoRef.current) {
      try {
        videoRef.current.pause();
      } catch (e) {
        console.error('Error pausing video:', e);
      }
    }
  }, [open]);

  const handlePlay = async (e?: React.MouseEvent) => {
    // Prevent event propagation if called from click event
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    if (!videoRef.current) {
      console.error('Video element reference is null');
      return;
    }
    
    console.log('Attempting to play video...');
    
    try {
      // Set the src attribute directly
      if (!videoRef.current.src) {
        videoRef.current.src = '/Testvid.mp4';
      }
      
      // Show native controls for better debugging
      setShowControls(true);
      videoRef.current.controls = true;
      
      // Load the video if not already loaded
      if (videoRef.current.readyState < 2) {
        console.log('Loading video...');
        await videoRef.current.load();
      }
      
      console.log('Calling play() method...');
      setIsPlaying(true);
      
      // Play the video
      await videoRef.current.play();
      
      console.log('Video successfully playing');
      localStorage.setItem("tutorialWatched", "true");
      localStorage.removeItem("showTutorialAfterSignup"); 
    } catch (error) {
      console.error('Error playing video:', error);
      setIsPlaying(false);
      toast({
        title: "Video konnte nicht abgespielt werden",
        description: "Es gibt Probleme beim Abspielen des Videos. Bitte versuchen Sie es erneut oder öffnen Sie das Video direkt.",
        variant: "destructive",
      });
    }
  };

  const handleVideoLoaded = () => {
    console.log('Video loaded event fired');
    setIsVideoLoaded(true);
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const target = e.target as HTMLVideoElement;
    console.error('Video load error:', {
      error: target.error,
      networkState: target.networkState,
      readyState: target.readyState
    });
    
    setLoadError(true);
    toast({
      title: "Video konnte nicht geladen werden",
      description: "Es gab ein Problem beim Laden des Videos. Bitte versuchen Sie es später erneut.",
      variant: "destructive",
    });
  };

  // Only render if showTutorial is true
  if (!showTutorial) return null;

  const handleDialogClose = (open: boolean) => {
    // Store tutorial watched flag when dialog closes
    if (!open) {
      localStorage.setItem("tutorialWatched", "true");
      localStorage.removeItem("showTutorialAfterSignup");
      setIsPlaying(false);
    }
    onOpenChange(open);
  };

  const handleOpenVideoDirectly = () => {
    // Open the video in a new tab
    window.open('/Testvid.mp4', '_blank');
    // Mark as watched
    localStorage.setItem("tutorialWatched", "true");
    localStorage.removeItem("showTutorialAfterSignup");
    // Close the dialog
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
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
          {loadError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4 text-center">
              <AlertCircle className="w-12 h-12 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Video konnte nicht geladen werden</h3>
              <p className="mb-4">Es gab ein Problem beim Laden des Videos.</p>
              <Button onClick={handleOpenVideoDirectly} variant="outline" className="bg-white/20 hover:bg-white/30 text-white">
                Video direkt öffnen
              </Button>
            </div>
          ) : !isPlaying && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 z-10"
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
            ref={videoRef}
            className="w-full h-full"
            controls={showControls}
            preload="auto"
            onClick={(e) => !isPlaying && handlePlay(e)}
            style={{ cursor: !isPlaying ? "pointer" : "default" }}
            onLoadedData={handleVideoLoaded}
            onEnded={() => {
              console.log('Video ended');
              localStorage.setItem("tutorialWatched", "true");
            }}
            onError={handleVideoError}
            playsInline
            muted={false}
            src="/Testvid.mp4"
          />
        </div>
        {isVideoLoaded && (
          <div className="flex justify-between mt-4">
            <Button onClick={handlePlay} className="flex-1">
              Video abspielen
            </Button>
            <Button onClick={handleOpenVideoDirectly} variant="outline" className="ml-2">
              In neuem Tab öffnen
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
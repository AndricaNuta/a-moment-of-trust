import { useState, useRef } from "react";
import { Play, Pause, Link2, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export interface LetterForModal {
  id: string;
  author: string;
  content: string;
  images: string[];
  audio?: string;
  createdAt: Date;
}

interface LetterDetailModalProps {
  letter: LetterForModal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const SITE_TITLE = "ideo ideis · peretele amintirilor";

function getShareBaseUrl(): string {
  if (typeof window === "undefined") return "";
  const envBase = import.meta.env.VITE_SHARE_BASE_URL;
  if (envBase && typeof envBase === "string" && envBase.trim() !== "") {
    return envBase.replace(/\/$/, "");
  }
  return window.location.origin + window.location.pathname;
}

function getShareUrl(letterId: string): string {
  return `${getShareBaseUrl()}#letter-${letterId}`;
}

function getShareText(author: string): string {
  return `Ai primit o scrisoare în care ${author} vrea să îți mulțumească. Citește-o aici:`;
}

export function LetterDetailModal({
  letter,
  open,
  onOpenChange,
}: LetterDetailModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const shareUrl = letter ? getShareUrl(letter.id) : "";
  const shareText = letter ? getShareText(letter.author) : "";

  const openShare = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=400");
  };

  const shareFacebook = () => {
    openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
  };
  const shareTwitter = () => {
    openShare(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
    );
  };
  const shareLinkedIn = () => {
    openShare(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
  };
  const shareWhatsApp = () => {
    openShare(`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`);
  };

  const copyLink = async () => {
    const doFallbackCopy = () => {
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        const ok = document.execCommand("copy");
        document.body.removeChild(textarea);
        return ok;
      } catch {
        document.body.removeChild(textarea);
        return false;
      }
    };

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        if (!doFallbackCopy()) throw new Error("Fallback failed");
      }
      setLinkCopied(true);
      toast({ title: "Link copiat", description: "Linkul a fost copiat în clipboard." });
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      if (doFallbackCopy()) {
        setLinkCopied(true);
        toast({ title: "Link copiat", description: "Linkul a fost copiat în clipboard." });
        setTimeout(() => setLinkCopied(false), 2000);
      } else {
        toast({
          title: "Eroare",
          description: "Nu s-a putut copia linkul. Copiază manual: " + shareUrl,
          variant: "destructive",
        });
      }
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!letter) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed top-4 left-1/2 flex w-[calc(100%-2rem)] max-w-lg max-h-[calc(100dvh-2rem)] -translate-x-1/2 translate-y-0 flex-col overflow-hidden p-4 sm:top-[50%] sm:max-w-2xl sm:translate-y-[-50%] sm:max-h-[90dvh] [&>*]:min-w-0 sm:p-6">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="sr-only">
            Scrisoare, de la {letter.author}
          </DialogTitle>
        </DialogHeader>
        <div className="letter-modal-scroll min-h-0 flex-1 space-y-6 pt-2 min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-2 min-w-0">
            <p className="text-sm font-semibold text-foreground break-words min-w-0">
              {letter.author}
            </p>
            <span className="text-xs text-muted-foreground tabular-nums">
              {formatDate(letter.createdAt)}
            </span>
          </div>

          <p className="text-foreground leading-relaxed whitespace-pre-wrap font-[450] break-words">
            {letter.content}
          </p>

          {letter.images.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                poze
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
                {letter.images.map((src, i) => (
                  <div
                    key={i}
                    className="rounded-lg overflow-hidden border border-border bg-muted/30 min-w-0"
                  >
                    <img
                      src={src}
                      alt={`Atașament ${i + 1}`}
                      className="w-full h-auto max-h-80 object-contain photo-bw max-w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {letter.audio && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                mesaj audio
              </p>
              <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/20">
                <button
                  type="button"
                  onClick={toggleAudio}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-0.5" />
                  )}
                </button>
                <span className="text-sm text-muted-foreground">
                  {isPlaying ? "pauză" : "ascultă"}
                </span>
                <audio
                  ref={audioRef}
                  src={letter.audio}
                  onEnded={() => setIsPlaying(false)}
                  onPause={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                />
              </div>
            </div>
          )}

          <div className="space-y-2 pt-2 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              share
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={shareFacebook}
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
                aria-label="Share on Facebook"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={shareTwitter}
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
                aria-label="Share on X (Twitter)"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={shareLinkedIn}
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
                aria-label="Share on LinkedIn"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={shareWhatsApp}
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
                aria-label="Share on WhatsApp"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={copyLink}
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
                aria-label="Copy link"
              >
                {linkCopied ? (
                  <Check className="w-5 h-5 text-primary" />
                ) : (
                  <Link2 className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground/60 tracking-wide text-right">
            ideo ideis
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

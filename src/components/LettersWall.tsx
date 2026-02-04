import { Play } from "lucide-react";
import { useState, useRef } from "react";

interface Letter {
  id: string;
  author: string;
  content: string;
  image?: string;
  audio?: string;
  createdAt: Date;
}

interface LettersWallProps {
  letters: Letter[];
}

const ROTATIONS = [-0.5, 0.5, -0.3, 0.4, -0.4, 0.25]; // subtle note tilt

// Tape position/rotation variants – placed toward exterior (edge + slight overflow)
const TAPE_CONFIGS: { position: string; rotate: number; size: string }[][] = [
  [{ position: "top-0 right-0 -mr-2 -mt-0.5", rotate: 4, size: "w-12 h-4" }],
  [{ position: "top-0 left-0 -ml-2 -mt-0.5", rotate: -5, size: "w-14 h-4" }],
  [
    { position: "top-0 right-0 -mr-2 -mt-0.5", rotate: 3, size: "w-10 h-4" },
    { position: "bottom-0 left-0 -ml-2 -mb-0.5", rotate: -4, size: "w-12 h-4" },
  ],
  [{ position: "bottom-0 right-0 -mr-2 -mb-0.5", rotate: -3, size: "w-11 h-4" }],
  [{ position: "top-0 left-0 -ml-2 -mt-0.5", rotate: 6, size: "w-13 h-4" }],
  [
    { position: "top-0 left-0 -ml-2 -mt-0.5", rotate: -2, size: "w-10 h-4" },
    { position: "bottom-0 right-0 -mr-2 -mb-0.5", rotate: 5, size: "w-11 h-4" },
  ],
  [{ position: "bottom-0 left-0 -ml-2 -mb-0.5", rotate: 2, size: "w-12 h-4" }],
  [{ position: "top-0 right-0 -mr-2 -mt-0.5", rotate: -4, size: "w-14 h-4" }],
];

const LetterCard = ({ letter, index = 0 }: { letter: Letter; index?: number }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const rotation = ROTATIONS[index % ROTATIONS.length];
  const tapes = TAPE_CONFIGS[index % TAPE_CONFIGS.length];

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ro-RO", {
      day: "numeric",
      month: "short",
    }).format(date);
  };

  return (
    <article
      className="note-paper rounded-sm transition-all duration-200 border border-amber-300/40 relative"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Tape strip(s) – no text, position/rotation vary by note */}
      {tapes.map((tape, i) => (
        <div
          key={i}
          className={`absolute ${tape.position} bg-primary/85 shadow-sm ${tape.size}`}
          style={{ transform: `rotate(${tape.rotate}deg)` }}
          aria-hidden
        />
      ))}

      <div className="p-5 pt-6">
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <p className="text-sm font-medium text-foreground/90">{letter.author}</p>
          <span className="text-[11px] text-muted-foreground tabular-nums shrink-0">
            {formatDate(letter.createdAt)}
          </span>
        </div>
        <p className="text-muted-foreground text-[15px] leading-relaxed whitespace-pre-wrap mb-4 font-[450]">
          {letter.content}
        </p>

        {(letter.image || letter.audio) && (
          <div className="flex flex-wrap gap-3 pt-4 border-t border-amber-200/40">
            {letter.image && (
              <div className="rounded overflow-hidden border border-amber-200/40 shadow-sm">
                <img
                  src={letter.image}
                  alt="Atașat"
                  className="w-20 h-20 object-cover photo-bw"
                />
              </div>
            )}
            {letter.audio && (
              <button
                type="button"
                onClick={toggleAudio}
                className="flex items-center gap-2 bg-amber-50/60 border border-amber-200/50 rounded-md px-3 py-2 hover:bg-amber-100/70 transition-colors text-foreground/80"
              >
                {isPlaying ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                ) : (
                  <Play className="w-4 h-4 text-primary" />
                )}
                <span className="text-xs font-medium text-muted-foreground">ascultă</span>
                <audio
                  ref={audioRef}
                  src={letter.audio}
                  onEnded={() => setIsPlaying(false)}
                />
              </button>
            )}
          </div>
        )}

        <p className="mt-4 text-[10px] text-muted-foreground/60 text-right">ideo ideis</p>
      </div>
    </article>
  );
};

const LettersWall = ({ letters }: LettersWallProps) => {
  if (letters.length === 0) {
    return (
      <section id="letters" className="py-14 lg:py-16 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-xl mx-auto text-left">
            <div className="note-paper rounded-lg border border-amber-200/60 p-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 mb-4">
                <span className="text-[11px] font-semibold tracking-wider text-primary uppercase">
                  ideo ideis
                </span>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                încă nu a sosit nicio scrisoare
              </h2>
              <p className="text-muted-foreground text-sm">
                fii primul care scrie. <a href="#write" className="text-primary font-medium hover:underline">scrie aici</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="letters" className="py-14 lg:py-16 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 relative">
        <div className="text-left mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 mb-3">
            <span className="text-[11px] font-semibold tracking-wider text-primary uppercase">
              ideo ideis
            </span>
            <span className="text-muted-foreground/70">·</span>
            <span className="text-xs text-muted-foreground font-medium">peretele amintirilor</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold mt-2 mb-2">scrisori din inimă</h2>
          <p className="text-muted-foreground text-sm max-w-lg">
            povești despre încredere. un singur om poate schimba totul.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {letters.map((letter, index) => (
            <LetterCard key={letter.id} letter={letter} index={index} />
          ))}
        </div>

        <div className="mt-10 text-left flex flex-wrap items-center gap-3">
          <p className="text-muted-foreground text-sm">
            și tu? <a href="#write" className="text-primary hover:underline font-medium">scrie aici ↑</a>
          </p>
          <span className="text-xs text-muted-foreground/70">· ideo ideis</span>
        </div>
      </div>
    </section>
  );
};

export default LettersWall;

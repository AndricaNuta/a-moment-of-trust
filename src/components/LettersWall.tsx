import { FileAudio, Play } from "lucide-react";
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

const LetterCard = ({ letter }: { letter: Letter }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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
      year: "numeric",
    }).format(date);
  };

  return (
    <article className="bg-card p-6 space-y-4 group hover:bg-secondary/50 transition-colors">
      {/* Author & Date */}
      <div className="flex items-center justify-between">
        <span className="text-foreground font-medium lowercase">
          {letter.author}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatDate(letter.createdAt)}
        </span>
      </div>

      {/* Content */}
      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
        {letter.content}
      </p>

      {/* Media */}
      {(letter.image || letter.audio) && (
        <div className="flex flex-wrap gap-4 pt-2">
          {letter.image && (
            <img
              src={letter.image}
              alt="Letter attachment"
              className="w-full max-w-[200px] h-auto grayscale hover:grayscale-0 transition-all duration-300"
            />
          )}
          {letter.audio && (
            <div className="flex items-center gap-3 bg-secondary p-3">
              <button
                onClick={toggleAudio}
                className="w-10 h-10 bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {isPlaying ? (
                  <span className="w-3 h-3 bg-primary-foreground" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </button>
              <span className="text-sm text-muted-foreground">
                Înregistrare audio
              </span>
              <audio
                ref={audioRef}
                src={letter.audio}
                onEnded={() => setIsPlaying(false)}
              />
            </div>
          )}
        </div>
      )}

      {/* Accent line */}
      <div className="h-[2px] w-8 bg-primary/30 group-hover:bg-primary group-hover:w-16 transition-all duration-300" />
    </article>
  );
};

const LettersWall = ({ letters }: LettersWallProps) => {
  if (letters.length === 0) {
    return (
      <section id="letters" className="py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex gap-2 mb-6 justify-center">
              <span className="w-2 h-2 bg-primary/30" />
              <span className="w-2 h-2 bg-primary/30" />
              <span className="w-2 h-2 bg-primary/30" />
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold ideo-headline mb-4">
              fii primul care scrie
            </h2>
            <p className="text-muted-foreground">
              încă nu a fost trimisă nicio scrisoare. poți fi tu primul care 
              împărtășește povestea sa.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="letters" className="py-24 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <div className="flex gap-2 mb-6">
            <span className="w-2 h-2 bg-primary" />
            <span className="w-2 h-2 bg-primary/60" />
            <span className="w-2 h-2 bg-primary/30" />
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold ideo-headline mb-4">
            scrisori de recunoștință
          </h2>
          <p className="text-muted-foreground">
            povești despre încredere, scrise de oameni ca tine. fiecare 
            scrisoare e o mărturie a puterii pe care o are un adult care 
            crede în adolescenți.
          </p>
        </div>

        {/* Letters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {letters.map((letter) => (
            <LetterCard key={letter.id} letter={letter} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LettersWall;

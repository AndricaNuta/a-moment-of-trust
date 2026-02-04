import { FileAudio, Play, Heart } from "lucide-react";
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

const LetterCard = ({ letter, index }: { letter: Letter; index: number }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
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
    }).format(date);
  };

  // Alternate rotations for scattered look
  const rotations = [-2, 1, -1, 2, 0, -1.5];
  const rotation = rotations[index % rotations.length];

  return (
    <article 
      className="relative bg-background p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Tape decoration */}
      <div 
        className="absolute -top-3 left-1/4 w-12 h-5 bg-accent/80 shadow-sm"
        style={{ transform: `rotate(${-rotation * 2}deg)` }}
      />

      {/* Like button */}
      <button
        onClick={() => setIsLiked(!isLiked)}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Heart 
          className={`w-5 h-5 transition-colors ${isLiked ? 'text-primary fill-primary' : 'text-muted-foreground hover:text-primary'}`} 
        />
      </button>

      {/* Author & Date */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-handwritten text-xl text-foreground">
          {letter.author}
        </span>
        <span className="font-handwritten text-sm text-muted-foreground">
          {formatDate(letter.createdAt)}
        </span>
      </div>

      {/* Content */}
      <p className="font-handwritten text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap mb-4">
        {letter.content}
      </p>

      {/* Media */}
      {(letter.image || letter.audio) && (
        <div className="flex flex-wrap gap-4 pt-2 border-t border-dashed border-border">
          {letter.image && (
            <div className="bg-white p-1 shadow-md rotate-[-2deg]">
              <img
                src={letter.image}
                alt="Amintire atașată"
                className="w-24 h-24 object-cover sepia-[0.15]"
              />
            </div>
          )}
          {letter.audio && (
            <button
              onClick={toggleAudio}
              className="flex items-center gap-2 bg-secondary px-4 py-2 hover:bg-secondary/80 transition-colors"
            >
              {isPlaying ? (
                <span className="w-3 h-3 bg-primary" />
              ) : (
                <Play className="w-4 h-4 text-primary" />
              )}
              <span className="font-handwritten text-muted-foreground">
                ascultă ♪
              </span>
              <audio
                ref={audioRef}
                src={letter.audio}
                onEnded={() => setIsPlaying(false)}
              />
            </button>
          )}
        </div>
      )}

      {/* Decorative heart */}
      <div className="absolute bottom-3 right-3 font-handwritten text-2xl text-primary/20 group-hover:text-primary/40 transition-colors">
        ♡
      </div>
    </article>
  );
};

const LettersWall = ({ letters }: LettersWallProps) => {
  if (letters.length === 0) {
    return (
      <section id="letters" className="py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-xl mx-auto text-center">
            <div className="font-handwritten text-6xl text-primary/20 mb-6">✉</div>
            <h2 className="font-handwritten text-3xl text-foreground mb-4">
              încă nu a sosit nicio scrisoare
            </h2>
            <p className="text-muted-foreground">
              fii primul care împărtășește o amintire despre cineva 
              care a crezut în el.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="letters" className="py-24 bg-background relative overflow-hidden">
      {/* Decorative pin board texture hint */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      />

      <div className="container mx-auto px-6 lg:px-12 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-handwritten text-primary text-2xl">peretele amintirilor</span>
          <h2 className="text-3xl md:text-4xl font-semibold mt-4 mb-6">
            scrisori din inimă
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            povești despre încredere, scrise de oameni ca tine. 
            fiecare scrisoare e o mărturie că un singur om poate schimba totul.
          </p>
        </div>

        {/* Letters Grid - scattered bulletin board style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {letters.map((letter, index) => (
            <LetterCard key={letter.id} letter={letter} index={index} />
          ))}
        </div>

        {/* Add more prompt */}
        <div className="mt-16 text-center">
          <p className="font-handwritten text-xl text-muted-foreground">
            și tu ai o poveste de spus? 
            <a href="#write" className="text-primary hover:underline ml-2">
              scrie-o aici ↑
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LettersWall;

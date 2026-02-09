import { Play, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useMemo, useEffect } from "react";
import { LetterDetailModal, type LetterForModal } from "@/components/LetterDetailModal";

const ROWS_PREVIEW = 3;
const COLS_LG = 3;
const LETTERS_PER_PAGE = ROWS_PREVIEW * COLS_LG; // 3 rows × 3 cols = 9

interface Letter {
  id: string;
  author: string;
  content: string;
  images: string[];
  audio?: string;
  createdAt: Date;
}

interface LettersWallProps {
  letters: Letter[];
  highlightLetterId?: string | null;
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

const LetterCard = ({
  letter,
  index = 0,
  isHighlighted = false,
  onOpenDetail,
}: {
  letter: Letter;
  index?: number;
  isHighlighted?: boolean;
  onOpenDetail: () => void;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const rotation = ROTATIONS[index % ROTATIONS.length];
  const tapes = TAPE_CONFIGS[index % TAPE_CONFIGS.length];
  const hasAttachments = letter.images.length > 0 || letter.audio;

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const PREVIEW_CHARS = 320;
  const rawPreview =
    letter.content.length > PREVIEW_CHARS
      ? letter.content.slice(0, PREVIEW_CHARS).trim() + "…"
      : letter.content;
  const previewText = rawPreview.replace(/\s+/g, " ").trim();

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpenDetail}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenDetail();
        }
      }}
      className={`note-paper letter-fold rounded-xl transition-all duration-200 relative pl-5 cursor-pointer hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${isHighlighted ? "ring-2 ring-primary/60 ring-offset-2 ring-offset-background shadow-lg animate-in fade-in duration-500" : ""}`}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-label={`Citește scrisoarea de la ${letter.author}`}
    >
      {/* Tape strip(s) – no text, position/rotation vary by note */}
      {tapes.map((tape, i) => (
        <div
          key={i}
          className={`absolute ${tape.position} bg-primary/75 shadow-sm ${tape.size}`}
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
        <p
          className="text-foreground/85 text-[15px] leading-relaxed mb-4 font-[450] break-words min-h-[4.9rem] line-clamp-3"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
          } as React.CSSProperties}
        >
          {previewText}
        </p>

        {hasAttachments && (
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border">
            {letter.images.length > 0 && (
              <div className="flex gap-1.5">
                {letter.images.slice(0, 3).map((src, i) => (
                  <div
                    key={i}
                    className="rounded-lg overflow-hidden border border-border shadow-sm"
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-14 h-14 object-cover photo-bw"
                    />
                  </div>
                ))}
                {letter.images.length > 3 && (
                  <span className="text-xs text-muted-foreground self-center">
                    +{letter.images.length - 3}
                  </span>
                )}
              </div>
            )}
            {letter.audio && (
              <button
                type="button"
                onClick={toggleAudio}
                className="flex items-center gap-2 bg-background/50 border border-border rounded-lg px-3 py-2 hover:bg-primary/5 hover:border-primary/25 transition-colors text-foreground/80"
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

        <div className="mt-4 flex items-center justify-end gap-2">
          <span className="text-[10px] text-primary font-medium flex items-center gap-1">
            <Maximize2 className="w-3 h-3" />
            citește
          </span>
          <span className="text-[10px] text-muted-foreground/50 tracking-wide">
            ideo ideis
          </span>
        </div>
      </div>
    </article>
  );
};

const LettersWall = ({ letters, highlightLetterId = null }: LettersWallProps) => {
  const [detailLetter, setDetailLetter] = useState<LetterForModal | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(letters.length / LETTERS_PER_PAGE)),
    [letters.length]
  );
  const paginatedLetters = useMemo(() => {
    const start = (currentPage - 1) * LETTERS_PER_PAGE;
    return letters.slice(start, start + LETTERS_PER_PAGE);
  }, [letters, currentPage]);

  // Pad to LETTERS_PER_PAGE so the grid always shows 3 full rows (avoids "1 row" when few letters)
  const displayItems = useMemo(() => {
    const list = [...paginatedLetters];
    while (list.length < LETTERS_PER_PAGE) list.push(null);
    return list.slice(0, LETTERS_PER_PAGE);
  }, [paginatedLetters]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages >= 1) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    if (highlightLetterId) setCurrentPage(1);
  }, [highlightLetterId]);

  const openDetail = (letter: Letter) => {
    setDetailLetter({
      ...letter,
      images: letter.images ?? [],
    });
    setDetailOpen(true);
  };

  if (letters.length === 0) {
    return (
      <section id="letters" className="py-14 lg:py-16 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-xl mx-auto text-left">
            <div className="note-paper letter-fold rounded-xl p-6 md:p-8 pl-7 text-left">
              <span className="text-[11px] font-semibold tracking-wider text-primary uppercase">
                ideo ideis · peretele amintirilor
              </span>
              <h2 className="text-xl font-semibold text-foreground mt-3 mb-2">
                încă nu a sosit nicio scrisoare
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                fii primul care scrie. <a href="#write" className="text-primary font-medium hover:underline">scrie aici</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="letters" className="py-14 lg:py-16 bg-background relative">
      <div className="container mx-auto px-6 lg:px-12 relative">
        <div className="text-left mb-10">
          <span className="text-[11px] font-semibold tracking-wider text-primary uppercase">
            ideo ideis · peretele amintirilor
          </span>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mt-2 mb-2">poveștile noastre</h2>
          <p className="text-muted-foreground text-sm max-w-lg leading-relaxed">
            scrisori către noi, cei de la 16 ani, și către oamenii care au avut atunci încredere în noi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayItems.map((letter, index) =>
            letter ? (
              <LetterCard
                key={letter.id}
                letter={{ ...letter, images: letter.images ?? [] }}
                index={(currentPage - 1) * LETTERS_PER_PAGE + index}
                isHighlighted={letter.id === highlightLetterId}
                onOpenDetail={() => openDetail(letter)}
              />
            ) : (
              <div key={`empty-${index}`} className="min-h-[180px] opacity-0 pointer-events-none" aria-hidden />
            )
          )}
        </div>

        {totalPages > 1 && (
          <nav
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
            aria-label="Paginare scrisori"
          >
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50 disabled:pointer-events-none disabled:opacity-50 transition-colors"
              aria-label="Pagina anterioară"
            >
              <ChevronLeft className="w-4 h-4" />
              înapoi
            </button>
            <span className="text-sm text-muted-foreground tabular-nums">
              pagina {currentPage} din {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50 disabled:pointer-events-none disabled:opacity-50 transition-colors"
              aria-label="Pagina următoare"
            >
              înainte
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        )}

        <LetterDetailModal
          letter={detailLetter}
          open={detailOpen}
          onOpenChange={setDetailOpen}
        />

        <div className="mt-10 text-left flex flex-wrap items-center gap-3">
          <p className="text-muted-foreground text-sm">
            și tu? <a href="#write" className="text-primary hover:underline font-medium">scrie aici ↑</a>
          </p>
          <span className="text-xs text-muted-foreground/60 tracking-wide">· ideo ideis</span>
        </div>
      </div>
    </section>
  );
};

export default LettersWall;

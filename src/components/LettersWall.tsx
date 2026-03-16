import { Play, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useMemo, useEffect } from "react";
import { LetterDetailModal, type LetterForModal } from "@/components/LetterDetailModal";
import { trackEvent } from "@/lib/analytics";

const ROWS_PREVIEW = 3;
const COLS_LG = 3;
const LETTERS_PER_PAGE = ROWS_PREVIEW * COLS_LG; // 3 rows × 3 cols = 9

interface Letter {
  id: string;
  author: string;
  content: string;
  images: string[];
  audios?: string[];
  videos?: string[];
  createdAt: Date;
}

interface LettersWallProps {
  letters: Letter[];
  highlightLetterId?: string | null;
  /** When set (e.g. from URL hash or parent postMessage), open the modal for this letter once. */
  openLetterIdFromUrl?: string | null;
  onOpenLetterFromUrlHandled?: () => void;
}

const LetterCard = ({
  letter,
  isHighlighted = false,
  onOpenDetail,
}: {
  letter: Letter;
  index?: number;
  isHighlighted?: boolean;
  onOpenDetail: () => void;
}) => {
  const [playingAudioIndex, setPlayingAudioIndex] = useState<number | null>(null);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const hasAttachments =
    letter.images.length > 0 ||
    (letter.audios?.length ?? 0) > 0 ||
    (letter.videos?.length ?? 0) > 0;

  const toggleAudio = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const el = audioRefs.current[index];
    if (el) {
      if (playingAudioIndex === index) {
        el.pause();
        setPlayingAudioIndex(null);
      } else {
        audioRefs.current.forEach((a, i) => {
          if (i !== index && a) a.pause();
        });
        el.play();
        setPlayingAudioIndex(index);
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ro-RO", {
      day: "numeric",
      month: "short",
    }).format(date);
  };

  const PREVIEW_CHARS = 320;
  const hasText = letter.content.trim().length > 0;
  const parts: string[] = [];
  if ((letter.videos?.length ?? 0) > 0) parts.push("video");
  if ((letter.audios?.length ?? 0) > 0) parts.push("audio");
  if (letter.images.length > 0) parts.push("imagini");
  const mediaLabel = parts.length > 0 ? "mesaj cu " + parts.join(", ") : "";
  const rawPreview = hasText
    ? letter.content.length > PREVIEW_CHARS
      ? letter.content.slice(0, PREVIEW_CHARS).trim() + "…"
      : letter.content
    : mediaLabel;
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
      className={`note-paper letter-fold transition-all duration-200 relative pl-5 cursor-pointer hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${isHighlighted ? "ring-2 ring-primary/60 ring-offset-2 ring-offset-background shadow-lg animate-in fade-in duration-500" : ""}`}
      aria-label={`Citește scrisoarea de la ${letter.author}`}
    >
      <div className="p-5 pt-6 pb-10">
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <p className="text-body font-semibold text-foreground/90">{letter.author}</p>
          <span className="text-detalii text-muted-foreground tabular-nums shrink-0">
            {formatDate(letter.createdAt)}
          </span>
        </div>
        {previewText && (
          <p
            className="text-body text-foreground/85 mb-4 break-words min-h-[4.9rem] line-clamp-3"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
            } as React.CSSProperties}
          >
            {previewText}
          </p>
        )}

        {hasAttachments && (
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border min-w-0">
            {letter.images.length > 0 && (
              <div className="flex gap-1.5">
                {letter.images.slice(0, 3).map((src, i) => (
                  <div
                    key={i}
                    className="rounded overflow-hidden border border-border shadow-sm"
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-14 h-14 object-cover photo-bw"
                    />
                  </div>
                ))}
                {letter.images.length > 3 && (
                  <span className="text-detalii text-muted-foreground self-center">
                    +{letter.images.length - 3}
                  </span>
                )}
              </div>
            )}
            {(letter.videos ?? []).map((src, i) => (
              <div
                key={i}
                className="rounded overflow-hidden border border-border shadow-sm w-28 aspect-video shrink-0 flex items-center justify-center bg-muted/50 relative [&_video]:object-cover"
                onClick={(e) => e.stopPropagation()}
              >
                <video
                  src={src}
                  controls
                  playsInline
                  preload="metadata"
                  poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'%3E%3Crect width='64' height='64' fill='%23333'/%3E%3Cpath d='M26 20v24l18-12-18-12z' fill='%23fff' fill-opacity='0.9'/%3E%3C/svg%3E"
                  className="w-full h-full"
                />
              </div>
            ))}
            {(letter.audios ?? []).map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => toggleAudio(e, i)}
                className="flex items-center gap-2 bg-background/50 border border-border rounded px-3 py-2 hover:bg-primary/5 hover:border-primary/25 transition-colors text-foreground/80"
              >
                {playingAudioIndex === i ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                ) : (
                  <Play className="w-4 h-4 text-primary" />
                )}
                <span className="text-detalii font-semibold text-muted-foreground">
                  {letter.audios!.length > 1 ? `ascultă ${i + 1}` : "ascultă"}
                </span>
                <audio
                  ref={(el) => (audioRefs.current[i] = el)}
                  src={src}
                  onEnded={() => setPlayingAudioIndex(null)}
                />
              </button>
            ))}
          </div>
        )}

        <div className="absolute bottom-4 right-5 flex items-center gap-1">
          <Maximize2 className="w-3 h-3 text-primary" />
          <span className="text-detalii text-primary font-semibold">citește</span>
        </div>
      </div>
    </article>
  );
};

const LettersWall = ({
  letters,
  highlightLetterId = null,
  openLetterIdFromUrl = null,
  onOpenLetterFromUrlHandled,
}: LettersWallProps) => {
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

  useEffect(() => {
    if (currentPage > totalPages && totalPages >= 1) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    if (highlightLetterId) setCurrentPage(1);
  }, [highlightLetterId]);

  // When opening from share link (URL hash or parent postMessage), open the modal for that letter
  useEffect(() => {
    if (!openLetterIdFromUrl || letters.length === 0) return;
    const letter = letters.find((l) => l.id === openLetterIdFromUrl);
    if (letter) {
      trackEvent({
        event_type: "letter_opened",
        letter_id: letter.id,
        from_share_link: true,
      });
      setDetailLetter({
        ...letter,
        images: letter.images ?? [],
        audios: letter.audios ?? [],
        videos: letter.videos ?? [],
      });
      setDetailOpen(true);
      setCurrentPage(Math.max(1, Math.ceil((letters.indexOf(letter) + 1) / LETTERS_PER_PAGE)));
      onOpenLetterFromUrlHandled?.();
    }
  }, [openLetterIdFromUrl, letters, onOpenLetterFromUrlHandled]);

  const openDetail = (letter: Letter) => {
    trackEvent({
      event_type: "letter_opened",
      letter_id: letter.id,
      from_share_link: false,
    });
    setDetailLetter({
      ...letter,
      images: letter.images ?? [],
      audios: letter.audios ?? [],
      videos: letter.videos ?? [],
    });
    setDetailOpen(true);
  };

  if (letters.length === 0) {
    return (
      <section id="letters" className="py-14 lg:py-16 bg-section-alt text-section-alt-foreground">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-xl text-left">
            <div className="note-paper letter-fold p-6 md:p-8 pl-7 text-left bg-card text-foreground">
              <span className="text-detalii font-semibold tracking-wider text-primary">
                ideo ideis · peretele amintirilor
              </span>
              <h2 className="text-titlu-capitol mt-3 mb-2">
                încă nu a sosit nicio scrisoare
              </h2>
              <p className="text-body text-muted-foreground">
                fii primul care scrie. <a href="#write" className="text-primary font-semibold hover:underline">scrie aici</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="letters" className="py-14 lg:py-16 bg-section-alt text-section-alt-foreground relative">
      <div className="container mx-auto px-6 lg:px-12 relative">
        <div className="text-left mb-10">
          <span className="text-detalii font-semibold tracking-wider text-primary">
            ideo ideis · peretele amintirilor
          </span>
          <h2 className="text-titlu-capitol mt-2 mb-2">poveștile noastre</h2>
          <p className="text-body text-white/85 max-w-lg">
            scrisori către noi, cei de la 16 ani, și către oamenii care au avut atunci încredere în noi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
          {paginatedLetters.map((letter) => (
            <LetterCard
              key={letter.id}
              letter={{
              ...letter,
              images: letter.images ?? [],
              audios: letter.audios ?? [],
              videos: letter.videos ?? [],
            }}
              isHighlighted={letter.id === highlightLetterId}
              onOpenDetail={() => openDetail(letter)}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <nav
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
            aria-label="Paginare scrisori"
          >
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="inline-flex items-center gap-1.5 border border-white/30 bg-white/10 px-4 py-2 text-body font-medium text-white hover:bg-white/20 disabled:pointer-events-none disabled:opacity-50 transition-colors"
              aria-label="Pagina anterioară"
            >
              <ChevronLeft className="w-4 h-4" />
              înapoi
            </button>
            <span className="text-detalii text-white/80 tabular-nums">
              pagina {currentPage} din {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="inline-flex items-center gap-1.5 border border-white/30 bg-white/10 px-4 py-2 text-body font-medium text-white hover:bg-white/20 disabled:pointer-events-none disabled:opacity-50 transition-colors"
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

        <div className="mt-6 lg:mt-8 text-left flex flex-wrap items-center gap-3">
          <p className="text-body text-white/90">
            și tu? <a href="#write" className="text-primary hover:underline font-semibold">scrie aici ↑</a>
          </p>
          <span className="text-detalii text-white/60 tracking-wide">· ideo ideis</span>
        </div>
      </div>
    </section>
  );
};

export default LettersWall;

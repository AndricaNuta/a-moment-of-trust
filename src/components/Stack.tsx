import { motion, useMotionValue, useTransform } from "motion/react";
import { useState, useEffect, useCallback, useRef, useMemo, type ReactNode } from "react";
import "./Stack.css";

const VISIBLE_RANGE = 6;
const IMAGE_LOAD_RANGE = 6;

interface CardRotateProps {
  children: ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
  disableDrag?: boolean;
  spreadHorizontal?: boolean;
}

function CardRotate({
  children,
  onSendToBack,
  sensitivity,
  disableDrag = false,
  spreadHorizontal = false,
}: CardRotateProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  function handleDragEnd(
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number; y: number } }
  ) {
    if (
      Math.abs(info.offset.x) > sensitivity ||
      Math.abs(info.offset.y) > sensitivity
    ) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  if (disableDrag) {
    return (
      <motion.div
        className={`card-rotate-disabled ${spreadHorizontal ? "card-rotate--spread" : ""}`}
        style={{ x: 0, y: 0 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`card-rotate ${spreadHorizontal ? "card-rotate--spread" : ""}`}
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: "grabbing" }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

export interface StackProps {
  randomRotation?: boolean;
  sensitivity?: number;
  cards?: ReactNode[];
  animationConfig?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
  sendToBackOnClick?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  mobileClickOnly?: boolean;
  mobileBreakpoint?: number;
  /** When true, cards are laid out in a horizontal row instead of stacked. */
  spreadHorizontal?: boolean;
  /** Gap between cards when spread horizontally (px). */
  spreadGap?: number;
  /** Width of each card when spread (px). */
  spreadCardWidth?: number;
  /** Horizontal offset (px) per card in the back so they peek out (carousel-style). 0 = all stacked. */
  backSpreadPx?: number;
  /** When "horizontalScroll", advancing uses a horizontal slide instead of reordering the stack. */
  transitionMode?: "stack" | "horizontalScroll";
  /** When provided with horizontalScroll, images are lazy-loaded (only near-focus cards load). Reduces lag with large images. */
  imageItems?: { src: string; alt?: string }[];
}

export default function Stack({
  randomRotation = false,
  sensitivity = 200,
  cards = [],
  animationConfig = { stiffness: 80, damping: 24, mass: 0.9 },
  sendToBackOnClick = false,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  mobileClickOnly = false,
  mobileBreakpoint = 768,
  spreadHorizontal = false,
  spreadGap = 8,
  spreadCardWidth = 100,
  backSpreadPx = 0,
  transitionMode = "stack",
  imageItems,
}: StackProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [mobileBreakpoint]);

  const shouldDisableDrag = mobileClickOnly && isMobile;
  const shouldEnableClick = sendToBackOnClick || shouldDisableDrag;

  type StackItem =
    | { id: number; content: ReactNode; src?: never; alt?: never }
    | { id: number; src: string; alt: string; content?: never };

  const [stack, setStack] = useState<StackItem[]>(() => {
    if (imageItems?.length && transitionMode === "horizontalScroll") {
      const reversed = [...imageItems].reverse();
      return reversed.map((item, index) => ({
        id: reversed.length - index,
        src: item.src,
        alt: item.alt ?? "",
      }));
    }
    if (cards.length) {
      const reversed = [...cards].reverse();
      return reversed.map((content, index) => ({
        id: reversed.length - index,
        content,
      }));
    }
    return [
      {
        id: 1,
        content: (
          <img
            src="https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format"
            alt="card-1"
            className="card-image"
          />
        ),
      },
      {
        id: 2,
        content: (
          <img
            src="https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format"
            alt="card-2"
            className="card-image"
          />
        ),
      },
      {
        id: 3,
        content: (
          <img
            src="https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format"
            alt="card-3"
            className="card-image"
          />
        ),
      },
      {
        id: 4,
        content: (
          <img
            src="https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format"
            alt="card-4"
            className="card-image"
          />
        ),
      },
    ];
  });

  const [scrollIndex, setScrollIndex] = useState(0);

  useEffect(() => {
    if (imageItems?.length && transitionMode === "horizontalScroll") {
      const reversed = [...imageItems].reverse();
      setStack(
        reversed.map((item, index) => ({
          id: reversed.length - index,
          src: item.src,
          alt: item.alt ?? "",
        }))
      );
      setScrollIndex(0);
    } else if (cards.length) {
      const reversed = [...cards].reverse();
      setStack(
        reversed.map((content, index) => ({
          id: reversed.length - index,
          content,
        }))
      );
      setScrollIndex(0);
    }
  }, [cards, imageItems, transitionMode]);

  const advanceRef = useRef<() => void>(() => {});
  const advance = useCallback(() => {
    if (transitionMode === "horizontalScroll") {
      setScrollIndex((prev) => (prev + 1) % Math.max(1, stack.length));
    } else {
      setStack((prev) => {
        const newStack = [...prev];
        const topCardId = prev[prev.length - 1].id;
        const idx = newStack.findIndex((c) => c.id === topCardId);
        const [card] = newStack.splice(idx, 1);
        newStack.unshift(card);
        return newStack;
      });
    }
  }, [transitionMode, stack.length]);
  advanceRef.current = advance;

  const sendToBack = (id: number) => {
    if (transitionMode === "horizontalScroll") {
      advance();
      return;
    }
    setStack((prev) => {
      const newStack = [...prev];
      const index = newStack.findIndex((card) => card.id === id);
      const [card] = newStack.splice(index, 1);
      newStack.unshift(card);
      return newStack;
    });
  };

  useEffect(() => {
    if (autoplay && stack.length > 1 && !isPaused) {
      const interval = setInterval(() => {
        if (transitionMode === "horizontalScroll") {
          advanceRef.current();
        } else {
          const topCardId = stack[stack.length - 1].id;
          setStack((prev) => {
            const newStack = [...prev];
            const idx = newStack.findIndex((c) => c.id === topCardId);
            const [card] = newStack.splice(idx, 1);
            newStack.unshift(card);
            return newStack;
          });
        }
      }, autoplayDelay);

      return () => clearInterval(interval);
    }
  }, [autoplay, autoplayDelay, stack, isPaused, transitionMode]);

  const useHorizontalScroll = transitionMode === "horizontalScroll" && !spreadHorizontal;
  const n = stack.length;

  const visibleItems = useMemo(() => {
    if (n === 0) return [];
    const items: { stackIndex: number; position: number; card: (typeof stack)[0] }[] = [];
    for (let position = -VISIBLE_RANGE; position <= VISIBLE_RANGE; position++) {
      const stackIndex = ((n - 1 - scrollIndex - position) % n + n) % n;
      items.push({ stackIndex, position, card: stack[stackIndex] });
    }
    return items;
  }, [stack, scrollIndex, n]);

  const stableRandomRotate = useCallback((id: number) => {
    if (!randomRotation) return 0;
    return ((id * 9301 + 49297) % 1000) / 1000 * 10 - 5;
  }, [randomRotation]);

  return (
    <div
      className={`stack-container ${spreadHorizontal ? "stack-container--spread" : ""} ${useHorizontalScroll ? "stack-container--horizontal-scroll" : ""}`}
      style={
        spreadHorizontal
          ? {
              ["--stack-gap" as string]: `${spreadGap}px`,
              ["--stack-card-width" as string]: `${spreadCardWidth}px`,
            } as React.CSSProperties
          : undefined
      }
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {useHorizontalScroll ? (
        <>
          {visibleItems.map(({ position, card }) => {
            const isFront = position === 0;
            const shouldLoadImage =
              "src" in card && Math.abs(position) <= IMAGE_LOAD_RANGE;
            const randomRotate = stableRandomRotate(card.id);
            const backOffsetPx =
              position > 0 ? -backSpreadPx : position < 0 ? backSpreadPx : 0;
            const scale =
              isFront ? 1 : 1 - Math.min(Math.abs(position) * 0.23, 0.35);
            const focusGap = 0.8;
            const backStep = 0.65;
            const offset =
              position === 0
                ? 0
                : position > 0
                  ? focusGap + (position - 1) * backStep
                  : -(focusGap + (Math.abs(position) - 1) * backStep);
            const cardContent =
              "src" in card ? (
                <img
                  src={shouldLoadImage ? card.src : undefined}
                  alt={card.alt}
                  loading="lazy"
                  decoding="async"
                  fetchPriority={isFront ? "high" : "low"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  className="card-image"
                />
              ) : (
                card.content
              );
            return (
              <div
                key={card.id}
                className="stack-card-slot stack-card-slot--horizontal"
                style={{
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: n - Math.abs(position),
                }}
              >
                <CardRotate
                  onSendToBack={advance}
                  sensitivity={sensitivity}
                  disableDrag={shouldDisableDrag}
                  spreadHorizontal={false}
                >
                  <motion.div
                    className={`card ${isFront ? "card--focused" : "card--back"}`}
                    onClick={() => shouldEnableClick && advance()}
                    animate={{
                      x:
                        backOffsetPx === 0
                          ? `${offset * 100}%`
                          : `calc(${offset * 100}% + ${backOffsetPx}px)`,
                      rotateZ:
                        isFront
                          ? randomRotate
                          : Math.abs(position) * 4 + randomRotate,
                      scale,
                      transformOrigin: "center center",
                    }}
                    initial={false}
                    transition={{
                      type: "tween",
                      duration: 0.4,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    {cardContent}
                  </motion.div>
                </CardRotate>
              </div>
            );
          })}
        </>
      ) : (
        stack.map((card, index) => {
          const randomRotate = randomRotation ? Math.random() * 10 - 5 : 0;
          const topIndex = stack.length - 1;
          const distanceFromTop = topIndex - index;
          const backOffsetX =
            backSpreadPx > 0 && distanceFromTop > 0
              ? distanceFromTop *
                backSpreadPx *
                (distanceFromTop % 2 === 1 ? 1 : -1)
              : 0;
          return (
            <CardRotate
              key={card.id}
              onSendToBack={() => sendToBack(card.id)}
              sensitivity={sensitivity}
              disableDrag={shouldDisableDrag}
              spreadHorizontal={spreadHorizontal}
            >
              <motion.div
                className={`card ${index === topIndex ? "card--focused" : "card--back"}`}
                onClick={() => shouldEnableClick && sendToBack(card.id)}
                animate={
                  spreadHorizontal
                    ? {
                        rotateZ: randomRotate,
                        scale: 1,
                        transformOrigin: "center center",
                      }
                    : {
                        x: backOffsetX,
                        rotateZ: (stack.length - index - 1) * 4 + randomRotate,
                        scale: 1 + index * 0.06 - stack.length * 0.06,
                        transformOrigin: "90% 90%",
                      }
                }
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: animationConfig.stiffness ?? 80,
                  damping: animationConfig.damping ?? 24,
                  mass: animationConfig.mass ?? 0.9,
                }}
              >
                {card.content}
              </motion.div>
            </CardRotate>
          );
        })
      )}
    </div>
  );
}

import { motion, useMotionValue, useTransform } from "motion/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import "./Stack.css";

const lerp = (p1: number, p2: number, t: number) => p1 + (p2 - p1) * t;

function computeBend(
  xFromCenter: number,
  viewportWidth: number,
  bend: number
): { y: number; rotationZ: number } {
  const H = viewportWidth / 2;
  if (bend === 0) return { y: 0, rotationZ: 0 };
  const B_abs = Math.abs(bend);
  const R = (H * H + B_abs * B_abs) / (2 * B_abs);
  const effectiveX = Math.min(Math.abs(xFromCenter), H);
  const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
  const angle = Math.asin(Math.min(effectiveX / R, 1));
  if (bend > 0) {
    return {
      y: -arc,
      rotationZ: -Math.sign(xFromCenter) * (angle * 180) / Math.PI,
    };
  }
  return {
    y: arc,
    rotationZ: (Math.sign(xFromCenter) * (angle * 180)) / Math.PI,
  };
}

interface CardTiltProps {
  children: ReactNode;
  isActive: boolean;
}

function CardTilt({ children, isActive }: CardTiltProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-80, 80], [12, -12]);
  const rotateY = useTransform(x, [-80, 80], [-12, 12]);

  if (!isActive) {
    return (
      <motion.div className="circular-scroll-card-wrapper" style={{ x: 0, y: 0 }}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="circular-scroll-card-wrapper circular-scroll-card-wrapper--floating"
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.5}
      whileTap={{ cursor: "grabbing" }}
    >
      {children}
    </motion.div>
  );
}

export interface CircularScrollStackProps {
  cards?: ReactNode[];
  bend?: number;
  scrollSpeed?: number;
  scrollEase?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  /** Card width in px (used for layout and scroll). */
  cardWidth?: number;
  /** Card height in px. */
  cardHeight?: number;
}

const DEFAULT_CARDS: ReactNode[] = [];

export default function CircularScrollStack({
  cards = DEFAULT_CARDS,
  bend = 1,
  scrollSpeed = 2,
  scrollEase = 0.05,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  cardWidth = 208,
  cardHeight = 208,
}: CircularScrollStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(208);
  const [viewportHeight, setViewportHeight] = useState(208);

  const scrollRef = useRef({ current: 0, target: 0, last: 0 });
  const [scrollState, setScrollState] = useState(0);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const items = useMemo(() => (cards.length ? cards : []), [cards]);
  const n = items.length;
  const totalStripWidth = n * cardWidth;
  const stripWidth = totalStripWidth * 2;

  const normalizedScroll = useCallback(
    (raw: number) => {
      if (totalStripWidth <= 0) return 0;
      return ((raw % totalStripWidth) + totalStripWidth) % totalStripWidth;
    },
    [totalStripWidth]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (el) {
        setViewportWidth(el.clientWidth);
        setViewportHeight(el.clientHeight);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const getBendStyle = useCallback(
    (stripPosition: number) => {
      const scroll = normalizedScroll(scrollState);
      const xFromCenter = stripPosition - scroll - viewportWidth / 2 + cardWidth / 2;
      const { y, rotationZ } = computeBend(xFromCenter, viewportWidth, bend);
      return {
        y,
        rotationZ,
        xFromCenter,
      };
    },
    [viewportWidth, bend, cardWidth, normalizedScroll, scrollState]
  );

  useEffect(() => {
    if (items.length === 0) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY || (e as WheelEvent & { wheelDelta?: number }).wheelDelta || 0;
      scrollRef.current.target += (delta > 0 ? scrollSpeed : -scrollSpeed) * 0.5 * cardWidth;
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Element;
      if (!target || !container.contains(target as Node)) return;
      if (target.closest(".circular-scroll-card-wrapper--floating")) return;
      isDownRef.current = true;
      startXRef.current = "touches" in e ? e.touches[0].clientX : e.clientX;
      startScrollRef.current = scrollRef.current.current;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDownRef.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const dx = (startXRef.current - clientX) * (scrollSpeed * 0.04);
      scrollRef.current.target = startScrollRef.current + dx;
    };

    const onPointerUp = () => {
      isDownRef.current = false;
    };

    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    window.addEventListener("touchstart", onPointerDown);
    window.addEventListener("touchmove", onPointerMove);
    window.addEventListener("touchend", onPointerUp);

    return () => {
      container.removeEventListener("wheel", onWheel);
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
    };
  }, [items.length, scrollSpeed, cardWidth]);

  useEffect(() => {
    if (items.length === 0) return;

    const update = () => {
      const scroll = scrollRef.current;
      scroll.current = lerp(scroll.current, scroll.target, scrollEase);
      scroll.last = scroll.current;
      setScrollState(scroll.current);
      rafRef.current = requestAnimationFrame(update);
    };
    rafRef.current = requestAnimationFrame(update);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [items.length, scrollEase]);

  const [isPaused, setIsPaused] = useState(false);
  const effectivePaused = pauseOnHover && isPaused;

  useEffect(() => {
    if (!autoplay || items.length <= 1) return;
    if (effectivePaused) return;
    const interval = setInterval(() => {
      scrollRef.current.target += cardWidth;
    }, autoplayDelay);
    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, items.length, cardWidth, effectivePaused]);

  const normalized = normalizedScroll(scrollState);

  if (items.length === 0) {
    return (
      <div
        ref={containerRef}
        className="circular-scroll-stack"
        style={{ cursor: "grab" }}
      />
    );
  }

  const allIndices = Array.from({ length: 2 * n }, (_, i) => i);

  return (
    <div
      ref={containerRef}
      className="circular-scroll-stack"
      style={{
        width: "100%",
        height: "100%",
        // overflow: "hidden",
        cursor: "grab",
        position: "relative",
      }}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div
        className="circular-scroll-stack__strip"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: stripWidth,
          height: cardHeight,
          marginLeft: -stripWidth / 2,
          marginTop: -cardHeight / 2,
          transform: `translateX(${-normalized + viewportWidth / 2 - cardWidth / 2}px)`,
          willChange: "transform",
          pointerEvents: "none",
        }}
      >
        {allIndices.map((i) => {
          const stripPosition = i * cardWidth;
          const { y, rotationZ, xFromCenter } = getBendStyle(stripPosition);
          const isFocused =
            Math.abs(xFromCenter) <= cardWidth / 2 + 20;
          const itemIndex = i % n;
          const content = items[itemIndex];

          return (
            <motion.div
              key={`${i}`}
              className="circular-scroll-stack__card-slot"
              style={{
                position: "absolute",
                left: stripPosition,
                top: 0,
                width: cardWidth,
                height: cardHeight,
                transformOrigin: "center center",
                transform: `translateY(${y}px) rotateZ(${rotationZ}deg)`,
                pointerEvents: "auto",
              }}
            >
              <CardTilt isActive={isFocused}>
                <motion.div
                  className={`card ${isFocused ? "card--focused" : "card--back"}`}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    borderRadius: "1rem",
                    //overflow: "hidden",
                  }}
                >
                  {content}
                </motion.div>
              </CardTilt>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

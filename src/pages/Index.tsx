import { useState, useEffect, useCallback } from "react";
import HeroSection from "@/components/HeroSection";
import StorySection from "@/components/StorySection";
import GallerySection from "@/components/GallerySection";
import LetterForm, { type LetterSubmitPayload } from "@/components/LetterForm";
import LettersWall from "@/components/LettersWall";
import DonationCTA from "@/components/DonationCTA";
import {
  submitLetter,
  fetchLetters,
  letterRowToLetter,
} from "@/lib/letters";

// Import all images from assets (Vite glob – no one-by-one imports)
const imageModules = import.meta.glob<{ default: string }>(
  "/src/assets/*.{jpg,jpeg,png,gif,webp}",
  { eager: true }
);
const imageEntries = Object.entries(imageModules) as [string, { default: string }][];
const allImageUrls = imageEntries.map(([, mod]) => mod.default);
const heroImageUrl = imageEntries.find(([path]) => path.includes("hero"))?.[1].default ?? allImageUrls[0];

interface Letter {
  id: string;
  author: string;
  content: string;
  images: string[];
  audio?: string;
  createdAt: Date;
}

// Sample letters to show the wall isn't empty
const sampleLetters: Letter[] = [
  {
    id: "1",
    author: "Maria",
    images: [],
    content: `Dragă eu, cea de la 16 ani,
Poate nu știi încă, dar există oameni care văd mai mult în tine decât vezi tu acum. Îți amintești de profesoara care te-a încurajat să mergi la concursul de teatru, deși abia aveai curaj să vorbești în clasă? Atunci a fost momentul în care cineva a avut încredere în tine. Și, fără să îți dai seama, acel moment îți va schimba drumul.

Ține minte: uneori e nevoie de un singur om care să creadă în tine.`,
    createdAt: new Date("2025-01-15"),
  },
  {
    id: "2",
    author: "Andrei",
    images: [],
    content: `Dragă eu, cel de la 16 ani,
Vor fi multe momente în care o să simți că nu ești suficient de bun. Dar o să fie și cineva care îți va spune, la momentul potrivit: „O să fie bine. Eu știu că poți."
Pentru tine, acel om va fi tata. Iar cuvintele lui vor rămâne cu tine mult mai mult decât îți imaginezi acum.

Încrederea primită atunci o să te ducă mai departe decât crezi.`,
    createdAt: new Date("2025-01-28"),
  },
  {
    id: "3",
    author: "Anonim",
    images: [],
    content: `Dragă eu, cel de la 16 ani,
Îți amintești momentul în care cineva ți-a dat prima carte „greu de citit" și a spus că știe că o vei înțelege? Nu era doar o carte, era încrederea pe care ți-a oferit-o.
Poate nu ți-ai dat seama atunci, dar acel gest mic te-a făcut să crezi că poți mai mult.

Și, într-o zi, vei descoperi că exact de acolo a început totul.`,
    createdAt: new Date("2025-02-01"),
  },
];

const LETTER_HASH_REGEX = /^#letter-([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;

const Index = () => {
  const [letters, setLetters] = useState<Letter[]>(sampleLetters);
  const [highlightLetterId, setHighlightLetterId] = useState<string | null>(null);
  const [openLetterIdFromUrl, setOpenLetterIdFromUrl] = useState<string | null>(null);

  const galleryImages = allImageUrls;

  // Open shared letter when URL has #letter-<id> (e.g. when embedded in iframe and parent passes hash into iframe src)
  useEffect(() => {
    const hash = window.location.hash?.trim() || "";
    const match = hash.match(LETTER_HASH_REGEX);
    if (match) {
      const id = match[1];
      setHighlightLetterId(id);
      setOpenLetterIdFromUrl(id);
    }
  }, []);

  // When embedded in iframe, parent (WordPress) can send letter id via postMessage so we open that letter
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const data = event.data;
      if (data?.type === "OPEN_LETTER" && typeof data?.letterId === "string") {
        setHighlightLetterId(data.letterId);
        setOpenLetterIdFromUrl(data.letterId);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const loadLetters = useCallback(() => {
    fetchLetters().then((rows) => {
      const fromDb = rows.map(letterRowToLetter);
      // Use only DB data when we have any, so the wall always reflects the latest from DB
      const list =
        fromDb.length > 0
          ? fromDb.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
          : sampleLetters;
      setLetters(list);
    });
  }, []);

  useEffect(() => {
    loadLetters();
  }, [loadLetters]);

  useEffect(() => {
    const onFocus = () => loadLetters();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [loadLetters]);

  const handleLetterSubmit = async (letterData: LetterSubmitPayload) => {
    const result = await submitLetter({
      author: letterData.author,
      content: letterData.content,
      images: letterData.images?.length ? letterData.images : undefined,
      audio: letterData.audio,
      isPrivate: letterData.isPrivate,
      promoConsent: letterData.promoConsent,
    });
    if (result.ok === false) {
      throw new Error(result.error);
    }
    const newId = result.row.id;
    if (!letterData.isPrivate) {
      loadLetters();
    }
    setHighlightLetterId(newId);
    setTimeout(() => setHighlightLetterId(null), 3000);
    document.getElementById("letters")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen scroll-smooth">
      <HeroSection heroImage={heroImageUrl} />
      <StorySection />
      <GallerySection images={galleryImages} />
      <LetterForm onSubmit={handleLetterSubmit} />
      <LettersWall
        letters={letters}
        highlightLetterId={highlightLetterId}
        openLetterIdFromUrl={openLetterIdFromUrl}
        onOpenLetterFromUrlHandled={() => setOpenLetterIdFromUrl(null)}
      />
      <DonationCTA />
    </main>
  );
};

export default Index;

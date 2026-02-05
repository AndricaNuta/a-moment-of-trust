import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import StorySection from "@/components/StorySection";
import GallerySection from "@/components/GallerySection";
import LetterForm from "@/components/LetterForm";
import LettersWall from "@/components/LettersWall";
import DonationCTA from "@/components/DonationCTA";

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
  image?: string;
  audio?: string;
  createdAt: Date;
}

// Sample letters to show the wall isn't empty
const sampleLetters: Letter[] = [
  {
    id: "1",
    author: "Maria",
    content: `Dragă doamnă profesoară,

Nu știu dacă vă mai aduceți aminte de mine. Eram acel adolescent timid din clasa a X-a care nu vorbea niciodată. Dar dumneavoastră ați văzut ceva în mine — m-ați încurajat să particip la concursul de teatru.

Atunci ați crezut în mine. Și asta mi-a schimbat viața.

Mulțumesc.`,
    createdAt: new Date("2025-01-15"),
  },
  {
    id: "2",
    author: "Andrei",
    content: `Tată,

La 16 ani, când toată lumea spunea că nu o să reușesc nimic, tu ai fost singurul care mi-a spus: "O să fie bine. Eu știu că poți."

Acele cuvinte încă mă ghidează și azi.`,
    createdAt: new Date("2025-01-28"),
  },
  {
    id: "3",
    author: "Anonim",
    content: `Pentru doamna de la librărie,

Probabil nu o să citiți niciodată asta, dar ați fost prima persoană care mi-a dat de citit o carte "de mari" când eram adolescent. Ați avut încredere că pot înțelege lucruri complicate.

Acum sunt scriitor.`,
    createdAt: new Date("2025-02-01"),
  },
];

const Index = () => {
  const [letters, setLetters] = useState<Letter[]>(sampleLetters);

  const galleryImages = allImageUrls;

  const handleLetterSubmit = (letterData: Omit<Letter, "id" | "createdAt">) => {
    const newLetter: Letter = {
      ...letterData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setLetters((prev) => [newLetter, ...prev]);
  };

  return (
    <main className="min-h-screen scroll-smooth">
      <HeroSection heroImage={heroImageUrl} />
      <StorySection />
      <GallerySection images={galleryImages} />
      <LetterForm onSubmit={handleLetterSubmit} />
      <LettersWall letters={letters} />
      <DonationCTA />
    </main>
  );
};

export default Index;

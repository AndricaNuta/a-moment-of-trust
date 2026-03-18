import { useMemo } from "react";
import DomeGallery from "@/components/DomeGallery";
import Stack from "@/components/Stack";

interface GallerySectionProps {
  images: string[];
}

const captions = [
  "acel moment când cineva te vede",
  "mâini care te susțin",
  "sub lumina reflectoarelor",
];

const GallerySection = ({ images }: GallerySectionProps) => {
  const galleryImages = useMemo(
    () =>
      images.map((src, i) => ({
        src,
        alt: captions[i] ?? `Imagine ${i + 1}`,
      })),
    [images]
  );

  const stackCards = useMemo(
    () =>
      images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={captions[i] ?? `Imagine ${i + 1}`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )),
    [images]
  );

  const stackImageItems = useMemo(
    () =>
      images.map((src, i) => ({
        src,
        alt: captions[i] ?? `Imagine ${i + 1}`,
      })),
    [images]
  );

  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-background relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-left mb-6 sm:mb-8">
          <span className="text-primary text-detalii font-semibold tracking-wide">
            momente
          </span>
          <h2 className="text-titlu-capitol text-foreground mt-2 mb-2">
            încrederea în acțiune
          </h2>
          <p className="text-body text-muted-foreground max-w-lg">
            fii diferența între cineva care nu crede și cineva care începe să creadă în sine.
          </p>
        </div>

        <div className="w-full h-[70vh] min-h-[400px]">
          <DomeGallery
            images={galleryImages}
            fit={0.8}
            minRadius={600}
            maxVerticalRotationDeg={0}
            segments={34}
            dragDampening={2}
            grayscale
            overlayBlurColor="hsl(var(--background))"
            openedImageWidth="min(75vw, 500px)"
            openedImageHeight="min(60vh, 400px)"
          />
        </div>
{/*
        <div className="mt-8 flex justify-center overflow-visible">
          <div className="w-[208px] h-[208px] overflow-visible">
            <Stack
              randomRotation={true}
              sensitivity={200}
              sendToBackOnClick={true}
              cards={stackCards}
              imageItems={stackImageItems}
              autoplay={true}
              autoplayDelay={3000}
              pauseOnHover={true}
              backSpreadPx={42}
              animationConfig={{
                stiffness: 70,
                damping: 26,
                mass: 1,
              }}
              transitionMode="horizontalScroll"
            />
          </div>
        </div>
*/}
        {/*
        <p className="mt-6 sm:mt-8 text-left text-body text-muted-foreground">
          iar tu?{" "}
          <a href="#write" className="text-primary font-semibold hover:underline">
            scrie-i o scrisoare
          </a>
        </p>
        */}
      </div>
    </section>
  );
};

export default GallerySection;

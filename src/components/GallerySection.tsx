import DomeGallery from "@/components/DomeGallery";

interface GallerySectionProps {
  images: string[];
}

const captions = [
  "acel moment când cineva te vede",
  "mâini care te susțin",
  "sub lumina reflectoarelor",
];

const GallerySection = ({ images }: GallerySectionProps) => {
  const galleryImages = images.map((src, i) => ({
    src,
    alt: captions[i] ?? `Imagine ${i + 1}`,
  }));

  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-background relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-left mb-6 sm:mb-8">
          <span className="text-primary text-sm font-medium tracking-wide">
            momente
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mt-2 mb-2">
            încrederea în acțiune
          </h2>
          <p className="text-muted-foreground max-w-lg text-sm leading-relaxed">
            cineva care crede — cineva care începe să creadă în sine.
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
          />
        </div>

        <p className="mt-6 sm:mt-8 text-center text-muted-foreground text-sm">
          iar tu?{" "}
          <a href="#write" className="text-primary font-medium hover:underline">
            scrie-i o scrisoare
          </a>
        </p>
      </div>
    </section>
  );
};

export default GallerySection;

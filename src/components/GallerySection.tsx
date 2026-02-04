interface GallerySectionProps {
  images: string[];
}

const GallerySection = ({ images }: GallerySectionProps) => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <div className="flex gap-2 mb-6">
            <span className="w-2 h-2 bg-primary" />
            <span className="w-2 h-2 bg-primary/60" />
            <span className="w-2 h-2 bg-primary/30" />
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold ideo-headline mb-4">
            momente de încredere
          </h2>
          <p className="text-muted-foreground">
            imagini care surprind legătura specială dintre adolescenți și mentorii 
            lor — acele momente în care cineva alege să creadă.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden group"
            >
              <img
                src={image}
                alt={`Trust moment ${index + 1}`}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
              
              {/* Corner accent */}
              <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <div className="w-8 h-1 bg-primary mx-auto mb-8" />
          <blockquote className="text-2xl md:text-3xl font-light text-foreground ideo-headline italic">
            "dacă cineva a crezut în mine la 16 ani,
            <br />
            <span className="text-primary not-italic">eu pot crede în altcineva azi.</span>"
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;

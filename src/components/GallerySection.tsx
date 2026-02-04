interface GallerySectionProps {
  images: string[];
}

const GallerySection = ({ images }: GallerySectionProps) => {
  const captions = [
    "acel moment când cineva te vede",
    "mâini care te susțin",
    "sub lumina reflectoarelor"
  ];

  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-background relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-left mb-6 sm:mb-8">
          <span className="text-primary text-sm font-medium tracking-wide">momente</span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mt-2 mb-2">încrederea în acțiune</h2>
          <p className="text-muted-foreground max-w-lg text-sm leading-relaxed">
            cineva care crede — cineva care începe să creadă în sine.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto">
          {images.map((image, index) => (
            <div key={index} className="group max-w-[180px] sm:max-w-[240px] md:max-w-none mx-auto sm:mx-0 w-full">
              <div className="bg-card rounded-xl border border-border/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                <img
                  src={image}
                  alt={captions[index]}
                  className="w-full aspect-square object-cover photo-bw max-w-full"
                  loading="lazy"
                  decoding="async"
                />
                <p className="p-3 text-left text-muted-foreground text-sm">
                  {captions[index]}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 sm:mt-8 text-center text-muted-foreground text-sm">
          iar tu? <a href="#write" className="text-primary font-medium hover:underline">scrie-i o scrisoare</a>
        </p>
      </div>
    </section>
  );
};

export default GallerySection;

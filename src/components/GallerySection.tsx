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
    <section className="py-24 bg-background relative">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 font-handwritten text-6xl text-primary/10 hidden lg:block">
        ♡
      </div>

      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-handwritten text-primary text-2xl">albumul amintirilor</span>
          <h2 className="text-3xl md:text-4xl font-semibold mt-4 mb-6">
            momente care rămân
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            imagini care surprind încrederea în acțiune — acel schimb nevăzut între 
            cineva care crede și cineva care începe să creadă în sine.
          </p>
        </div>

        {/* Photo gallery - polaroid style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative"
              style={{ 
                transform: `rotate(${index === 1 ? 0 : index === 0 ? -3 : 3}deg)`,
              }}
            >
              {/* Tape */}
              <div 
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-amber-100/80 shadow-sm z-10"
                style={{ transform: `rotate(${index % 2 === 0 ? -5 : 5}deg)` }}
              />
              
              {/* Polaroid frame */}
              <div className="bg-white p-3 pb-16 shadow-lg hover:shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:rotate-0">
                <div className="relative overflow-hidden">
                  <img
                    src={image}
                    alt={captions[index]}
                    className="w-full aspect-square object-cover sepia-[0.2] group-hover:sepia-0 transition-all duration-500"
                  />
                  
                  {/* Vintage overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-100/10 to-transparent pointer-events-none" />
                </div>
                
                {/* Handwritten caption */}
                <p className="absolute bottom-4 left-0 right-0 text-center font-handwritten text-lg text-muted-foreground px-2">
                  {captions[index]}
                </p>
              </div>

              {/* Decorative heart on hover */}
              <div className="absolute -bottom-2 -right-2 font-handwritten text-2xl text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                ♡
              </div>
            </div>
          ))}
        </div>

        {/* Memory prompt */}
        <div className="mt-20 max-w-2xl mx-auto text-center">
          <div className="bg-card p-8 relative">
            {/* Corner decorations */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-primary/40" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-primary/40" />
            
            <p className="font-handwritten text-2xl md:text-3xl text-foreground mb-4">
              iar tu? ce amintire îți vine în minte?
            </p>
            <p className="text-muted-foreground">
              poate e timpul să-i mulțumești acelei persoane. 
              sau măcar să-ți amintești cât de mult a însemnat.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;

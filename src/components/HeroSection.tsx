import { ChevronDown } from "lucide-react";

interface HeroSectionProps {
  heroImage: string;
}

const HeroSection = ({ heroImage }: HeroSectionProps) => {
  const scrollToContent = () => {
    document.getElementById("story")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-background">
      {/* Soft warm blob – one subtle shape for warmth */}
      <div
        className="absolute top-0 right-0 w-[80%] max-w-2xl h-[70%] rounded-full opacity-[0.07] pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
          transform: "translate(20%, -10%)",
        }}
      />

      <div className="container mx-auto px-6 lg:px-12 py-12 lg:py-16 relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 text-left">
            <p className="text-sm text-muted-foreground tracking-wide mb-3">
              o invitație să-ți amintești
            </p>

            <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-foreground leading-[1.2] mb-4">
              cine a crezut în tine când aveai 16 ani?
            </h1>

            <p className="text-muted-foreground max-w-lg leading-relaxed mb-6">
              scrie-i o scrisoare — câteva cuvinte din inimă. apoi citește pe ale altora sau ajuță un adolescent să aibă pe cineva care crede în el.
            </p>

            <button
              onClick={scrollToContent}
              className="group inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-5 py-2.5 rounded-lg shadow-sm hover:bg-primary/90 hover:shadow transition-all duration-200"
            >
              <span>scrie o scrisoare</span>
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>

          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="max-w-sm w-full">
              <img
                src={heroImage}
                alt="Un adolescent cu privirea spre viitor"
                className="w-full aspect-[4/5] object-cover rounded-2xl shadow-lg photo-warm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground">
        <span className="text-xs tracking-widest uppercase">scroll</span>
        <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
      </div>
    </section>
  );
};

export default HeroSection;

import { ChevronDown } from "lucide-react";

interface HeroSectionProps {
  heroImage: string;
}

const HeroSection = ({ heroImage }: HeroSectionProps) => {
  const scrollToContent = () => {
    document.getElementById("story")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Teenage hope and trust"
          className="w-full h-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
      </div>

      {/* Geometric Accent */}
      <div className="absolute left-0 top-1/4 w-2 h-32 bg-primary" />
      <div className="absolute left-6 top-1/4 w-1 h-20 bg-primary/50" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl">
          {/* Small accent squares */}
          <div className="flex gap-2 mb-8">
            <span className="w-2 h-2 bg-primary" />
            <span className="w-2 h-2 bg-primary/60" />
            <span className="w-2 h-2 bg-primary/30" />
          </div>

          {/* Main Question */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-foreground ideo-headline leading-tight mb-6">
            cineva a avut
            <br />
            <span className="text-primary">încredere în mine</span>
            <br />
            la 16 ani?
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mt-8 leading-relaxed">
            gândește-te la acea persoană. cea care ți-a oferit o șansă când alții 
            nu credeau în tine. acum e rândul tău să fii acea persoană pentru un 
            adolescent din România.
          </p>

          {/* CTA hint */}
          <div className="mt-12 flex items-center gap-4">
            <div className="w-12 h-[1px] bg-primary" />
            <span className="text-sm text-muted-foreground uppercase tracking-widest">
              scrie-i o scrisoare
            </span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
      >
        <span className="text-xs uppercase tracking-widest">descoperă</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </button>
    </section>
  );
};

export default HeroSection;

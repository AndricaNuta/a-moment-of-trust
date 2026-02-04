import { ChevronDown, Heart } from "lucide-react";

interface HeroSectionProps {
  heroImage: string;
}

const HeroSection = ({ heroImage }: HeroSectionProps) => {
  const scrollToContent = () => {
    document.getElementById("story")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Decorative floating elements */}
      <div className="absolute top-20 right-10 w-24 h-32 bg-secondary/60 rotate-6 shadow-lg animate-float hidden lg:block" />
      <div className="absolute bottom-32 left-16 w-20 h-28 bg-accent/40 -rotate-3 shadow-lg animate-float hidden lg:block" style={{ animationDelay: '2s' }} />
      
      {/* Main content grid */}
      <div className="container mx-auto px-6 lg:px-12 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left - Text content */}
          <div className="order-2 lg:order-1 space-y-8">
            {/* Small intro */}
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-primary fill-primary" />
              <span className="text-sm text-muted-foreground tracking-wide">
                o invitație să-ți amintești
              </span>
            </div>

            {/* Main Question - Handwritten style */}
            <h1 className="space-y-2">
              <span className="block text-2xl md:text-3xl text-muted-foreground font-light">
                ți-aduci aminte...
              </span>
              <span className="block font-handwritten text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight">
                cine a crezut în tine
              </span>
              <span className="block font-handwritten text-5xl md:text-6xl lg:text-7xl leading-tight">
                când aveai <span className="text-primary underline-hand">16 ani</span>?
              </span>
            </h1>

            {/* Warm, friendly description */}
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              un profesor, o bunică, un antrenor, poate chiar un necunoscut care 
              ți-a zis exact ce aveai nevoie să auzi. închide ochii o secundă și 
              gândește-te la acea persoană. 
              <span className="font-medium text-foreground"> acum hai să-i scriem împreună.</span>
            </p>

            {/* Playful CTA */}
            <button
              onClick={scrollToContent}
              className="group inline-flex items-center gap-3 text-primary hover:text-primary/80 transition-colors"
            >
              <span className="font-handwritten text-2xl">hai să începem</span>
              <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>

          {/* Right - Photo collage style */}
          <div className="order-1 lg:order-2 relative">
            {/* Main photo with nostalgic effect */}
            <div className="relative max-w-md mx-auto">
              {/* Tape decoration */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-8 bg-accent/90 rotate-[-2deg] shadow-sm z-10" />
              
              {/* Photo frame */}
              <div className="relative bg-background p-3 shadow-xl rotate-2 hover:rotate-0 transition-transform duration-500">
                <img
                  src={heroImage}
                  alt="Un adolescent cu privirea spre viitor"
                  className="w-full aspect-[4/5] object-cover sepia-[0.15] hover:sepia-0 transition-all duration-500"
                />
                
                {/* Handwritten caption */}
                <p className="font-handwritten text-xl text-center mt-3 text-muted-foreground">
                  "cineva a crezut în mine" ♡
                </p>
              </div>

              {/* Small decorative polaroid */}
              <div className="absolute -bottom-8 -left-8 bg-white p-2 shadow-lg -rotate-6 w-24 hidden md:block">
                <div className="w-full aspect-square bg-secondary" />
                <p className="font-handwritten text-sm text-center mt-1 text-muted-foreground">2008</p>
              </div>

              {/* Decorative stamp */}
              <div className="absolute -top-2 -right-4 w-16 h-16 border-4 border-primary/30 border-dashed rounded-full flex items-center justify-center rotate-12 hidden md:flex">
                <span className="font-handwritten text-primary text-sm text-center leading-tight">cu<br/>drag</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
        <span className="text-xs tracking-widest uppercase">descoperă povestea</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  );
};

export default HeroSection;

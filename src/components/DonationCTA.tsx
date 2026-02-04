import { Heart, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const DonationCTA = () => {
  return (
    <>
      {/* Floating Donation Banner - warm and friendly */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-border shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-primary fill-primary/30 hidden sm:block" />
              <p className="font-handwritten text-lg text-foreground text-center sm:text-left">
                ajută un adolescent să aibă parte de <span className="text-primary">cineva care crede în el</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                asChild
                size="sm"
                variant="outline"
                className="gap-1 font-handwritten text-base"
              >
                <a
                  href="https://ideoideis.ro/implica-te/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  3,5%
                </a>
              </Button>
              <Button
                asChild
                size="sm"
                className="gap-1 bg-primary hover:bg-primary/90 font-handwritten text-base"
              >
                <a
                  href="https://ideoideis.ro/implica-te/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Heart className="w-4 h-4" />
                  donează
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Donation Section - warm, emotional */}
      <section id="donate" className="py-24 bg-primary text-primary-foreground mb-20 relative overflow-hidden">
        {/* Decorative hearts */}
        <div className="absolute top-10 left-10 font-handwritten text-8xl text-primary-foreground/10 hidden lg:block">♡</div>
        <div className="absolute bottom-10 right-10 font-handwritten text-6xl text-primary-foreground/10 hidden lg:block">♡</div>

        <div className="container mx-auto px-6 lg:px-12 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Sparkles className="w-10 h-10 mx-auto mb-6 opacity-80" />

            <h2 className="font-handwritten text-4xl md:text-6xl mb-6">
              acum e rândul tău
            </h2>
            
            <p className="text-xl text-primary-foreground/90 mb-4">
              să fii acea persoană care crede
            </p>

            <p className="text-lg text-primary-foreground/70 max-w-xl mx-auto mb-10 leading-relaxed">
              prin donația ta, susții programele ideo ideis care oferă 
              adolescenților din România un loc unde cineva crede în ei —
              tabere, festivaluri, laboratoare de artă și dezvoltare personală.
            </p>

            {/* Stats - playful */}
            <div className="grid grid-cols-3 gap-6 mb-12 max-w-md mx-auto">
              {[
                { number: "18", label: "ani" },
                { number: "3000+", label: "adolescenți" },
                { number: "∞", label: "povești" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="font-handwritten text-4xl md:text-5xl mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-primary-foreground/60">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-handwritten text-xl gap-2"
              >
                <a
                  href="https://ideoideis.ro/implica-te/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Heart className="w-5 h-5" />
                  donează cu inima
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-handwritten text-xl gap-2"
              >
                <a
                  href="https://ideoideis.ro/implica-te/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-5 h-5" />
                  redirecționează 3,5%
                </a>
              </Button>
            </div>

            {/* Friendly explanation */}
            <div className="bg-white/10 backdrop-blur-sm p-6 max-w-lg mx-auto">
              <p className="font-handwritten text-lg text-primary-foreground/90 mb-2">
                ce e 3,5%?
              </p>
              <p className="text-sm text-primary-foreground/70">
                poți redirecționa 3,5% din impozitul pe venit către ideo ideis, 
                <span className="font-medium text-primary-foreground"> fără niciun cost pentru tine</span>. 
                banii ăștia oricum merg la stat — mai bine să meargă la adolescenți, nu?
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DonationCTA;

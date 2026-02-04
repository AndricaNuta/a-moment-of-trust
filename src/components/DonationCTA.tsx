import { Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const DonationCTA = () => {
  return (
    <>
      {/* Floating Donation Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-1 h-12 bg-primary hidden md:block" />
              <div>
                <p className="text-foreground font-medium">
                  susține adolescenții din România
                </p>
                <p className="text-sm text-muted-foreground">
                  redirecționează 3,5% din impozit sau donează direct
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                asChild
                variant="outline"
                className="gap-2"
              >
                <a
                  href="https://ideoideis.ro/implica-te/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4" />
                  3,5% din impozit
                </a>
              </Button>
              <Button
                asChild
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <a
                  href="https://ideoideis.ro/implica-te/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Heart className="w-4 h-4" />
                  Donează acum
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Donation Section */}
      <section id="donate" className="py-24 bg-primary text-primary-foreground mb-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Geometric accent */}
            <div className="flex justify-center gap-2 mb-8">
              <span className="w-3 h-3 bg-primary-foreground" />
              <span className="w-3 h-3 bg-primary-foreground/60" />
              <span className="w-3 h-3 bg-primary-foreground/30" />
            </div>

            <h2 className="text-3xl md:text-5xl font-semibold ideo-headline mb-6">
              acum e rândul tău să ai
              <br />
              încredere în adolescenți
            </h2>

            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
              prin donația ta, susții programele ideo ideis care oferă 
              adolescenților din România acces la educație artistică și 
              dezvoltare personală. un loc unde cineva crede în ei.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mb-12">
              {[
                { number: "18", label: "ediții festival" },
                { number: "3000+", label: "adolescenți" },
                { number: "50+", label: "comunități" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-primary-foreground/70 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2"
              >
                <a
                  href="https://ideoideis.ro/implica-te/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Heart className="w-5 h-5" />
                  Donează acum
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 gap-2"
              >
                <a
                  href="https://ideoideis.ro/implica-te/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-5 h-5" />
                  Redirecționează 3,5%
                </a>
              </Button>
            </div>

            {/* Info about 3.5% */}
            <p className="mt-8 text-sm text-primary-foreground/60">
              formularul 230 îți permite să redirecționezi 3,5% din impozitul 
              pe venit către ideo ideis, fără niciun cost suplimentar pentru tine.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default DonationCTA;

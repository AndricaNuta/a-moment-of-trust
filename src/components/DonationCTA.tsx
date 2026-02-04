import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const DonationCTA = () => {
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-foreground text-center sm:text-left text-sm">
              ajută un adolescent să aibă parte de{" "}
              <span className="text-primary font-medium">cineva care crede în el</span>
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline">
                <a
                  href="https://ideoideis.ro/implica-te/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  3,5%
                </a>
              </Button>
              <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                <a
                  href="https://ideoideis.ro/implica-te/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  donează
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <section id="donate" className="py-14 lg:py-16 bg-primary text-primary-foreground mb-20 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">fii acea persoană care crede</h2>
            <p className="text-primary-foreground/90 text-sm max-w-lg mx-auto mb-6">
              donație sau 3,5% din impozit → adolescenți care au pe cineva care crede în ei (tabere, festivaluri, artă).
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8 max-w-sm mx-auto">
              {[
                { number: "18", label: "ani" },
                { number: "3000+", label: "adolescenți" },
                { number: "∞", label: "povești" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-semibold">{stat.number}</div>
                  <div className="text-xs text-primary-foreground/70">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Button
                asChild
                size="lg"
                className="bg-background text-primary hover:bg-background/90 font-semibold"
              >
                <a
                  href="https://ideoideis.ro/implica-te/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  donează
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground/15"
              >
                <a
                  href="https://ideoideis.ro/implica-te/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4" />
                  3,5%
                </a>
              </Button>
            </div>

            <p className="text-xs text-primary-foreground/80 max-w-md mx-auto text-left">
              <strong>3,5%:</strong> redirecționezi din impozit către ideo ideis, fără cost pentru tine.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default DonationCTA;

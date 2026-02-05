import { Button } from "@/components/ui/button";

const DonationCTA = () => {
  return (
    <section id="donate" className="py-14 lg:py-16 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">
              cineva a avut încredere în tine la 16 ani.
              <br />
              acum e rândul tău.
            </h2>
            <p className="text-primary-foreground/90 text-sm max-w-lg mx-auto mb-6">
              prin donație directă sau redirecționarea a 3,5% din impozit, ajuți un adolescent să întâlnească acel „cineva” la momentul potrivit.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8 max-w-sm mx-auto">
              {[
                { number: "21", label: "ani" },
                { number: "6000+", label: "adolescenți" },
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
                  target="_top"
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
                  target="_top"
                >
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
  );
};

export default DonationCTA;

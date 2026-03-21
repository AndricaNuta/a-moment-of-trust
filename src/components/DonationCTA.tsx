import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

const DonationCTA = () => {
  return (
    <section id="donate" className="py-14 lg:py-16 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-titlu-capitol mb-3">
              cineva a avut încredere în tine la 16 ani
              <br />
              acum e rândul tău
            </h2>
            <p className="text-body text-primary-foreground/90 max-w-lg mx-auto mb-6">
              prin donație directă sau redirecționarea a 3,5% din impozit, ajuți un adolescent să întâlnească acel „cineva” la momentul potrivit
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8 max-w-sm mx-auto">
              {[
                { number: "21", label: "ani" },
                { number: "6000+", label: "adolescenți" },
                { number: "∞", label: "povești" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-titlu-capitol">{stat.number}</div>
                  <div className="text-detalii text-primary-foreground/70">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button
                asChild
                size="lg"
                className="bg-background text-primary hover:bg-background/90 font-semibold text-lg px-10 py-6"
              >
                <a
                  href="https://ideoideis.ro/doneaza/"
                  target="_top"
                  onClick={() => trackEvent({ event_type: "donation_clicked", button: "doneaza" })}
                >
                  donează
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground/15 text-lg px-10 py-6"
              >
                <a
                  href="https://ideoideis.ro/doneaza/"
                  target="_top"
                  onClick={() => trackEvent({ event_type: "donation_clicked", button: "3,5" })}
                >
                  3,5%
                </a>
              </Button>
            </div>

            <p className="text-detalii text-primary-foreground/80 max-w-md mx-auto text-left">
              <strong>3,5%:</strong> redirecționezi din impozit către ideo ideis, fără cost pentru tine
            </p>
          </div>
        </div>
      </section>
  );
};

export default DonationCTA;

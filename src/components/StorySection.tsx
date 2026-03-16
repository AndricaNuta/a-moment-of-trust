import { Sparkles, PenLine, Share2, Heart } from "lucide-react";

const StorySection = () => {
  const steps = [
    { icon: Sparkles, title: "amintește-ți", description: "cine a avut încredere în tine când aveai 16 ani?" },
    { icon: PenLine, title: "scrie-i", description: "o scrisoare versiunii tale de atunci - câteva rânduri din inimă" },
    { icon: Share2, title: "distribuie", description: "povestea ta îi poate inspira și pe alții să își amintească" },
    { icon: Heart, title: "fii acea persoană", description: "printr-o donație sau redirecționarea a 3,5% din impozit, ajuți un alt adolescent să ajungă la Ideo Ideis" }
  ];

  return (
    <section id="story" className="py-14 lg:py-16 bg-section-alt text-section-alt-foreground relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-left mb-8">
            <span className="text-primary text-detalii font-semibold tracking-wide">cum funcționează</span>
            <h2 className="text-titlu-capitol mt-2 mb-3">
              toți am avut pe cineva
            </h2>
            <p className="text-body text-white/85 max-w-xl">
              scrie o scrisoare versiunii tale de la 16 ani și amintește-ți cine a avut încredere în tine atunci. povestea ta îi poate inspira pe alții, iar printr-o donație poți face ca și alți adolescenți să aibă, la rândul lor, pe cineva care are încredere în ei.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative bg-white/5 p-4 border border-white/20 shadow-sm hover:border-primary/40 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-primary/20 flex items-center justify-center text-primary font-semibold text-detalii">
                    {index + 1}
                  </div>
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-titlu-capitol text-white">{step.title}</h3>
                <p className="text-body text-white/80">{step.description}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default StorySection;

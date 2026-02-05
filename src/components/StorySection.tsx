import { Sparkles, PenLine, Share2, Heart } from "lucide-react";

const StorySection = () => {
  const steps = [
    { icon: Sparkles, title: "amintește-ți", description: "cine a fost acolo pentru tine?" },
    { icon: PenLine, title: "scrie-i", description: "câteva cuvinte — tot ce vrei să spui" },
    { icon: Share2, title: "împarte", description: "scrisoarea ta inspiră și pe alții" },
    { icon: Heart, title: "fii acea persoană", description: "donație → adolescenți care au pe cineva care crede în ei" }
  ];

  return (
    <section id="story" className="py-14 lg:py-16 bg-card/60 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-left mb-8">
            <span className="text-primary text-sm font-medium tracking-wide">cum funcționează</span>
            <h2 className="text-2xl md:text-3xl font-semibold mt-2 mb-3">
              toți am avut pe cineva
            </h2>
            <p className="text-muted-foreground max-w-xl leading-relaxed">
              un cuvânt, un gest — și totul s-a schimbat. scrii o scrisoare, o împarți, sau ajuți prin donație.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative bg-background p-4 rounded-xl border border-border/80 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                    {index + 1}
                  </div>
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-left">
            <p className="text-foreground font-medium">
              fiecare adolescent merită pe cineva care să spună: eu cred în tine.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;

import { Sparkles, PenLine, Share2, Heart } from "lucide-react";

const StorySection = () => {
  const steps = [
    {
      icon: Sparkles,
      title: "amintește-ți",
      description: "închide ochii și du-te înapoi în timp. cine a fost acolo pentru tine?"
    },
    {
      icon: PenLine,
      title: "scrie-i",
      description: "o scrisoare, un mesaj, câteva cuvinte — tot ce simți că vrei să spui"
    },
    {
      icon: Share2,
      title: "împarte povestea",
      description: "lasă-ți scrisoarea să inspire și pe alții să-și amintească"
    },
    {
      icon: Heart,
      title: "fii acea persoană",
      description: "prin donație, ajuți adolescenți să aibă parte de cineva care crede în ei"
    }
  ];

  return (
    <section id="story" className="py-24 bg-card relative overflow-hidden">
      {/* Decorative notebook lines */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute left-20 top-0 bottom-0 w-[1px] bg-primary/20" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="font-handwritten text-primary text-2xl">despre această poveste</span>
            <h2 className="text-3xl md:text-4xl font-semibold mt-4 mb-6">
              toți am avut pe cineva
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              poate nu ne-am dat seama atunci, dar cineva a văzut ceva în noi 
              când noi nu vedeam nimic. un cuvânt, un gest, o încurajare — 
              și totul s-a schimbat. 
              <span className="font-handwritten text-xl text-foreground"> asta e magia încrederii.</span>
            </p>
          </div>

          {/* Steps - playful cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="group relative bg-background p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                style={{ transform: `rotate(${index % 2 === 0 ? -1 : 1}deg)` }}
              >
                {/* Number badge */}
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-primary text-primary-foreground font-handwritten text-xl flex items-center justify-center shadow-md">
                  {index + 1}
                </div>

                {/* Icon */}
                <step.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />

                {/* Content */}
                <h3 className="font-handwritten text-2xl text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>

                {/* Decorative corner */}
                <div className="absolute bottom-2 right-2 font-handwritten text-3xl text-primary/20">
                  ✦
                </div>
              </div>
            ))}
          </div>

          {/* Warm quote */}
          <div className="mt-16 text-center">
            <div className="inline-block bg-secondary/50 px-8 py-6 relative">
              {/* Quote marks */}
              <span className="absolute -top-4 left-4 font-handwritten text-6xl text-primary/30">"</span>
              <p className="font-handwritten text-2xl md:text-3xl text-foreground leading-relaxed">
                fiecare adolescent merită pe cineva care să spună:
                <br />
                <span className="text-primary">"eu cred în tine"</span>
              </p>
              <span className="absolute -bottom-4 right-4 font-handwritten text-6xl text-primary/30">"</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;

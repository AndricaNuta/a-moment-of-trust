const StorySection = () => {
  return (
    <section id="story" className="py-24 bg-card">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Story */}
          <div className="space-y-8">
            {/* Accent dots */}
            <div className="flex gap-2">
              <span className="w-2 h-2 bg-primary" />
              <span className="w-2 h-2 bg-muted-foreground/30" />
            </div>

            <h2 className="text-3xl md:text-4xl font-semibold ideo-headline">
              despre această campanie
            </h2>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                la ideo ideis, credem că fiecare adolescent merită pe cineva care 
                să aibă încredere în el. un profesor, un părinte, un mentor, un 
                prieten mai mare — cineva care să spună: "eu cred în tine."
              </p>
              <p>
                această campanie este o invitație să te întorci în timp și să-ți 
                amintești de acea persoană din viața ta. și apoi să îi scrii o 
                scrisoare. o scrisoare de mulțumire, de recunoștință, de dragoste.
              </p>
              <p>
                <span className="text-foreground font-medium">
                  scrisorile tale vor fi parte dintr-un manifest colectiv
                </span>{" "}
                care demonstrează puterea încrederii în adolescenți.
              </p>
            </div>
          </div>

          {/* Right - Instructions */}
          <div className="bg-secondary/50 p-8 space-y-6">
            <h3 className="text-xl font-semibold text-foreground">
              cum poți participa
            </h3>

            <div className="space-y-4">
              {[
                "gândește-te la persoana care a crezut în tine când aveai 16 ani",
                "scrie-i o scrisoare — poate fi scurtă sau lungă, formală sau personală",
                "poți adăuga o fotografie sau chiar o înregistrare audio",
                "partajează-ți scrisoarea pentru a inspira pe alții",
              ].map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-medium text-sm">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-muted-foreground pt-1">{step}</p>
                </div>
              ))}
            </div>

            {/* Accent line */}
            <div className="pt-6">
              <div className="h-1 w-16 bg-primary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;

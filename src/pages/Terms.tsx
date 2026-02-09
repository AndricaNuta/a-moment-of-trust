import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
    setTimeout(() => {
      document.getElementById("write")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
  <main className="min-h-screen bg-background">
    <div className="container mx-auto px-6 lg:px-12 py-12 lg:py-16 max-w-3xl">
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-10"
      >
        <ArrowLeft className="w-4 h-4" />
        Înapoi la pagină
      </button>

      <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
        Termeni și confidențialitate
      </h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground text-sm leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Ce date colectăm
          </h2>
          <p>
            Când trimiți o scrisoare, colectăm conținutul pe care îl introduci: textul scrisoarei,
            numele (dacă îl completezi), pozele și înregistrarea audio atașate. Aceste date sunt
            stocate pentru a afișa scrisorile pe „peretele” proiectului și, în condițiile de mai
            jos, pentru conținut promoțional.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Utilizare în conținut promoțional
          </h2>
          <p>
            Informațiile din scrisoare (text, nume, poze, audio) pot și vor fi folosite în
            conținut promoțional pe paginile noastre: site-ul proiectului, rețele de socializare
            și alte materiale de promovare (postere, clipuri, articole). Prin bifarea consimțământului
            la trimiterea scrisorii, confirmi că ești de acord cu această utilizare.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Scrisori private
          </h2>
          <p>
            Poți alege să trimiți o scrisoare „privată”. Scrisorile private nu sunt afișate pe
            peretele public al proiectului; sunt stocate doar pentru arhivă / scopuri interne.
            În continuare, te rugăm să accepți că informațiile pot fi folosite în conținut
            promoțional, conform secțiunii de mai sus, dacă bifezi consimțământul la trimitere.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Contact
          </h2>
          <p>
            Pentru întrebări despre datele tale sau despre acești termeni, poți ne contacta prin
            canalele oficiale ale proiectului ideo ideis.
          </p>
        </section>
      </div>
    </div>
  </main>
  );
};

export default Terms;

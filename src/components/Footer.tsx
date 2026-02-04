import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 bg-card border-t border-border mb-20 md:mb-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary fill-primary/30" />
            <span className="font-handwritten text-2xl text-foreground">
              ideo ideis
            </span>
          </div>

          {/* Tagline */}
          <p className="font-handwritten text-lg text-muted-foreground max-w-md">
            un manifest artistic și social care susține adolescenții 
            din România în a se exprima așa cum sunt
          </p>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a
              href="https://ideoideis.ro"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              website
            </a>
            <a
              href="https://ideoideis.ro/implica-te/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              implică-te
            </a>
            <a
              href="https://www.facebook.com/ideoideis"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              facebook
            </a>
            <a
              href="https://www.instagram.com/ideoideis"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              instagram
            </a>
          </div>

          {/* Copyright with heart */}
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ideo ideis · făcut cu{" "}
            <span className="text-primary">♡</span> pentru adolescenții din România
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

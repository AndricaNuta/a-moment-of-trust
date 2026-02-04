const Footer = () => {
  return (
    <footer className="py-12 bg-card border-t border-border mb-20 md:mb-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo/Brand */}
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">ii</span>
            </div>
            <div>
              <span className="text-foreground font-semibold lowercase">
                ideo ideis
              </span>
              <p className="text-xs text-muted-foreground">
                manifest artistic și social
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-6 text-sm text-muted-foreground">
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

          {/* Copyright */}
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ideo ideis
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

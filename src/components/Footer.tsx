import { Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full px-6 py-4 border-t border-border">
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        {/* Logo (all'estremo sinistro) */}
        <div className="flex-none">
          <div className="text-4xl font-bold text-foreground tracking-tight">
            AGROPINO
          </div>
        </div>

        {/* Email (al centro) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
          <a
            href="mailto:support@agropino.it"
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <Mail className="h-4 w-4" />
            <span>support@agropino.it</span>
          </a>
        </div>

        {/* Spazio vuoto (all'estremo destro per bilanciamento) */}
        <div className="flex-none w-10"></div>
      </div>
    </footer>
  );
};

export default Footer;

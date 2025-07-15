import { Mail } from "lucide-react";
import {Link} from "react-router-dom";
import {useIsMobile} from "@/hooks/use-mobile.tsx";

const Footer = () => {
  const isMobile = useIsMobile();
  return (
    <footer className="w-full px-6 py-4 border-t border-border">
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        {/* Logo (all'estremo sinistro) */}

        <div className="flex-none">
          {isMobile ? <div style={{ width: "2rem" }} /> : (
            <div className="text-4xl font-bold text-foreground tracking-tight">
              AGROPINO
            </div>
          )}
        </div>

        {/* Email (al centro) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
          <a
            href="mailto:support@agropino.it"
            className="flex items-center space-x-2 text-muted-foreground hover:text-agropino-jasmine transition-colors duration-200"
          >
            <Mail className="h-4 w-4" />
            <span>support@agropino.it</span>
          </a>
        </div>

        {/* FAQ */}
        <div className="flex-none w-10">
          <Link
              to="/faq"
              className="font-bold text-black hover:text-agropino-jasmine transition-colors duration-200"
          >
            FAQ
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center">
        {/* Logo (a sinistra) */}
        <div className="flex-1">
          <Link to="/" className="text-4xl font-bold text-foreground tracking-tight hover:text-mava-yellow transition-all duration-300">
            MIELPINO
          </Link>
        </div>

        {/* Navigation (centro) */}
        <div className="flex-1 flex justify-center">
          <Button
            variant="ghost" 
            className="rounded-full px-6 py-2 text-foreground hover:bg-muted"
            asChild
          >
            <Link to="/learn">Scopri di più</Link>
          </Button>
        </div>

        {/* Spazio vuoto a destra (per mantenere il bilanciamento) */}
        <div className="flex-1"></div>

        {/* Right side icons (commentati) */}
        {/*<div className="flex items-center space-x-3">*/}
        {/*  <Button*/}
        {/*    variant="ghost"*/}
        {/*    size="icon"*/}
        {/*    className="rounded-full w-10 h-10 hover:bg-muted"*/}
        {/*  >*/}
        {/*    <User className="h-5 w-5" />*/}
        {/*  </Button>*/}
        {/*  <Button*/}
        {/*    variant="ghost"*/}
        {/*    size="icon"*/}
        {/*    className="rounded-full w-10 h-10 hover:bg-muted"*/}
        {/*  >*/}
        {/*    <ShoppingCart className="h-5 w-5" />*/}
        {/*  </Button>*/}
        {/*</div>*/}
      </div>
    </header>
  );
};

export default Header;
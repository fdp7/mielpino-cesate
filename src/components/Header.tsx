import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-4xl font-bold text-foreground tracking-tight hover:opacity-80">
          MIELPINO
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center justify-between space-x-6">
          {/*<Button */}
          {/*  variant="ghost" */}
          {/*  className="rounded-full px-6 py-2 text-foreground hover:bg-muted"*/}
          {/*>*/}
          {/*  Shop ↓*/}
          {/*</Button>*/}
          <Button 
            variant="ghost" 
            className="rounded-full px-6 py-2 text-foreground hover:bg-muted"
            asChild
          >
            <Link to="/learn">Conosci il miele?</Link>
          </Button>
          {/*<Button */}
          {/*  variant="ghost" */}
          {/*  className="rounded-full px-6 py-2 text-foreground hover:bg-muted"*/}
          {/*>*/}
          {/*  Subscription*/}
          {/*</Button>*/}
          {/*<Button */}
          {/*  variant="ghost" */}
          {/*  className="rounded-full px-6 py-2 text-foreground hover:bg-muted"*/}
          {/*>*/}
          {/*  Fr*/}
          {/*</Button>*/}
        </nav>

        {/* Right side icons */}
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
import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="w-full px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-4xl font-bold text-foreground tracking-tight">
          MAVA
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          <Button 
            variant="ghost" 
            className="rounded-full px-6 py-2 text-foreground hover:bg-muted"
          >
            Shop ↓
          </Button>
          <Button 
            variant="ghost" 
            className="rounded-full px-6 py-2 text-foreground hover:bg-muted"
          >
            Learn ↓
          </Button>
          <Button 
            variant="ghost" 
            className="rounded-full px-6 py-2 text-foreground hover:bg-muted"
          >
            Subscription
          </Button>
          <Button 
            variant="ghost" 
            className="rounded-full px-6 py-2 text-foreground hover:bg-muted"
          >
            Fr
          </Button>
        </nav>

        {/* Right side icons */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-10 h-10 hover:bg-muted"
          >
            <User className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-10 h-10 hover:bg-muted"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Cart from "./Cart";
import {useEffect, useState} from "react";
import {CartItem} from "@/api/cart.ts";
import {useIsMobile} from "@/hooks/use-mobile.tsx";

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const isMobile = useIsMobile();

  // Carica gli articoli del carrello dal localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Errore nel caricamento del carrello:", e);
      }
    }
  }, []);

  // Gestisce l'aggiornamento della quantità
  const handleUpdateCartQuantity = (id: string, newQuantity: number) => {
    const updatedItems = cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  // Gestisce la rimozione degli articoli
  const handleRemoveCartItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);

    if (updatedItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(updatedItems));
    } else {
      localStorage.removeItem('cart');
    }
  };

  return (
    <header className="w-full px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        {/* Logo (all'estremo sinistro) */}
        <div className="flex-none">
          <Link to="/" className="text-4xl font-bold text-foreground tracking-tight hover:text-mava-yellow transition-all duration-300">
            MIELPINO
          </Link>
        </div>

        {/* Navigation - nascosta su mobile */}
        {!isMobile && (
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Button
                  variant="ghost"
                  className="rounded-full px-6 py-2 text-foreground hover:bg-muted"
                  asChild
              >
                <Link to="/learn">Scopri di più</Link>
              </Button>
            </div>
        )}

        {/* Carrello (all'estremo destro) */}
        <div className="flex-none">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-10 h-10 hover:bg-muted"
            onClick= {() => setIsCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-mava-orange text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Componente del carrello */}
      <Cart
          isOpen={isCartOpen}
          onOpenChange={setIsCartOpen}
          items={cartItems}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
      />
    </header>
  );
};

export default Header;
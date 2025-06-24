import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import { getProductById } from "@/api/products.ts";
import { CartItem } from "@/api/cart.ts";

interface CartProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

const Cart = ({ isOpen, onOpenChange, items, onUpdateQuantity, onRemoveItem }: CartProps) => {
  const navigate = useNavigate();
  const [stockWarnings, setStockWarnings] = useState<{[productId: number]: number}>({});

  // Calcolo del subtotale corretto considerando la dimensione
  const subtotal = items.reduce((sum, item) => {
    const sizeValue = item.size ? parseFloat(item.size) : 1;
    const itemPrice = typeof item.price === 'number' ? item.price : 0;
    return sum + (itemPrice * item.quantity * sizeValue);
  }, 0);

  // Verifica lo stock disponibile quando il carrello si apre o cambia
  useEffect(() => {
    const checkStock = async () => {
      const warnings: {[productId: number]: number} = {};

      for (const item of items) {
        try {
          const product = await getProductById(item.productId);
          // Considera la dimensione quando verifica la disponibilità
          const sizeValue = item.size ? parseFloat(item.size) : 1;
          if (product && (item.quantity * sizeValue) > product.stock) {
            warnings[item.productId] = product.stock;
          }
        } catch (error) {
          console.error(`Errore nel recupero del prodotto ${item.productId}:`, error);
        }
      }

      setStockWarnings(warnings);
    };

    if (isOpen && items.length > 0) {
      checkStock();
    }
  }, [isOpen, items]);

  const handleQuantityChange = (id: string, delta: number) => {
    // Trova l'item nel carrello
    const item = items.find(item => item.id === id);
    if (!item) return;

    // Calcola la nuova quantità
    const newQuantity = Math.max(1, item.quantity + delta);

    // Verifica disponibilità stock
    const sizeValue = item.size ? parseFloat(item.size) : 1;
    if (delta > 0 && stockWarnings[item.productId] && (newQuantity * sizeValue) > stockWarnings[item.productId]) {
      console.warn(`Disponibili solo ${stockWarnings[item.productId]} kg`);
      return;
    }

    // Aggiorna la quantità
    onUpdateQuantity(id, newQuantity);
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;

    // Navigazione al checkout con gli articoli del carrello
    navigate("/checkout", { state: { cartItems: items } });
    onOpenChange(false);
  };

  const getSizeLabel = (size: string): string => {
    const sizeValue = parseFloat(size);
    return sizeValue === 0.5 ? "500g" : "1kg";
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold">Carrello</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100%-180px)] overflow-hidden mb-0">
          {/* Elementi del carrello */}
          <div className="flex-1 overflow-y-auto py-3">
            {items.length === 0 ? (
              <p className="text-center text-muted-foreground">Il tuo carrello è vuoto</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => {
                  const sizeValue = item.size ? parseFloat(item.size) : 1;
                  const sizeLabel = getSizeLabel(item.size || "1");
                  const stockRequired = item.quantity * sizeValue;
                  const hasWarning = stockWarnings[item.productId] !== undefined;

                  return (
                    <div key={item.id} className="flex items-center gap-4 p-4 rounded-lg border relative">
                      {hasWarning && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          Disponibili: {stockWarnings[item.productId]} kg
                        </div>
                      )}

                      {/* Immagine prodotto */}
                      {item.image_url ? (
                          <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                      ) : (
                          <div className="w-16 h-16 rounded-lg bg-mava-orange flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl font-bold text-white">{item.name.charAt(0)}</span>
                          </div>
                      )}

                      {/* Dettagli prodotto */}
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {sizeLabel} × {item.quantity} = {stockRequired} kg
                        </p>

                        {/* Controlli quantità */}
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Prezzo e rimuovi */}
                      <div className="text-right">
                        <div className="font-medium">
                          €{(typeof item.price === 'number' ? item.price * sizeValue : 0).toFixed(2)} × {item.quantity}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 mt-1"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer carrello */}
        {items.length > 0 && (
          <div className="border-t pt-2 mt-auto sticky bottom-0 bg-white">
            <div className="space-y-1 mb-2">
              <div className="flex justify-between text-lg font-semibold">
                <span>Subtotale</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Tasse e costi di spedizione calcolati al checkout
              </p>
            </div>

            <Button
              className="w-full bg-mava-orange hover:bg-mava-orange/90 text-white font-semibold py-2 rounded-full"
              onClick={handleProceedToCheckout}
              disabled={Object.keys(stockWarnings).length > 0}
            >
              Procedi al checkout
            </Button>

            {Object.keys(stockWarnings).length > 0 && (
              <p className="text-destructive text-sm mt-2 text-center">
                Alcuni prodotti non hanno stock sufficiente
              </p>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;

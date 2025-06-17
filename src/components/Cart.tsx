import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  flavor: string;
  size: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

const Cart = ({ isOpen, onOpenChange, items, onUpdateQuantity, onRemoveItem }: CartProps) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold">Cart</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-6">
            {items.length === 0 ? (
              <p className="text-center text-muted-foreground">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 rounded-lg border">
                    {/* Product Image */}
                    <div className="w-16 h-16 rounded-full bg-mava-orange flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-white">12</span>
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-medium">{item.flavor}</h3>
                      <p className="text-sm text-muted-foreground">{item.size}</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Price and Remove */}
                    <div className="text-right">
                      <div className="font-medium">
                        ${item.price.toFixed(2)} x {item.quantity}
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
                ))}
              </div>
            )}
          </div>
          
          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Taxes and shipping costs calculated at checkout
                </p>
              </div>
              
              <Button className="w-full bg-mava-orange hover:bg-mava-orange/90 text-white font-semibold py-3 rounded-full">
                Payment
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
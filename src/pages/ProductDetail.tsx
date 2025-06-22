import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import Can3D from "@/components/Can3D";
import Header from "@/components/Header";
import Cart from "@/components/Cart";

interface Product {
  id: string;
  name: string;
  flavor: string;
  bgColor: string;
  btnColor: string;
  price: string;
  subtitle: string;
  description: string;
}

interface CartItem {
  id: string;
  name: string;
  flavor: string;
  size: string;
  price: number;
  quantity: number;
}

const products: Record<string, Product> = {
  "melon-mint": {
    id: "melon-mint",
    name: "MAVA",
    flavor: "MELON & MINT",
    bgColor: "bg-mava-sage",
    btnColor: "bg-mava-green",
    price: "$36.99",
    subtitle: "Refreshing Fusion",
    description: "A perfect blend of sweet melon and refreshing mint. Light and energizing with natural botanical extracts."
  },
  "berry-blast": {
    id: "berry-blast",
    name: "MAVA",
    flavor: "BERRY BLAST",
    bgColor: "bg-mava-coral",
    btnColor: "bg-mava-pink",
    price: "$36.99",
    subtitle: "Energizing Infusion",
    description: "Tasty combination of mixed berries and natural extracts. A light residual sweetness brings a pleasant acidity."
  },
  "citrus-burst": {
    id: "citrus-burst",
    name: "MAVA",
    flavor: "CITRUS BURST",
    bgColor: "bg-mava-yellow",
    btnColor: "bg-mava-orange",
    price: "$36.99",
    subtitle: "Energizing Infusion",
    description: "Vibrant citrus blend with natural energy boosters. Refreshing taste with a burst of vitamin C."
  }
};

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("1");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const product = productId ? products[productId] : null;

  if (!product) {
    navigate("/");
    return null;
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const newItem: CartItem = {
      id: `${product.id}-${selectedSize}`,
      name: product.name,
      flavor: product.flavor,
      size: selectedSize,
      price: parseFloat(product.price.replace('$', '')),
      quantity: quantity
    };

    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === newItem.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, newItem];
    });
    
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, newQuantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className={`min-h-screen ${product.bgColor} transition-all duration-700 ease-in-out`}>
        {/* Back button */}
        <div className="absolute top-24 left-6 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="w-12 h-12 rounded-full bg-background/80 hover:bg-background transition-all duration-300"
          >
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </Button>
        </div>

        <div className="flex min-h-screen">
          {/* Left side - 3D Can */}
          <div className="flex-1 flex items-center justify-center relative">
            {/* Background decorative elements - simplified from the original */}
            <div className="absolute inset-0 overflow-hidden opacity-30">
              <div className="absolute top-20 left-10 w-32 h-32 bg-mava-coral rounded-full animate-bounce-gentle"></div>
              <div className="absolute bottom-32 right-20 w-24 h-24 bg-mava-orange rounded-full"></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-mava-yellow rounded-full"></div>
            </div>
            
            <div className="relative z-10 animate-fade-slide-in">
              <Can3D 
                color={product.bgColor}
                flavor={product.flavor}
                isAnimating={false}
              />
            </div>
          </div>

          {/* Right side - Product details */}
          <div className="flex-1 bg-background flex items-center justify-center">
            <div className="max-w-md w-full px-8 animate-fade-slide-in" style={{ animationDelay: '0.2s' }}>
              {/* Product name */}
              <h1 className="text-4xl font-bold text-foreground mb-2">
                {product.flavor}
              </h1>

              {/* Price and subtitle */}
              <div className="flex items-center gap-6 mb-4">
                <span className="text-3xl font-semibold text-foreground">
                  {product.price}
                </span>
                <span className="text-lg text-muted-foreground">
                  {product.subtitle}
                </span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Size selector */}
              <div className="mb-6">
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">500 gr</SelectItem>
                    <SelectItem value="1">1 kg</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity selector */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    className="h-12 w-12"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-6 py-3 text-lg font-medium min-w-16 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    className="h-12 w-12"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Add to cart button */}
              <Button 
                className={`w-full ${product.btnColor} hover:opacity-90 text-white font-semibold py-4 text-lg rounded-xl transition-all duration-300`}
                onClick={handleAddToCart}
              >
                Add to cart
              </Button>

              {/* Product features */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-xl">⚡</span>
                  </div>
                  <span className="text-sm text-muted-foreground">WITHOUT THE CRASH</span>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-xl">🌿</span>
                  </div>
                  <span className="text-sm text-muted-foreground">NATURAL CAFFEINE</span>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-xl">🛡️</span>
                  </div>
                  <span className="text-sm text-muted-foreground">ANTIOXIDANT</span>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-xl">🌱</span>
                  </div>
                  <span className="text-sm text-muted-foreground">VEGAN</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Cart
        isOpen={isCartOpen}
        onOpenChange={setIsCartOpen}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
      />
    </div>
  );
};

export default ProductDetail;
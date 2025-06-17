import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Can3D from "./Can3D";

interface Product {
  id: string;
  name: string;
  flavor: string;
  canImage: string;
  bgColor: string;
  btnColor: string;
}

const products: Product[] = [
  {
    id: "melon-mint",
    name: "MAVA",
    flavor: "Melon & Mint",
    canImage: "/lovable-uploads/a1e4091c-22b1-4ea4-aee2-4559fec15b82.png",
    bgColor: "bg-mava-sage",
    btnColor: "bg-mava-green"
  },
  {
    id: "berry-blast",
    name: "MAVA",
    flavor: "Berry Blast",
    canImage: "/lovable-uploads/a1e4091c-22b1-4ea4-aee2-4559fec15b82.png",
    bgColor: "bg-mava-coral",
    btnColor: "bg-mava-pink"
  },
  {
    id: "citrus-burst",
    name: "MAVA",
    flavor: "Citrus Burst",
    canImage: "/lovable-uploads/a1e4091c-22b1-4ea4-aee2-4559fec15b82.png",
    bgColor: "bg-mava-yellow",
    btnColor: "bg-mava-orange"
  }
];

const ProductShowcase = () => {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentProduct = products[currentProductIndex];

  const handlePrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentProductIndex((prev) => 
        prev === 0 ? products.length - 1 : prev - 1
      );
      setIsAnimating(false);
    }, 300);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentProductIndex((prev) => 
        (prev + 1) % products.length
      );
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-700 ease-in-out ${currentProduct.bgColor}`}>
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Strawberry-like shape with patterns */}
        <div className="absolute top-20 left-10 w-56 h-56 transform rotate-12 animate-bounce-gentle">
          <div className="w-full h-full bg-mava-coral rounded-full relative overflow-hidden">
            {/* Pattern elements inside strawberry */}
            <div className="absolute top-8 left-8 text-mava-yellow text-2xl">✦</div>
            <div className="absolute top-16 right-12 text-background text-xl">❋</div>
            <div className="absolute bottom-12 left-12 text-mava-pink text-lg">♡</div>
            <div className="absolute bottom-20 right-8 text-mava-orange text-sm">✿</div>
            <div className="absolute top-20 left-20 text-background text-base">⟡</div>
            {/* Hand/glove shape on top */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-20 h-12 bg-mava-green rounded-t-full"></div>
          </div>
        </div>

        {/* Basketball */}
        <div className="absolute top-16 right-1/4 w-24 h-24 bg-mava-orange rounded-full border-4 border-background transform hover:scale-110 transition-transform duration-300">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-background"></div>
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-background"></div>
          <div className="absolute top-2 left-2 right-2 bottom-2 border-2 border-background rounded-full"></div>
        </div>

        {/* Yellow star-like shape */}
        <div className="absolute top-12 left-1/3 w-0 h-0 border-l-12 border-r-12 border-b-16 border-l-transparent border-r-transparent border-b-mava-yellow transform rotate-12"></div>
        <div className="absolute top-16 left-1/3 w-0 h-0 border-l-12 border-r-12 border-t-16 border-l-transparent border-r-transparent border-t-mava-yellow transform rotate-12"></div>

        {/* Flowers */}
        <div className="absolute top-1/3 right-20 w-28 h-28 animate-bounce-gentle" style={{ animationDelay: '0.5s' }}>
          <div className="w-full h-full bg-mava-orange rounded-full relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-background rounded-full"></div>
            {/* Flower petals */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-mava-yellow rounded-full"></div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-mava-yellow rounded-full"></div>
            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-mava-yellow rounded-full"></div>
            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-mava-yellow rounded-full"></div>
          </div>
        </div>

        <div className="absolute bottom-1/4 right-32 w-24 h-24 animate-bounce-gentle" style={{ animationDelay: '1s' }}>
          <div className="w-full h-full bg-mava-coral rounded-full relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-background rounded-full"></div>
            {/* Flower petals */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-mava-pink rounded-full"></div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-mava-pink rounded-full"></div>
            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-mava-pink rounded-full"></div>
            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-mava-pink rounded-full"></div>
          </div>
        </div>

        {/* Cloud shapes */}
        <div className="absolute bottom-20 right-10 w-36 h-24 bg-mava-blue rounded-full relative">
          <div className="absolute top-6 left-6 w-20 h-10 bg-background rounded-full"></div>
          <div className="absolute bottom-3 right-8 w-16 h-8 bg-background rounded-full"></div>
          <div className="absolute top-2 right-4 w-12 h-6 bg-background rounded-full"></div>
        </div>

        {/* Leaves and natural elements */}
        <div className="absolute bottom-32 left-20 w-20 h-32 bg-mava-green transform rotate-45 rounded-full opacity-90"></div>
        <div className="absolute top-1/2 left-32 w-16 h-28 bg-mava-mint transform -rotate-12 rounded-full opacity-80"></div>
        <div className="absolute bottom-40 right-1/4 w-12 h-20 bg-mava-green transform rotate-25 rounded-full opacity-85"></div>

        {/* Watermelon slice */}
        <div className="absolute bottom-16 left-1/3 w-24 h-12 bg-mava-mint rounded-t-full relative">
          <div className="absolute bottom-0 left-2 right-2 h-8 bg-mava-pink rounded-t-full"></div>
          <div className="absolute bottom-2 left-4 w-2 h-2 bg-background rounded-full"></div>
          <div className="absolute bottom-2 right-4 w-2 h-2 bg-background rounded-full"></div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-background rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-20 pb-32">
        {/* Navigation Arrows */}
        <div className="flex items-center justify-center space-x-8 md:space-x-32">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            className={`w-12 h-12 rounded-full bg-background/80 hover:bg-background transition-all duration-300 ${
              isAnimating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isAnimating}
          >
            <ChevronLeft className="h-6 w-6 text-foreground" />
          </Button>

          {/* Product Can - 3D */}
          <div className={`transition-all duration-500 ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
            <Can3D 
              color={currentProduct.bgColor}
              flavor={currentProduct.flavor}
              isAnimating={isAnimating}
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className={`w-12 h-12 rounded-full bg-background/80 hover:bg-background transition-all duration-300 ${
              isAnimating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isAnimating}
          >
            <ChevronRight className="h-6 w-6 text-foreground" />
          </Button>
        </div>

        {/* Product Button */}
        <div className="mt-12">
          <Button 
            className={`${currentProduct.btnColor} hover:opacity-90 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-500 ${
              isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
            }`}
          >
            {currentProduct.flavor}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductShowcase;
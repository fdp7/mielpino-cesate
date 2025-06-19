import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Can3D from "./Can3D";

const ScrollSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showFirstCard, setShowFirstCard] = useState(false);
  const [showSecondCard, setShowSecondCard] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Show first card when user scrolls to this section
      if (currentScrollY > window.innerHeight * 1.2) {
        setShowFirstCard(true);
      }
      
      // Show second card when user scrolls further
      if (currentScrollY > window.innerHeight * 1.6) {
        setShowSecondCard(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-mava-green relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Decorative wave */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-96 h-24">
          <svg viewBox="0 0 400 100" className="w-full h-full">
            <path
              d="M0 50 Q100 20 200 50 T400 50"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="3"
              fill="none"
            />
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-20">
        {/* Header section */}
        <div className="text-center mb-12">
          <div className="inline-block bg-background text-mava-green px-8 py-3 rounded-full font-semibold text-lg mb-6">
            SANS CRASH
          </div>
          <div className="text-background text-center max-w-md mx-auto">
            <p className="text-xl font-medium mb-2">Une vague d'énergie tout en douceur.</p>
            <p className="text-lg opacity-90">Pour t'activer sans contrecoup.</p>
          </div>
        </div>

        {/* 3D Can with scroll animation */}
        <div 
          className="transition-transform duration-500 ease-out"
          style={{
            transform: `translateY(${Math.min(scrollY * 0.1, 100)}px)`
          }}
        >
          <Can3D 
            color="bg-mava-green"
            flavor="Energy Infusion"
            isAnimating={false}
          />
        </div>
      </div>

      {/* Sliding cards */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 space-y-8">
        {/* First card */}
        <Card 
          className={`w-80 bg-background/95 backdrop-blur-sm shadow-lg transition-all duration-700 ease-out ${
            showFirstCard ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
        >
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-mava-green mb-3">Énergie Naturelle</h3>
            <p className="text-muted-foreground mb-4">
              Une formule unique qui te donne de l'énergie progressive et durable, 
              sans les effets secondaires des boissons énergisantes traditionnelles.
            </p>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-mava-green rounded-full"></div>
              <span className="text-sm font-medium">100% Naturel</span>
            </div>
          </CardContent>
        </Card>

        {/* Second card */}
        <Card 
          className={`w-80 bg-background/95 backdrop-blur-sm shadow-lg transition-all duration-700 ease-out ${
            showSecondCard ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-mava-green mb-3">Performance Optimale</h3>
            <p className="text-muted-foreground mb-4">
              Améliore ta concentration et tes performances sans stress ni nervosité. 
              L'énergie parfaite pour tes journées les plus intenses.
            </p>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-mava-orange rounded-full"></div>
              <span className="text-sm font-medium">Longue Durée</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScrollSection;
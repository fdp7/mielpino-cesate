import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Link } from "react-router-dom";
import { Product } from "@/api/products";
import {useIsMobile} from "@/hooks/use-mobile.tsx";
import HoneyJarGLB from "@/components/HoneyJarGLB.tsx";

const ProductShowcase = ({products}: {products: Product[]}) => {
  const navigate = useNavigate();
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showCards, setShowCards] = useState(false);
  const [showBigText, setShowBigText] = useState(false);
  const isMobile = useIsMobile();

  const currentProduct = products && products.length > 0 ? products[currentProductIndex] : null

  // Usa direttamente lo stock dal database
  const getStockLevel = () => {
    if (!currentProduct) return 0;
    return currentProduct.stock;
  };

  const getHoneyColor = () => {
    if (!currentProduct || !currentProduct.honey_color) return "#ffb000"; // Colore predefinito
    return currentProduct.honey_color;
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Calcola le altezze di soglia in base all'altezza della finestra
      const cardAppearThreshold = window.innerHeight * 0.7;
      const cardDisappearThreshold = window.innerHeight * 1.2;
      const bigTextAppearThreshold = window.innerHeight * 1.1;

      // Prima fase: le card appaiono quando si inizia a scorrere
      if (currentScrollY > cardAppearThreshold && currentScrollY < cardDisappearThreshold) {
        setShowCards(true);
        setShowBigText(false);
      }
      // Seconda fase: le card scompaiono verso sinistra quando si continua a scorrere
      else if (currentScrollY > cardDisappearThreshold) {
        setShowCards(false);
        // Mostra i testi grandi dopo che le card sono scomparse
        setTimeout(() => setShowBigText(true), 500);
      }
      // Quando si torna su, ripristina lo stato
      else if (currentScrollY < cardAppearThreshold) {
        setShowCards(false);
        setShowBigText(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  if (!currentProduct) {
    return <div className="flex items-center justify-center h-screen">Nessun prodotto disponibile</div>;
  }

  return (
    <>
    <div className={`min-h-[150vh] relative overflow-hidden ${currentProduct.bg_color}`}>
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
      <div className="relative z-30 flex flex-col items-center justify-center min-h-screen pt-20 pb-32 sticky top-0">
        {/* Layout Desktop: frecce ai lati */}
        {!isMobile && (
          <div className="flex items-center justify-center space-x-12 md:space-x-48 relative z-50">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className={`w-12 h-12 rounded-full bg-background/80 hover:bg-background transition-all duration-300 ${
                isAnimating ? 'opacity-50 cursor-not-allowed' : ''
              } relative z-50`}
              disabled={isAnimating}
            >
              <ChevronLeft className="h-6 w-6 text-foreground" />
            </Button>

            {/* Modello GLB - dimensioni complete */}
            <div
                className={`transition-all duration-500 h-[500px] w-96 ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}
            >
              <Canvas camera={{ position: [3, 2, 5], fov: 50 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[20, 90, 20]} intensity={1} />

                <HoneyJarGLB
                    modelPath="/assets/miele_dippi_2.glb"
                    scale={40}
                    honeyColor={getHoneyColor()}
                    stockLevel={getStockLevel()}
                />

                <OrbitControls
                  enablePan={false}
                  enableZoom={true}
                  minDistance={3}
                  maxDistance={8}
                  minPolarAngle={Math.PI / 6}
                  maxPolarAngle={Math.PI / 2.1}
                />
              </Canvas>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className={`w-12 h-12 rounded-full bg-background/80 hover:bg-background transition-all duration-300 ${
                isAnimating ? 'opacity-50 cursor-not-allowed' : ''
              } relative z-50`}
              disabled={isAnimating}
            >
              <ChevronRight className="h-6 w-6 text-foreground" />
            </Button>
          </div>
        )}

        {/* Layout Mobile: barattolo centrato */}
        {isMobile && (
          <div className="flex flex-col items-center justify-center relative z-50">
            {/* Modello GLB - dimensioni complete anche su mobile */}
            <div
                className={`transition-all duration-500 h-[400px] w-80 ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}
            >
              <Canvas camera={{ position: [3, 2, 5], fov: 50 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[20, 90, 20]} intensity={1} />

                <HoneyJarGLB
                    modelPath="/assets/miele_dippi_2.glb"
                    scale={40}
                    honeyColor={getHoneyColor()}
                    stockLevel={getStockLevel()}
                />

                <OrbitControls
                  enablePan={false}
                  enableZoom={true}
                  minDistance={3}
                  maxDistance={8}
                  minPolarAngle={Math.PI / 6}
                  maxPolarAngle={Math.PI / 2.1}
                />
              </Canvas>
            </div>
          </div>
        )}

        {/* Product Button */}
        <div className="mt-12 px-4">
          <Button
            onClick={() => navigate(`/product/${currentProduct.id}`)}
            className={`${currentProduct.btn_color} hover:opacity-90 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-500 ${
              isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
            } relative z-40`}
          >
            {currentProduct.name}
          </Button>
        </div>

        {/* Frecce sotto il pulsante solo su mobile */}
        {isMobile && (
          <div className="flex items-center justify-center space-x-8 mt-6 relative z-50">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className={`w-12 h-12 rounded-full bg-background/80 hover:bg-background transition-all duration-300 ${
                isAnimating ? 'opacity-50 cursor-not-allowed' : ''
              } relative z-50`}
              disabled={isAnimating}
            >
              <ChevronLeft className="h-6 w-6 text-foreground" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className={`w-12 h-12 rounded-full bg-background/80 hover:bg-background transition-all duration-300 ${
                isAnimating ? 'opacity-50 cursor-not-allowed' : ''
              } relative z-50`}
              disabled={isAnimating}
            >
              <ChevronRight className="h-6 w-6 text-foreground" />
            </Button>
          </div>
        )}
      </div>

      {/* Spazio vuoto per consentire lo scorrimento - ridotto a metà */}
      <div className="h-[50vh]"></div>

      {/* Horizontal cards layout - ora usa un posizionamento che evita di interferire con i pulsanti di navigazione */}
      <div className={`fixed ${
        isMobile ? 'top-1/2' : 'top-1/2'
      } left-0 right-0 transform -translate-y-1/2 z-50 transition-all duration-500 ${
        showBigText ? 'opacity-0 pointer-events-none' : showCards ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div className={`max-w-7xl mx-auto px-4 ${
          isMobile 
            ? 'flex flex-col space-y-4' 
            : 'flex justify-between'
        }`}>
          {/* Left Card */}
          <Card
            className={`${
              isMobile ? 'w-full' : 'w-72'
            } bg-background/95 backdrop-blur-sm shadow-lg transition-all duration-700 ease-out ${
              showCards 
                ? 'translate-x-0 opacity-100' 
                : scrollY > window.innerHeight * 0.8
                  ? '-translate-x-full opacity-0' 
                  : '-translate-x-full opacity-0'
            }`}
            style={{ transitionDelay: '0ms' }}
          >
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-mava-green mb-3">Naturale</h3>
              <p className="text-muted-foreground mb-4">
                Il nostro miele non contiene conservanti e non subisce trattamenti termici, così mantiene intatti enzimi, vitamine e tutte le sue preziose proprietà naturali.
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-mava-green rounded-full"></div>
                <span className="text-sm font-medium">100% Naturale</span>
              </div>
            </CardContent>
          </Card>

          {/* Center Card */}
          <Card
            className={`${
              isMobile ? 'w-full' : 'w-72'
            } bg-background/95 backdrop-blur-sm shadow-lg transition-all duration-700 ease-out ${
              showCards
                ? 'translate-x-0 opacity-100'
                : scrollY > window.innerHeight * 0.8
                  ? '-translate-x-full opacity-0'
                  : 'translate-x-full opacity-0'
            }`}
            style={{ transitionDelay: '150ms' }}
          >
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-mava-orange mb-3">Ricco di benefici</h3>
              <p className="text-muted-foreground mb-4">
                Fonte naturale di energia e benessere, il nostro miele contiene zuccheri semplici, vitamine e minerali, con proprietà antibatteriche e lenitive per la tua salute quotidiana.
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-mava-orange rounded-full"></div>
                <span className="text-sm font-medium">Salutare</span>
              </div>
            </CardContent>
          </Card>

          {/* Right Card */}
          <Card
            className={`${
              isMobile ? 'w-full' : 'w-72'
            } bg-background/95 backdrop-blur-sm shadow-lg transition-all duration-700 ease-out ${
              showCards
                ? 'translate-x-0 opacity-100'
                : scrollY > window.innerHeight * 0.8
                  ? '-translate-x-full opacity-0'
                  : 'translate-x-full opacity-0'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-mava-blue mb-3">Origine Garantita</h3>
              <p className="text-muted-foreground mb-4">
                Il nostro miele è genuino ed unico, proveniente da un'apicoltura sostenibile, rispettando le api e il variegato ambiente circostante.
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-mava-blue rounded-full"></div>
                <span className="text-sm font-medium">Unico</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    {/* Sezione con testo grande */}
    <div className={`h-screen ${currentProduct.bg_color} relative flex flex-col items-center justify-center`}>
      {/* Elementi decorativi ripetuti dalla prima sezione per creare continuità */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-20 right-1/4 w-24 h-24 bg-mava-orange rounded-full border-4 border-background/30"></div>
        <div className="absolute top-1/3 left-20 w-28 h-28">
          <div className="w-full h-full bg-mava-coral rounded-full relative"></div>
        </div>
        <div className="absolute bottom-1/4 right-32 w-20 h-32 bg-mava-green transform rotate-12 rounded-full opacity-70"></div>
      </div>

      {/* Testi grandi che appaiono quando si scorre verso il basso */}
      <div className={`w-full transition-all duration-1000 ease-in-out z-20 ${
        showBigText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-32'
      }`}>
        {/* SCOPRI MIELPINO - testo grande con link a /learn */}
        {isMobile ? (
            <Link
                to="/learn"
                className="relative z-30 w-full text-center transition-all duration-300 block px-4"
                onClick={() => {
                  setTimeout(() => window.scrollTo(0, 0), 0);
                }}
            >
              <h2 className="text-4xl sm:text-6xl md:text-8xl font-extrabold text-foreground hover:text-mava-yellow leading-none tracking-tight">
                SCOPRI MIELPINO
              </h2>
            </Link>
        ) : (
            <Link
                to="/learn"
                className="relative z-30 w-full text-center transition-all duration-300 block"
                onClick={() => {
                  setTimeout(() => window.scrollTo(0, 0), 0);
                }}
            >
              <h2 className="text-8xl md:text-[12vw] lg:text-[15vw] font-extrabold text-foreground hover:text-mava-yellow leading-none tracking-tight">
                SCOPRI MIELPINO
              </h2>
            </Link>
        )}

        {/* ACQUISTA - testo grande con scroll to top */}
        {isMobile ? (
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="relative z-30 w-full text-center transition-all duration-300 block mt-8 px-4"
            >
              <h2 className="text-4xl sm:text-6xl md:text-8xl font-extrabold text-foreground hover:text-mava-yellow leading-none tracking-tight">
                ACQUISTA
              </h2>
            </button>
        ) : (
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="relative z-30 w-full text-center transition-all duration-300 block mt-8"
            >
              <h2 className="text-8xl md:text-[12vw] lg:text-[15vw] font-extrabold text-foreground hover:text-mava-yellow leading-none tracking-tight">
                ACQUISTA
              </h2>
            </button>
        )}
      </div>
    </div>
    </>
  );
};

export default ProductShowcase;

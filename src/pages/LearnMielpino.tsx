import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Header from "@/components/Header";
import { getRecipesByType, Recipe } from "@/api/recipes.ts";
import { useIsMobile } from "@/hooks/use-mobile.tsx";

const LearnMielpino = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const isMobile = useIsMobile();

  // Ref per gestire il touch/swipe
  const carouselRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const recipesData = await getRecipesByType('miele');
        setRecipes(recipesData);
      } catch (error) {
        console.error("Errore nel caricamento delle ricette:", error);
      }
    };

    loadRecipes();
  }, []);

  const handlePrevious = () => {
    if (isAnimating || recipes.length === 0) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentRecipeIndex((prev) => {
        const step = isMobile ? 1 : 2;
        const maxIndex = Math.max(0, recipes.length - step);
        return prev === 0 ? maxIndex : Math.max(0, prev - step);
      });
      setIsAnimating(false);
    }, 300);
  };

  const handleNext = () => {
    if (isAnimating || recipes.length === 0) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentRecipeIndex((prev) => {
        const step = isMobile ? 1 : 2;
        const maxIndex = Math.max(0, recipes.length - step);
        return prev >= maxIndex ? 0 : Math.min(maxIndex, prev + step);
      });
      setIsAnimating(false);
    }, 300);
  };

  // Gestione touch events per mobile
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && !isAnimating) {
      handleNext();
    }
    if (isRightSwipe && !isAnimating) {
      handlePrevious();
    }
  };

  return (
      <div className="min-h-screen bg-background">
        <Header />

        <div className="container mx-auto px-4 py-8 pt-24">
          <h1 className="text-4xl font-bold mb-12 text-center">Scopri il nostro miele</h1>

          {/* Sezione "Com'è fatto" */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 text-center">Com'è fatto il nostro miele</h2>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="rounded-lg overflow-hidden">
                <img
                    src="https://nbvhtdzjethfxhkwswpz.supabase.co/storage/v1/object/sign/assets/apicoltura-01.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kZGRhZmQyNi0xOGMxLTQxYTQtODA0Ny05ZjE5Nzg0OTUwODUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldHMvYXBpY29sdHVyYS0wMS53ZWJwIiwiaWF0IjoxNzUxNjM3MjY4LCJleHAiOjIwNjY5OTcyNjh9.QUpWgWSQL0x2aA3Yh6UqJHzuw7k7r8wsK_zYAH9k3Xs"
                    alt="Produzione del miele"
                    className="w-full h-auto object-cover"
                />
              </div>

              <div className="space-y-4">
                <p className="text-lg">
                  Il nostro miele viene prodotto secondo metodi tradizionali, rispettando le api e la natura.
                  Raccogliamo solo il miele in eccesso rispetto alle necessità dell'alveare, e solo quando è maturo, rispettando le api e garantendo un prodotto di alta qualità.
                </p>

                <p>
                  Le nostre api bottinano liberamente in zone incontaminate, lontane da inquinamento e pesticidi,
                  permettendoci di offrire un miele puro e ricco di proprietà benefiche.
                </p>

                <p>
                  Ogni barattolo di miele viene controllato attentamente per garantire l'eccellenza del
                  prodotto che arriva sulla tua tavola, conservando intatti tutti i nutrienti e il sapore naturale.
                </p>
              </div>
            </div>
          </section>

          {/* Sezione "Valori giornalieri" */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 text-center">Valori nutrizionali</h2>

            <div className="max-w-2xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nutriente</TableHead>
                        <TableHead>Quantità per 100g</TableHead>
                        <TableHead>% Valori giornalieri</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Calorie</TableCell>
                        <TableCell>304 kcal</TableCell>
                        <TableCell>15%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Zuccheri</TableCell>
                        <TableCell>82 g</TableCell>
                        <TableCell>15%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Grassi</TableCell>
                        <TableCell>0 g</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Proteine</TableCell>
                        <TableCell>0.3 g</TableCell>
                        <TableCell>1%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Potassio</TableCell>
                        <TableCell>52 mg</TableCell>
                        <TableCell>1%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <p className="text-sm text-muted-foreground mt-4">* Valori basati su una dieta di 2000 kcal</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Sezione "Ricette" con carosello */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 text-center">Ricette con il nostro miele</h2>

            {recipes.length > 0 ? (
                <div className="relative">
                  {/* Controlli del carosello */}
                  <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePrevious}
                        className="rounded-full bg-background/80 hover:bg-background shadow-lg"
                        disabled={isAnimating || recipes.length <= (isMobile ? 1 : 2)}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                  </div>

                  <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNext}
                        className="rounded-full bg-background/80 hover:bg-background shadow-lg"
                        disabled={isAnimating || recipes.length <= (isMobile ? 1 : 2)}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </div>

                  {/* Container del carosello con supporto touch */}
                  <div
                    className="overflow-hidden rounded-xl mx-12"
                    ref={carouselRef}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                  >
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{
                          transform: isMobile
                            ? `translateX(-${currentRecipeIndex * 100}%)`
                            : `translateX(-${(currentRecipeIndex / 2) * 100}%)`
                        }}
                    >
                      {isMobile ? (
                        // Mobile: una ricetta per volta
                        recipes.map((recipe) => (
                          <div key={recipe.id} className="min-w-full px-2">
                            <div className="bg-background rounded-xl shadow-lg overflow-hidden group cursor-pointer">
                              <div className="relative aspect-square w-full">
                                <img
                                    src={recipe.image_url}
                                    alt={recipe.name}
                                    className="w-full h-full object-cover transition-all duration-700 grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105"
                                />
                                {/* Overlay con gradiente */}
                                <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/30 opacity-95 group-hover:opacity-60 transition-opacity duration-700"></div>

                                {/* Container del testo con animazione */}
                                <div className="absolute inset-0 flex flex-col justify-start p-4 transition-all duration-700">
                                  {/* Titolo sempre visibile */}
                                  <h3 className="text-xl font-bold text-white mb-1 transition-all duration-700">
                                    {recipe.name}
                                  </h3>

                                  {/* Descrizione visibile normalmente, sparisce al hover */}
                                  <p className="text-white/90 text-base line-clamp-3 opacity-100 mt-2 transition-all duration-700 group-hover:opacity-0 flex-1">
                                    {recipe.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        // Desktop: due ricette per volta
                        Array.from({ length: Math.ceil(recipes.length / 2) }).map((_, groupIndex) => (
                          <div key={groupIndex} className="min-w-full flex gap-4 px-2">
                            {recipes.slice(groupIndex * 2, groupIndex * 2 + 2).map((recipe) => (
                              <div key={recipe.id} className="flex-1">
                                <div className="bg-background rounded-xl shadow-lg overflow-hidden group cursor-pointer">
                                  <div className="relative aspect-square w-full">
                                    <img
                                        src={recipe.image_url}
                                        alt={recipe.name}
                                        className="w-full h-full object-cover transition-all duration-700 grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105"
                                    />
                                    {/* Overlay con gradiente */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/30 opacity-95 group-hover:opacity-60 transition-opacity duration-700"></div>

                                    {/* Container del testo con animazione */}
                                    <div className="absolute inset-0 flex flex-col justify-start p-4 transition-all duration-700">
                                      {/* Titolo sempre visibile */}
                                      <h3 className="text-xl font-bold text-white mb-1 transition-all duration-700">
                                        {recipe.name}
                                      </h3>

                                      {/* Descrizione visibile normalmente, sparisce al hover */}
                                      <p className="text-white/90 text-base line-clamp-3 opacity-100 mt-2 transition-all duration-700 group-hover:opacity-0 flex-1">
                                        {recipe.description}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {/* Placeholder se il gruppo ha solo una ricetta */}
                            {recipes.slice(groupIndex * 2, groupIndex * 2 + 2).length === 1 && (
                              <div className="flex-1"></div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Indicatori del carosello */}
                  {recipes.length > (isMobile ? 1 : 2) && (
                    <div className="flex justify-center space-x-2 mt-4">
                      {Array.from({
                        length: isMobile ? recipes.length : Math.ceil(recipes.length / 2)
                      }).map((_, index) => (
                          <button
                              key={index}
                              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                                  (isMobile ? currentRecipeIndex === index : Math.floor(currentRecipeIndex / 2) === index) 
                                    ? 'bg-mava-orange' : 'bg-gray-300'
                              }`}
                              onClick={() => {
                                setCurrentRecipeIndex(isMobile ? index : index * 2);
                              }}
                          />
                      ))}
                    </div>
                  )}
                </div>
            ) : (
                <div className="text-center text-muted-foreground">
                  Nessuna ricetta disponibile al momento.
                </div>
            )}
          </section>

          {/* Sezione "Impegno ambientale" */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-center">Il nostro impegno ambientale</h2>

            <div className="bg-mava-green/10 rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-medium mb-4">Proteggiamo le api</h3>

                  <p className="mb-4">
                    Le api sono fondamentali per l'ecosistema: impollinano circa l'80% delle piante da fiore nel mondo,
                    contribuendo alla produzione di gran parte del cibo che mangiamo.
                  </p>

                  <p>
                    Il nostro impegno va oltre la produzione di miele. Collaboriamo con associazioni locali per la
                    conservazione delle api e la creazione di habitat favorevoli agli impollinatori.
                  </p>
                </div>

                <div className="rounded-lg overflow-hidden">
                  <img
                      src="https://nbvhtdzjethfxhkwswpz.supabase.co/storage/v1/object/sign/assets/apicoluta-02.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kZGRhZmQyNi0xOGMxLTQxYTQtODA0Ny05ZjE5Nzg0OTUwODUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldHMvYXBpY29sdXRhLTAyLmpwZyIsImlhdCI6MTc1MTYzNzMxOSwiZXhwIjoyMDY2OTk3MzE5fQ.GebX6CsJKy6wKpOyZaBBI0OjdwzFMS2INz2D3dYqde4"
                      alt="Apicoltura sostenibile"
                      className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
  );
};

export default LearnMielpino;

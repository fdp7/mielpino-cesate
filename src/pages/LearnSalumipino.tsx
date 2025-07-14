import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getRecipesByType, Recipe } from "@/api/recipes.ts";
import { useIsMobile } from "@/hooks/use-mobile.tsx";

const LearnSalumipino = () => {
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
        const recipesData = await getRecipesByType('salume');
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
          <h1 className="text-4xl font-bold mb-12 text-center">Scopri i nostri salumi</h1>

          {/* Sezione "Com'è fatto" */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 text-center">Come produciamo i nostri salumi</h2>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="rounded-lg overflow-hidden">
                <img
                    src="https://nbvhtdzjethfxhkwswpz.supabase.co/storage/v1/object/sign/assets/salumi_1.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kZGRhZmQyNi0xOGMxLTQxYTQtODA0Ny05ZjE5Nzg0OTUwODUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldHMvc2FsdW1pXzEuanBnIiwiaWF0IjoxNzUxOTAzNzk5LCJleHAiOjIwNjcyNjM3OTl9.g5xJG4fxHgwM2oi2qOWwO81X6pjt9_FmNMn9P04angI"
                    alt="Produzione dei salumi"
                    className="w-full h-auto object-cover"
                />
              </div>

              <div className="space-y-4">
                <p className="text-lg">
                  I nostri salumi vengono prodotti secondo ricette tradizionali tramandate da generazioni,
                  utilizzando solo carni di prima qualità selezionate da allevatori locali di fiducia.
                </p>

                <p>
                  Ogni salume segue un processo di stagionatura naturale in ambienti controllati,
                  senza l'uso di conservanti artificiali, per garantire sapore autentico e qualità superiore.
                </p>

                <p>
                  La nostra produzione artigianale rispetta i tempi naturali di maturazione,
                  creando prodotti dal gusto inconfondibile che rispecchiano la tradizione italiana.
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
                        <TableCell>250-350 kcal</TableCell>
                        <TableCell>12-18%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Proteine</TableCell>
                        <TableCell>25-35 g</TableCell>
                        <TableCell>50-70%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Grassi</TableCell>
                        <TableCell>15-25 g</TableCell>
                        <TableCell>23-38%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Sodio</TableCell>
                        <TableCell>1000-1500 mg</TableCell>
                        <TableCell>43-65%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Ferro</TableCell>
                        <TableCell>2-4 mg</TableCell>
                        <TableCell>11-22%</TableCell>
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
            <h2 className="text-2xl font-semibold mb-6 text-center">Ricette con i nostri salumi</h2>

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
            <h2 className="text-2xl font-semibold mb-6 text-center">Il nostro impegno per la qualità</h2>

            <div className="bg-red-50 rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-medium mb-4">Tradizione e sostenibilità</h3>

                  <p className="mb-4">
                    Collaboriamo esclusivamente con allevatori locali che rispettano il benessere animale
                    e pratiche sostenibili, garantendo filiera corta e tracciabilità completa.
                  </p>

                  <p>
                    Il nostro impegno è preservare le tecniche tradizionali di produzione,
                    valorizzando le materie prime del territorio e supportando l'economia locale.
                  </p>
                </div>

                <div className="rounded-lg overflow-hidden">
                  <img
                      src="https://nbvhtdzjethfxhkwswpz.supabase.co/storage/v1/object/sign/assets/mucche.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kZGRhZmQyNi0xOGMxLTQxYTQtODA0Ny05ZjE5Nzg0OTUwODUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldHMvbXVjY2hlLndlYnAiLCJpYXQiOjE3NTE5MDQxNjIsImV4cCI6MjA2NzI2NDE2Mn0.Ippx9s2IUDCD_XWeNJ8lJ0VXQibzYOWuKVFUOTBFOlA"
                      alt="Produzione sostenibile"
                      className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </div>
  );
};

export default LearnSalumipino;


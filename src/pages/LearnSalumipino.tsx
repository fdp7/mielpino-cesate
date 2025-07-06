import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Header from "@/components/Header";
import { getRecipes, Recipe } from "@/api/recipes.ts";
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
        const recipesData = await getRecipes();
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
      setCurrentRecipeIndex((prev) =>
          prev === 0 ? recipes.length - 1 : prev - 1
      );
      setIsAnimating(false);
    }, 300);
  };

  const handleNext = () => {
    if (isAnimating || recipes.length === 0) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentRecipeIndex((prev) =>
          (prev + 1) % recipes.length
      );
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
                    src="https://nbvhtdzjethfxhkwswpz.supabase.co/storage/v1/object/sign/assets/apicoltura-01.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kZGRhZmQyNi0xOGMxLTQxYTQtODA0Ny05ZjE5Nzg0OTUwODUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldHMvYXBpY29sdHVyYS0wMS53ZWJwIiwiaWF0IjoxNzUxNjM3MjY4LCJleHAiOjIwNjY5OTcyNjh9.QUpWgWSQL0x2aA3Yh6UqJHzuw7k7r8wsK_zYAH9k3Xs"
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
                  {/* Controlli del carosello - nascosti su mobile */}
                  {!isMobile && (
                    <>
                      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handlePrevious}
                            className="rounded-full bg-background/80 hover:bg-background shadow-lg"
                            disabled={isAnimating}
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
                            disabled={isAnimating}
                        >
                          <ChevronRight className="h-6 w-6" />
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Card del carosello con supporto touch */}
                  <div
                    className="overflow-hidden rounded-xl"
                    ref={carouselRef}
                    onTouchStart={isMobile ? onTouchStart : undefined}
                    onTouchMove={isMobile ? onTouchMove : undefined}
                    onTouchEnd={isMobile ? onTouchEnd : undefined}
                  >
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentRecipeIndex * 100}%)` }}
                    >
                      {recipes.map((recipe) => (
                          <div
                              key={recipe.id}
                              className={`min-w-full ${isMobile ? 'px-2' : 'px-4'}`}
                          >
                            <div className="bg-background rounded-xl shadow-lg overflow-hidden">
                              <div className="relative h-80 w-full">
                                <img
                                    src={recipe.image_url}
                                    alt={recipe.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                                  <h3 className="text-2xl font-bold text-white mb-2">{recipe.name}</h3>
                                  <p className="text-white/90">{recipe.description}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>

                  {/* Indicatori del carosello */}
                  <div className="flex justify-center space-x-2 mt-4">
                    {recipes.map((_, index) => (
                        <button
                            key={index}
                            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                                index === currentRecipeIndex ? 'bg-mava-orange' : 'bg-gray-300'
                            }`}
                            onClick={() => {
                              setCurrentRecipeIndex(index);
                            }}
                        />
                    ))}
                  </div>
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
                      src="https://nbvhtdzjethfxhkwswpz.supabase.co/storage/v1/object/sign/assets/apicoluta-02.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kZGRhZmQyNi0xOGMxLTQxYTQtODA0Ny05ZjE5Nzg0OTUwODUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldHMvYXBpY29sdXRhLTAyLmpwZyIsImlhdCI6MTc1MTYzNzMxOSwiZXhwIjoyMDY2OTk3MzE5fQ.GebX6CsJKy6wKpOyZaBBI0OjdwzFMS2INz2D3dYqde4"
                      alt="Produzione sostenibile"
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

export default LearnSalumipino;


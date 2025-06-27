import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Header from "@/components/Header";
import { getRecipes, Recipe } from "@/api/recipes.ts";

const Learn = () => {
  // Risolto il problema con ESLint sostituendo 'any' con un tipo specifico
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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
                    src="/images/honey-production.jpg"
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
                        <TableCell>Carboidrati</TableCell>
                        <TableCell>82.4 g</TableCell>
                        <TableCell>28%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Zuccheri</TableCell>
                        <TableCell>82.12 g</TableCell>
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
                  <p className="text-sm text-muted-foreground mt-4">* Valori basati su una dieta di 2000 calorie</p>
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

                  {/* Card del carosello */}
                  <div className="overflow-hidden rounded-xl">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentRecipeIndex * 100}%)` }}
                    >
                      {recipes.map((recipe) => (
                          <div
                              key={recipe.id}
                              className="min-w-full px-4"
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
                      src="/images/beekeeper.jpg"
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

export default Learn;
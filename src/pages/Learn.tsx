import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Header from "@/components/Header";

const recipes = [
  {
    id: 1,
    title: "Bread and Honey",
    image: "/lovable-uploads/a1e4091c-22b1-4ea4-aee2-4559fec15b82.png",
    description: "Classic comfort combination"
  },
  {
    id: 2,
    title: "Avocado Toast",
    image: "/lovable-uploads/a1e4091c-22b1-4ea4-aee2-4559fec15b82.png",
    description: "Healthy morning start"
  },
  {
    id: 3,
    title: "Oatmeal Bowl",
    image: "/lovable-uploads/a1e4091c-22b1-4ea4-aee2-4559fec15b82.png",
    description: "Nutritious breakfast option"
  },
  {
    id: 4,
    title: "Green Smoothie",
    image: "/lovable-uploads/a1e4091c-22b1-4ea4-aee2-4559fec15b82.png",
    description: "Vitamin-packed drink"
  },
  {
    id: 5,
    title: "Quinoa Salad",
    image: "/lovable-uploads/a1e4091c-22b1-4ea4-aee2-4559fec15b82.png",
    description: "Protein-rich meal"
  }
];

const SwipeCard = ({ recipe, onSwipe }: { recipe: any, onSwipe: (direction: 'left' | 'right') => void }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null);

  const handleSwipe = (direction: 'left' | 'right') => {
    setIsAnimating(true);
    setAnimationDirection(direction);
    setTimeout(() => {
      onSwipe(direction);
      setIsAnimating(false);
      setAnimationDirection(null);
    }, 300);
  };

  return (
    <div className="relative w-80 h-96 mx-auto">
      <Card className={`absolute inset-0 transition-all duration-300 ${
        isAnimating 
          ? animationDirection === 'left' 
            ? 'translate-x-[-100%] rotate-[-15deg] opacity-0' 
            : 'translate-x-[100%] rotate-[15deg] opacity-0'
          : 'translate-x-0 rotate-0 opacity-100'
      }`}>
        <CardContent className="p-0 h-full flex flex-col">
          <div className="flex-1 relative overflow-hidden rounded-t-lg">
            <img 
              src={recipe.image} 
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-foreground mb-2">{recipe.title}</h3>
            <p className="text-muted-foreground">{recipe.description}</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Swipe buttons */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-12 h-12 bg-background hover:bg-muted"
          onClick={() => handleSwipe('left')}
          disabled={isAnimating}
        >
          <X className="h-6 w-6 text-destructive" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-12 h-12 bg-background hover:bg-muted"
          onClick={() => handleSwipe('right')}
          disabled={isAnimating}
        >
          <Heart className="h-6 w-6 text-green-500" />
        </Button>
      </div>
    </div>
  );
};

const Learn = () => {
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [showSwipeSection, setShowSwipeSection] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 400) {
        setShowSwipeSection(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSwipe = (direction: 'left' | 'right') => {
    console.log(`Swiped ${direction} on recipe:`, recipes[currentRecipeIndex].title);
    setCurrentRecipeIndex((prev) => (prev + 1) % recipes.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      

      {/* Content Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/lovable-uploads/06780df9-6d0a-4396-bf44-f72800085845.png" 
                alt="MAVA Product" 
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6 uppercase">
                Valeur Quotidienne
              </h2>
              <div className="bg-card rounded-lg p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold text-foreground text-base">Teneur</TableHead>
                      <TableHead className="font-bold text-foreground text-base">% Valeur quotidienne</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-semibold">Calories</TableCell>
                      <TableCell className="font-bold text-lg">50</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Lipides</TableCell>
                      <TableCell>0g    0%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Glucides</TableCell>
                      <TableCell>13g</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Sucres</TableCell>
                      <TableCell>13g    13%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Protéines</TableCell>
                      <TableCell>0g</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Cholestérol</TableCell>
                      <TableCell>0mg</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Sodium</TableCell>
                      <TableCell>0mg    0%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Potassium</TableCell>
                      <TableCell>10mg    1%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Calcium</TableCell>
                      <TableCell>10mg    1%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Swipe Section */}
      {showSwipeSection && (
        <section className="py-20 px-6 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Discover Your Next Recipe
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Swipe right to save recipes you love, swipe left to skip
            </p>
            
            <div className="relative">
              <SwipeCard 
                recipe={recipes[currentRecipeIndex]} 
                onSwipe={handleSwipe}
              />
            </div>

            <div className="mt-8 flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <X className="h-4 w-4 text-destructive" />
                <span>Skip</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-green-500" />
                <span>Save</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Additional scroll space */}
      <div className="h-screen"></div>
    </div>
  );
};

export default Learn;
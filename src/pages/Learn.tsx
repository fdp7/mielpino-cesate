import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-muted to-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-6xl font-bold text-foreground mb-6">
            Learn with MAVA
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover nutritious recipes, understand ingredient benefits, and build healthy eating habits with our interactive learning platform.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 rounded-lg bg-card">
              <h3 className="text-xl font-semibold mb-3">Nutritional Values</h3>
              <p className="text-muted-foreground">Learn about calories, proteins, and essential nutrients in every ingredient.</p>
            </div>
            <div className="p-6 rounded-lg bg-card">
              <h3 className="text-xl font-semibold mb-3">Recipe Discovery</h3>
              <p className="text-muted-foreground">Explore new recipes tailored to your dietary preferences and goals.</p>
            </div>
            <div className="p-6 rounded-lg bg-card">
              <h3 className="text-xl font-semibold mb-3">Health Insights</h3>
              <p className="text-muted-foreground">Understand how different foods impact your daily wellness routine.</p>
            </div>
          </div>
        </div>
      </section>

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
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Nutritional Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-card rounded-lg">
                  <div>
                    <span className="font-semibold">Calories</span>
                    <div className="text-2xl font-bold">50</div>
                  </div>
                  <div>
                    <span className="font-semibold">% Daily Value</span>
                    <div className="text-sm text-muted-foreground">Based on 2000 calories</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 p-4 bg-card rounded-lg text-sm">
                  <div>
                    <div className="font-semibold">Lipides</div>
                    <div>0g</div>
                  </div>
                  <div>
                    <div className="font-semibold">Glucides</div>
                    <div>13g</div>
                  </div>
                  <div>
                    <div className="font-semibold">Protéines</div>
                    <div>0g</div>
                  </div>
                </div>
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
import {useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Minus, Plus, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { MieleJar3D } from "@/components/MieleJar3D.tsx";
import Header from "@/components/Header";
import Cart from "@/components/Cart";
import {getProductById, Product} from "@/api/products.ts";
import { CartItem } from "@/api/cart.ts";
import { v4 as uuidv4 } from 'uuid';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("1");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Funzione per calcolare il livello di miele (da 0 a 100) in base allo stock
  const getHoneyLevel = () => {
    if (!product) return 0;
    // Assumiamo che lo stock massimo sia 100kg, quindi convertiamo direttamente
    return Math.min(150, Math.max(0, product.stock));
  };

  const getHoneyColor = () => {
    if (!product || !product.honey_color) return "#ffb000"; // Colore predefinito
    return product.honey_color;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        setLoading(true);
        const productData = await getProductById(parseInt(productId, 10));

        if (productData) {
          console.log("Prodotto caricato:", productData);
          setProduct(productData);
        } else {
          console.error("Prodotto non trovato");
          navigate("/404");
        }
      } catch (error) {
        console.error("Errore durante il caricamento del prodotto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigate]);

  // Carica il carrello dal localStorage all'avvio
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Errore nel caricamento del carrello:", e);
      }
    }
  }, []);

  // Salva il carrello nel localStorage quando cambia
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  if (loading) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p>Caricamento prodotto...</p>
        </div>
    );
  }

  if (!product) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p>Prodotto non trovato</p>
        </div>
    );
  }

  // Converte la dimensione selezionata in numero
  const getSizeValue = (): number => {
    return parseFloat(selectedSize);
  };

  // Calcola quanto stock viene consumato per la quantità e dimensione selezionate
  const getStockConsumption = (): number => {
    return quantity * getSizeValue();
  };

  // Calcola il massimo numero di articoli selezionabili in base alla dimensione
  const getMaxSelectableQuantity = (): number => {
    const sizeValue = getSizeValue();
    if (sizeValue === 0) return 0;
    return Math.floor(product.stock / sizeValue);
  };

  const handleQuantityChange = (delta: number) => {
    const maxQuantity = getMaxSelectableQuantity();
    setQuantity(prev => Math.max(1, Math.min(prev + delta, maxQuantity)));
  };

  const handleAddToCart = () => {
    // Verifica se la quantità richiesta è disponibile
    if (getStockConsumption() > product.stock) {
      // Mostra un messaggio di avviso
      console.error(`Disponibili solo ${product.stock} kg`);
      return;
    }

    // Verifica se l'articolo esiste già nel carrello (stessa dimensione e prodotto)
    const existingItemIndex = cartItems.findIndex(
      item => item.productId === product.id && item.size === selectedSize
    );

    if (existingItemIndex !== -1) {
      // Aggiorna l'articolo esistente
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += quantity;
      setCartItems(updatedItems);
    } else {
      // Crea un nuovo articolo con tutte le informazioni necessarie del prodotto
      const newItem: CartItem = {
        id: uuidv4(), // ID univoco per ogni articolo
        productId: product.id,
        quantity: quantity,
        name: product.name,
        description: product.description,
        price: product.price,
        size: selectedSize,
        image_url: product.image_url || "",
        // Includi l'intero oggetto prodotto per maggiore sicurezza
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          image_url: product.image_url || "",
          bg_color: product.bg_color,
          btn_color: product.btn_color
        }
      };

      setCartItems([...cartItems, newItem]);
    }

    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, newQuantity: number) => {
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const handleRemoveCartItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);

    if (updatedItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(updatedItems));
    } else {
      localStorage.removeItem('cart');
    }
  };

  // Determina se il bg_color è una classe Tailwind o un colore CSS
  const getBgColorClass = () => {
    if (!product.bg_color) return "bg-mava-green"; // Valore predefinito
    return product.bg_color.startsWith('bg-') ? product.bg_color : "bg-mava-green";
  };

  // Determina lo stile e la classe del pulsante in base a btn_color
  const getButtonClass = () => {
    if (!product.btn_color) return "bg-primary hover:bg-primary/90";
    return product.btn_color.startsWith('bg-') ? `${product.btn_color} hover:opacity-90` : "bg-primary hover:bg-primary/90";
  };

  const getButtonStyle = () => {
    if (!product.btn_color || product.btn_color.startsWith('bg-')) return {};
    return { backgroundColor: product.btn_color };
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
          <p>Caricamento prodotto...</p>
        </div>
    );
  }

  if (!product) {
    return (
        <div className="flex items-center justify-center h-screen">
          <p>Prodotto non trovato</p>
        </div>
    );
  }

  // Definiamo una funzione per determinare il colore del badge dello stock
  const getStockBadgeColor = () => {
    if (product.stock > 10) return "bg-green-500";
    if (product.stock > 5) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
      <div className="min-h-screen" style={{ backgroundColor: product.bg_color }}>
        <Header />

        <div className="container mx-auto px-4 py-8">
          {/* Pulsante Indietro */}
          <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="mb-6 bg-background/50 hover:bg-background/70"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Indietro
          </Button>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Lato sinistro - MieleJar3D */}
            <div className="flex justify-center">
              <div className="h-96 w-full">
                <Canvas camera={{ position: [3, 2, 5], fov: 50 }}>
                  <ambientLight intensity={0.6} />
                  <directionalLight position={[10, 10, 5]} intensity={1} />
                  <pointLight position={[-10, -10, -5]} intensity={0.3} color="#ffb000" />

                  <MieleJar3D
                      honeyLevel={getHoneyLevel()}
                      honeyColor={getHoneyColor()}
                        labelImageUrl={product.image_url || ""}
                  />

                  <OrbitControls
                      enablePan={false}
                      enableZoom={true}
                      minDistance={3}
                      maxDistance={8}
                  />
                </Canvas>
              </div>
            </div>

            {/* Lato destro - Dettagli prodotto e azioni */}
            <div className="bg-background/80 backdrop-blur-md rounded-lg p-6 shadow-lg">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground mb-4">{product.description}</p>

              {/* Informazioni su stock e prezzo al kg */}
              <div className="flex flex-col space-y-3 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Disponibilità:</span>
                  <Badge className={`${getStockBadgeColor()} text-white`}>
                    {product.stock} kg
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Prezzo al kg:</span>
                  <span className="font-bold text-lg">€{product.price.toFixed(2)}</span>
                </div>
              </div>

              {/* Selettore dimensione */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Dimensione
                </label>
                <Select
                    value={selectedSize}
                    onValueChange={(value) => {
                      setSelectedSize(value);
                      // Resetta la quantità quando si cambia dimensione per evitare problemi di stock
                      setQuantity(1);
                    }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleziona dimensione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 kg</SelectItem>
                    <SelectItem value="0.5">500 g</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Selettore quantità */}
              <div className="mb-8">
                <label className="block text-sm font-medium mb-2">
                  Quantità <span className="text-muted-foreground">({getStockConsumption()} kg totali)</span>
                </label>
                <div className="flex items-center space-x-3">
                  <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity === 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{quantity}</span>
                  <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= getMaxSelectableQuantity()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {product.stock < 1 && (
                  <p className="text-red-500 text-sm mt-1">Prodotto esaurito</p>
                )}
                {product.stock > 0 && getMaxSelectableQuantity() === quantity && (
                  <p className="text-amber-500 text-sm mt-1">
                    Quantità massima selezionata in base allo stock disponibile
                  </p>
                )}
              </div>

              {/* Pulsante Aggiungi al carrello */}
              <Button
                  className={`w-full text-white ${getButtonClass()}`}
                  style={getButtonStyle()}
                  onClick={handleAddToCart}
                  disabled={product.stock < getSizeValue() || quantity < 1}
              >
                <Package className="h-4 w-4 mr-2" />
                Aggiungi al carrello
              </Button>
            </div>
          </div>
        </div>

        {/* Componente del carrello */}
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

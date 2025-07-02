import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {ArrowLeft, Check} from "lucide-react";
import Header from "@/components/Header";
import confetti from "canvas-confetti";
import {Order, submitOrder, getOrderPositionInQueue} from "@/api/cart.ts";
import { CartItem } from "@/api/cart.ts";
import {generateOrderReceipt} from "@/services/pdf.ts";

interface CheckoutData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  phone?: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems: CartItem[] = location.state?.cartItems || [];

  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState<CheckoutData>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: ""
  });
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  // Calcolo corretto dei totali
  const subtotal = cartItems.reduce((sum, item) => {
    const sizeValue = item.size ? parseFloat(item.size) : 1;
    const itemPrice = typeof item.price === 'number' ? item.price : 0;
    return sum + (itemPrice * item.quantity * sizeValue);
  }, 0);

  const shipping = subtotal > 100 ? 0 : 5.00; // Spedizione gratuita sopra i 100€
  const taxes = 0 //subtotal * 0.05; // 5% di tasse
  const total = subtotal + shipping + taxes;

  const handleInputChange = (field: keyof CheckoutData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);

      // Creazione dell'ordine con i dati del cliente
      const newOrder: Order = {
        total: total,
        status: 'pending',
        created_at: new Date().toISOString(),
        checkout_info: {
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone ? formData.phone : "",
          address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode
        }
      };

      // Invio dell'ordine all'API
      const newOrderId = await submitOrder(newOrder, cartItems);
      setOrderId(newOrderId);
      setOrder({...newOrder, id:newOrderId});

      const position = await getOrderPositionInQueue(newOrderId);
      setQueuePosition(position);

      // Pulisci il carrello dal localStorage
      localStorage.removeItem('cart');

      // Effetto confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Mostra il dialogo di successo
      setShowSuccessDialog(true);

    } catch (error) {
      console.error("Errore nell'invio dell'ordine. Contatta fdpierro@gmail.com per effettuare l'ordine", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadReceipt = async () => {
    if (!order || !cartItems) return;
    try {
      await generateOrderReceipt(order, cartItems);
      setPdfDownloaded(true);
    } catch (error) {
      console.error("Errore nella generazione della ricevuta: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Torna al carrello
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left side - Checkout form */}
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Checkout</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Contatto</h2>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Delivery section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Indirizzo di consegna</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nome</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Cognome</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Indirizzo</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Città</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">CAP</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange("postalCode", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Telefono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Elaborazione..." : "Completa ordine"}
              </Button>
            </form>
          </div>

          {/* Right side - Order summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card>
              <CardHeader>
                <CardTitle>Riepilogo ordine</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart items */}
                {cartItems.map((item) => {
                  const sizeValue = item.size ? parseFloat(item.size) : 1;
                  const sizeLabel = sizeValue === 0.5 ? "500g" : "1kg";
                  const itemPrice = typeof item.price === 'number' ? item.price : 0;

                  return (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                            <img src={item.image_url} className="w-full h-full object-cover rounded-lg" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-mava-orange rounded-full flex items-center justify-center text-xs font-medium">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{sizeLabel}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">
                          €{(itemPrice * sizeValue * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}

                <hr />

                {/* Gift card/discount code */}
                <div className="flex gap-2">
                  <Input placeholder="Codice sconto" className="flex-1" />
                  <Button variant="outline">Applica</Button>
                </div>

                <hr />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotale</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Spedizione</span>
                    <span className="text-muted-foreground">
                      {shipping === 0 ? "Gratuita" : `€${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Totale</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogTitle className="text-lg font-semibold">Ordine confermato!</DialogTitle>
          <div className="text-center py-4">
            {/*<div className="w-12 h-12 rounded-full bg-green-100 mx-auto flex items-center justify-center">*/}
            {/*  <Check className="h-6 w-6 text-green-600" />*/}
            {/*</div>*/}
            <h3 className="mt-4 text-lg font-semibold">Ordine confermato!</h3>
            <p className="mt-2 text-muted-foreground">
              Il tuo ordine #{orderId} è stato registrato con successo.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Ti contatteremo presto per la consegna.
            </p>
          </div>
          <div className="flex flex-col gap-3 mt-4">
            <Button
                onClick={handleDownloadReceipt}
                className="bg-mava-orange hover:bg-mava-orange/90"
                disabled={pdfDownloaded}
            >
              {pdfDownloaded ? "Ricevuta scaricata" : "Scarica ricevuta"}
            </Button>
            <Button
                onClick={() => navigate('/')}
                variant="outline"
                disabled={!pdfDownloaded}
            >
              Torna alla home
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;
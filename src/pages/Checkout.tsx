import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import confetti from "canvas-confetti";
import {submitOrder} from "@/api/cart.ts";

interface CartItem {
  id: string;
  name: string;
  flavor: string;
  size: string;
  price: number;
  quantity: number;
}

interface CheckoutData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems: CartItem[] = location.state?.cartItems || [];
  
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [formData, setFormData] = useState<CheckoutData>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    phone: ""
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 7.40; // Free shipping over $100
  const taxes = subtotal * 0.05; // 5% tax
  const total = subtotal + shipping + taxes;

  const handleInputChange = (field: keyof CheckoutData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Show success dialog
    setShowSuccessDialog(true);
  };

  const handleSubmitOrder = async () => {
    try {
      setIsSubmitting(true);

      const order = {
        user_email: email,
        total: calculateTotal(),
        status: 'pending',
        shipping_address: `${address}, ${city}, ${cap}`
      };

      const orderId = await submitOrder(order, cartItems);

      // toast({
      //   title: "Ordine completato!",
      //   description: `Il tuo ordine #${orderId} è stato registrato.`
      // });

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Show success dialog
      setShowSuccessDialog(true);

      // Pulisci carrello e redirect
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'invio dell'ordine.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
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
          Back to cart
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left side - Checkout form */}
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Checkout</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Contact</h2>
                  <Button variant="link" className="text-sm text-primary">
                    Log in
                  </Button>
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
                <h2 className="text-lg font-semibold">Delivery</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="province">Province</Label>
                    <Select value={formData.province} onValueChange={(value) => handleInputChange("province", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Province" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alberta">Alberta</SelectItem>
                        <SelectItem value="bc">British Columbia</SelectItem>
                        <SelectItem value="ontario">Ontario</SelectItem>
                        <SelectItem value="quebec">Quebec</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal code</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange("postalCode", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Complete order
              </Button>
            </form>
          </div>

          {/* Right side - Order summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart items */}
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-lg bg-mava-orange flex items-center justify-center">
                        <span className="text-white font-bold">12</span>
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-medium">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.flavor}</h3>
                      <p className="text-sm text-muted-foreground">{item.size}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}

                <hr />

                {/* Gift card/discount code */}
                <div className="flex gap-2">
                  <Input placeholder="Gift card or discount code" className="flex-1" />
                  <Button variant="outline">Apply</Button>
                </div>

                <hr />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-muted-foreground">
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated taxes</span>
                    <span>${taxes.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>CAD ${total.toFixed(2)}</span>
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
          <DialogTitle className="text-center text-2xl font-bold text-primary">Grazie!</DialogTitle>
          <div className="text-center space-y-4 py-6">
            <div>
              <p className="text-lg font-semibold">Data di consegna</p>
              <p className="text-muted-foreground">Settembre 2025</p>
            </div>
            <div>
              <p className="text-lg font-semibold">Importo totale</p>
              <p className="text-2xl font-bold">CAD ${total.toFixed(2)}</p>
            </div>
            <Button 
              onClick={handleBackToHome}
              className="w-full bg-primary hover:bg-primary/90 mt-6"
            >
              Back to home
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;
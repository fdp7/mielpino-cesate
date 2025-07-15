import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Mielpino from "./pages/Mielpino.tsx";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import LearnMielpino from "./pages/LearnMielpino.tsx";
import NotFound from "./pages/NotFound";
import Salumipino from "@/pages/Salumipino.tsx";
import LearnSalumipino from "@/pages/LearnSalumipino.tsx";
import Faq from "./pages/Faq.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Mielpino />} />
          <Route path="/mielpino" element={<Mielpino />} />
            <Route path="/salumipino" element={<Salumipino />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/learn-mielpino" element={<LearnMielpino />} />
          <Route path="/learn-salumipino" element={<LearnSalumipino />} />
          <Route path="/faq" element={<Faq />}/>
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import {getProducts, Product } from "@/api/products";
import Header from "@/components/Header";
import ProductShowcase from "@/components/ProductShowcase";
import {useEffect, useState } from "react";

const Index = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true); // Indica che il caricamento è in corso

                // Chiamata all'API per recuperare i prodotti
                const productsData = await getProducts();

                // Verifica dei dati ricevuti
                console.log("Prodotti caricati:", productsData);

                if (productsData && productsData.length > 0) {
                    setProducts(productsData);
                } else {
                    console.warn("Nessun prodotto trovato nel database");
                }
            } catch (error) {
                console.error("Errore durante il caricamento dei prodotti:", error);
            } finally {
                setLoading(false); // Indica che il caricamento è terminato
            }
        };

        loadProducts();
    }, []);

    return (
        <div className="min-h-screen">
          <Header />
            {loading ? (
                <div className="flex items-center justify-center h-screen">
                    <p>Caricamento prodotti...</p>
                </div>
            ) : (
                <ProductShowcase products={products} />
            )}
        </div>
    );
};

export default Index;

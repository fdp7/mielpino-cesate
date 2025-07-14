import {getProductsByType, Product } from "@/api/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MielpinoShowcase from "@/components/MielpinoShowcase.tsx";
import {useEffect, useState } from "react";

const Mielpino = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true); // Indica che il caricamento è in corso

                // Chiamata all'API per recuperare i prodotti
                const productsData = await getProductsByType('miele');

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
                    <MielpinoShowcase products={products} />
                )}
            <Footer />
        </div>
    );
};

export default Mielpino;

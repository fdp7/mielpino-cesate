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
                const data = await getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Errore nel caricamento dei prodotti:", error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    return (
        <div className="min-h-screen">
          <Header />
          <ProductShowcase />
        </div>
    );
};

export default Index;

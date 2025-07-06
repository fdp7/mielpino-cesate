import {Product} from "@/api/products.ts";

export const getStockLevel = (product: Product) => {
    if (!product) return 0;
    return product.stock;
};

export const getHoneyColor = (product: Product) => {
    if (!product || !product.honey_color) return "#ffb000"; // Colore predefinito
    return product.honey_color;
};

export const getProductModelPath = (product: Product): string => {
    if (!product || !product.model_path) return ""; // Percorso predefinito
    return product.model_path;
}

export const getProductType = (product: Product): string => {
    if (!product || !product.model_path) return "generic";

    if (product.model_path.includes("miele") || product.model_path.includes("honey")) {
        return "honey";
    } else if (product.model_path.includes("cera") || product.model_path.includes("wax")) {
        return "wax";
    } else if (product.model_path.includes("salame") || product.model_path.includes("sausage")) {
        return "salame";
    }

    return "generic";
};

export const formatSizeLabel = (sizeKg: number): string => {
    if (sizeKg >= 1) {
        return `${sizeKg} kg`;
    } else {
        return `${sizeKg * 1000} g`;
    }
};

export const getAvailableSizes = (product: Product): number[] => {
    if (!product || !product.sizes_kg || !Array.isArray(product.sizes_kg)) {
        return [1]; // Default size if no sizes_kg available
    }
    return product.sizes_kg.sort((a, b) => b - a); // Sort descending
};

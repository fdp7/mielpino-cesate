import { supabase } from '@/lib/supabase';

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  created_at?: string;
  bg_color?: string;
  btn_color?: string;
  honey_color?: string;
  sizes_kg?: number[];
  model_path?: string;
};

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) throw error;
  return data || [];
}

export async function getProductById(id: number): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProductStock(productId: number, newStock: number): Promise<boolean> {
  try {
    // Aggiorniamo il prodotto nel database
    const { data, error: updateError } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', productId)
        .select();

    if (updateError) throw updateError;

    console.log("Update riuscito:", data);

    return true;
  } catch (error) {
    console.error(`Errore nell'aggiornamento dello stock per il prodotto ${productId}:`, error);
    return false;
  }
}
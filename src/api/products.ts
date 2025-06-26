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

export async function updateProductStock(productId: number, newStock: number): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update({ stock: newStock })
    .eq('id', productId);

  if (error) throw error;
}
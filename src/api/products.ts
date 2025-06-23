import { supabase } from '@/lib/supabase';

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  created_at?: string;
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
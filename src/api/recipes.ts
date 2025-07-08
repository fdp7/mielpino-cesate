import { supabase } from '@/lib/supabase';

export type Recipe = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  created_at?: string;
};

export async function getRecipes(): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*');

  if (error) throw error;
  return data || [];
}

export async function getRecipesByType(type: string): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('product_type', type);

  if (error) throw error;
  return data || [];
}

export async function getRecipeById(id: number): Promise<Recipe | null> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}
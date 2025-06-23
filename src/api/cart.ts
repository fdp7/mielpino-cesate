import { supabase } from '@/lib/supabase';
import { Product } from './products';

export type CartItem = {
  productId: number;
  quantity: number;
  product: Product;
};

export type Order = {
  id?: number;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  checkout_info: string;
  created_at?: string;
};

export async function submitOrder(order: Order, items: CartItem[]): Promise<number> {
  // 1. Inserire l'ordine
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert(order)
    .select('id')
    .single();

  if (orderError) throw orderError;

  // 2. Inserire gli articoli dell'ordine
  const orderItems = items.map(item => ({
    order_id: orderData.id,
    product_id: item.productId,
    quantity: item.quantity,
    price_at_purchase: item.product.price
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return orderData.id;
}
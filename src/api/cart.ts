import { supabase } from '@/lib/supabase';
import { Product, updateProductStock } from './products';

export type CartItem = {
  id?: string; // Aggiunto per gestire gli ID degli articoli del carrello
  productId: number;
  quantity: number;
  product?: Product;
  size?: string; // Aggiunto per gestire le taglie
  price?: number; // Aggiunto per gestire il prezzo al momento dell'aggiunta al carrello
  name?: string; // Aggiunto per gestire il nome del prodotto
  description?: string; // Aggiunto per gestire la descrizione del prodotto
  image_url?: string; // Aggiunto per gestire l'URL dell'immagine del prodotto
};

export type Order = {
  id?: number;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  checkout_info: CheckoutInfo;
  created_at?: string;
};

export type CheckoutInfo = {
  email: string;
  phone?: string;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  postal_code: string;
}

export async function submitOrder(order: Order, items: CartItem[]): Promise<number> {
  try {
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
      // Usa il prezzo direttamente dall'item se disponibile, altrimenti dal prodotto
      price_at_purchase: item.price || item.product?.price || 0
    }));

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

    if (itemsError) throw itemsError;

    // 3. Aggiornare lo stock per ogni prodotto
    for (const item of items) {
      // Prima ottenere lo stock corrente
      const { data: productData, error: productError } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.productId)
          .single();

      if (productError) throw productError;

      // Calcola la quantità effettiva in base alla dimensione
      const sizeValue = item.size ? parseFloat(item.size) : 1;
      const stockToRemove = item.quantity * sizeValue;
      const currentStock = productData.stock;
      const newStock = Math.max(0, currentStock - stockToRemove);

      // Aggiornare lo stock
      const updated = await updateProductStock(item.productId, newStock);
    }

    // 4. Inviare email ricezione ordine a me
    try {
      // Costruisci il contenuto dell'email qui nel frontend
      const itemsList = items.map(item => {
        const price = item.price || 0;
        const quantity = item.quantity || 1;
        const sizeValue = item.size ? parseFloat(item.size) : 1;
        return `• ${item.name} - Quantità: ${quantity} - €${(price * quantity * sizeValue).toFixed(2)}`;
      }).join('\n');

      const emailContentForMe = `
        Nuovo ordine #${orderData.id}

        Cliente: ${order.checkout_info.first_name} ${order.checkout_info.last_name}
        Email: ${order.checkout_info.email}
        Telefono: ${order.checkout_info.phone || 'Non fornito'}
        Indirizzo: ${order.checkout_info.address}, ${order.checkout_info.city} ${order.checkout_info.postal_code}

        Totale: €${order.total.toFixed(2)}

        Articoli ordinati:
        ${itemsList}

        ---
        AGROPINO
          `;

      await supabase.functions.invoke('send-email', {
        body: JSON.stringify({
          to: 'fdpierro@gmail.com',
          subject: `Nuovo ordine #${orderData.id}`,
          message: emailContentForMe,
        })
      });
    } catch (emailError) {
      console.error("Errore invio email:", emailError);
    }

    // 5. Inviare email ricezione ordine a cliente
    try {
      // Costruisci il contenuto dell'email qui nel frontend
      const itemsList = items.map(item => {
        const price = item.price || 0;
        const quantity = item.quantity || 1;
        const sizeValue = item.size ? parseFloat(item.size) : 1;
        return `• ${item.name} - Quantità: ${quantity} - €${(price * quantity * sizeValue).toFixed(2)}`;
      }).join('\n');

      const emailContentForCustomer = `
        Caro ${order.checkout_info.first_name} ${order.checkout_info.last_name},
        
        Abbiamo ricevuto il tuo ordine e sarà processato al più presto.
        
        Dettagli del tuo ordine:
        ${itemsList}
        Totale: €${order.total.toFixed(2)}
        
        Per qualsiasi richiesta riguardo l'ordine effettuato e la spedizione, rispondi a questa email.
        
        ---
        Agropino Support Team
          `;

      await supabase.functions.invoke('send-email', {
        body: JSON.stringify({
          to: 'fdpierro@gmail.com',
          subject: `Conferma ordine ${order.id} - Agropino`,
          message: emailContentForCustomer,
        })
      });
    } catch (emailError) {
      console.error("Errore invio email:", emailError);
    }

    return orderData.id;
  } catch (error) {
    console.error("Errore durante la transazione:", error);
    throw error;
  }
}

export async function getOrderPositionInQueue(orderId: number): Promise<number> {
  try {
    // Ottieni la data di creazione dell'ordine corrente
    const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('created_at')
        .eq('id', orderId)
        .single();

    if (orderError) throw orderError;

    // Conta quanti ordini in stato "pending" sono stati creati prima di questo ordine
    const { count, error: countError } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending')
        .lt('created_at', orderData.created_at);

    if (countError) throw countError;

    // La posizione in coda è il numero di ordini pending + 1
    return (count || 0) + 1;
  } catch (error) {
    console.error("Errore nel calcolo della posizione in coda:", error);
    return 1; // Default nel caso di errore
  }
}
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Funzione di test per verificare la connessione
export async function testSupabaseConnection() {
    try {
        const { data, error } = await supabase.from('products').select('id').limit(1);
        if (error) throw error;
        console.log('data', data)
        console.log('Connessione a Supabase stabilita con successo!');
        return true;
    } catch (error) {
        console.error('Errore di connessione a Supabase:', error);
        return false;
    }
}

testSupabaseConnection()
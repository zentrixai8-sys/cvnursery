import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Agar user ne URL set nahi kiya hai, toh dummy credentials use karein taaki app crash na ho
const isValidUrl = supabaseUrl && supabaseUrl.startsWith('http');
const finalUrl = isValidUrl ? supabaseUrl : 'https://dummyproject.supabase.co';
const finalKey = supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key_here' ? supabaseAnonKey : 'dummy_key';

export const supabase = createClient(finalUrl, finalKey);

// Database Types
export interface DbProduct {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  description: string;
  care_guide: string;
  in_stock: boolean;
  discount: number | null;
  created_at: string;
}

export interface DbOrder {
  id: string;
  user_id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
}

export interface DbOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
}

export interface DbCartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
}

export interface DbWishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

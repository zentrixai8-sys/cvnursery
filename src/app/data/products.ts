import { supabase } from '../../lib/supabase';
import { Product } from '../context/AppContext';

// Supabase se products fetch karo
export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id');

  if (error) {
    console.error('Products load karne mein error:', error);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    name: row.name,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    image: row.image,
    category: row.category,
    rating: row.rating,
    reviews: row.reviews,
    description: row.description,
    careGuide: row.care_guide,
    inStock: row.in_stock,
    discount: row.discount ?? undefined,
  }));
}

// Ek product ID se fetch karo
export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name,
    price: data.price,
    originalPrice: data.original_price ?? undefined,
    image: data.image,
    category: data.category,
    rating: data.rating,
    reviews: data.reviews,
    description: data.description,
    careGuide: data.care_guide,
    inStock: data.in_stock,
    discount: data.discount ?? undefined,
  };
}

// Categories list (static - zyada change nahi hoti)
export const categories = [
  'All Plants',
  'Indoor Plants',
  'Outdoor Plants',
  'Flower Plants',
  'Pots',
  'Seeds',
  'Fertilizers',
];

// Static reviews (ya Supabase reviews table baad mein add kar sakte hain)
export const reviews = [
  {
    id: '1',
    name: 'Priya Sharma',
    rating: 5,
    comment: 'Excellent quality plants! They arrived in perfect condition and are thriving in my home.',
    date: '2026-03-05',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  {
    id: '2',
    name: 'Rahul Verma',
    rating: 5,
    comment: 'Great service and beautiful plants. The packaging was very professional.',
    date: '2026-03-02',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
  },
  {
    id: '3',
    name: 'Anjali Desai',
    rating: 4,
    comment: 'Good variety and healthy plants. Delivery was prompt.',
    date: '2026-02-28',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
  },
  {
    id: '4',
    name: 'Vikram Singh',
    rating: 5,
    comment: 'Best plant nursery online! Highly recommend CV Nursery.',
    date: '2026-02-25',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
  },
];

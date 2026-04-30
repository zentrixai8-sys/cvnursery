import { supabase } from '../../lib/supabase';
import { Product } from '../context/AppContext';

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Monstera Deliciosa', price: 899, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=2000', category: 'Indoor Plants', rating: 4.8, reviews: 124, description: 'Elegant Swiss cheese plant.', in_stock: true, discount: 10 },
  { id: '10', name: 'Lavender', price: 549, image: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=2000', category: 'Flower Plants', rating: 4.9, reviews: 223, description: 'Soothing and fragrant purple blooms.', in_stock: true },
  { id: '11', name: 'Rose Bush', price: 899, image: 'https://images.unsplash.com/photo-1496062031456-07b8f162a322?q=80&w=2000', category: 'Flower Plants', rating: 4.7, reviews: 145, description: 'Stunning classic red roses.', in_stock: true },
  { id: '12', name: 'Marigold', price: 199, image: 'https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?q=80&w=2000', category: 'Flower Plants', rating: 4.6, reviews: 289, description: 'Bright orange and yellow flowers.', in_stock: true },
  { id: '13', name: 'Sunflower', price: 299, image: 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?q=80&w=2000', category: 'Flower Plants', rating: 4.8, reviews: 312, description: 'Cheerful and tall sun-seekers.', in_stock: true },
  { id: '14', name: 'Petunia', price: 349, image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=2000', category: 'Flower Plants', rating: 4.5, reviews: 156, description: 'Vibrant and trailing blooms.', in_stock: true },
  { id: '15', name: 'Ceramic Planter Set', price: 1299, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=2000', category: 'Pots', rating: 5.0, reviews: 78, description: 'Luxury handcrafted ceramic pots.', in_stock: true },
  { id: '16', name: 'Terracotta Pots', price: 399, image: 'https://images.unsplash.com/photo-1518458028785-8b391e3b8b00?q=80&w=2000', category: 'Pots', rating: 4.4, reviews: 234, description: 'Breathable classic clay pots.', in_stock: true },
];

// Fallback images map for recovery (matches by ID and Name)
const IMAGE_FALLBACKS: Record<string, string> = {
  '1': 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=2000',
  '10': 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=2000',
  '11': 'https://images.unsplash.com/photo-1496062031456-07b8f162a322?q=80&w=2000',
  '12': 'https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?q=80&w=2000',
  '13': 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?q=80&w=2000',
  '14': 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=2000',
  '15': 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=2000',
  '16': 'https://images.unsplash.com/photo-1518458028785-8b391e3b8b00?q=80&w=2000',
  // Name based fallbacks
  'Monstera Deliciosa': 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=2000',
  'Lavender': 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=2000',
  'Rose Bush': 'https://images.unsplash.com/photo-1496062031456-07b8f162a322?q=80&w=2000',
  'Marigold': 'https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?q=80&w=2000',
  'Sunflower': 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?q=80&w=2000',
  'Petunia': 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=2000',
};

// Supabase se products fetch karo
export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id');

    if (error || !data || data.length === 0) return MOCK_PRODUCTS;

    return (data ?? []).map((row: any) => {
      // Logic to auto-fix broken or blank images
      let image = row.image;
      const needsFix = !image || image.includes('placeholder') || image === '' || !image.startsWith('http');
      
      if (needsFix) {
         image = IMAGE_FALLBACKS[row.id] || IMAGE_FALLBACKS[row.name] || MOCK_PRODUCTS.find(p => p.id === row.id)?.image || MOCK_PRODUCTS[0].image;
      }

      return {
        id: row.id,
        name: row.name,
        price: row.price,
        originalPrice: row.original_price ?? undefined,
        image: image,
        category: row.category,
        rating: row.rating,
        reviews: row.reviews,
        description: row.description,
        careGuide: row.care_guide,
        inStock: row.in_stock,
        discount: row.discount ?? undefined,
      };
    });
  } catch {
    return MOCK_PRODUCTS;
  }
}

// Ek product ID se fetch karo
export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return MOCK_PRODUCTS.find(p => p.id === id) || null;
  }

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
];

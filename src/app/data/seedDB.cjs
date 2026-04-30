const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vijllsomnwrtuoiwjzax.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpamxsc29tbndydHVvaXdqemF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MTE4OTQsImV4cCI6MjA4ODk4Nzg5NH0.lHUZoTAkzzHSOhJWP7K5xlv4TTL3v5qbIsvryDqqNRk';

const supabase = createClient(supabaseUrl, supabaseKey);

const mockProducts = [
  { id: 'p1', name: 'Premium Monstera', price: 1299, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=1000', category: 'Indoor Plants', rating: 4.8, reviews: 124, description: 'Elegant Swiss cheese plant.', in_stock: true },
  { id: 'p2', name: 'Snake Plant', price: 599, image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bac?q=80&w=1000', category: 'Indoor Plants', rating: 4.9, reviews: 85, description: 'Tough and air-purifying.', in_stock: true },
  { id: 'p3', name: 'Desert Rose', price: 899, image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?q=80&w=1000', category: 'Outdoor Plants', rating: 4.7, reviews: 42, description: 'Stunning pink blooms.', in_stock: true },
  { id: 'p4', name: 'Lavender Pot', price: 450, image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=1000', category: 'Flower Plants', rating: 4.6, reviews: 67, description: 'Fragrant and calming.', in_stock: true },
  { id: 'p5', name: 'Ceramic Planter', price: 1200, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d445?q=80&w=1000', category: 'Pots', rating: 5.0, reviews: 15, description: 'Handcrafted luxury pot.', in_stock: true },
  { id: 'p6', name: 'Areca Palm', price: 750, image: 'https://images.unsplash.com/photo-1512428813824-f713cb752935?q=80&w=1000', category: 'Indoor Plants', rating: 4.5, reviews: 92, description: 'Tropical vibe for your home.', in_stock: true },
  { id: 'p7', name: 'Peace Lily', price: 650, image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=1000', category: 'Indoor Plants', rating: 4.7, reviews: 110, description: 'Elegant and air-purifying.', in_stock: true },
  { id: 'p8', name: 'Aloe Vera', price: 350, image: 'https://images.unsplash.com/photo-1567171466295-4afa58145227?q=80&w=1000', category: 'Indoor Plants', rating: 4.8, reviews: 200, description: 'Medicinal and easy care.', in_stock: true },
];

const mockCustomers = [
  { id: 'c1', full_name: 'Priya Sharma', email: 'priya@example.com', phone: '9876543210' },
  { id: 'c2', full_name: 'Rahul Verma', email: 'rahul@example.com', phone: '9876543211' },
  { id: 'c3', full_name: 'Anjali Desai', email: 'anjali@example.com', phone: '9876543212' },
  { id: 'c4', full_name: 'Vikram Singh', email: 'vikram@example.com', phone: '9876543213' },
  { id: 'c5', full_name: 'Sonia Gupta', email: 'sonia@example.com', phone: '9876543214' },
];

const mockOrders = [
  { id: 'ORD-101', user_id: 'c1', date: 'Apr 25, 2026', total: 1898, status: 'delivered' },
  { id: 'ORD-102', user_id: 'c2', date: 'Apr 26, 2026', total: 599, status: 'processing' },
  { id: 'ORD-103', user_id: 'c3', date: 'Apr 27, 2026', total: 2450, status: 'shipped' },
  { id: 'ORD-104', user_id: 'c4', date: 'Apr 28, 2026', total: 3500, status: 'delivered' },
  { id: 'ORD-105', user_id: 'c5', date: 'Apr 29, 2026', total: 1299, status: 'pending' },
  { id: 'ORD-106', user_id: 'c1', date: 'Apr 30, 2026', total: 899, status: 'delivered' },
  { id: 'ORD-107', user_id: 'c2', date: 'Apr 30, 2026', total: 1200, status: 'processing' },
];

const mockOrderItems = [
  { order_id: 'ORD-101', product_id: 'p1', product_name: 'Premium Monstera', product_image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=1000', price: 1299, quantity: 1 },
  { order_id: 'ORD-101', product_id: 'p2', product_name: 'Snake Plant', product_image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bac?q=80&w=1000', price: 599, quantity: 1 },
  { order_id: 'ORD-102', product_id: 'p2', product_name: 'Snake Plant', product_image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bac?q=80&w=1000', price: 599, quantity: 1 },
  { order_id: 'ORD-103', product_id: 'p5', product_name: 'Ceramic Planter', product_image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d445?q=80&w=1000', price: 1200, quantity: 2 },
  { order_id: 'ORD-104', product_id: 'p1', product_name: 'Premium Monstera', product_image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=1000', price: 1299, quantity: 2 },
  { order_id: 'ORD-105', product_id: 'p1', product_name: 'Premium Monstera', product_image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=1000', price: 1299, quantity: 1 },
  { order_id: 'ORD-106', product_id: 'p3', product_name: 'Desert Rose', product_image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?q=80&w=1000', price: 899, quantity: 1 },
  { order_id: 'ORD-107', product_id: 'p5', product_name: 'Ceramic Planter', product_image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d445?q=80&w=1000', price: 1200, quantity: 1 },
];

async function seed() {
  console.log('Seeding extended data...');
  await supabase.from('products').upsert(mockProducts);
  await supabase.from('customers').upsert(mockCustomers);
  await supabase.from('orders').upsert(mockOrders);
  await supabase.from('order_items').upsert(mockOrderItems);
  console.log('Database seeded with full mock data! 🌿');
}

seed();

-- ============================================================
-- CV Nursery E-commerce - Supabase SQL Schema
-- Supabase Dashboard → SQL Editor mein yeh poora code paste karein
-- ============================================================

-- 1. PROFILES TABLE (Supabase Auth ke saath linked)
-- -------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  email text not null,
  phone text,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Jab bhi naya user sign up kare, profile auto-create ho
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'User'),
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', '')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. PRODUCTS TABLE
-- -------------------------------------------------------
create table if not exists public.products (
  id text primary key,
  name text not null,
  price numeric not null,
  original_price numeric,
  image text not null,
  category text not null,
  rating numeric default 0,
  reviews integer default 0,
  description text,
  care_guide text,
  in_stock boolean default true,
  discount integer,
  created_at timestamp with time zone default timezone('utc', now())
);

-- 3. ORDERS TABLE
-- -------------------------------------------------------
create table if not exists public.orders (
  id text primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date text not null,
  total numeric not null,
  status text default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at timestamp with time zone default timezone('utc', now())
);

-- 4. ORDER ITEMS TABLE
-- -------------------------------------------------------
create table if not exists public.order_items (
  id text primary key,
  order_id text references public.orders(id) on delete cascade not null,
  product_id text not null,
  product_name text not null,
  product_image text not null,
  price numeric not null,
  quantity integer not null
);

-- 5. CART ITEMS TABLE
-- -------------------------------------------------------
create table if not exists public.cart_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id text references public.products(id) on delete cascade not null,
  quantity integer not null default 1,
  created_at timestamp with time zone default timezone('utc', now()),
  unique(user_id, product_id)
);

-- 6. WISHLIST ITEMS TABLE
-- -------------------------------------------------------
create table if not exists public.wishlist_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id text references public.products(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc', now()),
  unique(user_id, product_id)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) - Important for security!
-- ============================================================

alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.cart_items enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.products enable row level security;

-- Profiles: sirf apna profile dekh aur update kar sako
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Products: sabhi log dekh sakein (public read)
create policy "Anyone can view products" on public.products
  for select using (true);

-- Orders: sirf apne orders dekh sako
create policy "Users can view own orders" on public.orders
  for select using (auth.uid() = user_id);
create policy "Users can insert own orders" on public.orders
  for insert with check (auth.uid() = user_id);

-- Order Items: apne orders ke items dekh sako
create policy "Users can view own order items" on public.order_items
  for select using (
    exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
  );
create policy "Users can insert own order items" on public.order_items
  for insert with check (
    exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
  );

-- Cart: apna cart manage karo
create policy "Users can manage own cart" on public.cart_items
  for all using (auth.uid() = user_id);

-- Wishlist: apni wishlist manage karo
create policy "Users can manage own wishlist" on public.wishlist_items
  for all using (auth.uid() = user_id);

-- ============================================================
-- SEED PRODUCTS DATA - Sabhi 20 Products
-- ============================================================
insert into public.products (id, name, price, original_price, image, category, rating, reviews, description, care_guide, in_stock, discount) values
('1', 'Monstera Deliciosa', 899, 1299, 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800', 'Indoor Plants', 4.8, 124, 'The Monstera Deliciosa is a stunning tropical plant known for its large, glossy leaves with natural holes. Perfect for adding a touch of the jungle to your home.', 'Water when the top 2 inches of soil are dry. Prefers bright, indirect light. Keep in temperatures between 65-85°F.', true, 31),
('2', 'Snake Plant', 499, null, 'https://images.unsplash.com/photo-1593482892290-f54927ae1e8e?w=800', 'Indoor Plants', 4.9, 256, 'A hardy, low-maintenance plant perfect for beginners. Known for air-purifying qualities and striking vertical leaves.', 'Water every 2-3 weeks. Tolerates low light but prefers indirect sunlight. Very drought-tolerant.', true, null),
('3', 'Fiddle Leaf Fig', 1299, 1799, 'https://images.unsplash.com/photo-1614594895304-fe7116ac3b58?w=800', 'Indoor Plants', 4.6, 89, 'A popular indoor tree with large, violin-shaped leaves. Makes a bold statement in any room.', 'Water when top inch of soil is dry. Needs bright, indirect light. Rotate regularly for even growth.', true, 28),
('4', 'Pothos Golden', 399, null, 'https://images.unsplash.com/photo-1614594737564-58b525e7d0ca?w=800', 'Indoor Plants', 4.9, 342, 'Easy-to-grow trailing plant with heart-shaped golden-green leaves. Perfect for hanging baskets.', 'Water when soil is dry. Tolerates low to bright indirect light. Very forgiving and fast-growing.', true, null),
('5', 'Peace Lily', 699, null, 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=800', 'Indoor Plants', 4.7, 178, 'Elegant plant with dark green leaves and beautiful white blooms. Excellent air purifier.', 'Keep soil moist but not soggy. Prefers low to medium light. Droops when thirsty.', true, null),
('6', 'ZZ Plant', 599, null, 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=800', 'Indoor Plants', 4.8, 156, 'Extremely hardy plant with glossy, dark green leaves. Perfect for busy plant parents.', 'Water every 2-3 weeks. Tolerates low light and neglect. Very drought-resistant.', true, null),
('7', 'Bougainvillea', 799, null, 'https://images.unsplash.com/photo-1605440999009-d0259a1d6f6a?w=800', 'Outdoor Plants', 4.7, 98, 'Vibrant flowering plant with colorful bracts. Perfect for gardens and balconies.', 'Full sun required. Water when soil is dry. Prune regularly to maintain shape.', true, null),
('8', 'Hibiscus', 599, null, 'https://images.unsplash.com/photo-1592729645009-b96d1e63d14b?w=800', 'Outdoor Plants', 4.6, 134, 'Beautiful flowering shrub with large, colorful blooms. Attracts butterflies and hummingbirds.', 'Full to partial sun. Water regularly, especially during hot weather. Fertilize monthly.', true, null),
('9', 'Jade Plant', 449, null, 'https://images.unsplash.com/photo-1612363148951-15f16817648f?w=800', 'Outdoor Plants', 4.8, 167, 'Succulent with thick, fleshy leaves. Symbol of good luck and prosperity.', 'Full sun to partial shade. Water sparingly. Let soil dry between waterings.', true, null),
('10', 'Lavender', 549, null, 'https://images.unsplash.com/photo-1611251185942-a024621a1c6c?w=800', 'Flower Plants', 4.9, 223, 'Fragrant herb with purple flowers. Perfect for gardens and aromatherapy.', 'Full sun required. Well-draining soil. Water moderately, avoid overwatering.', true, null),
('11', 'Rose Bush', 899, 1199, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800', 'Flower Plants', 4.7, 145, 'Classic flowering plant with beautiful, fragrant blooms. Available in various colors.', 'Full sun (6+ hours). Water deeply 2-3 times per week. Prune dead flowers regularly.', true, 25),
('12', 'Marigold', 199, null, 'https://images.unsplash.com/photo-1595839974073-8c9c0f94e1f4?w=800', 'Flower Plants', 4.8, 289, 'Bright, cheerful flowers that bloom profusely. Natural pest repellent.', 'Full sun. Water regularly but avoid waterlogging. Deadhead spent flowers.', true, null),
('13', 'Sunflower', 299, null, 'https://images.unsplash.com/photo-1597848212624-e4c0c1d73ed0?w=800', 'Flower Plants', 4.9, 312, 'Tall, cheerful flowers that follow the sun. Produces edible seeds.', 'Full sun essential. Water regularly, especially when young. Support tall varieties.', true, null),
('14', 'Petunia', 349, null, 'https://images.unsplash.com/photo-1585847961527-22990a10964f?w=800', 'Flower Plants', 4.6, 156, 'Colorful, trumpet-shaped flowers perfect for hanging baskets and borders.', 'Full sun to partial shade. Water regularly. Fertilize every 2 weeks.', true, null),
('15', 'Ceramic Planter Set', 1299, null, 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800', 'Pots', 4.8, 78, 'Set of 3 elegant ceramic planters with drainage holes. Modern minimalist design.', 'Wipe clean with damp cloth. Drainage holes included. Saucers included.', true, null),
('16', 'Terracotta Pots', 399, null, 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800', 'Pots', 4.7, 234, 'Classic terracotta pots with natural breathability. Perfect for succulents and herbs.', 'Porous material helps prevent overwatering. Develops natural patina over time.', true, null),
('17', 'Tomato Seeds', 149, null, 'https://images.unsplash.com/photo-1592841200221-2d623fd94f8c?w=800', 'Seeds', 4.6, 189, 'Premium quality tomato seeds. High germination rate. Produces juicy, flavorful tomatoes.', 'Sow indoors 6-8 weeks before last frost. Keep soil moist. Transplant after frost.', true, null),
('18', 'Mixed Flower Seeds', 99, null, 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800', 'Seeds', 4.8, 267, 'Assorted flower seeds for a colorful garden. Attracts butterflies and bees.', 'Sow directly in garden after last frost. Keep soil moist until germination.', true, null),
('19', 'Organic Plant Food', 449, null, 'https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=800', 'Fertilizers', 4.9, 412, '100% organic fertilizer for all plants. Slow-release formula for sustained growth.', 'Apply once monthly during growing season. Mix into soil or dissolve in water.', true, null),
('20', 'Liquid Seaweed Fertilizer', 599, null, 'https://images.unsplash.com/photo-1628016876179-1ebf9c90cf5f?w=800', 'Fertilizers', 4.7, 156, 'Natural seaweed extract rich in micronutrients. Promotes healthy root development.', 'Dilute as directed. Apply every 2 weeks. Safe for all plants.', true, null)
on conflict (id) do nothing;


-- ============================================================
-- 7. CUSTOMERS MASTER TABLE
-- ============================================================
create table if not exists public.customers (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  email text not null,
  phone text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  pincode text,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);

alter table public.customers enable row level security;
create policy "Users can view own customer details" on public.customers
  for select using (auth.uid() = id);
create policy "Users can update own customer details" on public.customers
  for update using (auth.uid() = id);
create policy "Users can insert own customer details" on public.customers
  for insert with check (auth.uid() = id);

-- ============================================================
-- 8. LOGIN HISTORY TABLE
-- ============================================================
create table if not exists public.login_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  email text not null,
  login_time timestamp with time zone default timezone('utc', now()),
  ip_address text,
  device_info text
);

alter table public.login_history enable row level security;
create policy "Users can view own login history" on public.login_history
  for select using (auth.uid() = user_id);
create policy "Users can insert own login history" on public.login_history
  for insert with check (auth.uid() = user_id);


import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  description: string;
  careGuide: string;
  inStock: boolean;
  discount?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: CartItem[];
}

interface AppContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
  logout: () => Promise<void>;

  orders: Order[];
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;

  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  isAuthLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper: DB row → Product
function dbToProduct(row: any): Product {
  return {
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
  };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // ─── Auth state listener ─────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        loadUserProfile(session.user.id);
      }
      setIsAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const sbUser = session?.user ?? null;
      setSupabaseUser(sbUser);
      if (sbUser) {
        loadUserProfile(sbUser.id);
      } else {
        setUser(null);
        setOrders([]);
        setCart([]);
        setWishlist([]);
        // Clear localStorage fallback
        localStorage.removeItem('cv_nursery_cart');
        localStorage.removeItem('cv_nursery_wishlist');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ─── Load user profile from Supabase ────────────────────
  const loadUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setUser({ id: data.id, name: data.name, email: data.email, phone: data.phone ?? '' });
    }
  };

  // ─── Load cart, wishlist, orders when user changes ──────
  useEffect(() => {
    if (supabaseUser) {
      loadCartFromDB(supabaseUser.id);
      loadWishlistFromDB(supabaseUser.id);
      loadOrdersFromDB(supabaseUser.id);
    } else {
      // Fallback: load from localStorage when not logged in
      const savedCart = localStorage.getItem('cv_nursery_cart');
      const savedWishlist = localStorage.getItem('cv_nursery_wishlist');
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    }
  }, [supabaseUser]);

  // ─── Cart DB operations ──────────────────────────────────
  const loadCartFromDB = async (userId: string) => {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('user_id', userId);

    if (!error && data) {
      const cartItems: CartItem[] = data.map((row: any) => ({
        ...dbToProduct(row.products),
        quantity: row.quantity,
      }));
      setCart(cartItems);
    }
  };

  const addToCart = async (product: Product) => {
    if (supabaseUser) {
      const existing = cart.find((item) => item.id === product.id);
      const newQty = existing ? existing.quantity + 1 : 1;

      const { error } = await supabase
        .from('cart_items')
        .upsert({ user_id: supabaseUser.id, product_id: product.id, quantity: newQty }, { onConflict: 'user_id,product_id' });

      if (!error) {
        setCart((prev) => {
          if (existing) {
            toast.success(`${product.name} quantity updated in cart`);
            return prev.map((item) => item.id === product.id ? { ...item, quantity: newQty } : item);
          }
          toast.success(`${product.name} added to cart`);
          return [...prev, { ...product, quantity: 1 }];
        });
      }
    } else {
      // localStorage fallback (not logged in)
      setCart((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          toast.success(`${product.name} quantity updated in cart`);
          const updated = prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
          localStorage.setItem('cv_nursery_cart', JSON.stringify(updated));
          return updated;
        }
        toast.success(`${product.name} added to cart`);
        const updated = [...prev, { ...product, quantity: 1 }];
        localStorage.setItem('cv_nursery_cart', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    const product = cart.find((item) => item.id === productId);
    if (product) toast.info(`${product.name} removed from cart`);

    if (supabaseUser) {
      await supabase.from('cart_items').delete().eq('user_id', supabaseUser.id).eq('product_id', productId);
    }
    setCart((prev) => {
      const updated = prev.filter((item) => item.id !== productId);
      if (!supabaseUser) localStorage.setItem('cv_nursery_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return; }

    if (supabaseUser) {
      await supabase.from('cart_items').update({ quantity }).eq('user_id', supabaseUser.id).eq('product_id', productId);
    }
    setCart((prev) => {
      const updated = prev.map((item) => item.id === productId ? { ...item, quantity } : item);
      if (!supabaseUser) localStorage.setItem('cv_nursery_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = async () => {
    if (supabaseUser) {
      await supabase.from('cart_items').delete().eq('user_id', supabaseUser.id);
    } else {
      localStorage.removeItem('cv_nursery_cart');
    }
    setCart([]);
  };

  // ─── Wishlist DB operations ──────────────────────────────
  const loadWishlistFromDB = async (userId: string) => {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('*, products(*)')
      .eq('user_id', userId);

    if (!error && data) {
      const wishlistItems: Product[] = data.map((row: any) => dbToProduct(row.products));
      setWishlist(wishlistItems);
    }
  };

  const addToWishlist = async (product: Product) => {
    if (wishlist.find((item) => item.id === product.id)) return;
    toast.success(`${product.name} added to wishlist`);

    if (supabaseUser) {
      await supabase.from('wishlist_items').insert({ user_id: supabaseUser.id, product_id: product.id });
    } else {
      const updated = [...wishlist, product];
      localStorage.setItem('cv_nursery_wishlist', JSON.stringify(updated));
    }
    setWishlist((prev) => [...prev, product]);
  };

  const removeFromWishlist = async (productId: string) => {
    const product = wishlist.find((item) => item.id === productId);
    if (product) toast.info(`${product.name} removed from wishlist`);

    if (supabaseUser) {
      await supabase.from('wishlist_items').delete().eq('user_id', supabaseUser.id).eq('product_id', productId);
    }
    setWishlist((prev) => {
      const updated = prev.filter((item) => item.id !== productId);
      if (!supabaseUser) localStorage.setItem('cv_nursery_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const isInWishlist = (productId: string) => wishlist.some((item) => item.id === productId);

  // ─── Orders DB operations ────────────────────────────────
  const loadOrdersFromDB = async (userId: string) => {
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !ordersData) return;

    const ordersWithItems: Order[] = await Promise.all(
      ordersData.map(async (order: any) => {
        const { data: itemsData } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id);

        const items: CartItem[] = (itemsData ?? []).map((item: any) => ({
          id: item.product_id,
          name: item.product_name,
          image: item.product_image,
          price: item.price,
          quantity: item.quantity,
          originalPrice: undefined,
          category: '',
          rating: 0,
          reviews: 0,
          description: '',
          careGuide: '',
          inStock: true,
        }));

        return {
          id: order.id,
          date: order.date,
          total: order.total,
          status: order.status,
          items,
        };
      })
    );

    setOrders(ordersWithItems);
  };

  const addOrder = async (order: Order) => {
    if (!supabaseUser) return;

    // Insert order
    const { error: orderError } = await supabase.from('orders').insert({
      id: order.id,
      user_id: supabaseUser.id,
      date: order.date,
      total: order.total,
      status: order.status,
    });

    if (orderError) { toast.error('Order save nahi hua. Try again.'); return; }

    // Insert order items
    const orderItems = order.items.map((item) => ({
      id: `${order.id}_${item.id}`,
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      product_image: item.image,
      price: item.price,
      quantity: item.quantity,
    }));

    await supabase.from('order_items').insert(orderItems);
    setOrders((prev) => [order, ...prev]);
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (!error) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      toast.success(`Order #${orderId.slice(0, 8)} marked as ${status}`);
    } else {
      toast.error(`Failed to update order: ${error.message}`);
    }
  };

  // ─── Auth functions ──────────────────────────────────────
  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message === 'Invalid login credentials'
        ? 'Email ya password galat hai!'
        : error.message);
      return false;
    }
    if (data.user) {
      toast.success('Login successful! 🌱');
      // Store login history in Supabase
      await supabase.from('login_history').insert({
        user_id: data.user.id,
        email: email,
      });
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, password: string, phone: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone } },
    });

    if (error) {
      toast.error(error.message);
      return false;
    }
    if (data.user) {
      toast.success('Account create ho gaya! Welcome 🌿');
      // Create Customer Master Record
      await supabase.from('customers').insert({
        id: data.user.id,
        full_name: name,
        email: email,
        phone: phone,
      });
      return true;
    }
    return false;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    toast.info('Logged out successfully');
  };

  // ─── Computed values ─────────────────────────────────────
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        user,
        login,
        signup,
        logout,
        orders,
        addOrder,
        updateOrderStatus,
        quickViewProduct,
        setQuickViewProduct,
        isAuthLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
import { supabase } from '../../lib/supabase';
import { Order, User } from '../context/AppContext';

const MOCK_ORDERS: Order[] = [
  { id: 'ORD-101', date: 'Apr 25, 2026', total: 1898, status: 'delivered', items: [{ id: 'p1', name: 'Premium Monstera', image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800', price: 1299, quantity: 1 }] },
  { id: 'ORD-102', date: 'Apr 26, 2026', total: 599, status: 'processing', items: [{ id: 'p2', name: 'Snake Plant', image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bac?w=800', price: 599, quantity: 1 }] },
  { id: 'ORD-103', date: 'Apr 27, 2026', total: 2450, status: 'shipped', items: [{ id: 'p5', name: 'Ceramic Planter', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800', price: 1200, quantity: 2 }] },
  { id: 'ORD-104', date: 'Apr 28, 2026', total: 3500, status: 'delivered', items: [{ id: 'p1', name: 'Premium Monstera', image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800', price: 1299, quantity: 2 }] },
  { id: 'ORD-105', date: 'Apr 29, 2026', total: 1299, status: 'pending', items: [{ id: 'p1', name: 'Premium Monstera', image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800', price: 1299, quantity: 1 }] },
  { id: 'ORD-106', date: 'Apr 30, 2026', total: 899, status: 'delivered', items: [{ id: 'p3', name: 'Desert Rose', image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800', price: 899, quantity: 1 }] },
  { id: 'ORD-107', date: 'Apr 30, 2026', total: 1200, status: 'processing', items: [{ id: 'p5', name: 'Ceramic Planter', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800', price: 1200, quantity: 1 }] },
];

const MOCK_CUSTOMERS = [
  { id: 'c1', name: 'Priya Sharma', email: 'priya@example.com', phone: '9876543210', orders: 12, totalSpent: 15400 },
  { id: 'c2', name: 'Rahul Verma', email: 'rahul@example.com', phone: '9876543211', orders: 8, totalSpent: 8900 },
  { id: 'c3', name: 'Anjali Desai', email: 'anjali@example.com', phone: '9876543212', orders: 5, totalSpent: 12450 },
  { id: 'c4', name: 'Vikram Singh', email: 'vikram@example.com', phone: '9876543213', orders: 3, totalSpent: 3500 },
  { id: 'c5', name: 'Sonia Gupta', email: 'sonia@example.com', phone: '9876543214', orders: 2, totalSpent: 1299 },
];

export async function fetchAllOrders(): Promise<Order[]> {
  try {
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('date', { ascending: false });

    if (ordersError || !ordersData || ordersData.length === 0) return MOCK_ORDERS;

    const ordersWithItems = await Promise.all(
      (ordersData ?? []).map(async (order: any) => {
        const { data: itemsData } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id);

        const items = (itemsData ?? []).map((item: any) => ({
          id: item.product_id,
          name: item.product_name,
          image: item.product_image,
          price: item.price,
          quantity: item.quantity,
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

    return ordersWithItems;
  } catch {
    return MOCK_ORDERS;
  }
}

export async function fetchAllCustomers() {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*');

    if (error || !data || data.length === 0) return MOCK_CUSTOMERS;

    const customersWithStats = await Promise.all(
      (data ?? []).map(async (customer: any) => {
        const { count } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', customer.id);

        const { data: orderSums } = await supabase
          .from('orders')
          .select('total')
          .eq('user_id', customer.id);

        const totalSpent = (orderSums ?? []).reduce((sum, o) => sum + o.total, 0);

        return {
          id: customer.id,
          name: customer.full_name,
          email: customer.email,
          phone: customer.phone,
          orders: count ?? 0,
          totalSpent: totalSpent,
        };
      })
    );

    return customersWithStats;
  } catch {
    return MOCK_CUSTOMERS;
  }
}

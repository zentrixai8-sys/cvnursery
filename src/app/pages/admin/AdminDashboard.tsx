import { motion } from 'motion/react';
import { Link } from 'react-router';
import { LayoutDashboard, Package, ShoppingBag, Users, TrendingUp, DollarSign, ShoppingCart, Eye, Activity, BarChart3, PieChart } from 'lucide-react';
import { fetchProducts } from '../../data/products';
import { useApp } from '../../context/AppContext';
import { useState, useEffect } from 'react';
import { Product } from '../../context/AppContext';

export function AdminDashboard() {
  const { orders } = useApp();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const avgOrderValue = orders.length > 0 ? (totalRevenue / orders.length).toFixed(0) : 0;
  
  const today = new Date().toDateString();
  const todaySales = orders
    .filter(order => new Date(order.date).toDateString() === today)
    .reduce((sum, order) => sum + order.total, 0);

  const stats = [
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
      change: '+18%',
    },
    {
      label: 'Today\'s Sales',
      value: `₹${todaySales.toLocaleString()}`,
      icon: Activity,
      color: 'from-green-500 to-green-600',
      change: 'Active',
    },
    {
      label: 'Total Orders',
      value: orders.length,
      icon: ShoppingBag,
      color: 'from-blue-500 to-blue-600',
      change: '+23%',
    },
    {
      label: 'Avg Order Value',
      value: `₹${avgOrderValue.toLocaleString()}`,
      icon: BarChart3,
      color: 'from-orange-500 to-orange-600',
      change: '+5%',
    },
  ];

  // Category sales calc
  const categorySales: Record<string, number> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      const category = item.category || 'Other';
      categorySales[category] = (categorySales[category] || 0) + (item.price * item.quantity);
    });
  });

  const topCategories = Object.entries(categorySales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  const maxCategorySales = topCategories.length > 0 ? topCategories[0][1] : 1;

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100 via-stone-50 to-teal-100 overflow-hidden relative">
      {/* Decorative Orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-400/20 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Admin Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/60 border-b border-white/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--nature-green)] to-[var(--nature-green-light)] rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">CV Nursery Management</p>
              </div>
            </div>
            <Link to="/" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Back to Site
            </Link>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <Link to="/admin">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-xl shadow-emerald-500/30 rounded-2xl font-bold whitespace-nowrap"
            >
              Dashboard
            </motion.div>
          </Link>
          <Link to="/admin/products">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white/60 backdrop-blur-md border border-white/40 shadow-lg rounded-2xl hover:bg-white/80 transition-all font-medium text-gray-700 whitespace-nowrap"
            >
              Products
            </motion.div>
          </Link>
          <Link to="/admin/orders">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white/60 backdrop-blur-md border border-white/40 shadow-lg rounded-2xl hover:bg-white/80 transition-all font-medium text-gray-700 whitespace-nowrap"
            >
              Orders
            </motion.div>
          </Link>
          <Link to="/admin/billing">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white/60 backdrop-blur-md border border-white/40 shadow-lg rounded-2xl hover:bg-white/80 transition-all font-medium text-gray-700 whitespace-nowrap"
            >
              Billing POS
            </motion.div>
          </Link>
          <Link to="/admin/customers">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white/60 backdrop-blur-md border border-white/40 shadow-lg rounded-2xl hover:bg-white/80 transition-all font-medium text-gray-700 whitespace-nowrap"
            >
              Customers
            </motion.div>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1, type: "spring", bounce: 0.4 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative bg-white/40 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 border border-white/60 overflow-hidden group"
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br from-white/40 to-white/0 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl shadow-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300`}>
                  <stat.icon className="w-7 h-7 text-white drop-shadow-md" />
                </div>
                <span className="text-sm font-bold text-emerald-700 bg-emerald-100/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                  {stat.change}
                </span>
              </div>
              <p className="text-gray-500 font-medium text-sm mb-1 relative z-10">{stat.label}</p>
              <p className="text-4xl font-black text-gray-900 tracking-tight relative z-10">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Top Categories */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 lg:col-span-1 border border-white/60"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg flex items-center justify-center">
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Top Categories</h2>
            </div>
            
            <div className="space-y-6">
              {topCategories.length > 0 ? topCategories.map(([category, amount], index) => (
                <div key={category} className="group cursor-pointer">
                  <div className="flex justify-between text-base mb-2">
                    <span className="font-semibold text-gray-700 group-hover:text-amber-600 transition-colors">{category}</span>
                    <span className="font-bold text-amber-600">₹{amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-white/50 backdrop-blur-sm rounded-full h-3 overflow-hidden shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(amount / maxCategorySales) * 100}%` }}
                      transition={{ duration: 1.5, delay: 0.2 + index * 0.1, type: "spring", bounce: 0.2 }}
                      className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </motion.div>
                  </div>
                </div>
              )) : (
                <div className="text-gray-400 text-center py-8 font-medium">No order data yet</div>
              )}
            </div>
          </motion.div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, type: "spring", delay: 0.2 }}
            className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 lg:col-span-2 border border-white/60"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
              <Link to="/admin/orders" className="text-emerald-600 font-bold hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl transition-colors">
                View All
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200/50">
                      <th className="text-left py-4 px-4 font-bold text-gray-500 uppercase tracking-wider text-sm">Order ID</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-500 uppercase tracking-wider text-sm">Date</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-500 uppercase tracking-wider text-sm">Items</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-500 uppercase tracking-wider text-sm">Total</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-500 uppercase tracking-wider text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100/50 hover:bg-white/50 transition-colors group cursor-pointer">
                        <td className="py-4 px-4 font-bold text-gray-800">#{order.id.slice(0, 8)}</td>
                        <td className="py-4 px-4 text-gray-600 font-medium">{order.date}</td>
                        <td className="py-4 px-4 text-gray-600 font-medium">{order.items.length} items</td>
                        <td className="py-4 px-4 font-black text-emerald-600">₹{order.total}</td>
                        <td className="py-4 px-4">
                          <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-700 border border-blue-200'
                              : order.status === 'processing'
                              ? 'bg-amber-100 text-amber-700 border border-amber-200'
                              : 'bg-orange-100 text-orange-700 border border-orange-200'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400 font-medium">
                No orders yet
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

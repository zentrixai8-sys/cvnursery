import { motion } from 'motion/react';
import { Link } from 'react-router';
import { LayoutDashboard, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useState } from 'react';

export function AdminOrders() {
  const { orders, updateOrderStatus } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--nature-green)] to-[var(--nature-green-light)] rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Order Management</h1>
                <p className="text-sm text-muted-foreground">Manage all orders</p>
              </div>
            </div>
            <Link to="/" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Back to Site
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <Link to="/admin">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-white border border-border rounded-lg hover:bg-muted transition-colors whitespace-nowrap"
            >
              Dashboard
            </motion.div>
          </Link>
          <Link to="/admin/products">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-white border border-border rounded-lg hover:bg-muted transition-colors whitespace-nowrap"
            >
              Products
            </motion.div>
          </Link>
          <Link to="/admin/orders">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg whitespace-nowrap"
            >
              Orders
            </motion.div>
          </Link>
          <Link to="/admin/billing">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-white border border-border rounded-lg hover:bg-muted transition-colors whitespace-nowrap"
            >
              Billing POS
            </motion.div>
          </Link>
          <Link to="/admin/customers">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-white border border-border rounded-lg hover:bg-muted transition-colors whitespace-nowrap"
            >
              Customers
            </motion.div>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders by ID..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium">Order ID</th>
                    <th className="text-left py-4 px-6 font-medium">Date</th>
                    <th className="text-left py-4 px-6 font-medium">Items</th>
                    <th className="text-left py-4 px-6 font-medium">Total</th>
                    <th className="text-left py-4 px-6 font-medium">Status</th>
                    <th className="text-left py-4 px-6 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6 font-medium">#{order.id}</td>
                      <td className="py-4 px-6">{order.date}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span>{order.items.length} items</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold text-primary">₹{order.total}</td>
                      <td className="py-4 px-6">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className="px-3 py-1 rounded-full text-sm font-medium border-0 bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                        >
                          View Details
                        </motion.button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No orders found</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

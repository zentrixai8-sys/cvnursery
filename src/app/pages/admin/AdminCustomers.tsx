import { motion } from 'motion/react';
import { Link } from 'react-router';
import { LayoutDashboard, Search, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

export function AdminCustomers() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock customer data
  const customers = [
    { id: '1', name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 9876543210', orders: 12, totalSpent: 15420 },
    { id: '2', name: 'Rahul Verma', email: 'rahul@example.com', phone: '+91 9876543211', orders: 8, totalSpent: 9850 },
    { id: '3', name: 'Anjali Desai', email: 'anjali@example.com', phone: '+91 9876543212', orders: 15, totalSpent: 22300 },
    { id: '4', name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 9876543213', orders: 5, totalSpent: 6200 },
  ];

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
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
                <h1 className="text-2xl font-bold">Customer Management</h1>
                <p className="text-sm text-muted-foreground">View and manage customers</p>
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
              className="px-6 py-3 bg-white border border-border rounded-lg hover:bg-muted transition-colors whitespace-nowrap"
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
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg whitespace-nowrap"
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
              placeholder="Search customers..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCustomers.map((customer, index) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--nature-green)] to-[var(--nature-green-light)] rounded-full flex items-center justify-center text-white font-bold">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{customer.name}</h3>
                    <p className="text-sm text-muted-foreground">ID: {customer.id}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{customer.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-xl font-bold">{customer.orders}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-xl font-bold text-primary">₹{customer.totalSpent}</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              >
                View Details
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

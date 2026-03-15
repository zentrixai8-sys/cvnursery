import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Package, Heart, LogOut, ShoppingBag, Star, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate, useSearchParams } from 'react-router';
import { ProductCard } from '../components/ProductCard';

export function DashboardPage() {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'profile');
  const { user, logout, orders, wishlist, removeFromWishlist } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">My Account</h1>
          <p className="text-muted-foreground">Manage your profile, orders, and wishlist</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center mb-6 pb-6 border-b border-border">
                <div className="w-20 h-20 bg-gradient-to-br from-[var(--nature-green)] to-[var(--nature-green-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-bold text-lg">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </motion.button>
                ))}

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </motion.button>
              </nav>
            </div>
          </motion.div>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        value={user.name}
                        readOnly
                        className="w-full px-4 py-3 bg-muted rounded-xl border border-border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address</label>
                      <input
                        type="email"
                        value={user.email}
                        readOnly
                        className="w-full px-4 py-3 bg-muted rounded-xl border border-border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={user.phone}
                        readOnly
                        className="w-full px-4 py-3 bg-muted rounded-xl border border-border"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
                    >
                      Edit Profile
                    </motion.button>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Order History</h2>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-border rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="font-bold">Order #{order.id}</p>
                              <p className="text-sm text-muted-foreground">{order.date}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                          <div className="space-y-3 mb-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-4">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-bold">₹{item.price * item.quantity}</p>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t border-border">
                            <span className="font-bold">Total</span>
                            <span className="text-xl font-bold text-primary">₹{order.total}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">No orders yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Start shopping to see your orders here
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/shop')}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
                      >
                        Start Shopping
                      </motion.button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
                  {wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlist.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
                      <p className="text-muted-foreground mb-6">
                        Save your favorite plants to your wishlist
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/shop')}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
                      >
                        Browse Plants
                      </motion.button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

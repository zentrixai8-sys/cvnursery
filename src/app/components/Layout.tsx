import { Outlet, Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Heart, User, Menu, X, Leaf, Search, Phone, Mail } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, user, logout } = useApp();
  const location = useLocation();

  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-[var(--glass-border)] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="border-b border-border/50 py-2 hidden md:flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-muted-foreground">
              <a href="tel:+917089935022" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                <span>+91 7089935022</span>
              </a>
              <a href="mailto:demo@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                <span>demo@gmail.com</span>
              </a>
            </div>
            <div className="text-muted-foreground">
              Free delivery on orders above ₹999
            </div>
          </div>

          {/* Main Header */}
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--nature-green)] to-[var(--nature-green-light)] flex items-center justify-center"
              >
                <Leaf className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[var(--nature-green)] to-[var(--nature-green-light)] bg-clip-text text-transparent">
                CV Nursery
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/shop">Shop</NavLink>
              <NavLink to="/dashboard">My Account</NavLink>
              {user?.email === 'zentrix.ai8@gmail.com' && (
                <Link to="/admin" className="px-3 py-1 bg-primary/10 text-primary font-medium rounded-full hover:bg-primary/20 transition-colors">
                  Admin Panel
                </Link>
              )}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Search className="w-5 h-5" />
              </motion.button>
              
              <Link to="/dashboard?tab=wishlist">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <Heart className="w-5 h-5" />
                </motion.button>
              </Link>

              <Link to="/cart" className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </motion.button>
              </Link>

              {user ? (
                <div className="flex items-center gap-2">
                  <Link to="/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>{user.name.split(' ')[0]}</span>
                    </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={logout}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    Logout
                  </motion.button>
                </div>
              ) : (
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Login</span>
                  </motion.button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border bg-white"
            >
              <div className="px-4 py-4 space-y-4">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-lg hover:text-primary transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-lg hover:text-primary transition-colors"
                >
                  Shop
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-lg hover:text-primary transition-colors"
                >
                  My Account
                </Link>
                {user?.email === 'zentrix.ai8@gmail.com' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-lg text-primary font-medium hover:text-primary/80 transition-colors border-l-2 border-primary pl-2"
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-lg hover:text-primary transition-colors"
                >
                  Cart ({cartCount})
                </Link>
                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 px-4 bg-muted rounded-lg text-left"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 px-4 bg-primary text-primary-foreground rounded-lg text-center"
                  >
                    Login
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[var(--nature-green)] text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Leaf className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold">CV Nursery</span>
              </div>
              <p className="text-white/80 mb-4">
                Your trusted source for fresh, healthy plants delivered to your doorstep.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/shop" className="text-white/80 hover:text-white transition-colors">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-white/80 hover:text-white transition-colors">
                    My Account
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="text-white/80 hover:text-white transition-colors">
                    Cart
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Categories</h3>
              <ul className="space-y-2">
                <li className="text-white/80">Indoor Plants</li>
                <li className="text-white/80">Outdoor Plants</li>
                <li className="text-white/80">Flower Plants</li>
                <li className="text-white/80">Pots & Accessories</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-white/80">
                  <Phone className="w-4 h-4" />
                  <span>+91 7089935022</span>
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <Mail className="w-4 h-4" />
                  <span>demo@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/80">
            <p>&copy; 2026 CV Nursery. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className="relative group">
      <span className={`${isActive ? 'text-primary' : 'text-foreground'} hover:text-primary transition-colors`}>
        {children}
      </span>
      {isActive && (
        <motion.div
          layoutId="activeNav"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
        />
      )}
    </Link>
  );
}

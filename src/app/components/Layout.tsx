import { Outlet, Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Heart, User, Menu, X, Leaf, Search, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, user, logout } = useApp();
  const location = useLocation();
  const [navbarVisible, setNavbarVisible] = useState(location.pathname !== '/');

  const isAdmin = location.pathname.startsWith('/admin');
  const isHome = location.pathname === '/';

  // Show/hide navbar based on scroll position on homepage
  useEffect(() => {
    if (!isHome) {
      setNavbarVisible(true);
      return;
    }

    setNavbarVisible(false);

    const handleScroll = () => {
      // The hero section is 400vh. We want the navbar to appear
      // once the user scrolls past it. Calculate the threshold.
      const heroHeight = window.innerHeight * 4; // 400vh
      const scrolled = window.scrollY;
      setNavbarVisible(scrolled >= heroHeight - 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // check initial

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  if (isAdmin) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/70 border-b border-emerald-100/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)] transition-transform duration-500 ease-out"
        style={{ transform: navbarVisible ? 'translateY(0)' : 'translateY(-100%)' }}
      >
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
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="w-10 h-10 rounded-full overflow-hidden"
              >
                <img src="https://i.ibb.co/PvL2jHzk/CV-Nursery-logo-design.png" alt="CV Nursery" className="w-full h-full object-cover" />
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

      {/* Premium Footer */}
      <footer className="bg-gradient-to-b from-emerald-950 to-gray-950 text-white relative overflow-hidden">
        {/* Decorative top border */}
        <div className="h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        
        {/* Decorative blur orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-600/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-600/5 rounded-full blur-[100px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
            {/* Brand Column */}
            <div className="md:col-span-4">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-full overflow-hidden shadow-lg shadow-emerald-500/20">
                  <img src="https://i.ibb.co/PvL2jHzk/CV-Nursery-logo-design.png" alt="CV Nursery" className="w-full h-full object-cover" />
                </div>
                <span className="text-2xl font-black tracking-tight">CV Nursery</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
                Bringing nature closer to you since 2016. Premium plants, curated with love and delivered with care to your doorstep.
              </p>
              {/* Social Icons */}
              <div className="flex gap-3">
                <a href="https://www.instagram.com/cv_nursery?igsh=MTdjcXJ1c20wN3dhNg%3D%3D" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:border-pink-500 transition-all duration-300 group">
                  <Instagram className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 group">
                  <Facebook className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-sky-500 hover:border-sky-500 transition-all duration-300 group">
                  <Twitter className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-2">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-5">Quick Links</h3>
              <ul className="space-y-3">
                {[{ to: '/shop', label: 'Shop' }, { to: '/dashboard', label: 'My Account' }, { to: '/cart', label: 'Cart' }].map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-white/50 hover:text-emerald-400 transition-colors text-sm flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-emerald-600 group-hover:bg-emerald-400 transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div className="md:col-span-3">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-5">Categories</h3>
              <ul className="space-y-3">
                {['Indoor Plants', 'Outdoor Plants', 'Flower Plants', 'Seeds & Fertilizers', 'Pots & Planters'].map((cat) => (
                  <li key={cat}>
                    <Link to="/shop" className="text-white/50 hover:text-emerald-400 transition-colors text-sm flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-emerald-600 group-hover:bg-emerald-400 transition-colors" />
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="md:col-span-3">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-5">Get in Touch</h3>
              <ul className="space-y-4">
                <li>
                  <a href="tel:+917089935022" className="flex items-center gap-3 text-white/50 hover:text-emerald-400 transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm block">+91 7089935022</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="mailto:demo@gmail.com" className="flex items-center gap-3 text-white/50 hover:text-emerald-400 transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm block">demo@gmail.com</span>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/5 mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs tracking-wide">&copy; 2026 CV Nursery. Crafted with 🌿 for plant lovers.</p>
            <div className="flex gap-6">
              {['Privacy Policy', 'Terms of Service', 'Shipping Info'].map((item) => (
                <a key={item} href="#" className="text-white/30 text-xs hover:text-emerald-400 transition-colors">{item}</a>
              ))}
            </div>
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

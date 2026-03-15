import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { LayoutDashboard, Plus, Trash2, FileText, Search, Receipt } from 'lucide-react';
import { fetchProducts } from '../../data/products';
import { Product, CartItem } from '../../context/AppContext';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';

export function AdminBilling() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToBill = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} added to bill`);
  };

  const removeFromBill = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) { removeFromBill(productId); return; }
    setCart((prev) => prev.map((item) => item.id === productId ? { ...item, quantity } : item));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.18; // 18% GST example
  const total = Math.round(subtotal + tax);

  const handleGenerateBill = async () => {
    if (cart.length === 0) {
      toast.error('Add items to the bill first');
      return;
    }
    setIsGenerating(true);
    try {
      const orderId = `BILL-${Date.now().toString().slice(-6)}`;
      const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      
      const { error: orderError } = await supabase.from('orders').insert({
        id: orderId,
        user_id: null, // POS bill
        date: date,
        total: total,
        status: 'delivered', // Delivered instantly
      });

      if (orderError) throw orderError;

      const orderItems = cart.map((item) => ({
        id: `${orderId}_${item.id}`,
        order_id: orderId,
        product_id: item.id,
        product_name: item.name,
        product_image: item.image,
        price: item.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      toast.success(`Bill Generated Successfully! Invoice ID: ${orderId}`);
      setCart([]);
      setCustomerInfo({ name: '', phone: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate bill');
    } finally {
      setIsGenerating(false);
    }
  };

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
                <h1 className="text-2xl font-bold">POS Billing</h1>
                <p className="text-sm text-muted-foreground">Generate Customer Invoices</p>
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
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-6 py-3 bg-white border border-border rounded-lg hover:bg-muted transition-colors whitespace-nowrap">
              Dashboard
            </motion.div>
          </Link>
          <Link to="/admin/products">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-6 py-3 bg-white border border-border rounded-lg hover:bg-muted transition-colors whitespace-nowrap">
              Products
            </motion.div>
          </Link>
          <Link to="/admin/orders">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-6 py-3 bg-white border border-border rounded-lg hover:bg-muted transition-colors whitespace-nowrap">
              Orders
            </motion.div>
          </Link>
          <Link to="/admin/billing">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg whitespace-nowrap">
              Billing POS
            </motion.div>
          </Link>
          <Link to="/admin/customers">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-6 py-3 bg-white border border-border rounded-lg hover:bg-muted transition-colors whitespace-nowrap">
              Customers
            </motion.div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Product Selector */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-border">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products to add to bill..."
                  className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => addToBill(product)}
                    className="border border-border rounded-xl p-3 cursor-pointer hover:border-primary transition-colors flex flex-col items-center text-center"
                  >
                    <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg mb-3" />
                    <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                    <p className="font-bold text-primary text-sm mt-1">₹{product.price}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Invoice Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-border sticky top-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                <Receipt className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold">Current Bill</h2>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <input
                    type="text"
                    placeholder="Customer Name (Optional)"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Customer Phone (Optional)"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="max-h-[300px] overflow-y-auto mb-6 space-y-3">
                {cart.length === 0 ? (
                  <p className="text-center text-muted-foreground text-sm py-8">Bill is empty</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{item.name}</span>
                        <span className="text-muted-foreground text-xs">₹{item.price} x {item.quantity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-muted rounded-lg">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-sm hover:text-primary">-</button>
                          <span className="text-sm w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-sm hover:text-primary">+</button>
                        </div>
                        <button onClick={() => removeFromBill(item.id)} className="p-1 text-destructive hover:bg-destructive/10 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-3 pt-4 border-t border-border mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                  <span>Grand Total</span>
                  <span className="text-primary">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={cart.length === 0 || isGenerating}
                onClick={handleGenerateBill}
                className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                <FileText className="w-5 h-5" />
                {isGenerating ? 'Generating...' : 'Generate Bill'}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

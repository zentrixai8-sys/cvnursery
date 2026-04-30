import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, FileText, Search, Receipt, Plus, Minus, User, Phone, ShoppingBag, ArrowRight, Play, CreditCard, Save, X, CheckCircle2, DollarSign, Wallet, Clock } from 'lucide-react';
import { fetchProducts } from '../../data/products';
import { Product, CartItem } from '../../context/AppContext';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';
import { AdminLayout } from '../../components/AdminLayout';

export function AdminBilling() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Payment Module State
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'MIXED' | 'PENDING'>('CASH');
  const [isPartPayment, setIsPartPayment] = useState(false);
  const [cashPart, setCashPart] = useState(0);
  const [upiPart, setUpiPart] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState(0);

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
  };

  const removeFromBill = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) { removeFromBill(productId); return; }
    setCart((prev) => prev.map((item) => item.id === productId ? { ...item, quantity } : item));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.round(subtotal);

  const isSplitBalanced = (cashPart + upiPart) === total;

  const handleCompleteTransaction = async () => {
    if (cart.length === 0) {
      toast.error('Add items first');
      return;
    }
    setIsGenerating(true);
    try {
      const orderId = `BILL-${Date.now().toString().slice(-6)}`;
      
      // Calculate received and pending amounts based on module selection
      let finalReceived = total;
      let finalPending = 0;
      
      if (isPartPayment) {
        finalReceived = receivedAmount;
        finalPending = total - receivedAmount;
      } else if (paymentMethod === 'PENDING') {
        finalReceived = 0;
        finalPending = total;
      }

      const { error: orderError } = await supabase.from('orders').insert({
        id: orderId,
        customer_name: customerInfo.name || 'Walk-in Client',
        customer_phone: customerInfo.phone || '0000000000',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        total: total,
        status: finalPending > 0 ? 'part_paid' : 'delivered',
        payment_method: paymentMethod,
        is_part_payment: isPartPayment,
        received_amount: finalReceived,
        pending_amount: finalPending
      });
      if (orderError) throw orderError;
      
      toast.success(finalPending > 0 ? `Order Saved! Pending: ₹${finalPending}` : 'Transaction Completed! 🧾');
      setCart([]);
      setCustomerInfo({ name: '', phone: '' });
      setIsPaymentOpen(false);
      // Reset payment states
      setPaymentMethod('CASH');
      setIsPartPayment(false);
      setCashPart(0);
      setUpiPart(0);
      setReceivedAmount(0);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AdminLayout title="POS Terminal">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
        
        {/* Product Selection (Main View) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">Terminal</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Instant transactional interface</p>
            </div>
            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-white flex items-center gap-4">
               <div className="text-right">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Bill</p>
                  <p className="text-sm font-black text-indigo-600">₹{total.toLocaleString()}</p>
               </div>
               <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
               </div>
            </div>
          </div>

          {/* Compact Search */}
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-white/60">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assets to add..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm"
              />
            </div>
          </div>

          {/* Compact Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -4 }}
                onClick={() => addToBill(product)}
                className="bg-white rounded-3xl p-4 shadow-sm border border-white group cursor-pointer hover:border-indigo-200 transition-all flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden mb-3 shadow-md">
                   <img src={product.image} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-[10px] font-bold text-slate-900 leading-tight mb-1">{product.name}</h3>
                <p className="text-xs font-black text-indigo-600">₹{product.price}</p>
                <div className="mt-3 w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                   <Plus className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar: Cart & Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Context */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-white">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5" />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-slate-900">Client Context</h4>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Identify your buyer</p>
               </div>
            </div>
            <div className="space-y-3">
               <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Client Name" 
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-xs font-bold outline-none" 
                  />
               </div>
               <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Contact Number" 
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-xs font-bold outline-none" 
                  />
               </div>
            </div>
          </div>

          {/* Active Bill List */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-white flex flex-col h-[500px]">
            <div className="flex justify-between items-center mb-6">
               <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-indigo-600" /> Itemized Bill
               </h4>
               <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[8px] font-black uppercase tracking-widest">{cart.length} SKU</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl overflow-hidden shrink-0">
                     <img src={item.image} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-slate-900 leading-tight">{item.name}</p>
                    <p className="text-[10px] font-black text-indigo-600">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-1 px-2">
                     <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="hover:text-rose-500 transition-colors"><Minus className="w-3 h-3" /></button>
                     <span className="text-[10px] font-bold min-w-[20px] text-center">{item.quantity}</span>
                     <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="hover:text-emerald-500 transition-colors"><Plus className="w-3 h-3" /></button>
                  </div>
                  <button onClick={() => removeFromBill(item.id)} className="w-8 h-8 bg-white border border-slate-100 rounded-lg flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 text-rose-500 transition-all">
                     <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-20">
                   <Receipt className="w-12 h-12 mb-4" />
                   <p className="text-[10px] font-black uppercase tracking-[0.3em]">Empty Terminal</p>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-50 space-y-4">
               <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Due</p>
                  <p className="text-2xl font-black text-[#1A1A1A]">₹{total.toLocaleString()}</p>
               </div>
               <button 
                 onClick={() => cart.length > 0 && setIsPaymentOpen(true)}
                 disabled={cart.length === 0}
                 className="w-full py-4 bg-[#1A1A1A] text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 hover:bg-indigo-600 transition-all active:scale-95"
               >
                 Go to Payment <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- PAYMENT MODULE MODAL --- */}
      <AnimatePresence>
        {isPaymentOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsPaymentOpen(false)}
               className="absolute inset-0 bg-[#FDFCF0]/80 backdrop-blur-xl"
             />
             
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="bg-white w-full max-w-md rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border border-white overflow-hidden relative z-10"
             >
                {/* Modal Header */}
                <div className="p-10 pb-6 flex items-center gap-4 bg-emerald-50/30">
                   <div className="w-14 h-14 bg-emerald-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-emerald-200">
                      <CreditCard className="w-7 h-7" />
                   </div>
                   <h2 className="text-3xl font-bold tracking-tight text-slate-900">Payment</h2>
                   <button 
                     onClick={() => setIsPaymentOpen(false)}
                     className="ml-auto w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-all shadow-sm"
                   >
                      <X className="w-4 h-4" />
                   </button>
                </div>

                <div className="p-10 space-y-8">
                   {/* TOTAL AMOUNT BENTO */}
                   <div className="bg-white rounded-[2.5rem] p-10 border-2 border-emerald-100 shadow-sm text-center space-y-4">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Total Bill Amount</p>
                      <div className="flex items-center justify-center gap-4">
                         <span className="text-4xl font-black text-emerald-600 italic">₹</span>
                         <h1 className="text-7xl font-black tracking-tighter text-slate-900 leading-none">{total}</h1>
                      </div>
                      <div className="w-full h-1.5 bg-emerald-500 rounded-full" />
                   </div>

                   {/* PART PAYMENT TOGGLE */}
                   <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Part Payment?</p>
                      <button 
                        onClick={() => setIsPartPayment(!isPartPayment)}
                        className={`w-14 h-8 rounded-full transition-all relative ${isPartPayment ? 'bg-indigo-600' : 'bg-slate-200'}`}
                      >
                         <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${isPartPayment ? 'right-1' : 'left-1'}`} />
                      </button>
                   </div>

                   <AnimatePresence>
                     {isPartPayment && (
                       <motion.div 
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: 'auto', opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         className="overflow-hidden space-y-4"
                       >
                          <div className="grid grid-cols-2 gap-4">
                             <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                                <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-1">Received</p>
                                <div className="flex items-center gap-2">
                                   <span className="text-emerald-500 font-bold">₹</span>
                                   <input 
                                     type="number" 
                                     value={receivedAmount}
                                     onChange={(e) => setReceivedAmount(Number(e.target.value))}
                                     className="bg-transparent text-2xl font-black text-emerald-700 outline-none w-full" 
                                   />
                                </div>
                                <div className="w-full h-0.5 bg-emerald-200 mt-1" />
                             </div>
                             <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100">
                                <p className="text-[8px] font-black text-rose-600 uppercase tracking-widest mb-1">Pending</p>
                                <div className="flex items-center gap-2">
                                   <span className="text-rose-500 font-bold">₹</span>
                                   <span className="text-2xl font-black text-rose-700">{total - receivedAmount}</span>
                                </div>
                             </div>
                          </div>
                       </motion.div>
                     )}
                   </AnimatePresence>

                   {/* MIXED PAYMENT INPUTS */}
                   <AnimatePresence>
                     {paymentMethod === 'MIXED' && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden space-y-4"
                        >
                           <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white p-6 rounded-3xl border-2 border-emerald-50 shadow-sm">
                                 <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-1">Cash Part</p>
                                 <div className="flex items-center gap-2">
                                    <span className="text-emerald-500 font-bold">₹</span>
                                    <input 
                                      type="number" 
                                      value={cashPart}
                                      onChange={(e) => setCashPart(Number(e.target.value))}
                                      className="bg-transparent text-2xl font-black text-slate-800 outline-none w-full" 
                                    />
                                 </div>
                                 <div className="w-full h-0.5 bg-emerald-400 mt-1" />
                              </div>
                              <div className="bg-white p-6 rounded-3xl border-2 border-indigo-50 shadow-sm">
                                 <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest mb-1">UPI Part</p>
                                 <div className="flex items-center gap-2">
                                    <span className="text-indigo-500 font-bold">₹</span>
                                    <input 
                                      type="number" 
                                      value={upiPart}
                                      onChange={(e) => setUpiPart(Number(e.target.value))}
                                      className="bg-transparent text-2xl font-black text-slate-800 outline-none w-full" 
                                    />
                                 </div>
                                 <div className="w-full h-0.5 bg-indigo-400 mt-1" />
                              </div>
                           </div>
                           {isSplitBalanced ? (
                              <div className="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest">
                                 <CheckCircle2 className="w-3 h-3" /> Split Balanced Correctly
                              </div>
                           ) : (
                              <div className="text-center text-rose-500 text-[8px] font-black uppercase tracking-widest">
                                 Difference: ₹{total - (cashPart + upiPart)}
                              </div>
                           )}
                        </motion.div>
                     )}
                   </AnimatePresence>

                   {/* PAYMENT METHOD SELECTOR */}
                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Payment Method</p>
                      <div className="grid grid-cols-2 gap-4">
                         {[
                           { id: 'CASH', icon: DollarSign, label: 'Cash', color: 'emerald' },
                           { id: 'UPI', icon: Wallet, label: 'UPI', color: 'indigo' },
                           { id: 'MIXED', icon: RefreshCw, label: 'Mixed / Split', color: 'amber' },
                           { id: 'PENDING', icon: Clock, label: 'Pending', color: 'slate' }
                         ].map((method) => (
                           <button 
                             key={method.id}
                             onClick={() => setPaymentMethod(method.id as any)}
                             className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all group ${
                               paymentMethod === method.id 
                               ? `bg-${method.color}-500 border-${method.color}-500 text-white shadow-xl shadow-${method.color}-100` 
                               : `bg-white border-slate-50 text-slate-400 hover:border-${method.color}-200`
                             }`}
                           >
                              <method.icon className={`w-5 h-5 ${paymentMethod === method.id ? 'text-white' : `text-${method.color}-500`}`} />
                              <span className="text-[10px] font-black uppercase tracking-widest">{method.label}</span>
                           </button>
                         ))}
                      </div>
                   </div>

                   {/* COMPLETE TRANSACTION BUTTON */}
                   <button 
                     onClick={handleCompleteTransaction}
                     disabled={isGenerating || (paymentMethod === 'MIXED' && !isSplitBalanced)}
                     className="w-full py-10 bg-indigo-600 text-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(79,70,229,0.3)] flex flex-col items-center justify-center gap-2 group hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                   >
                      <Save className="w-8 h-8 mb-2 group-hover:scale-125 transition-transform" />
                      <span className="text-xl font-black uppercase tracking-[0.2em]">Complete Transaction</span>
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

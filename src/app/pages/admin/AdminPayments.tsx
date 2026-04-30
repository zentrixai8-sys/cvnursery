import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, ArrowUpRight, Search, Filter, CheckCircle2, Clock, AlertCircle, DollarSign, ArrowRight, Phone, User, Calendar, MessageSquare, History, X, Save } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { fetchAllOrders } from '../../data/admin';
import { toast } from 'sonner';

// Mock data for initial view
const MOCK_PENDING_ORDERS = [
  { id: 'BILL-8821', customer_name: 'Rajesh Kumar', customer_phone: '9876543210', total: 12500, received_amount: 5000, pending_amount: 7500, date: 'April 28, 2026', status: 'part_paid' },
  { id: 'BILL-8845', customer_name: 'Anita Singh', customer_phone: '9988776655', total: 4500, received_amount: 2000, pending_amount: 2500, date: 'April 29, 2026', status: 'part_paid' },
  { id: 'BILL-8902', customer_name: 'Vikram Mehta', customer_phone: '9122334455', total: 18000, received_amount: 0, pending_amount: 18000, date: 'April 30, 2026', status: 'part_paid' },
  { id: 'BILL-8910', customer_name: 'Suresh Raina', customer_phone: '8877665544', total: 3200, received_amount: 1500, pending_amount: 1700, date: 'April 30, 2026', status: 'part_paid' },
];

export function AdminPayments() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Payment Collection State
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [collectionAmount, setCollectionAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchAllOrders().then(data => {
      // Merge live data with mock data for demonstration
      const livePending = data.filter((o: any) => o.pending_amount > 0 || o.status === 'part_paid');
      setOrders([...livePending, ...MOCK_PENDING_ORDERS]);
      setIsLoading(false);
    });
  }, []);

  const filteredOrders = orders.filter(o => 
    o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_phone?.includes(search) ||
    o.id?.includes(search)
  );

  const totalPending = orders.reduce((sum, o) => sum + (o.pending_amount || 0), 0);
  const criticalFollowups = orders.filter(o => (o.pending_amount || 0) > 5000).length;

  const handleReceivePayment = () => {
    if (!selectedOrder || collectionAmount <= 0) return;
    
    if (collectionAmount > selectedOrder.pending_amount) {
      toast.error('Collection amount cannot exceed pending dues');
      return;
    }

    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setOrders(prev => prev.map(o => {
        if (o.id === selectedOrder.id) {
          const newPending = o.pending_amount - collectionAmount;
          return {
            ...o,
            received_amount: o.received_amount + collectionAmount,
            pending_amount: newPending,
            status: newPending === 0 ? 'delivered' : 'part_paid'
          };
        }
        return o;
      }));
      
      toast.success(`Received ₹${collectionAmount} from ${selectedOrder.customer_name}`);
      setIsProcessing(false);
      setSelectedOrder(null);
      setCollectionAmount(0);
    }, 1000);
  };

  return (
    <AdminLayout title="Payment Follow Up">
      <div className="space-y-6 pb-20">
        
        {/* KPI Section (ERP Style) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <div className="bg-white rounded-[1.5rem] md:rounded-3xl p-5 md:p-6 shadow-sm border border-white/60">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-rose-50 text-rose-600 rounded-lg md:rounded-xl flex items-center justify-center mb-4">
                 <AlertCircle className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Outstanding</p>
              <h3 className="text-2xl md:text-3xl font-black tracking-tighter text-rose-600">₹{totalPending.toLocaleString()}</h3>
           </div>
           <div className="bg-white rounded-[1.5rem] md:rounded-3xl p-5 md:p-6 shadow-sm border border-white/60">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-50 text-amber-600 rounded-lg md:rounded-xl flex items-center justify-center mb-4">
                 <Clock className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending Accounts</p>
              <h3 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900">{orders.filter(o => o.pending_amount > 0).length} Cases</h3>
           </div>
           <div className="md:col-span-2 bg-[#1A1A1A] rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 shadow-2xl text-white flex items-center justify-between relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Critical Follow-ups</p>
                <h3 className="text-2xl md:text-4xl font-black tracking-tighter text-rose-400">{criticalFollowups} High Priority</h3>
                <p className="text-[8px] text-white/30 font-bold uppercase mt-2 tracking-widest">Dues exceeding ₹5,000</p>
              </div>
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                 <History className="w-8 h-8 md:w-10 md:h-10 text-white/10" />
              </div>
           </div>
        </div>

        {/* Toolbar */}
         <div className="flex flex-col md:flex-row gap-3 bg-white p-3 rounded-2xl border border-white shadow-sm">
            <div className="flex-1 relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search by client name, phone or bill ID..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="w-full pl-12 pr-4 py-3 bg-slate-50/50 rounded-xl outline-none text-xs font-bold"
               />
            </div>
            <div className="flex gap-2">
               <button className="flex-1 md:flex-none px-4 py-3 md:px-6 bg-white border border-slate-100 rounded-xl flex items-center justify-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">
                  <Filter className="w-3 h-3" /> Filter
               </button>
               <button className="flex-1 md:flex-none px-4 py-3 md:px-6 bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors">
                  <MessageSquare className="w-3 h-3" /> Bulk Remind
               </button>
            </div>
         </div>

        {/* Follow Up List */}
        <div className="space-y-3">
           <AnimatePresence mode='popLayout'>
             {filteredOrders.filter(o => o.pending_amount > 0).map((order) => (
               <motion.div
                 key={order.id}
                 layout
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="bg-white rounded-2xl p-5 shadow-sm border border-white/60 hover:shadow-md transition-all group"
               >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                     
                     {/* Client Info */}
                     <div className="flex items-center gap-4 min-w-[250px]">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-indigo-50 transition-colors">
                           <User className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                        </div>
                        <div>
                           <h4 className="text-sm font-black text-slate-900 leading-none mb-1.5">{order.customer_name}</h4>
                           <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                                 <Phone className="w-2.5 h-2.5" /> {order.customer_phone}
                              </span>
                              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{order.id}</span>
                           </div>
                        </div>
                     </div>

                      {/* Financials */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 flex-1 py-4 border-y border-slate-50 md:border-none">
                         <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Bill</p>
                            <p className="text-xs md:text-sm font-black text-slate-900">₹{order.total?.toLocaleString()}</p>
                         </div>
                         <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Received</p>
                            <p className="text-xs md:text-sm font-black text-emerald-600">₹{order.received_amount?.toLocaleString()}</p>
                         </div>
                         <div className="col-span-2 md:col-span-1">
                            <p className="text-[8px] font-black text-rose-400 uppercase tracking-widest mb-1">Pending Dues</p>
                            <p className="text-sm md:text-base font-black text-rose-600">₹{order.pending_amount?.toLocaleString()}</p>
                         </div>
                      </div>

                     {/* Actions */}
                     <div className="flex items-center gap-4">
                        <div className="hidden lg:block text-right mr-4">
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Bill Date</p>
                           <p className="text-[9px] font-bold text-slate-600 flex items-center justify-end gap-1">
                              <Calendar className="w-2.5 h-2.5" /> {order.date}
                           </p>
                        </div>
                        <div className="flex gap-2">
                           <button 
                             onClick={() => {
                               setSelectedOrder(order);
                               setCollectionAmount(order.pending_amount);
                             }}
                             className="h-10 px-6 bg-[#1A1A1A] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-100"
                           >
                              Receive Payment
                           </button>
                           <button className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
                              <Phone className="w-4 h-4" />
                           </button>
                        </div>
                     </div>

                  </div>
               </motion.div>
             ))}
           </AnimatePresence>
        </div>

        {/* --- RECEIVE PAYMENT MODAL --- */}
        <AnimatePresence>
           {selectedOrder && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                 <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   onClick={() => setSelectedOrder(null)}
                   className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                 />
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9, y: 20 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.9, y: 20 }}
                   className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl border border-white overflow-hidden relative z-10"
                 >
                    <div className="p-8 pb-4 flex justify-between items-center">
                       <h3 className="text-xl font-bold tracking-tight">Receive Dues</h3>
                       <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center hover:bg-rose-50 transition-colors">
                          <X className="w-4 h-4" />
                       </button>
                    </div>
                    
                    <div className="p-8 pt-0 space-y-6">
                       <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Collecting From</p>
                          <p className="text-sm font-bold text-slate-900">{selectedOrder.customer_name}</p>
                          <p className="text-[10px] font-bold text-indigo-500 mt-0.5">{selectedOrder.id}</p>
                       </div>

                       <div className="space-y-2">
                          <div className="flex justify-between">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Outstanding</p>
                             <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">₹{selectedOrder.pending_amount}</p>
                          </div>
                          <div className="relative">
                             <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                             <input 
                               type="number" 
                               value={collectionAmount}
                               onChange={(e) => setCollectionAmount(Number(e.target.value))}
                               className="w-full pl-12 pr-4 py-4 bg-emerald-50 text-2xl font-black text-emerald-700 rounded-2xl outline-none border-2 border-emerald-100 focus:border-emerald-300"
                             />
                          </div>
                       </div>

                       <button 
                         onClick={handleReceivePayment}
                         disabled={isProcessing}
                         className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                       >
                          {isProcessing ? <History className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                          Confirm Collection
                       </button>
                    </div>
                 </motion.div>
              </div>
           )}
        </AnimatePresence>

      </div>
    </AdminLayout>
  );
}

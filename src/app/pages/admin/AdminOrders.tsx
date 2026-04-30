import { motion } from 'motion/react';
import { Search, Package, CheckCircle2, Clock, XCircle, ArrowUpRight, ShoppingBag, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useState, useEffect } from 'react';
import { Order } from '../../context/AppContext';
import { AdminLayout } from '../../components/AdminLayout';
import { fetchAllOrders } from '../../data/admin';

export function AdminOrders() {
  const { updateOrderStatus } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllOrders().then(data => {
      setOrders(data);
      setIsLoading(false);
    });
  }, []);

  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Orders">
      <div className="space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-6xl font-medium tracking-tight text-[#1A1A1A]">Fulfillment</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Manage customer satisfaction</p>
          </div>
          <div className="flex gap-4">
             <button className="w-16 h-16 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all">
               <Filter className="w-5 h-5 text-slate-600" />
             </button>
             <button className="px-8 py-5 bg-[#1A1A1A] text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3">
               <ShoppingBag className="w-5 h-5" />
               <span>Order Metrics</span>
             </button>
          </div>
        </div>

        {/* Search Bento */}
        <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-white/60">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Locate order by ID or ID hash..."
              className="w-full pl-16 pr-6 py-6 bg-slate-50/50 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-lg"
            />
          </div>
        </div>

        {/* Orders Artistic List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-white/60 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-6">
                <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center relative overflow-hidden ${
                  order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                }`}>
                  <Package className="w-8 h-8 relative z-10" />
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.02)_10px,rgba(0,0,0,0.02)_20px)]" />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-slate-900">Order #{order.id.slice(0, 8)}</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{order.date}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-12">
                 <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Items</p>
                   <p className="font-bold text-slate-700">{order.items.length} Units</p>
                 </div>
                 <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                   <p className="text-2xl font-bold tracking-tighter">₹{order.total.toLocaleString()}</p>
                 </div>
                 <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                   <select
                     value={order.status}
                     onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                     className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-none appearance-none cursor-pointer focus:ring-0 ${
                       order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                       order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                       order.status === 'processing' ? 'bg-amber-100 text-amber-700' :
                       order.status === 'cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                     }`}
                   >
                     <option value="pending">Pending</option>
                     <option value="processing">Processing</option>
                     <option value="shipped">Shipped</option>
                     <option value="delivered">Delivered</option>
                     <option value="cancelled">Cancelled</option>
                   </select>
                 </div>
              </div>

              <div className="flex items-center gap-4">
                 <button className="w-14 h-14 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-all">
                   <ArrowUpRight className="w-5 h-5" />
                 </button>
              </div>
            </motion.div>
          )) : (
            <div className="bg-white rounded-[3rem] p-20 border border-dashed border-slate-200 text-center">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <ShoppingBag className="w-8 h-8 text-slate-200" />
               </div>
               <h3 className="text-xl font-bold text-slate-400">No Orders Tracked</h3>
               <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mt-2">Adjust your search or filter</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

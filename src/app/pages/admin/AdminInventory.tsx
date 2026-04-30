import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, AlertTriangle, ArrowUpRight, Search, Filter, MoreVertical, Package, ArrowDown, ArrowUp, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { fetchProducts } from '../../data/products';
import { Product } from '../../context/AppContext';
import { AdminLayout } from '../../components/AdminLayout';
import { toast } from 'sonner';

export function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data);
      setFilteredProducts(data);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = products;
    if (search) {
      result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (categoryFilter !== 'All') {
      result = result.filter(p => p.category === categoryFilter);
    }
    setFilteredProducts(result);
  }, [search, categoryFilter, products]);

  const updateStock = (id: string, delta: number) => {
    setProducts(prev => prev.map(p => {
       if (p.id === id) {
          const newStock = Math.max(0, (p.reviews || 0) + delta); // Using reviews as mock stock
          return { ...p, reviews: newStock };
       }
       return p;
    }));
    toast.success('Inventory updated');
  };

  const lowStockCount = products.filter(p => (p.reviews || 0) < 10).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * (p.reviews || 0)), 0);

  return (
    <AdminLayout title="Inventory">
      <div className="space-y-10">
        
        {/* Real-time Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
           <div className="bg-white rounded-[1.5rem] md:rounded-3xl p-5 md:p-6 shadow-sm border border-white/60">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-50 text-blue-600 rounded-lg md:rounded-xl flex items-center justify-center mb-3"><Package className="w-4 h-4" /></div>
              <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Assets</p>
              <h3 className="text-xl md:text-2xl font-bold tracking-tighter">{products.length} Items</h3>
           </div>
           <div className="bg-white rounded-[1.5rem] md:rounded-3xl p-5 md:p-6 shadow-sm border border-white/60">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-rose-50 text-rose-600 rounded-lg md:rounded-xl flex items-center justify-center mb-3"><AlertTriangle className="w-4 h-4" /></div>
              <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock Alerts</p>
              <h3 className="text-xl md:text-2xl font-bold tracking-tighter text-rose-500">{lowStockCount} Critical</h3>
           </div>
           <div className="md:col-span-2 bg-[#1A1A1A] rounded-[1.5rem] md:rounded-3xl p-5 md:p-6 shadow-2xl text-white flex justify-between items-center relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Inventory Valuation</p>
                <h3 className="text-3xl md:text-4xl font-bold tracking-tighter">₹{(totalValue / 1000).toFixed(1)}K</h3>
                <p className="text-[8px] text-emerald-400 font-bold uppercase mt-1 tracking-widest">+12% from last month</p>
              </div>
              <div className="hidden sm:block absolute right-[-20px] top-[-20px] opacity-10">
                 <Layers className="w-40 h-40" />
              </div>
           </div>
        </div>

        {/* Toolbar: Search & Filter */}
        <div className="flex flex-col md:flex-row gap-3">
           <div className="flex-1 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#1A1A1A] transition-colors" />
              <input 
                type="text" 
                placeholder="Search assets..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl border border-white shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all font-medium text-sm"
              />
           </div>
           <div className="flex gap-2">
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="flex-1 md:flex-none px-6 py-4 bg-white rounded-2xl border border-white shadow-sm focus:outline-none font-bold text-[9px] md:text-[10px] uppercase tracking-widest appearance-none cursor-pointer"
              >
                 <option value="All">All Categories</option>
                 <option value="Indoor Plants">Indoor</option>
                 <option value="Outdoor Plants">Outdoor</option>
                 <option value="Pots">Pots</option>
              </select>
              <button className="w-14 h-14 bg-[#1A1A1A] text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                 <Filter className="w-4 h-4" />
              </button>
           </div>
        </div>

        {/* Inventory Artistic Table */}
        <div className="bg-white rounded-[2rem] md:rounded-3xl p-2 md:p-4 shadow-sm border border-white/60 overflow-hidden">
           {/* Desktop Table View */}
           <div className="hidden md:block overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                    <th className="px-6 py-4">Asset</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Adjust</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 <AnimatePresence mode='popLayout'>
                   {filteredProducts.map((p) => (
                     <motion.tr 
                       layout
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       key={p.id} 
                       className="group hover:bg-slate-50/50 transition-all"
                     >
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-lg overflow-hidden shadow-sm border border-white">
                               <img src={p.image} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2000' }} />
                             </div>
                             <div>
                               <span className="font-bold text-slate-900 block text-sm">{p.name}</span>
                               <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">ID: {p.id}</span>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-slate-100 rounded-md text-[8px] font-black text-slate-500 uppercase tracking-widest">{p.category}</span>
                       </td>
                       <td className="px-6 py-4">
                          <span className={`text-lg font-black tracking-tighter ${ (p.reviews || 0) < 10 ? 'text-rose-500' : 'text-slate-900'}`}>
                             {p.reviews || 0}
                          </span>
                       </td>
                       <td className="px-6 py-4">
                          <span className="font-bold text-sm text-indigo-600">₹{p.price}</span>
                       </td>
                       <td className="px-6 py-4">
                          {(p.reviews || 0) > 20 ? (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-md w-fit">
                               <div className="w-1 h-1 rounded-full bg-emerald-600 animate-pulse" />
                               <span className="text-[8px] font-black uppercase tracking-widest">OK</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-md w-fit">
                               <div className="w-1 h-1 rounded-full bg-amber-600" />
                               <span className="text-[8px] font-black uppercase tracking-widest">LOW</span>
                            </div>
                          )}
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1.5">
                             <button 
                               onClick={() => updateStock(p.id, 1)}
                               className="w-8 h-8 bg-white border border-slate-100 rounded-lg flex items-center justify-center shadow-sm hover:bg-emerald-500 hover:text-white transition-all"
                             >
                                <Plus className="w-3 h-3" />
                             </button>
                             <button 
                               onClick={() => updateStock(p.id, -1)}
                               className="w-8 h-8 bg-white border border-slate-100 rounded-lg flex items-center justify-center shadow-sm hover:bg-rose-500 hover:text-white transition-all"
                             >
                                <Minus className="w-3 h-3" />
                             </button>
                          </div>
                       </td>
                     </motion.tr>
                   ))}
                 </AnimatePresence>
               </tbody>
             </table>
           </div>

           {/* Mobile Card View */}
           <div className="md:hidden divide-y divide-slate-50">
             {filteredProducts.map((p) => (
               <div key={p.id} className="p-5 flex flex-col gap-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 shrink-0">
                         <img src={p.image} className="w-full h-full object-cover" />
                       </div>
                       <div>
                         <h4 className="text-sm font-bold text-slate-900 leading-tight">{p.name}</h4>
                         <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{p.category}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Price</p>
                       <p className="text-sm font-black text-indigo-600">₹{p.price}</p>
                    </div>
                 </div>
                 
                 <div className="flex items-center justify-between bg-slate-50/50 p-4 rounded-2xl">
                    <div className="flex flex-col">
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Stock</p>
                       <span className={`text-xl font-black tracking-tighter ${ (p.reviews || 0) < 10 ? 'text-rose-500' : 'text-slate-900'}`}>
                          {p.reviews || 0}
                       </span>
                    </div>
                    <div className="flex items-center gap-2">
                       <button 
                         onClick={() => updateStock(p.id, -1)}
                         className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-sm"
                       >
                          <Minus className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => updateStock(p.id, 1)}
                         className="w-10 h-10 bg-[#1A1A1A] text-white rounded-xl flex items-center justify-center shadow-sm"
                       >
                          <Plus className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
               </div>
             ))}
           </div>
        </div>

      </div>
    </AdminLayout>
  );
}

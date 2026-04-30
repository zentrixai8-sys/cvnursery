import { motion, AnimatePresence } from 'motion/react';
import { Search, Mail, Phone, ShoppingBag, User, ArrowLeft, Filter, Users, DollarSign, Calendar, History, RefreshCw, ChevronRight, CheckCircle2, MoreHorizontal, ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { fetchAllCustomers, fetchAllOrders } from '../../data/admin';
import { Order } from '../../context/AppContext';

export function AdminCustomers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAllCustomers(), fetchAllOrders()]).then(([cData, oData]) => {
      setCustomers(cData);
      setOrders(oData);
      setIsLoading(false);
    });
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
  );

  const getCustomerOrders = (phone: string) => {
    return orders.filter(o => o.customerPhone === phone);
  };

  const totalSpent = selectedCustomer ? getCustomerOrders(selectedCustomer.phone).reduce((sum, o) => sum + o.total, 0) : 0;

  return (
    <AdminLayout title={selectedCustomer ? "Client History" : "Customers"}>
      <AnimatePresence mode="wait">
        {!selectedCustomer ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Customer List Header */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-3xl border border-white/60 shadow-sm gap-4">
               <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search by name or mobile..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm"
                  />
               </div>
               <div className="flex gap-4">
                  <div className="w-full sm:w-auto px-5 py-3 md:px-6 md:py-3 bg-indigo-50 text-indigo-600 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                     <Users className="w-4 h-4" />
                     {customers.length} Clients
                  </div>
               </div>
            </div>

            {/* Compact Customer Table */}
            <div className="bg-white rounded-[1.5rem] md:rounded-3xl border border-white/60 shadow-sm overflow-hidden">
               {/* Desktop View */}
               <div className="hidden md:block overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                          <th className="px-8 py-4">Client Identity</th>
                          <th className="px-8 py-4">Contact</th>
                          <th className="px-8 py-4">Status</th>
                          <th className="px-8 py-4">Activity</th>
                          <th className="px-8 py-4 text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {filteredCustomers.map(c => (
                          <tr 
                            key={c.id} 
                            onClick={() => setSelectedCustomer(c)}
                            className="group cursor-pointer hover:bg-slate-50/50 transition-all"
                          >
                             <td className="px-8 py-4">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 bg-[#1A1A1A] text-white rounded-xl flex items-center justify-center font-bold text-sm">
                                      {c.name[0]}
                                   </div>
                                   <div>
                                      <p className="font-bold text-sm text-slate-900">{c.name}</p>
                                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">ID: {c.id.slice(0, 8)}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-8 py-4">
                                <div className="flex flex-col gap-1">
                                   <span className="text-xs font-bold text-slate-600">{c.phone}</span>
                                   <span className="text-[10px] text-slate-400">{c.email}</span>
                                </div>
                             </td>
                             <td className="px-8 py-4">
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg w-fit">
                                   <div className="w-1 h-1 rounded-full bg-emerald-600" />
                                   <span className="text-[8px] font-black uppercase tracking-widest">Active</span>
                                </div>
                             </td>
                             <td className="px-8 py-4 text-xs font-bold text-slate-500">
                                {c.orders} Transactions
                             </td>
                             <td className="px-8 py-4 text-right">
                                <button className="w-8 h-8 bg-white border border-slate-100 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                   <ArrowLeft className="w-4 h-4 rotate-180" />
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
               </div>

               {/* Mobile View */}
               <div className="md:hidden divide-y divide-slate-50">
                 {filteredCustomers.map(c => (
                   <div 
                     key={c.id} 
                     onClick={() => setSelectedCustomer(c)}
                     className="p-5 flex items-center justify-between active:bg-slate-50"
                   >
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#1A1A1A] text-white rounded-xl flex items-center justify-center font-bold text-base shrink-0">
                           {c.name[0]}
                        </div>
                        <div>
                           <h4 className="font-bold text-sm text-slate-900 leading-tight">{c.name}</h4>
                           <div className="flex items-center gap-2 mt-1">
                              <span className="text-[9px] font-bold text-slate-400">{c.phone}</span>
                              <div className="w-1 h-1 bg-slate-200 rounded-full" />
                              <span className="text-[8px] font-black text-emerald-600 uppercase">Active</span>
                           </div>
                        </div>
                     </div>
                     <ChevronRight className="w-4 h-4 text-slate-300" />
                   </div>
                 ))}
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
             {/* SCREENSHOT INSPIRED HEADER */}
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-3 md:gap-4">
                   <button 
                     onClick={() => setSelectedCustomer(null)}
                     className="w-10 h-10 md:w-12 md:h-12 bg-white border border-slate-100 rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm"
                   >
                      <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                   </button>
                   <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                      <History className="w-5 h-5 md:w-6 md:h-6" />
                   </div>
                   <div>
                      <h1 className="text-xl md:text-3xl font-bold tracking-tight text-[#1A1A1A] flex items-center gap-2">
                         History <RefreshCw className="w-3 h-3 text-slate-400" />
                      </h1>
                      <p className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Transaction records</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 md:flex gap-3 md:gap-4 w-full md:w-auto">
                   <div className="bg-white px-5 py-3 md:px-8 md:py-4 rounded-2xl md:rounded-3xl border border-white shadow-sm flex flex-col justify-center">
                      <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Revenue</p>
                      <h4 className="text-lg md:text-2xl font-black text-emerald-600 tracking-tighter">₹{totalSpent.toLocaleString()}</h4>
                   </div>
                   <div className="bg-white px-5 py-3 md:px-8 md:py-4 rounded-2xl md:rounded-3xl border border-white shadow-sm flex flex-col justify-center">
                      <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Records</p>
                      <h4 className="text-lg md:text-2xl font-black tracking-tighter text-indigo-600">{getCustomerOrders(selectedCustomer.phone).length}</h4>
                   </div>
                </div>
             </div>

             {/* SCREENSHOT INSPIRED FILTERS */}
             <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="space-y-1.5">
                   <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2 md:ml-4">From Date</p>
                   <div className="relative group">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input type="text" value="30-04-2026" readOnly className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl text-[9px] font-bold outline-none" />
                   </div>
                </div>
                <div className="space-y-1.5">
                   <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2 md:ml-4">To Date</p>
                   <div className="relative group">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input type="text" value="30-04-2026" readOnly className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl text-[9px] font-bold outline-none" />
                   </div>
                </div>
                <div className="space-y-1.5">
                   <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2 md:ml-4">Branch</p>
                   <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl text-[9px] font-bold outline-none appearance-none cursor-pointer">
                      <option>All Branches</option>
                   </select>
                </div>
                <div className="space-y-1.5">
                   <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2 md:ml-4">Service</p>
                   <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl text-[9px] font-bold outline-none appearance-none cursor-pointer">
                      <option>All Services</option>
                   </select>
                </div>
             </div>

             {/* SCREENSHOT INSPIRED TABS & SEARCH */}
             <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white/40 p-2 rounded-3xl">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                   <button className="whitespace-nowrap px-6 md:px-8 py-3 bg-white text-indigo-600 shadow-sm rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest">Today</button>
                   <button className="whitespace-nowrap px-6 md:px-8 py-3 bg-slate-100/50 text-slate-500 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all"><Filter className="w-3 h-3" /> All Data</button>
                   <button className="whitespace-nowrap px-4 md:px-6 py-3 text-slate-400 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all"><RefreshCw className="w-3 h-3" /> Reset</button>
                </div>
                <div className="relative flex-1 max-w-md w-full">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input type="text" placeholder="Search client name, mobile, etc..." className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl shadow-sm outline-none text-xs font-medium" />
                </div>
             </div>

            {/* LOG TABLE */}
             <div className="bg-[#1A1A1A] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl">
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] border-b border-white/5 bg-[#1F1F1F]">
                            <th className="px-10 py-6">Date</th>
                            <th className="px-10 py-6">Client</th>
                            <th className="px-10 py-6">Service</th>
                            <th className="px-10 py-6">Payment</th>
                            <th className="px-10 py-6">Amount</th>
                            <th className="px-10 py-6 text-right">Action</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                         {getCustomerOrders(selectedCustomer.phone).length > 0 ? getCustomerOrders(selectedCustomer.phone).map(o => (
                            <tr key={o.id} className="group hover:bg-white/5 transition-all">
                               <td className="px-10 py-6">
                                  <p className="text-xs font-bold text-white/90">{o.date.split(',')[0]}</p>
                                  <p className="text-[8px] font-black text-white/20 uppercase mt-1">THU</p>
                               </td>
                               <td className="px-10 py-6">
                                  <p className="text-xs font-bold text-white">{selectedCustomer.name}</p>
                                  <span className="text-[8px] px-2 py-0.5 bg-white/10 rounded-md text-white/40 font-black mt-2 inline-block">{selectedCustomer.phone}</span>
                               </td>
                               <td className="px-10 py-6">
                                  <div className="flex flex-col gap-1.5">
                                     <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[8px] font-black uppercase w-fit tracking-widest">Service</span>
                                     <div className="flex items-center gap-2 opacity-40">
                                        <User className="w-3 h-3" />
                                        <span className="text-[8px] font-black">RPR</span>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-10 py-6">
                                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[8px] font-black text-white/60 uppercase tracking-widest">Cash</span>
                               </td>
                               <td className="px-10 py-6">
                                  <span className="text-xl font-black tracking-tighter text-white">₹{o.total.toLocaleString()}</span>
                               </td>
                               <td className="px-10 py-6 text-right">
                                  <button className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white hover:text-black transition-all">
                                     <MoreHorizontal className="w-4 h-4" />
                                  </button>
                               </td>
                            </tr>
                         )) : (
                            <tr>
                               <td colSpan={6} className="px-10 py-20 text-center text-white/20 font-black uppercase tracking-[0.4em]">No transaction logs found</td>
                            </tr>
                         )}
                      </tbody>
                   </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden divide-y divide-white/5">
                   {getCustomerOrders(selectedCustomer.phone).length > 0 ? getCustomerOrders(selectedCustomer.phone).map(o => (
                      <div key={o.id} className="p-6 flex flex-col gap-4">
                         <div className="flex justify-between items-start">
                            <div>
                               <p className="text-xs font-bold text-white/90">{o.date.split(',')[0]}</p>
                               <span className="text-[9px] text-white/30 font-black uppercase tracking-widest">Order #{o.id.slice(0, 8)}</span>
                            </div>
                            <span className="text-xl font-black text-white tracking-tighter">₹{o.total.toLocaleString()}</span>
                         </div>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[7px] font-black uppercase tracking-widest">Service</span>
                               <span className="px-2 py-0.5 bg-white/5 text-white/40 rounded text-[7px] font-black uppercase tracking-widest">Cash</span>
                            </div>
                            <button className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                               <ArrowUpRight className="w-3.5 h-3.5 text-white/20" />
                            </button>
                         </div>
                      </div>
                   )) : (
                      <div className="p-10 text-center text-white/20 font-black uppercase text-[10px] tracking-widest">No transaction logs</div>
                   )}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

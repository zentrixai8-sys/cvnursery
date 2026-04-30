import { motion } from 'motion/react';
import { ShoppingBag, DollarSign, Activity, BarChart3, TrendingUp, ArrowUpRight, Play, Pause, Clock, CheckCircle2, Users, PieChart, Star, Calendar, TrendingDown } from 'lucide-react';
import { fetchProducts } from '../../data/products';
import { fetchAllOrders, fetchAllCustomers } from '../../data/admin';
import { useState, useEffect } from 'react';
import { Product, Order } from '../../context/AppContext';
import { AdminLayout } from '../../components/AdminLayout';
import { Link } from 'react-router';

export function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchProducts(),
      fetchAllOrders(),
      fetchAllCustomers()
    ]).then(([productsData, ordersData, customersData]) => {
      setProducts(productsData);
      setOrders(ordersData);
      setCustomers(customersData);
      setIsLoading(false);
    });
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const growth = "+18%";
  
  // Normalized Date for chart comparison
  const getDayKey = (dateStr: string) => {
    const parts = dateStr.split(' ');
    if (parts.length >= 2) return `${parts[0]} ${parts[1].replace(',', '')}`;
    return dateStr;
  };

  // 7 Days Sales Graph Data
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }).reverse();

  const dailySales = last7Days.map(day => {
    return orders
      .filter(order => getDayKey(order.date).includes(day))
      .reduce((sum, order) => sum + order.total, 0);
  });
  const maxDailySale = Math.max(...dailySales, 1000);

  // VIP Customers
  const topClients = [...customers]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  // Top Product Categories for Donut
  const categoryStats: Record<string, number> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      const product = products.find(p => p.id === item.id);
      const cat = product?.category || 'Indoor Plants';
      categoryStats[cat] = (categoryStats[cat] || 0) + (item.price * item.quantity);
    });
  });
  const totalCategoryValue = Object.values(categoryStats).reduce((a, b) => a + b, 0);
  const topCategories = Object.entries(categoryStats)
    .sort(([, a], [, b]) => b - a)
    .map(([name, val]) => ({ name, val, percent: Math.round((val / (totalCategoryValue || 1)) * 100) }));

  // Best Selling Products
  const productSales: Record<string, { name: string, qty: number, image: string }> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!productSales[item.id]) {
        productSales[item.id] = { name: item.name, qty: 0, image: item.image || '' };
      }
      productSales[item.id].qty += item.quantity;
    });
  });
  const bestSellers = Object.values(productSales)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 4);

  const recentOrders = orders.slice(0, 5);

  // SVG Line Path Calculation
  const width = 800;
  const height = 200;
  const smoothPath = dailySales.reduce((acc, sale, i) => {
    const x = (i / 6) * width;
    const y = height - (sale / (maxDailySale || 1)) * (height - 40) - 20;
    if (i === 0) return `M ${x},${y}`;
    const prevX = ((i - 1) / 6) * width;
    const prevY = height - (dailySales[i-1] / (maxDailySale || 1)) * (height - 40) - 20;
    const cpX = (prevX + x) / 2;
    return `${acc} C ${cpX},${prevY} ${cpX},${y} ${x},${y}`;
  }, '');
  const areaPath = `${smoothPath} L ${width},${height} L 0,${height} Z`;

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6 pb-10">
        
        {/* Section 1: Welcome & Stats Small Cards */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-[#1A1A1A] mb-2">Welcome in, Admin</h1>
            <div className="flex flex-wrap gap-2">
              <div className="bg-white/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/80 shadow-sm flex items-center gap-3">
                 <div className="w-6 h-6 bg-[#1A1A1A] rounded-full flex items-center justify-center text-[8px] text-white font-bold">15%</div>
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Sales</p>
                 <div className="w-12 h-2 bg-orange-400 rounded-full" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
             {[
               { label: 'Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: 'bg-blue-400' },
               { label: 'Orders', value: totalOrders, color: 'bg-emerald-400' },
               { label: 'Clients', value: customers.length, color: 'bg-purple-400' },
               { label: 'Growth', value: growth, color: 'bg-orange-400' },
             ].map(stat => (
               <div key={stat.label} className="bg-white px-4 py-3 md:px-6 md:py-4 rounded-[1.5rem] md:rounded-3xl shadow-sm border border-white/60 group hover:bg-[#1A1A1A] hover:text-white transition-all">
                  <div className="flex items-center gap-2 mb-1">
                     <div className={`w-1.5 h-1.5 ${stat.color} rounded-full`} />
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white/40">{stat.label}</p>
                  </div>
                  <h4 className="text-base md:text-xl font-bold tracking-tighter">{stat.value}</h4>
               </div>
             ))}
          </div>
        </div>

        {/* Section 2: First Row Bento Cards (Admin, Activity, Live, Recent) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-white/60 flex flex-col relative group h-64">
            <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=1000" className="w-full h-full object-cover" />
            <div className="p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent absolute bottom-0 left-0 right-0 text-white">
              <h3 className="text-lg font-bold">Admin User</h3>
              <p className="text-[10px] text-white/60">Manager</p>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] md:rounded-3xl p-5 md:p-6 shadow-sm border border-white/60 flex flex-col h-64">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-sm font-bold">Store Activity</h3>
              <button className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center"><ArrowUpRight className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 flex items-end justify-between gap-2 h-24 px-1">
               {dailySales.map((sale, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
                   <div className={`w-full rounded-full ${i === 6 ? 'bg-orange-400' : 'bg-[#1A1A1A]'}`} style={{ height: `${Math.max((sale / maxDailySale) * 100, 10)}%` }} />
                 </div>
               ))}
            </div>
            <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mt-4 px-1">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-white/60 flex flex-col items-center justify-center text-center h-64">
            <div className="relative w-28 h-28 mb-4 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-50" />
                <circle cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={314} strokeDashoffset={314 * 0.3} className="text-orange-400" />
              </svg>
              <div className="absolute"><p className="text-xl font-bold">02:35</p></div>
            </div>
            <div className="flex gap-2">
               <button className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center"><Play className="w-3 h-3" /></button>
               <button className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center"><Pause className="w-3 h-3" /></button>
            </div>
          </div>

          <div className="bg-[#1A1A1A] rounded-3xl p-6 shadow-2xl text-white flex flex-col h-64">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold">Recent Orders</h3>
              <span className="text-[8px] opacity-40">{recentOrders.length}/10</span>
            </div>
            <div className="flex-1 space-y-2">
               {recentOrders.map(order => (
                 <div key={order.id} className="flex justify-between items-center text-[8px]">
                   <span className="font-bold opacity-60">#{order.id.slice(0, 8)}</span>
                   <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Section 3: ANALYTICAL HUB (LINE CHART & DONUT) */}
        <div className="space-y-6 pt-8 border-t border-slate-100">
           <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-medium tracking-tight">Revenue Analysis Hub</h2>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Line Chart */}
              <div className="lg:col-span-2 bg-white rounded-[2rem] md:rounded-3xl p-5 md:p-8 shadow-sm border border-white/60">
                 <div className="flex justify-between items-start mb-6">
                    <div>
                       <h3 className="text-lg font-bold tracking-tight">Revenue Trend</h3>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Daily income patterns</p>
                    </div>
                    <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[8px] font-black tracking-widest">REAL TIME</div>
                 </div>
                 
                 <div className="relative h-48 mt-6">
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                       <defs>
                          <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.2" />
                             <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
                          </linearGradient>
                          <filter id="glow">
                             <feGaussianBlur stdDeviation="3" result="blur" />
                             <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                       </defs>
                       
                       {/* Subtle Grid Lines */}
                       {[0, 0.25, 0.5, 0.75, 1].map(f => (
                          <line key={f} x1="0" y1={height * f} x2={width} y2={height * f} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="5,5" />
                       ))}

                       <motion.path initial={{ opacity: 0 }} animate={{ opacity: 1 }} d={areaPath} fill="url(#g)" />
                       <motion.path 
                          initial={{ pathLength: 0 }} 
                          animate={{ pathLength: 1 }} 
                          transition={{ duration: 2, ease: "easeInOut" }} 
                          d={smoothPath} 
                          fill="none" 
                          stroke="#4F46E5" 
                          strokeWidth="5" 
                          filter="url(#glow)"
                       />

                       {/* Points & Data Labels */}
                       {dailySales.map((sale, i) => {
                          const x = (i / 6) * width;
                          const y = height - (sale / (maxDailySale || 1)) * (height - 40) - 20;
                          return (
                            <g key={i} className="group/p">
                               <circle cx={x} cy={y} r="8" fill="#4F46E5" className="shadow-lg" />
                               <circle cx={x} cy={y} r="4" fill="white" />
                               
                               {/* PERMANENT AMOUNT LABEL */}
                               <text 
                                  x={x} 
                                  y={y - 20} 
                                  textAnchor="middle" 
                                  className="fill-[#1A1A1A] text-[10px] font-black tracking-tighter"
                               >
                                  ₹{sale.toLocaleString()}
                               </text>

                               {/* HOVER TOOLTIP (EXTRA DETAIL) */}
                               <motion.g initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}>
                                  <rect x={x - 45} y={y - 65} width="90" height="35" rx="12" fill="#1A1A1A" />
                                  <text x={x} y={y - 45} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">₹{sale.toLocaleString()}</text>
                               </motion.g>
                            </g>
                          )
                       })}
                    </svg>
                    <div className="flex justify-between mt-6 text-[10px] font-bold text-slate-400">
                       {last7Days.map(day => <span key={day}>{day}</span>)}
                    </div>
                 </div>
              </div>

              {/* Donut Chart */}
              <div className="lg:col-span-1 bg-white rounded-[2rem] md:rounded-3xl p-5 md:p-8 shadow-sm border border-white/60 flex flex-col items-center">
                 <div className="w-full mb-6">
                    <h3 className="text-lg font-bold tracking-tight">Category Mix</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Distribution</p>
                 </div>
                 <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                       {topCategories.map((item, i) => (
                          <circle key={i} cx="50" cy="50" r="40" fill="transparent" stroke={['#6366F1', '#10B981', '#F59E0B', '#EF4444'][i % 4]} strokeWidth="12"
                             strokeDasharray={`${item.percent * 2.51} 251`}
                             strokeDashoffset={-topCategories.slice(0, i).reduce((s, c) => s + c.percent, 0) * 2.51}
                             strokeLinecap="round" />
                       ))}
                    </svg>
                    <div className="absolute text-center">
                       <p className="text-xl font-black">{topCategories[0]?.percent}%</p>
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{topCategories[0]?.name.split(' ')[0]}</p>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-2 mt-6 w-full">
                    {topCategories.map((cat, i) => (
                       <div key={cat.name} className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ['#6366F1', '#10B981', '#F59E0B', '#EF4444'][i % 4] }} />
                          <span className="text-[8px] font-bold text-slate-600 uppercase truncate">{cat.percent}% {cat.name}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Section 4: VIP & Best Sellers (Bottom) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-12 border-t border-slate-100">
           <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 shadow-sm border border-white/60">
              <div className="flex justify-between items-center mb-10">
                 <div>
                    <h3 className="text-2xl font-bold tracking-tight">VIP Clients</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">High-value partnerships</p>
                 </div>
                 <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-sm">
                    <Star className="w-6 h-6 fill-amber-400" />
                 </div>
              </div>
              <div className="space-y-6">
                 {topClients.map((c, i) => (
                   <motion.div 
                     key={c.id} 
                     whileHover={{ x: 10 }}
                     className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-5 md:p-8 bg-slate-50/50 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100/50 hover:bg-white hover:shadow-xl transition-all group cursor-pointer gap-4 md:gap-0"
                   >
                      <div className="flex items-center gap-4 md:gap-6">
                         <div className="relative shrink-0">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#1A1A1A] text-white rounded-2xl md:rounded-3xl flex items-center justify-center text-lg md:text-xl font-bold group-hover:rotate-6 transition-transform">
                               {c.name[0]}
                            </div>
                            <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-4 h-4 md:w-6 md:h-6 bg-emerald-500 border-2 md:border-4 border-white rounded-full" title="Active" />
                         </div>
                         <div>
                            <p className="text-base md:text-lg font-bold text-slate-900 leading-tight">{c.name}</p>
                            <div className="flex items-center gap-2 md:gap-3 mt-1">
                               <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.orders} Orders</span>
                               <div className="w-1 h-1 bg-slate-200 rounded-full" />
                               <div className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md text-[8px] font-black uppercase tracking-widest">VIP</div>
                            </div>
                         </div>
                      </div>
                      <div className="text-left sm:text-right border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                         <p className="text-[9px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5 md:mb-1">Lifetime Value</p>
                         <p className="text-xl md:text-2xl font-black tracking-tighter text-indigo-600">₹{c.totalSpent.toLocaleString()}</p>
                      </div>
                   </motion.div>
                 ))}
              </div>
           </div>
           <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 shadow-sm border border-white/60">
              <h3 className="text-2xl font-bold tracking-tight mb-10">Best Sellers</h3>
              <div className="grid grid-cols-2 gap-8">
                 {bestSellers.map(s => (
                   <div key={s.name} className="space-y-4 group">
                      <div className="h-40 rounded-3xl overflow-hidden shadow-sm"><img src={s.image} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" /></div>
                      <div className="flex justify-between px-2">
                         <div><p className="font-bold truncate w-24">{s.name}</p><p className="text-[10px] opacity-40 uppercase">{s.qty} Units</p></div>
                         <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center"><ArrowUpRight className="w-4 h-4" /></div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </AdminLayout>
  );
}

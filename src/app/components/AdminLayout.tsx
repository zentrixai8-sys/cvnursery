import { motion } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Receipt, 
  Bell, 
  Settings, 
  User, 
  CreditCard, 
  Layers, 
  Tag, 
  ChevronRight,
  LogOut
} from 'lucide-react';
import { ReactNode } from 'react';
import { supabase } from '../../lib/supabase';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Inventory', path: '/admin/inventory', icon: Layers },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Payment Follow Up', path: '/admin/payments', icon: CreditCard },
    { label: 'Billing POS', path: '/admin/billing', icon: Receipt },
    { label: 'Offers', path: '/admin/offers', icon: Tag },
    { label: 'Customers', path: '/admin/customers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF0] font-sans text-[#1A1A1A] flex p-2 lg:p-4 gap-4">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 hidden lg:flex flex-col bg-[#F7F5E4] rounded-[2rem] shadow-sm border border-white/40 overflow-hidden sticky top-4 h-[95vh]">
        {/* Sidebar Logo */}
        <div className="p-6">
          <Link to="/admin" className="flex items-center gap-2 px-4 py-3 bg-white/40 backdrop-blur-md rounded-full border border-white/60">
            <div className="w-4 h-4 bg-emerald-600 rounded-full" />
            <span className="font-bold text-lg tracking-tight">CV Nursery</span>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/admin' && location.pathname === '/admin/');
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ x: 3 }}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                    isActive ? 'bg-[#1A1A1A] text-white shadow-lg' : 'text-slate-500 hover:bg-white/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span className="text-[12px] font-bold">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3 h-3 text-white/40" />}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-8 mt-auto">
          <div className="bg-white/40 p-6 rounded-[2.5rem] border border-white/60">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center text-white">
                 <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold">Admin User</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Super Admin</p>
              </div>
            </div>
            <button 
              onClick={handleSignOut}
              className="w-full py-3 bg-white border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
               <LogOut className="w-4 h-4" />
               Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 bg-[#F7F5E4] rounded-[2rem] shadow-sm min-h-[95vh] overflow-hidden relative border border-white/40">
        
        {/* Top Actions Bar */}
        <header className="px-6 py-4 flex items-center justify-between sticky top-0 bg-[#F7F5E4]/80 backdrop-blur-md z-50">
          <h2 className="text-lg font-bold tracking-tight">{title}</h2>
          
          <div className="flex items-center gap-3">
            <button className="w-12 h-12 flex items-center justify-center bg-white rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <Settings className="w-5 h-5 text-slate-600" />
            </button>
            <button className="w-12 h-12 flex items-center justify-center bg-white rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-all relative">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-orange-400 border-2 border-white rounded-full" />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="px-6 pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}

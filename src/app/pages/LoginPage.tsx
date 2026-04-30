import { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (success) {
      if (email === 'zentrix.ai8@gmail.com') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const FloatingLeaf = ({ delay, x, y, size, rotate }: { delay: number, x: string, y: string, size: number, rotate: number }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotateZ: rotate }}
      animate={{ 
        opacity: [0, 0.3, 0],
        y: ['0px', '-150px'],
        x: ['0px', '30px', '-30px'],
        rotateX: [0, 180, 360],
        rotateY: [0, 360, 720],
        scale: [0.5, 1.2, 0.8]
      }}
      transition={{ 
        duration: 15 + Math.random() * 10, 
        repeat: Infinity, 
        delay, 
        ease: "easeInOut" 
      }}
      className="absolute pointer-events-none z-0"
      style={{ left: x, top: y }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600/30">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.5 2 7a7 7 0 0 1-7 7h-3" />
        <path d="M11 20c-1.33-1-3-2.67-3-4.5" />
        <path d="M11 20c1.33-1 3-2.67 3-4.5" />
      </svg>
    </motion.div>
  );

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans relative overflow-hidden">
      
      {/* Premium Background Effects */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-700/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none" />

      {/* Left Panel - Ultra-Premium Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden m-6 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] border border-white/20">
        <motion.img 
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=2000&auto=format&fit=crop" 
          alt="Luxury indoor plants" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/30 to-transparent opacity-90" />
        
        <div className="absolute bottom-20 left-20 text-white z-10 max-w-md">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 1.2 }}
          >
            <div className="w-16 h-1 bg-emerald-400 mb-8 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
            <h1 className="text-6xl font-black mb-8 tracking-[ -0.05em] leading-[0.9] italic opacity-95">Cultivating<br/>Elegance</h1>
            <p className="text-white/60 text-xl leading-relaxed font-light tracking-wide italic">
              Where nature meets luxury. Explore our curated selection of rare botanicals.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - 3D Luxury Card Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-start p-6 pt-56 relative overflow-y-auto">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative"
        >
          {/* Decorative Back Glow */}
          <div className="absolute inset-0 bg-emerald-500/5 blur-[80px] rounded-full scale-110" />

          {/* Main Luxury Card */}
          <motion.div
            whileHover={{ rotateY: 2, rotateX: -1, y: -5 }}
            style={{ perspective: 2000 }}
            className="bg-white/90 backdrop-blur-3xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_50px_120px_rgba(0,0,0,0.1)] border border-white/60 relative overflow-hidden group"
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50 pointer-events-none" />

            <div className="relative z-10">
              <div className="mb-10 text-center">
                <motion.div
                   initial={{ opacity: 0, y: -10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.3 }}
                >
                  <h2 className="text-3xl font-black text-slate-900 tracking-[-0.04em] mb-2 font-serif italic">Welcome Back</h2>
                  <div className="w-8 h-0.5 bg-emerald-500/30 mx-auto mb-3" />
                  <p className="text-slate-400 font-medium text-[10px] uppercase tracking-[0.3em]">Elevate your space with nature</p>
                </motion.div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">
                    Client Email
                  </label>
                  <div className="relative group/input">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within/input:text-emerald-600 transition-all duration-300" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-100 py-4 pl-14 pr-6 rounded-[1.25rem] outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 focus:bg-white transition-all duration-500 text-slate-900 font-medium text-sm placeholder:text-slate-200 shadow-inner"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">
                    Private Password
                  </label>
                  <div className="relative group/input">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within/input:text-emerald-600 transition-all duration-300" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-100 py-4 pl-14 pr-14 rounded-[1.25rem] outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 focus:bg-white transition-all duration-500 text-slate-900 font-medium text-sm placeholder:text-slate-200 shadow-inner"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between px-1">
                  <label className="flex items-center gap-2.5 cursor-pointer group/check">
                    <input type="checkbox" className="peer appearance-none w-4 h-4 rounded-md border-2 border-slate-100 checked:bg-emerald-600 checked:border-emerald-600 transition-all duration-300 cursor-pointer" />
                    <span className="text-[10px] font-bold text-slate-400 group-hover/check:text-slate-600 transition-colors uppercase tracking-wider">Remember</span>
                  </label>
                  <Link to="/forgot-password" size="sm" className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-widest">
                    Forgot Key?
                  </Link>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white py-4 rounded-[1.25rem] font-black text-[11px] tracking-[0.3em] uppercase flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] transition-all duration-500 disabled:opacity-50 mt-4 group/btn overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                  {isLoading ? 'Verifying...' : (
                    <>
                      <span>Secure Access</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-10 text-center">
                <Link to="/signup">
                   <motion.button 
                     whileHover={{ scale: 1.05 }}
                     className="px-8 py-2.5 border border-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 hover:text-emerald-600 transition-all duration-300 shadow-sm"
                   >
                     Create Account
                   </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Login Footer Links */}
      <div className="absolute bottom-8 left-1/2 lg:left-[75%] -translate-x-1/2 flex gap-8 whitespace-nowrap z-20">
        {[
          { label: 'Privacy Policy', path: '/privacy-policy' },
          { label: 'Terms & Policy', path: '/terms-and-policy' },
          { label: 'Shipping Info', path: '/shipping-info' }
        ].map((item) => (
          <Link key={item.label} to={item.path} className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-emerald-600 transition-colors">
            {item.label}
          </Link>
        ))}
      </div>

    </div>
  );
}

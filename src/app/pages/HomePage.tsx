import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router';
import { ScrollCanvas } from '../components/ScrollCanvas';
import { ArrowRight, Leaf, Truck, Shield, HeadphonesIcon, Star, RefreshCw, Tag, Users, Award, MapPin, ChevronRight } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { fetchProducts, reviews } from '../data/products';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Product, useApp } from '../context/AppContext';
import { supabase } from '../../lib/supabase';

// Garden Decor Card — clean bounce-in on scroll
function DecorCard({ card, index }: { card: { title: string; price: string; desc: string; image: string }; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.15, duration: 0.6, type: "spring", bounce: 0.4 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <Link to="/shop">
        <div className="relative h-[220px] md:h-[260px] rounded-[1.25rem] overflow-hidden group cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_25px_60px_rgba(16,185,129,0.2)] transition-shadow duration-500">
          <img src={card.image} alt={card.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.2s] ease-out" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/85 via-emerald-900/50 to-transparent" />
          <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
            <span className="text-emerald-300 text-[10px] font-bold uppercase tracking-[0.15em] mb-1">{card.title}</span>
            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2">
              Starting <span className="text-emerald-400">{card.price}</span>
            </h3>
            <p className="text-white/70 text-sm mb-4 max-w-[300px] leading-relaxed">{card.desc}</p>
            <div>
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-md text-white rounded-full text-xs font-bold border border-white/20 group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-300 shadow-lg">
                Shop Now <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  // Story text animations mapped to scrollYProgress
  const opacity1 = useTransform(scrollYProgress, [0, 0.05, 0.15], [1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.15], [0, -50]);

  const opacity2 = useTransform(scrollYProgress, [0.15, 0.25, 0.35, 0.45], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.15, 0.35], [50, -50]);

  const opacity3 = useTransform(scrollYProgress, [0.45, 0.6, 0.7, 0.8], [0, 1, 1, 0]);
  const y3 = useTransform(scrollYProgress, [0.45, 0.7], [50, -50]);

  const opacity4 = useTransform(scrollYProgress, [0.8, 0.9, 1], [0, 1, 1]);
  const y4 = useTransform(scrollYProgress, [0.8, 1], [50, 0]);

  // Original state and logic
  const [email, setEmail] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  
  const { user } = useApp();
  const isAdmin = user?.email === 'zentrix.ai8@gmail.com';

  useEffect(() => {
    fetchProducts().then(setAllProducts);
  }, []);

  const bestSellers = allProducts.slice(0, 8);
  const featuredCategories = [
    { name: 'Offers', image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=200', isSpecial: true },
    { name: 'Indoor Plants', image: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?w=200' },
    { name: 'Outdoor Plants', image: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=200' },
    { name: 'Seeds', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200' },
    { name: 'Flower Plants', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200' },
    { name: 'Pots', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200' },
    { name: 'Fertilizers', image: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=200' },
    { name: 'Pebbles', image: 'https://images.unsplash.com/photo-1518458028785-8b391e3b8b00?w=200' },
    { name: 'Accessories', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200' },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Thank you for subscribing! 🎉`);
    setEmail('');
  };

  const handleAdminReset = async () => {
    const confirmReset = window.confirm("Admin Action: Do you want to send a password reset link to zentrix.ai8@gmail.com?");
    if (confirmReset) {
      const { error } = await supabase.auth.resetPasswordForEmail('zentrix.ai8@gmail.com');
      if (error) {
        toast.error("Failed to send reset link: " + error.message);
      } else {
        toast.success("Reset link sent successfully to zentrix.ai8@gmail.com!");
      }
    }
  };

  const activeOffers = [
    { id: '1', title: 'Summer Bloom Sale', discount: '20% Off', banner: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1000' },
    { id: '2', title: 'New Arrival: Palms', discount: 'Flat ₹200 Off', banner: 'https://images.unsplash.com/photo-1512428813824-f713cb752935?q=80&w=1000' },
    { id: '3', title: 'Monstera Madness', discount: 'Buy 1 Get 1', banner: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=1000' },
  ];

  return (
    <div className="bg-[#fbfcfa] min-h-screen selection:bg-emerald-200">
      
      {/* Admin Floating Button */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdminReset}
            className="flex items-center gap-2 px-6 py-4 bg-red-600/90 backdrop-blur-md text-white rounded-full shadow-[0_0_30px_rgba(220,38,38,0.4)] border border-red-400 font-bold tracking-wider hover:bg-red-600 transition-colors"
          >
            <RefreshCw className="w-5 h-5 animate-spin-slow" />
            <span>Admin Reset</span>
          </motion.button>
        </motion.div>
      )}

      {/* --- SCROLLYTELLING HERO SECTION --- */}
      <div ref={heroRef} className="relative h-[400vh] bg-[#EEF2EC]">
        {/* Sticky Canvas */}
        <ScrollCanvas frameCount={80} scrollProgress={scrollYProgress} />

        {/* Text Overlays — top-right corner, compact glassmorphism cards */}
        
        {/* 0% — CV Nursery */}
        <motion.div
          style={{ opacity: opacity1, y: y1 }}
          className="fixed top-32 right-6 md:top-36 md:right-10 pointer-events-none z-10 max-w-[220px]"
        >
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl px-5 py-4 shadow-xl">
            <h1 className="text-lg md:text-xl font-bold text-black/90 tracking-tight mb-1 text-right">
              CV Nursery
            </h1>
            <p className="text-xs md:text-sm text-black/60 font-light tracking-wide text-right">
              Where life begins.
            </p>
          </div>
        </motion.div>

        {/* 25% — Rooted in Care */}
        <motion.div
          style={{ opacity: opacity2, y: y2 }}
          className="fixed top-32 right-6 md:top-36 md:right-10 pointer-events-none z-10 max-w-[220px]"
        >
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl px-5 py-4 shadow-xl">
            <div className="w-6 h-0.5 bg-emerald-500 mb-2 ml-auto rounded-full" />
            <h2 className="text-base md:text-lg font-medium text-black/90 tracking-tight mb-1 text-right">
              Rooted in Care
            </h2>
            <p className="text-xs md:text-sm text-black/60 font-light tracking-wide text-right">
              Every plant nurtured with precision.
            </p>
          </div>
        </motion.div>

        {/* 60% — Growing Naturally */}
        <motion.div
          style={{ opacity: opacity3, y: y3 }}
          className="fixed top-32 right-6 md:top-36 md:right-10 pointer-events-none z-10 max-w-[220px]"
        >
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl px-5 py-4 shadow-xl">
            <div className="w-6 h-0.5 bg-emerald-500 mb-2 ml-auto rounded-full" />
            <h2 className="text-base md:text-lg font-medium text-black/90 tracking-tight mb-1 text-right">
              Growing Naturally
            </h2>
            <p className="text-xs md:text-sm text-black/60 font-light tracking-wide text-right">
              From soil to life.
            </p>
          </div>
        </motion.div>

        {/* 90% — CTA */}
        <motion.div
          style={{ opacity: opacity4, y: y4 }}
          className="fixed top-32 right-6 md:top-36 md:right-10 pointer-events-none z-10 max-w-[220px]"
        >
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl px-5 py-4 shadow-xl">
            <div className="w-6 h-0.5 bg-emerald-500 mb-2 ml-auto rounded-full" />
            <h2 className="text-base md:text-lg font-semibold text-black/90 tracking-tight mb-1 text-right">
              Bring Nature Home
            </h2>
            <p className="text-xs md:text-sm text-black/60 font-light tracking-wide text-right mb-3">
              Explore our collection.
            </p>
            <div className="pointer-events-auto flex justify-end">
              <Link to="/shop">
                <button className="px-5 py-2 bg-black text-white rounded-full font-medium text-xs hover:bg-black/80 transition-colors shadow-md">
                  Shop Collection
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- CONTENT SECTIONS --- */}
      <div className="relative z-20">
        <div className="h-24 bg-gradient-to-b from-transparent via-white/80 to-white" />


      {/* Category Circles Bar */}
      <section className="py-6 md:py-8 bg-white border-b border-gray-100 z-20">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 md:gap-8 lg:gap-10 overflow-x-auto pb-2 md:justify-center snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            <style>{`.snap-x::-webkit-scrollbar { display: none; }`}</style>
            {featuredCategories.map((cat, i) => (
              <motion.div key={cat.name} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                className="snap-center shrink-0"
              >
                <Link to={cat.name === 'Offers' ? '/shop?discount=true' : `/shop?category=${encodeURIComponent(cat.name)}`}
                  className="flex flex-col items-center gap-1.5 w-[60px] md:w-[75px] group"
                >
                  <div className={`w-[52px] h-[52px] md:w-[72px] md:h-[72px] rounded-full overflow-hidden border-2 ${
                    (cat as any).isSpecial ? 'border-red-400 bg-red-400' : 'border-gray-200 group-hover:border-emerald-500 active:border-emerald-500'
                  } transition-all duration-300 shadow-sm group-hover:shadow-md active:scale-95`}>
                    {(cat as any).isSpecial ? (
                      <div className="w-full h-full flex items-center justify-center bg-red-400 text-white text-xl md:text-2xl font-black">%</div>
                    ) : (
                      <img src={cat.image} alt={cat.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    )}
                  </div>
                  <span className="text-[9px] md:text-[10px] font-bold text-gray-600 group-hover:text-emerald-600 transition-colors text-center uppercase tracking-wider leading-tight">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DYNAMIC SCROLLING OFFERS MARQUEE (OPTIMIZED FOR CLARITY) */}
      <section className="py-24 bg-white z-20 overflow-hidden relative">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 flex items-center justify-center md:justify-start">
            <div className="flex flex-col gap-1">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-1 bg-rose-500 rounded-full" />
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em]">Limited Drops</span>
               </div>
               <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase">Exclusive Campaigns</h3>
            </div>
         </div>
         
         <div className="relative">
            {/* Edge Fades for Cinematic Feel */}
            <div className="absolute top-0 left-0 w-64 h-full bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />
            
            <motion.div 
              animate={{ x: [0, -2500] }}
              transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
              className="flex gap-12 whitespace-nowrap px-10"
            >
               {[...activeOffers, ...activeOffers, ...activeOffers, ...activeOffers].map((offer, i) => (
                 <motion.div 
                   key={`${offer.id}-${i}`}
                   whileHover={{ y: -10, scale: 1.02 }}
                   className="shrink-0 relative w-[500px] h-[340px] rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border-4 border-white/60 group cursor-pointer"
                 >
                    <img 
                      src={offer.banner} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" 
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2000' }}
                    />
                    
                    {/* Floating Glass Tag */}
                    <div className="absolute top-8 left-8">
                       <div className="px-6 py-2.5 bg-black/40 backdrop-blur-xl border border-white/20 text-white rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3">
                          <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                          {offer.discount}
                       </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent p-12 flex flex-col justify-end">
                       <h4 className="text-4xl md:text-5xl font-black text-white mb-4 whitespace-normal leading-[1.1] tracking-tighter group-hover:text-emerald-300 transition-colors">
                         {offer.title}
                       </h4>
                       <div className="flex items-center gap-6">
                          <p className="text-[11px] text-white/50 font-black uppercase tracking-[0.4em]">Limited Time Campaign</p>
                          <div className="h-[2px] flex-1 bg-white/10 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ x: '-100%' }}
                               whileInView={{ x: '0%' }}
                               transition={{ duration: 1, delay: 0.5 }}
                               className="h-full bg-emerald-500 w-1/3" 
                             />
                          </div>
                          <button className="w-14 h-14 bg-white text-slate-900 rounded-full flex items-center justify-center group-hover:bg-emerald-400 group-hover:text-white transition-all shadow-xl group-hover:rotate-12">
                             <ChevronRight className="w-7 h-7" />
                          </button>
                       </div>
                    </div>
                 </motion.div>
               ))}
            </motion.div>
         </div>
      </section>

      {/* Trending Section */}
      <section className="py-14 bg-white z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 text-center mb-10">Trending</h2>
          <div className="flex justify-center gap-6 md:gap-12 overflow-x-auto pb-4 snap-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            <style>{`.snap-x::-webkit-scrollbar{display:none}`}</style>
            {[
              { name: 'Bonsai Plants', sub: 'Upto 25% Off', image: 'https://images.unsplash.com/photo-1567331711402-509c12c41959?w=300' },
              { name: 'Ceramic Planters', sub: 'Starting ₹299', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300' },
              { name: 'Kokedama', sub: 'Starting ₹249', image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=300' },
              { name: 'Seasonal Gardening', sub: 'Upto 65% Off', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="snap-center shrink-0 flex flex-col items-center gap-3 group cursor-pointer"
              >
                <Link to="/shop" className="flex flex-col items-center gap-3">
                  <div className="w-[130px] h-[130px] md:w-[160px] md:h-[160px] rounded-full overflow-hidden border-4 border-gray-100 group-hover:border-emerald-400 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-800">{item.name}</p>
                    <p className="text-xs font-semibold text-rose-500">{item.sub}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Garden Decor & Care — 3D Scroll */}
      <section className="py-16 md:py-20 bg-white z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-emerald-600 font-bold text-xs uppercase tracking-[0.2em]">Shop by Collection</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-2">Garden Decor & Care</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {[
              { title: 'Planters', price: '₹129', desc: 'Add color to your garden with 400+ designer pots.', image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=700' },
              { title: 'Soil & Fertilizers', price: '₹100', desc: 'Nourish your plants with premium organic soil mixes.', image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=700' },
              { title: 'Pebbles & Stones', price: '₹79', desc: 'Decorative natural pebbles for elegant plant styling.', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=700' },
              { title: 'Garden Tools', price: '₹129', desc: 'Professional-grade tools for every green thumb.', image: 'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?w=700' },
            ].map((card, i) => (
              <DecorCard key={i} card={card} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Grid */}
      <section className="py-16 bg-gray-50 border-y border-gray-100 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900">Best Sellers</h2>
              <p className="text-gray-500 mt-1">Our most loved plants by the community</p>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-full font-semibold text-sm hover:bg-emerald-700 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {bestSellers.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10 md:hidden">
            <Link to="/shop">
              <button className="px-8 py-3 bg-emerald-600 text-white rounded-full font-bold text-sm">View All Products</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value For Money — Horizontal Scroll */}
      {allProducts.filter(p => p.discount && p.discount >= 20).length > 0 && (
        <section className="py-14 bg-white z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">Value For Money – Upto 35% Off</h2>
              <Link to="/shop" className="text-emerald-600 font-semibold text-sm hover:text-emerald-700 flex items-center gap-1">
                See All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Scrollable Row */}
            <div className="relative group/scroll">
              <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
              >
                {allProducts.filter(p => p.discount && p.discount >= 20).map((product) => {
                  const originalPrice = product.originalPrice || Math.round(product.price * (100 / (100 - product.discount!)));
                  return (
                    <Link key={product.id} to={`/product/${product.id}`} className="snap-start shrink-0 w-[220px] md:w-[240px]">
                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full"
                      >
                        {/* Image + Badge */}
                        <div className="relative aspect-square bg-gray-50 p-4 flex items-center justify-center">
                          <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" loading="lazy" />
                          <span className="absolute top-3 left-3 px-2.5 py-1 bg-red-500 text-white text-[11px] font-bold rounded-md shadow">
                            Save {product.discount}%
                          </span>
                        </div>

                        {/* Info */}
                        <div className="p-4">
                          {/* Price */}
                          <div className="flex items-baseline gap-2 mb-1.5">
                            <span className="text-gray-400 text-sm line-through">₹{originalPrice}</span>
                            <span className="text-xl font-black text-gray-900">₹{product.price}</span>
                          </div>

                          {/* Name */}
                          <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-2 line-clamp-2">{product.name}</h3>

                          {/* Rating */}
                          <div className="flex items-center gap-1.5 mb-2">
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, j) => (
                                <Star key={j} className={`w-3.5 h-3.5 ${j < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                              ))}
                            </div>
                            <span className="text-xs text-gray-400">{product.reviews} reviews</span>
                          </div>

                          {/* Offers tag */}
                          {product.discount >= 25 && (
                            <div className="flex items-center gap-1 text-red-500">
                              <Tag className="w-3.5 h-3.5" />
                              <span className="text-[11px] font-bold">Offers Inside</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Special Offers Section — Cinematic Banners */}
      <section className="py-24 px-4 bg-slate-50 relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/50 rounded-full blur-[150px] -mr-64 -mt-64" />
        <div className="max-w-[1600px] mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12 px-4"
          >
            <div>
               <h2 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-4">Limited Edition</h2>
               <p className="text-5xl font-black text-slate-900 tracking-tighter">Premium Deals</p>
            </div>
            <div className="hidden md:flex gap-4">
               <div className="w-16 h-16 bg-white rounded-full border border-slate-100 flex items-center justify-center shadow-sm font-black text-xs">OFFERS</div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Offer Banner 1 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative h-[600px] rounded-[4rem] overflow-hidden group shadow-2xl border border-white"
            >
               <img src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1000" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2.5s]" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-16 flex flex-col justify-end">
                  <div className="px-5 py-2 bg-orange-500 text-white rounded-full w-fit text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl">Summer Collection</div>
                  <h3 className="text-6xl font-black text-white mb-6 leading-[0.95] tracking-tighter">Upto 40% OFF <br/>on Exotic Blooms</h3>
                  <p className="text-white/60 font-bold uppercase tracking-widest text-xs mb-12 max-w-sm">Elevate your living space with our premium selection of rare flowering plants.</p>
                  <Link to="/shop" className="w-fit px-12 py-6 bg-white text-slate-900 rounded-full font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-2xl">Claim Offer</Link>
               </div>
            </motion.div>

            {/* Offer Banner 2 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative h-[600px] rounded-[4rem] overflow-hidden group shadow-2xl border border-white"
            >
               <img src="https://images.unsplash.com/photo-1512428813824-f713cb752935?q=80&w=1000" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2.5s]" />
               <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/30 to-transparent p-16 flex flex-col justify-end">
                  <div className="px-5 py-2 bg-emerald-500 text-white rounded-full w-fit text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl">Curated Assets</div>
                  <h3 className="text-6xl font-black text-white mb-6 leading-[0.95] tracking-tighter">Tropical Palms <br/>Flat ₹500 OFF</h3>
                  <p className="text-white/60 font-bold uppercase tracking-widest text-xs mb-12 max-w-sm">Bring the serenity of the tropics to your doorstep with our palm collection.</p>
                  <Link to="/shop" className="w-fit px-12 py-6 bg-emerald-500 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-white hover:text-emerald-900 transition-all shadow-2xl">Use Code: PALM500</Link>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section — Compact */}
      <section className="py-20 bg-white z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="rounded-3xl overflow-hidden shadow-xl">
                <img src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800" alt="About CV Nursery" className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest">About Us</span>
              <h2 className="text-4xl font-black text-gray-900 mt-2 mb-6">Cultivating <span className="text-emerald-600">Nature</span></h2>
              <p className="text-gray-600 leading-relaxed mb-4">CV Nursery is more than a plant store. Every leaf and root is meticulously nurtured to ensure absolute health and vibrancy.</p>
              <p className="text-gray-600 leading-relaxed mb-8">Our commitment spans sustainable packaging to ethical sourcing, delivering you a premium slice of nature.</p>
              <div className="flex items-center gap-6">
                <Link to="/shop">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="px-7 py-3 bg-emerald-600 text-white rounded-full font-bold text-sm hover:bg-emerald-700 transition-colors shadow-lg flex items-center gap-2"
                  >Discover More <ArrowRight className="w-4 h-4" /></motion.button>
                </Link>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" className="w-full h-full object-cover"/>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">10k+</p>
                    <p className="text-xs text-gray-500">Happy Customers</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-emerald-900 relative overflow-hidden z-20">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-black mb-3 text-white">What Customers Say</h2>
            <p className="text-emerald-200/60 text-lg">Don't take our word for it.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((review, i) => (
              <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400" />
                  <div>
                    <h4 className="font-bold text-white text-sm">{review.name}</h4>
                    <div className="flex gap-0.5 mt-0.5">
                      {[...Array(review.rating)].map((_, j) => (
                        <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">"{review.comment}"</p>
                <p className="text-xs text-emerald-400 mt-4 font-semibold uppercase tracking-wider">{review.date}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Newsletter */}
      <section className="py-20 bg-white z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
            className="relative rounded-[2rem] overflow-hidden"
          >
            {/* Dark luxury background */}
            <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 p-10 md:p-16">
              {/* Floating orbs */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-green-400/10 rounded-full blur-[60px] pointer-events-none" />
              <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-emerald-300/5 rounded-full blur-[40px] pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                {/* Left — Text */}
                <div className="flex-1 text-center md:text-left">
                  <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-[0.25em]">Newsletter</span>
                    <h2 className="text-3xl md:text-4xl font-black text-white mt-3 mb-3 leading-tight">
                      Join Our <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">Green</span> Community
                    </h2>
                    <p className="text-white/50 text-sm max-w-md leading-relaxed">
                      Get exclusive offers, expert plant care tips, and early access to new arrivals. No spam, just green goodness.
                    </p>
                  </motion.div>
                </div>

                {/* Right — Form */}
                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.35 }}
                  className="flex-1 w-full max-w-md"
                >
                  <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" required
                      className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 text-sm backdrop-blur-sm transition-all"
                    />
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                      className="w-full px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-400 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all"
                    >Subscribe Now →</motion.button>
                  </form>
                  <p className="text-white/25 text-[11px] mt-3 text-center">By subscribing, you agree to our privacy policy. Unsubscribe anytime.</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Happy Customers — Premium Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="text-center mb-16"
          >
            <span className="text-emerald-600 font-bold text-xs uppercase tracking-[0.25em]">Why Choose Us</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3 mb-4">
              Loved by <span className="bg-gradient-to-r from-emerald-600 to-green-400 bg-clip-text text-transparent">10,000+</span> Customers
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">From plant enthusiasts to corporate offices — delivering happiness since 2016.</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-20">
            {[
              { value: '10K+', label: 'Happy Customers', icon: Users, gradient: 'from-emerald-600 to-emerald-500' },
              { value: '500+', label: 'Plant Varieties', icon: Leaf, gradient: 'from-teal-600 to-teal-500' },
              { value: '50+', label: 'Cities Delivered', icon: MapPin, gradient: 'from-green-600 to-green-500' },
              { value: '4.8★', label: 'Average Rating', icon: Award, gradient: 'from-amber-500 to-amber-400' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.12, duration: 0.6, type: "spring", bounce: 0.4 }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 md:p-7 border border-gray-100/80 border-b-gray-200/60 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.06)] group-hover:shadow-[0_4px_8px_rgba(16,185,129,0.06),0_8px_24px_rgba(16,185,129,0.1),0_20px_60px_rgba(16,185,129,0.15)] group-hover:border-emerald-200/60 transition-all duration-500 h-full relative overflow-hidden">
                  <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/0 to-transparent group-hover:via-emerald-400/40 transition-all duration-500" />
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 shadow-md`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-3xl md:text-4xl font-black text-gray-900 leading-none mb-1">{stat.value}</p>
                  <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Social Proof Strip */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="flex flex-col items-center gap-8"
          >
            {/* Avatars */}
            <div className="flex -space-x-3">
              {[11, 12, 13, 14, 15, 16, 17, 18].map((id, idx) => (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06, type: "spring", bounce: 0.5 }}
                  className="w-11 h-11 md:w-13 md:h-13 rounded-full border-[3px] border-white shadow-md overflow-hidden"
                >
                  <img src={`https://i.pravatar.cc/120?img=${id}`} alt="" className="w-full h-full object-cover" />
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring", bounce: 0.5 }}
                className="w-11 h-11 md:w-13 md:h-13 rounded-full border-[3px] border-white shadow-md bg-emerald-600 flex items-center justify-center text-white text-[10px] font-black"
              >
                9K+
              </motion.div>
            </div>

            {/* Rating */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 text-sm"><span className="font-bold">4.8</span> out of 5 · <span className="text-gray-400">2,400+ reviews</span></p>
            </div>

            {/* Trust text */}
            <p className="text-gray-400 text-center max-w-lg text-sm leading-relaxed">
              Join thousands of happy plant parents who trust CV Nursery for premium, healthy plants delivered with care.
            </p>

            {/* CTA */}
            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-gray-900 text-white rounded-full font-bold text-sm shadow-xl hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                Start Shopping <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      </div>{/* End of z-20 wrapper */}

    </div>
  );
}
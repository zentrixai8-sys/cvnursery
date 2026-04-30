import { useState } from 'react';
import { motion } from 'motion/react';
import { Tag, Plus, X, Upload, Megaphone, Trash2, Edit } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';

export function AdminOffers() {
  const [offers, setOffers] = useState([
    { id: '1', title: 'Summer Bloom Sale', discount: '20% Off', banner: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1000' },
    { id: '2', title: 'New Arrival: Palms', discount: 'Flat ₹200 Off', banner: 'https://images.unsplash.com/photo-1512428813824-f713cb752935?q=80&w=1000' },
  ]);

  return (
    <AdminLayout title="Offer Campaigns">
      <div className="space-y-6">
        
        {/* Header Section (Compact) */}
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-white/60 shadow-sm">
           <div>
             <h3 className="text-2xl font-bold tracking-tight text-slate-900">Campaigns</h3>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Create floating home page banners</p>
           </div>
           <button className="px-6 py-3 bg-[#1A1A1A] text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2 hover:scale-105 transition-transform">
             <Plus className="w-4 h-4" />
             Create New Offer
           </button>
        </div>

        {/* Offers Grid (Compact) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {offers.map((offer) => (
             <div key={offer.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-white/60 group relative h-64">
                <img 
                  src={offer.banner} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" 
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2000' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 flex flex-col justify-end">
                   <div className="px-3 py-1 bg-orange-400 text-white rounded-lg w-fit text-[8px] font-black uppercase tracking-widest mb-3">
                     {offer.discount}
                   </div>
                   <h4 className="text-xl font-bold text-white mb-1 leading-tight">{offer.title}</h4>
                   <p className="text-[8px] text-white/50 font-black uppercase tracking-[0.2em] mb-4">Live on Storefront</p>
                   
                   <div className="flex gap-2">
                      <button className="flex-1 py-2.5 bg-white text-[#1A1A1A] rounded-xl font-bold text-[9px] uppercase tracking-widest hover:bg-slate-50 transition-colors">Edit</button>
                      <button className="w-9 h-9 bg-rose-500/10 backdrop-blur-md text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                   </div>
                </div>
             </div>
           ))}
        </div>

      </div>
    </AdminLayout>
  );
}

import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, Search, X, Upload, Loader2, Tag, ArrowUpRight, MoreVertical, Package } from 'lucide-react';
import { fetchProducts } from '../../data/products';
import { useEffect } from 'react';
import { Product } from '../../context/AppContext';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';
import { AdminLayout } from '../../components/AdminLayout';

export function AdminProducts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Indoor Plants',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isOffer, setIsOffer] = useState(false);
  const [discountPercent, setDiscountPercent] = useState('');

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !imageFile) {
      toast.error('Please fill all required fields');
      return;
    }
    setIsUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error: uploadError } = await supabase.storage.from('products').upload(filePath, imageFile);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(filePath);
      const newId = newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
      const productData = {
        id: newId,
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        image: publicUrl,
        discount: isOffer && discountPercent ? parseInt(discountPercent, 10) : 0,
        rating: 5.0,
        reviews: 0,
        description: 'Premium nursery plant.',
        in_stock: true,
      };
      const { error: dbError } = await supabase.from('products').insert(productData);
      if (dbError) throw dbError;
      toast.success('Product uploaded!');
      setIsModalOpen(false);
      setNewProduct({ name: '', price: '', category: 'Indoor Plants' });
      setImageFile(null);
      fetchProducts().then(setProducts);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <AdminLayout title="Products">
      <div className="space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-[#1A1A1A]">Collection</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Manage your botanical assets</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-[#1A1A1A] text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </motion.button>
        </div>

        {/* Search Bento */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-white/60">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm"
            />
          </div>
        </div>

        {/* Products Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-white/60 group hover:shadow-xl transition-all flex flex-col"
            >
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2000';
                  }}
                />
                <div className="absolute top-4 right-4 flex flex-col gap-1.5">
                   <button className="w-8 h-8 bg-white/80 backdrop-blur-md rounded-lg flex items-center justify-center shadow-md hover:bg-white transition-colors">
                     <Edit className="w-3.5 h-3.5 text-slate-600" />
                   </button>
                   <button className="w-8 h-8 bg-white/80 backdrop-blur-md rounded-lg flex items-center justify-center shadow-md hover:bg-rose-50 hover:text-rose-600 transition-colors">
                     <Trash2 className="w-3.5 h-3.5" />
                   </button>
                </div>
                {product.discount > 0 && (
                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-red-500 text-white rounded-md text-[8px] font-black uppercase tracking-widest">
                    {product.discount}% OFF
                  </div>
                )}
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">{product.name}</h3>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{product.category}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</span>
                    <span className="text-2xl font-bold tracking-tighter">₹{product.price}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In Stock</span>
                    <div className="flex items-center gap-1 mt-1">
                      <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                      <span className="text-xs font-bold">{product.inStock ? 'Active' : 'Out'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modern Modal Overhaul */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1A1A1A]/40 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
           <motion.div
             initial={{ opacity: 0, y: 100, scale: 0.9 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             className="bg-[#F7F5E4] w-full max-w-xl rounded-[3.5rem] shadow-2xl p-12 relative overflow-hidden"
           >
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full -mr-32 -mt-32 blur-3xl" />
             
             <div className="flex justify-between items-center mb-10 relative z-10">
               <div>
                 <h2 className="text-4xl font-bold tracking-tight">New Addition</h2>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Add to CV Nursery collection</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100">
                 <X className="w-6 h-6 text-slate-400" />
               </button>
             </div>

             <form onSubmit={handleAddProduct} className="space-y-8 relative z-10">
               <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</label>
                     <input type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</label>
                     <input type="number" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
                   </div>
                 </div>

                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                   <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold appearance-none">
                     <option>Indoor Plants</option>
                     <option>Outdoor Plants</option>
                     <option>Flower Plants</option>
                     <option>Pots</option>
                   </select>
                 </div>

                 <div className="bg-white/50 p-6 rounded-[2rem] border border-white/60">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Product Asset</label>
                    <div className="relative border-2 border-dashed border-slate-200 rounded-[2rem] p-10 flex flex-col items-center justify-center bg-white group cursor-pointer overflow-hidden">
                       <input type="file" required accept="image/*" onChange={e => e.target.files && setImageFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                       {imageFile ? (
                         <div className="text-center">
                           <p className="text-emerald-600 font-bold">{imageFile.name}</p>
                         </div>
                       ) : (
                         <>
                           <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                             <Upload className="w-6 h-6 text-slate-400" />
                           </div>
                           <p className="text-sm font-bold text-slate-700">Drag or click to upload</p>
                         </>
                       )}
                    </div>
                 </div>
               </div>

               <div className="flex gap-4">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest text-xs">Discard</button>
                 <button type="submit" disabled={isUploading} className="flex-[2] py-5 bg-[#1A1A1A] text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50">
                    {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Package className="w-5 h-5" />}
                    <span>Confirm Asset Addition</span>
                 </button>
               </div>
             </form>
           </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}

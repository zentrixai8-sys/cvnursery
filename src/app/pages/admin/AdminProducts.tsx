import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { LayoutDashboard, Plus, Edit, Trash2, Search, X, Upload, Loader2, Tag } from 'lucide-react';
import { fetchProducts } from '../../data/products';
import { useEffect } from 'react';
import { Product } from '../../context/AppContext';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';

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
      toast.error('Please fill all required fields and select an image');
      return;
    }

    setIsUploading(true);

    try {
      // 1. Upload Image to Supabase Storage 'products' bucket
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Image Upload Failed: ${uploadError.message}. Make sure the 'products' storage bucket exists and is public.`);
      }

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      // 3. Save to database
      const priceNum = parseFloat(newProduct.price);
      const newId = newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
      const discountNum = isOffer && discountPercent ? parseInt(discountPercent, 10) : 0;

      const productData = {
        id: newId,
        name: newProduct.name,
        price: priceNum,
        category: newProduct.category,
        image: publicUrl,
        discount: discountNum,
        rating: 5.0,
        reviews: 0,
        description: 'A beautiful plant for your space.',
        care_guide: 'Water moderately and keep in bright indirect light.',
        in_stock: true,
      };

      const { error: dbError } = await supabase.from('products').insert(productData);

      if (dbError) throw dbError;

      toast.success('Product and image uploaded successfully!');
      setIsModalOpen(false);
      setNewProduct({ name: '', price: '', category: 'Indoor Plants' });
      setImageFile(null);
      setIsOffer(false);
      setDiscountPercent('');
      
      fetchProducts().then(setProducts);

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--nature-green)] to-[var(--nature-green-light)] rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Product Management</h1>
                <p className="text-sm text-muted-foreground">Manage your products</p>
              </div>
            </div>
            <Link to="/" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Back to Site
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <Link to="/admin">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-white border border-border rounded-lg hover:bg-muted transition-colors whitespace-nowrap"
            >
              Dashboard
            </motion.div>
          </Link>
          <Link to="/admin/products">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg whitespace-nowrap"
            >
              Products
            </motion.div>
          </Link>
          <Link to="/admin/orders">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-white border border-border rounded-lg hover:bg-muted transition-colors whitespace-nowrap"
            >
              Orders
            </motion.div>
          </Link>
          <Link to="/admin/billing">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-white border border-border rounded-lg hover:bg-muted transition-colors whitespace-nowrap"
            >
              Billing POS
            </motion.div>
          </Link>
          <Link to="/admin/customers">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-white border border-border rounded-lg hover:bg-muted transition-colors whitespace-nowrap"
            >
              Customers
            </motion.div>
          </Link>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </motion.button>
        </div>

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left py-4 px-6 font-medium">Product</th>
                  <th className="text-left py-4 px-6 font-medium">Category</th>
                  <th className="text-left py-4 px-6 font-medium">Price</th>
                  <th className="text-left py-4 px-6 font-medium">Stock</th>
                  <th className="text-left py-4 px-6 font-medium">Rating</th>
                  <th className="text-left py-4 px-6 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.reviews} reviews</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold">₹{product.price}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{product.rating}</span>
                        <span className="text-amber-400">★</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
               <h2 className="text-xl font-bold">Add New Product</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
                type="button"
                disabled={isUploading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-4 py-2 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Monstera Deliciosa"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="w-full px-4 py-2 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. 599"
                />
              </div>

               <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full px-4 py-2 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Indoor Plants">Indoor Plants</option>
                  <option value="Outdoor Plants">Outdoor Plants</option>
                  <option value="Flower Plants">Flower Plants</option>
                  <option value="Pots">Pots & Accessories</option>
                </select>
              </div>

              {/* Special Offers Section */}
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 font-medium">
                    <Tag className="w-4 h-4" />
                    <label>Special Offer?</label>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={isOffer}
                      onChange={(e) => setIsOffer(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
                
                {isOffer && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <label className="block text-sm font-medium mb-1 text-emerald-800">Discount Percentage (%)</label>
                    <input
                      type="number"
                      required={isOffer}
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="e.g. 20"
                      min="1"
                      max="99"
                    />
                  </motion.div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Upload Product Image *</label>
                <div className="relative border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer group bg-muted/20">
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {imageFile ? (
                    <div className="text-center">
                      <p className="font-medium text-primary line-clamp-1">{imageFile.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{(imageFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Upload className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-sm font-medium">Click to upload image</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 5MB</p>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>Save Product</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

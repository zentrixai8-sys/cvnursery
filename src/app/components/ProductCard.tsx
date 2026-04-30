import { motion } from 'motion/react';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { Link } from 'react-router';
import { Product } from '../context/AppContext';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, setQuickViewProduct } = useApp();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    setQuickViewProduct(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      <Link to={`/product/${product.id}`}>
        <motion.div 
          whileHover={{ 
            rotateY: 5, 
            rotateX: -2, 
            scale: 1.02,
            y: -10
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          style={{ perspective: 1000 }}
          className="relative bg-white rounded-3xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.1)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.15)] transition-all duration-500 border-2 border-slate-300 group/card"
        >
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Discount Badge */}
            {product.discount && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold shadow-lg"
              >
                -{product.discount}%
              </motion.div>
            )}

            {/* Stock Badge */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-bold text-lg">Out of Stock</span>
              </div>
            )}

            {/* Quick Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute top-4 left-4 flex flex-col gap-2"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleToggleWishlist}
                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                  inWishlist
                    ? 'bg-destructive text-destructive-foreground'
                    : 'bg-white/90 text-foreground hover:bg-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleQuickView}
                className="p-2 bg-white/90 rounded-full backdrop-blur-sm hover:bg-white transition-colors"
              >
                <Eye className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>

          {/* Product Info (Premium Layout) */}
          <div className="p-5">
            {/* Category & Rating */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600/70">
                {product.category}
              </span>
              <div className="flex items-center gap-1">
                 <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                 <span className="text-[10px] font-bold text-slate-400">{product.rating} ({product.reviews})</span>
              </div>
            </div>

            <h3 className="text-lg font-black tracking-tight mb-4 text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
              {product.name}
            </h3>

            {/* Price & Action */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex flex-col">
                {product.originalPrice && (
                  <span className="text-[10px] font-bold text-slate-400 line-through mb-[-4px]">
                    ₹{product.originalPrice}
                  </span>
                )}
                <span className="text-2xl font-black text-slate-900 tracking-tighter">
                  ₹{product.price}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-12 h-12 bg-slate-50 text-slate-700 rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600 hover:text-white hover:border-transparent border border-slate-200 shadow-sm"
              >
                <ShoppingCart className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

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
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-[var(--glass-border)]">
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

          {/* Product Info */}
          <div className="p-4">
            <div className="mb-2">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                {product.category}
              </span>
            </div>

            <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviews})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">
                  ₹{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

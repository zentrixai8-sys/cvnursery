import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Heart, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router';

export function QuickView() {
  const { quickViewProduct, setQuickViewProduct, addToCart, addToWishlist, isInWishlist } = useApp();

  if (!quickViewProduct) return null;

  const inWishlist = isInWishlist(quickViewProduct.id);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={() => setQuickViewProduct(null)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Quick View</h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuickViewProduct(null)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Product Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                />
                {quickViewProduct.discount && (
                  <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold">
                    -{quickViewProduct.discount}%
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col">
                <div className="mb-2">
                  <span className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                    {quickViewProduct.category}
                  </span>
                </div>

                <h3 className="text-3xl font-bold mb-4">{quickViewProduct.name}</h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(quickViewProduct.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {quickViewProduct.rating} ({quickViewProduct.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl font-bold text-primary">
                    ₹{quickViewProduct.price}
                  </span>
                  {quickViewProduct.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      ₹{quickViewProduct.originalPrice}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {quickViewProduct.description}
                </p>

                {/* Stock Status */}
                <div className="mb-6">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      quickViewProduct.inStock
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {quickViewProduct.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => addToCart(quickViewProduct)}
                    disabled={!quickViewProduct.inStock}
                    className="flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (inWishlist) {
                        // removeFromWishlist would need to be added
                      } else {
                        addToWishlist(quickViewProduct);
                      }
                    }}
                    className={`p-4 rounded-xl border transition-colors ${
                      inWishlist
                        ? 'bg-destructive text-destructive-foreground border-destructive'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
                  </motion.button>
                </div>

                {/* View Full Details */}
                <Link
                  to={`/product/${quickViewProduct.id}`}
                  onClick={() => setQuickViewProduct(null)}
                  className="mt-4 text-center text-primary hover:underline"
                >
                  View Full Details →
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

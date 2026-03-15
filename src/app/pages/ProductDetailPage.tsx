import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingCart, Heart, Star, Leaf, Droplet, Sun, ThermometerIcon } from 'lucide-react';
import { fetchProducts } from '../data/products';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { useState, useEffect } from 'react';
import { Product } from '../context/AppContext';

export function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProducts().then((data) => {
      setAllProducts(data);
      const found = data.find((p) => p.id === id) ?? null;
      setProduct(found);
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Link to="/shop" className="text-primary hover:underline">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shop</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted shadow-2xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discount && (
                <div className="absolute top-6 right-6 bg-destructive text-destructive-foreground px-4 py-2 rounded-full font-bold shadow-lg">
                  -{product.discount}% OFF
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-3">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {product.category}
              </span>
            </div>

            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl font-bold text-primary">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-2xl text-muted-foreground line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium ${
                  product.inStock
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-600' : 'bg-red-600'}`} />
                <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
              </span>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-lg border border-border hover:bg-muted transition-colors flex items-center justify-center font-bold text-xl"
                >
                  −
                </motion.button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 h-12 text-center border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-lg border border-border hover:bg-muted transition-colors flex items-center justify-center font-bold text-xl"
                >
                  +
                </motion.button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (inWishlist) {
                    removeFromWishlist(product.id);
                  } else {
                    addToWishlist(product);
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

            {/* Plant Care Guide */}
            <div className="bg-gradient-to-br from-[var(--nature-green)]/10 to-[var(--nature-green-light)]/10 rounded-2xl p-6 border border-[var(--glass-border)]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold">Plant Care Guide</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {product.careGuide}
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Droplet className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Watering</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Sun className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Sunlight</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <ThermometerIcon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Temperature</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold">Related Products</h2>
              <p className="text-muted-foreground">You might also like these</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

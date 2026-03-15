import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { fetchProducts, categories } from '../data/products';
import { useSearchParams } from 'react-router';
import { Product } from '../context/AppContext';

export function ShopPage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All Plants');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts().then((data) => {
      setAllProducts(data);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  // Filter and sort products
  const filteredProducts = allProducts
    .filter((product) => {
      if (selectedCategory !== 'All Plants' && product.category !== selectedCategory) {
        return false;
      }
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.reviews - a.reviews;
    });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-[var(--nature-green)] to-[var(--nature-green-light)] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop Plants</h1>
            <p className="text-lg text-white/90">
              Discover our wide collection of beautiful, healthy plants
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6 flex items-center justify-between">
          <div className="text-muted-foreground">
            Showing {filteredProducts.length} products
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:col-span-1`}
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
              {/* Mobile Close Button */}
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h3 className="text-xl font-bold">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-bold mb-4 text-lg">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h3 className="font-bold mb-4 text-lg">Price Range</h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-primary"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">₹{priceRange[0]}</span>
                    <span className="font-medium">₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-4">
                <h3 className="font-bold mb-4 text-lg">Sort By</h3>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 bg-muted rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* Reset Filters */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedCategory('All Plants');
                  setPriceRange([0, 2000]);
                  setSortBy('popularity');
                  setShowFilters(false);
                }}
                className="w-full py-3 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Reset Filters
              </motion.button>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div className="text-muted-foreground">
                Showing {filteredProducts.length} products
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Filter className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters to see more results
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedCategory('All Plants');
                    setPriceRange([0, 2000]);
                  }}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Reset Filters
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

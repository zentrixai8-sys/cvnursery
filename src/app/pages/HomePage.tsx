import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router';
import { ArrowRight, Leaf, Truck, Shield, HeadphonesIcon, Star, RefreshCw, Tag } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { fetchProducts, reviews } from '../data/products';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Product, useApp } from '../context/AppContext';
import { supabase } from '../../lib/supabase';

// 3D Imports
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';
import { ErrorBoundary } from '../components/ErrorBoundary';

// ------------------------------------------------------------
// 3D Component: Abstract Glass Plant
// ------------------------------------------------------------
function AbstractPlant() {
  const group = useRef<THREE.Group>(null);
  
  // Animate Entry
  useFrame((state, delta) => {
    if (group.current) {
      group.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.04);
      group.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={group} scale={[0, 0, 0]} position={[0, -1.5, 0]}>
      {/* Modern Cylinder Pot */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.6, 1, 32]} />
        <meshPhysicalMaterial 
          color="#f4f7f4" 
          roughness={0.2}
          metalness={0.1}
          clearcoat={1}
        />
      </mesh>
      
      {/* Dirt plane */}
      <mesh position={[0, 1.01, 0]} receiveShadow>
        <cylinderGeometry args={[0.78, 0.78, 0.02, 32]} />
        <meshStandardMaterial color="#2c1a0e" roughness={0.9} />
      </mesh>

      {/* Main Stem */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 3, 16]} />
        <meshPhysicalMaterial color="#0f764a" roughness={0.4} />
      </mesh>

      {/* Abstract Leaves (Glass Morphism) */}
      {[
        { pos: [0.5, 2.0, 0.5], rot: [0.2, 0.5, -0.6], scale: [1, 0.05, 1.5] },
        { pos: [-0.6, 2.8, 0.2], rot: [0.3, -0.8, 0.5], scale: [1.2, 0.05, 1.8] },
        { pos: [0.2, 3.5, -0.6], rot: [-0.4, -0.2, -0.7], scale: [0.9, 0.05, 1.4] },
        { pos: [-0.4, 1.5, -0.5], rot: [-0.5, 0.6, 0.4], scale: [0.8, 0.05, 1.2] },
        { pos: [0.7, 3.8, 0.1], rot: [0.5, 0.1, -0.4], scale: [0.7, 0.05, 1.1] },
      ].map((leaf, i) => (
        <mesh 
          key={i} 
          position={leaf.pos as [number, number, number]} 
          rotation={leaf.rot as [number, number, number]} 
          scale={leaf.scale as [number, number, number]}
          castShadow
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhysicalMaterial 
            color="#10b981" 
            transmission={0.9} // Glass effect
            opacity={1}
            transparent
            metalness={0.1}
            roughness={0.1}
            ior={1.5}
            thickness={0.5}
          />
        </mesh>
      ))}

      {/* Floating Magic Orbs */}
      {[
        { pos: [1.5, 3.0, 1.0], color: "#34d399", size: 0.1 },
        { pos: [-1.2, 4.0, -1.0], color: "#10b981", size: 0.15 },
        { pos: [0.5, 4.5, 0.8], color: "#6ee7b7", size: 0.08 },
      ].map((orb, i) => (
        <mesh key={i} position={orb.pos as [number, number, number]}>
          <sphereGeometry args={[orb.size, 16, 16]} />
          <meshBasicMaterial color={orb.color} />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 15, 10]} intensity={2.5} penumbra={1} castShadow />
      <PresentationControls
        global
        config={{ mass: 1, tension: 170, friction: 26 }}
        snap={{ mass: 2, tension: 150, friction: 20 }}
        rotation={[0, -Math.PI / 4, 0]}
        polar={[-Math.PI / 6, Math.PI / 6]}
        azimuth={[-Math.PI / 2, Math.PI / 2]}
      >
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
          <AbstractPlant />
        </Float>
      </PresentationControls>
      <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
      <Environment preset="city" />
    </>
  );
}
// ------------------------------------------------------------


export function HomePage() {
  const [email, setEmail] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  
  // App context and admin check
  const { user } = useApp();
  const isAdmin = user?.email === 'zentrix.ai8@gmail.com';

  useEffect(() => {
    fetchProducts().then(setAllProducts);
  }, []);

  const bestSellers = allProducts.slice(0, 8);
  const featuredCategories = [
    {
      name: 'Indoor Plants',
      image: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?w=600',
      count: allProducts.filter((p) => p.category === 'Indoor Plants').length,
    },
    {
      name: 'Outdoor Plants',
      image: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=600',
      count: allProducts.filter((p) => p.category === 'Outdoor Plants').length,
    },
    {
      name: 'Flower Plants',
      image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600',
      count: allProducts.filter((p) => p.category === 'Flower Plants').length,
    },
    {
      name: 'Pots',
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600',
      count: allProducts.filter((p) => p.category === 'Pots').length,
    },
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

  return (
    <div className="bg-[#fbfcfa] min-h-screen overflow-hidden selection:bg-emerald-200">
      
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

      {/* Next-Gen Hero Section with 3D Canvas */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Subtle dynamic background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(167,243,208,0.3),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(254,240,138,0.3),transparent_40%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: 'easeOut', staggerChildren: 0.2 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 mb-8 mt-12 lg:mt-0"
              >
                <Leaf className="w-5 h-5 text-emerald-500" />
                <span className="font-bold tracking-wide uppercase text-sm">Welcome to CV Nursery</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-6xl md:text-8xl font-black text-gray-900 mb-6 leading-[1.05] tracking-tight"
              >
                Nature's <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-600">
                  Masterpiece.
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-xl md:text-2xl text-gray-600 mb-10 max-w-xl font-light tracking-wide leading-relaxed"
              >
                Immerse your living space in tranquility. We deliver meticulously grown, premium plants directly to your door.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-5"
              >
                <Link to="/shop">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(16,185,129,0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3"
                  >
                    <span>Shop Collection</span>
                    <ArrowRight className="w-6 h-6" />
                  </motion.button>
                </Link>
                <Link to="/shop">
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-gray-200 text-gray-800 rounded-2xl font-bold text-lg transition-all shadow-sm flex items-center justify-center"
                  >
                    Explore Categories
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Content - Full Interactive 3D Canvas */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="h-[600px] lg:h-[800px] w-full relative"
            >
              {/* Note for User Interaction */}
              <div className="absolute top-10 right-10 z-20 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 text-sm font-medium text-emerald-800 shadow-sm pointer-events-none animate-pulse">
                Click & Drag to Rotate
              </div>
              
              <div className="absolute inset-0 z-0">
                <ErrorBoundary>
                  <Canvas camera={{ position: [0, 2, 8], fov: 45 }} className="cursor-grab active:cursor-grabbing drop-shadow-2xl">
                    <Scene />
                  </Canvas>
                </ErrorBoundary>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="py-20 relative z-10 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {[
              { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹999', color: 'text-blue-500', bg: 'bg-blue-50' },
              { icon: Shield, title: 'Quality Assured', desc: 'Fresh & healthy guarantee', color: 'text-emerald-500', bg: 'bg-emerald-50' },
              { icon: HeadphonesIcon, title: '24/7 Experts', desc: 'Plant care round the clock', color: 'text-purple-500', bg: 'bg-purple-50' },
              { icon: Leaf, title: 'Eco-Friendly', desc: '100% Sustainable practices', color: 'text-green-500', bg: 'bg-green-50' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="flex flex-col items-center text-center p-2 group"
              >
                <div className={`w-20 h-20 ${feature.bg} rounded-3xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300`}>
                  <feature.icon className={`w-10 h-10 ${feature.color}`} />
                </div>
                <h3 className="font-extrabold text-xl mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-500 font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Categories */}
      <section className="py-32 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
          >
            <div>
              <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm mb-4 block">Collections</span>
              <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-4 tracking-tight">Explore Spaces</h2>
              <p className="text-gray-500 text-xl max-w-2xl font-light">
                Discover plants meticulously categorized to fit into the very specific aesthetics of your spaces.
              </p>
            </div>
            <Link to="/shop" className="hidden md:inline-flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
              <span>View All Categories</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group cursor-pointer"
              >
                <Link to={`/shop?category=${encodeURIComponent(category.name)}`} className="block">
                  <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-xl">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                    <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-3xl font-bold text-white mb-2">{category.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-300 font-semibold">{category.count} Botanical Items</span>
                        <div className="w-12 h-12 border border-white/30 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <ArrowRight className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Best Sellers */}
      <section className="py-24 bg-gray-50 relative border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 flex flex-col items-center text-center"
          >
            <div className="w-16 h-1 bg-emerald-500 mb-6 rounded-full" />
            <h2 className="text-5xl font-black text-gray-900 mb-6 drop-shadow-sm tracking-tight">Trending Botanicals</h2>
            <p className="text-gray-500 text-xl font-light">Loved by communities, perfectly curated for you.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product, i) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-20">
            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-colors inline-flex items-center gap-3 shadow-2xl"
              >
                <span>View Complete Collection</span>
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Exclusive Offers Section */}
      {allProducts.some(p => p.discount && p.discount > 0) && (
        <section className="py-24 bg-rose-50 border-y border-rose-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200/50 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-200/50 rounded-full blur-[80px]" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
            >
              <div>
                <span className="text-rose-600 font-bold tracking-widest uppercase text-sm mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5" /> Special Offers
                </span>
                <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-4 tracking-tight">Limited Deals</h2>
                <p className="text-gray-600 text-xl max-w-2xl font-light">
                  Grab these premium botanicals before the offers expire.
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {allProducts
                .filter(p => p.discount && p.discount > 0)
                .map((product, index) => {
                  const calculatedOriginal = Math.round(product.price * (100 / (100 - product.discount!)));
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.95, y: 30 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5, type: "spring" }}
                      viewport={{ once: true }}
                      className="relative group rounded-[2rem] shadow-xl border border-rose-100 hover:shadow-2xl hover:border-rose-200 transition-all bg-white"
                    >
                      <ProductCard product={{
                        ...product,
                        originalPrice: product.originalPrice || calculatedOriginal
                      }} />
                    </motion.div>
                  );
                })}
            </div>
          </div>
        </section>
      )}

      {/* Advanced About Section */}
      <section className="py-32 relative overflow-hidden bg-white">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-full bg-emerald-50 rounded-l-[100px] -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, type: "spring" }}
            >
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1000"
                  alt="About CV Nursery"
                  className="w-full h-[600px] lg:h-[700px] object-cover hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-10 left-10 p-8 bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl text-white max-w-xs shadow-2xl">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-4">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-black text-4xl mb-1">10+</p>
                  <p className="text-white font-medium text-lg">Years of bringing nature to homes.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-tight tracking-tight">
                Cultivating <br/><span className="text-emerald-600">Tranquility.</span>
              </h2>
              <div className="space-y-6 text-gray-600 text-[1.15rem] leading-relaxed mb-12 font-light">
                <p>
                  CV Nursery is more than a plant store; it's a sanctuary for enthusiasts. Every leaf, stem, and root is meticulously nurtured in our advanced greenhouses to ensure absolute health and vibrancy.
                </p>
                <p>
                  We believe that indoor botany is an artform. Our commitment spans across sustainable packaging to ethical sourcing, delivering you a premium slice of nature.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                <Link to="/shop">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/30 flex items-center gap-3"
                  >
                    <span>Discover More</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <div className="flex items-center gap-4 border-l border-gray-200 pl-8">
                  <div className="flex -space-x-4">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" className="w-full h-full object-cover"/>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">10k+ Happy</p>
                    <p className="text-sm text-gray-500">Plant Parents</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Review Section with Glass Cards */}
      <section className="py-32 bg-gray-900 relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl lg:text-6xl font-black mb-6 text-white tracking-tight">Wall of Love</h2>
            <p className="text-emerald-100/70 text-xl font-light">
              Don't just take our word for it. Hear from our community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative group"
              >
                <div className="absolute -top-10 right-6 text-6xl text-emerald-500/20 font-serif">"</div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500"
                    />
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-400 border-2 border-gray-900 rounded-full" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{review.name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed font-light text-lg">"{review.comment}"</p>
                <p className="text-xs text-emerald-400 mt-8 font-bold uppercase tracking-widest">{review.date}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Newsletter */}
      <section className="py-32 relative bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-emerald-900 rounded-[3rem] p-10 md:p-20 text-center shadow-[0_20px_60px_rgba(16,185,129,0.2)] border border-emerald-800 relative overflow-hidden"
          >
            {/* Decorative circles */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/30 rounded-full blur-[80px]" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-teal-500/30 rounded-full blur-[80px]" />

            <div className="relative z-10">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-lg border border-white/20 rotate-12">
                <Leaf className="w-12 h-12 text-emerald-300 -rotate-12" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                Join Our Green Community
              </h2>
              <p className="text-emerald-100 text-xl font-light mb-12 max-w-2xl mx-auto">
                Subscribe to get special offers, free plant care guides, and exclusive early access to our new arrivals.
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto bg-white/10 backdrop-blur-md p-2 rounded-3xl border border-white/20">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-8 py-5 rounded-2xl bg-transparent border-none text-white placeholder:text-emerald-200 focus:outline-none text-lg"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-10 py-5 bg-white text-emerald-900 rounded-2xl font-bold hover:bg-emerald-50 transition-colors shadow-xl text-lg flex items-center justify-center whitespace-nowrap"
                >
                  Subscribe Now
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
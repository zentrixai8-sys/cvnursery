import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router';
import { Leaf, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';

// 3D Imports
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

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


export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gray-50">
      
      {/* 3D Interactive Background */}
      <div className="absolute inset-0 z-0 select-none">
        <Canvas camera={{ position: [0, 2, 9], fov: 40 }} className="cursor-grab active:cursor-grabbing opacity-90">
          <Scene />
        </Canvas>
      </div>

      <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/30 via-emerald-50/20 to-teal-50/20 mix-blend-overlay pointer-events-none" />

      {/* Login Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="rounded-[2.5rem] bg-white/70 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/50 p-10 mt-16 sm:p-12 overflow-hidden relative">
          
          {/* Decorative Corner Orbs inside card */}
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-emerald-300/30 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-teal-300/30 rounded-full blur-2xl" />

          {/* Logo */}
          <div className="text-center mb-10 relative z-10">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 shadow-[0_0_20px_rgba(16,185,129,0.3)] rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Leaf className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Welcome Back</h2>
            <p className="text-gray-500 mt-3 font-medium text-lg">Sign in to your CV Nursery account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 ml-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full pl-14 pr-5 py-4 bg-white/60 backdrop-blur-md border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-gray-800 placeholder:text-gray-400/80 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2 ml-2">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full pl-14 pr-14 py-4 bg-white/60 backdrop-blur-md border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-gray-800 placeholder:text-gray-400/80 shadow-sm"
                />
                
                {/* Password Visibility Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-sm text-emerald-600 font-bold hover:text-emerald-700 hover:underline transition-all">
                Forgot password?
              </a>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(16,185,129,0.3)' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-5 rounded-2xl font-bold text-lg transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                'Secure Sign In'
              )}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center relative z-10 border-t border-gray-200/50 pt-8">
            <p className="text-gray-600 font-medium">
              Don't have an account?{' '}
              <Link to="/signup" className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline transition-all">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

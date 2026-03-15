import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-9xl font-bold bg-gradient-to-r from-[var(--nature-green)] to-[var(--nature-green-light)] bg-clip-text text-transparent mb-4"
        >
          404
        </motion.div>
        
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </motion.button>
          </Link>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="px-8 py-4 border border-border rounded-xl hover:bg-muted transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

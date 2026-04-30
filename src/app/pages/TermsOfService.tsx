import { motion } from 'motion/react';

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-black text-slate-900 mb-8 tracking-tighter">Terms of Service</h1>
          <div className="w-20 h-1.5 bg-emerald-500 rounded-full mb-12" />
          
          <div className="max-w-none space-y-12 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">1. Agreement to Terms</h2>
              <p className="text-lg">By accessing or using CV Nursery, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
            </section>

            <section>
              <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">2. Use License</h2>
              <p className="text-lg">Permission is granted to temporarily download one copy of the materials (information or software) on CV Nursery's website for personal, non-commercial transitory viewing only.</p>
            </section>

            <section>
              <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">3. Disclaimer</h2>
              <p className="text-lg">The materials on CV Nursery's website are provided on an 'as is' basis. CV Nursery makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.</p>
            </section>

            <section>
              <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">4. Limitations</h2>
              <p className="text-lg">In no event shall CV Nursery or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CV Nursery's website.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

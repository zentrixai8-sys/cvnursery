import { motion } from 'motion/react';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-black text-slate-900 mb-8 tracking-tighter">Privacy Policy</h1>
          <div className="w-20 h-1.5 bg-emerald-500 rounded-full mb-12" />
          
          <div className="max-w-none space-y-12 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">1. Introduction</h2>
              <p className="text-lg">Welcome to CV Nursery. We value your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.</p>
            </section>

            <section>
              <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">2. Data We Collect</h2>
              <p className="text-lg mb-4">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2.5 shrink-0" />
                  <span className="text-lg font-medium text-slate-700">Identity Data: <span className="font-normal text-slate-500">Includes first name, last name, username or similar identifier.</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2.5 shrink-0" />
                  <span className="text-lg font-medium text-slate-700">Contact Data: <span className="font-normal text-slate-500">Includes email address and telephone numbers.</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2.5 shrink-0" />
                  <span className="text-lg font-medium text-slate-700">Technical Data: <span className="font-normal text-slate-500">Includes internet protocol (IP) address, login data, browser type and version.</span></span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">3. How We Use Your Data</h2>
              <p className="text-lg">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to perform the contract we are about to enter into or have entered into with you.</p>
            </section>

            <section>
              <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">4. Data Security</h2>
              <p className="text-lg">We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

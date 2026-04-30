import { motion } from 'motion/react';
import { Truck, Shield, Clock, MapPin } from 'lucide-react';

export function ShippingInfo() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-black text-slate-900 mb-8 tracking-tighter">Shipping Information</h1>
          <div className="w-20 h-1.5 bg-emerald-500 rounded-full mb-12" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm">
              <Truck className="w-10 h-10 text-emerald-600 mb-6" />
              <h3 className="text-xl font-bold text-slate-800 mb-3">Safe Delivery</h3>
              <p className="text-slate-600 text-sm leading-relaxed">We use specialized eco-friendly packaging designed to keep your plants secure and hydrated during transit.</p>
            </div>
            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm">
              <Clock className="w-10 h-10 text-emerald-600 mb-6" />
              <h3 className="text-xl font-bold text-slate-800 mb-3">Delivery Timeline</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Standard shipping takes 3-7 business days depending on your location. Rare species may require extra handling time.</p>
            </div>
          </div>

          <div className="max-w-none space-y-12 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Shipping Rates</h2>
              <p className="text-lg">Shipping is calculated at checkout based on the weight of your order and your delivery location. We offer free shipping on orders above ₹999 across most major cities.</p>
            </section>

            <section>
              <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Order Tracking</h2>
              <p className="text-lg">Once your order is dispatched, you will receive a tracking link via email and SMS to monitor your plant's journey to its new home.</p>
            </section>

            <section>
              <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Handling Damaged Shipments</h2>
              <p className="text-lg">If your plant arrives damaged, please take a photo immediately and contact our support team within 24 hours. We offer full replacements for any shipping-related damage.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

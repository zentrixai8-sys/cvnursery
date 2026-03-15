import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useApp();
  const navigate = useNavigate();
  const deliveryFee = cartTotal > 999 ? 0 : 50;
  const total = cartTotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-16 h-16 text-muted-foreground" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">
            Add some plants to your cart to get started
          </p>
          <Link to="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <Link to={`/product/${item.id}`} className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-32 h-32 rounded-xl object-cover"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Link to={`/product/${item.id}`}>
                          <h3 className="font-bold text-lg hover:text-primary transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-10 h-10 rounded-lg border border-border hover:bg-muted transition-colors flex items-center justify-center"
                        >
                          <Minus className="w-4 h-4" />
                        </motion.button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-10 rounded-lg border border-border hover:bg-muted transition-colors flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          ₹{item.price * item.quantity}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ₹{item.price} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{cartTotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-medium">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                {cartTotal < 999 && (
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    Add ₹{999 - cartTotal} more to get free delivery
                  </p>
                )}
                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-primary">₹{total}</span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/checkout')}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-lg mb-4"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <Link to="/shop">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full border border-border py-4 rounded-xl font-medium hover:bg-muted transition-colors"
                >
                  Continue Shopping
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

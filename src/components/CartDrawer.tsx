'use client';

import { useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrency } from '@/hooks/useCurrency';

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getCartTotal } =
    useCartStore();
  const router = useRouter();
  const { formatPrice } = useCurrency();

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[60] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-cherry-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-cherry-dark" />
                <h2 className="font-serif text-xl font-semibold text-cherry-dark">
                  Your Cart
                </h2>
                <span className="bg-cherry-100 text-cherry-dark text-xs font-medium px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-cherry-text hover:text-cherry-dark hover:bg-cherry-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-cherry-50 rounded-full flex items-center justify-center text-cherry-300 mb-4">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <h3 className="font-serif text-xl text-cherry-dark">
                    Your cart is empty
                  </h3>
                  <p className="text-cherry-text text-sm max-w-[250px]">
                    Looks like you haven&apos;t added any skincare goodies to your
                    cart yet.
                  </p>
                  <button
                    onClick={closeCart}
                    className="mt-4 px-6 py-3 bg-cherry-700 text-white rounded-full font-medium hover:bg-cherry-800 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <Link
                        href={`/product/${item.id}`}
                        onClick={closeCart}
                        className="w-24 h-24 rounded-xl overflow-hidden bg-cherry-50 flex-shrink-0 border border-cherry-100"
                      >
                        <img
                          src={item.image}
                          alt={item.imageAlt || item.name}
                          className="w-full h-full object-cover mix-blend-multiply"
                        />
                      </Link>

                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link
                              href={`/product/${item.id}`}
                              onClick={closeCart}
                              className="font-medium text-cherry-dark hover:text-cherry-500 transition-colors line-clamp-1 text-sm"
                            >
                              {item.name}
                            </Link>
                            <p className="text-xs text-cherry-text mt-1">
                              {item.category}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-cherry-text hover:text-red-500 transition-colors p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-cherry-200 rounded-full bg-white">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="p-1.5 text-cherry-text hover:text-cherry-dark transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-cherry-dark">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="p-1.5 text-cherry-text hover:text-cherry-dark transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="font-semibold text-cherry-dark text-sm">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-cherry-100 bg-white">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-cherry-text">
                    <span>Subtotal</span>
                    <span>{formatPrice(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm text-cherry-text">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-cherry-dark pt-3 border-t border-cherry-100">
                    <span>Total</span>
                    <span>{formatPrice(getCartTotal())}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-cherry-700 text-white rounded-full font-medium flex items-center justify-center gap-2 hover:bg-cherry-800 transition-colors group"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

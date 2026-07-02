'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, CheckCircle } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { PageWrapper } from '@/components/PageWrapper';

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = getCartTotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Construct WhatsApp message
      const orderDetails = items
        .map(
          (item) =>
            `${item.quantity}x ${item.name} (₹${item.price * item.quantity})`
        )
        .join('%0A');

      const message = `Hello Cherryvelle! I would like to place an order:%0A%0A${orderDetails}%0A%0ASubtotal: ₹${subtotal}%0AShipping: ₹${shipping}%0A*Total: ₹${total}*%0A%0APlease confirm my order.`;

      // Redirect to WhatsApp
      window.open(`https://wa.me/1234567890?text=${message}`, '_blank');
      clearCart();
    }, 1500);
  };

  if (isSuccess) {
    return (
      <PageWrapper>
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6 shadow-sm">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-serif text-cherry-dark mb-4">
            Order Confirmed!
          </h2>
          <p className="text-cherry-text mb-8 max-w-md">
            Thank you for your purchase. We&apos;ve redirected you to WhatsApp to
            finalize your order details with our team.
          </p>
          <Link
            href="/"
            className="px-8 py-3 bg-cherry-700 text-white rounded-full font-medium hover:bg-cherry-800 transition-colors shadow-md"
          >
            Return to Home
          </Link>
        </div>
      </PageWrapper>
    );
  }

  if (items.length === 0) {
    return (
      <PageWrapper>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-3xl font-serif text-cherry-dark mb-4">
            Your cart is empty
          </h2>
          <p className="text-cherry-text mb-8">
            Add some products to your cart before checking out.
          </p>
          <Link
            href="/shop"
            className="px-8 py-3 bg-cherry-700 text-white rounded-full font-medium hover:bg-cherry-800 transition-colors shadow-md"
          >
            Go to Shop
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="bg-[#FAF8F5] min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-cherry-text hover:text-cherry-dark transition-colors mb-8 text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Checkout Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-cherry-50">
                <h2 className="text-2xl font-serif text-cherry-dark mb-6">
                  Checkout
                </h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Contact Info */}
                  <div>
                    <h3 className="text-lg font-medium text-cherry-dark mb-4">
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-cherry-text mb-1"
                        >
                          Email address
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          className="w-full px-4 py-3 rounded-xl border border-cherry-200 focus:outline-none focus:border-cherry-400 focus:ring-1 focus:ring-cherry-400 transition-colors bg-[#FAF8F5]"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div>
                    <h3 className="text-lg font-medium text-cherry-dark mb-4">
                      Shipping Address
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-cherry-text mb-1"
                        >
                          First name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          required
                          className="w-full px-4 py-3 rounded-xl border border-cherry-200 focus:outline-none focus:border-cherry-400 focus:ring-1 focus:ring-cherry-400 transition-colors bg-[#FAF8F5]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-cherry-text mb-1"
                        >
                          Last name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          required
                          className="w-full px-4 py-3 rounded-xl border border-cherry-200 focus:outline-none focus:border-cherry-400 focus:ring-1 focus:ring-cherry-400 transition-colors bg-[#FAF8F5]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="address"
                          className="block text-sm font-medium text-cherry-text mb-1"
                        >
                          Address
                        </label>
                        <input
                          type="text"
                          id="address"
                          required
                          className="w-full px-4 py-3 rounded-xl border border-cherry-200 focus:outline-none focus:border-cherry-400 focus:ring-1 focus:ring-cherry-400 transition-colors bg-[#FAF8F5]"
                          placeholder="Street address or P.O. Box"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-cherry-text mb-1"
                        >
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          required
                          className="w-full px-4 py-3 rounded-xl border border-cherry-200 focus:outline-none focus:border-cherry-400 focus:ring-1 focus:ring-cherry-400 transition-colors bg-[#FAF8F5]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="postalCode"
                          className="block text-sm font-medium text-cherry-text mb-1"
                        >
                          Postal code
                        </label>
                        <input
                          type="text"
                          id="postalCode"
                          required
                          className="w-full px-4 py-3 rounded-xl border border-cherry-200 focus:outline-none focus:border-cherry-400 focus:ring-1 focus:ring-cherry-400 transition-colors bg-[#FAF8F5]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div>
                    <h3 className="text-lg font-medium text-cherry-dark mb-4">
                      Payment
                    </h3>
                    <div className="bg-cherry-50 p-4 rounded-xl border border-cherry-200 mb-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          id="cod"
                          name="payment"
                          defaultChecked
                          className="w-4 h-4 text-cherry-dark focus:ring-cherry-dark"
                        />
                        <label htmlFor="cod" className="font-medium text-cherry-dark">
                          Order via WhatsApp
                        </label>
                      </div>
                      <p className="text-sm text-cherry-text ml-7 mt-1">
                        You will be redirected to WhatsApp to finalize your order.
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-cherry-700 text-white rounded-full font-medium hover:bg-cherry-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-cherry-700/20"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      `Place Order - ₹${total}`
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-cherry-50 sticky top-32">
                <h2 className="text-xl font-serif text-cherry-dark mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-cherry-50 flex-shrink-0 border border-cherry-100 relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover mix-blend-multiply"
                        />
                        <span className="absolute -top-2 -right-2 bg-cherry-dark text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center z-10">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-cherry-dark text-sm line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-xs text-cherry-text">
                            {item.category}
                          </p>
                        </div>
                        <span className="font-medium text-cherry-dark text-sm">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 py-4 border-t border-cherry-100">
                  <div className="flex justify-between text-sm text-cherry-text">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-cherry-text">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-cherry-500 text-right">
                      Add ₹{1000 - subtotal} more for free shipping
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center py-4 border-t border-cherry-100">
                  <span className="text-lg font-semibold text-cherry-dark">
                    Total
                  </span>
                  <span className="text-2xl font-semibold text-cherry-dark">
                    ₹{total}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

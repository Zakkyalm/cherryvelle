'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  Minus,
  Plus,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';
import { products } from '@/data/mockData';
import { useCartStore } from '@/store/useCartStore';
import { ProductCard } from '@/components/ProductCard';
import { PageWrapper } from '@/components/PageWrapper';
import { useCurrency } from '@/hooks/useCurrency';

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [quantity, setQuantity] = useState(1);
  const { addItem, toggleFavorite, isFavorite } = useCartStore();
  const { formatPrice } = useCurrency();

  const product = products.find((p) => p.id === id);
  const relatedProducts = products
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);
  }, [id]);

  if (!product) {
    return (
      <PageWrapper>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-3xl font-serif text-cherry-dark mb-4">
            Product Not Found
          </h2>
          <p className="text-cherry-text mb-8">
            The product you are looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/shop"
            className="px-8 py-3 bg-cherry-700 text-white rounded-full font-medium hover:bg-cherry-800 transition-colors shadow-md"
          >
            Back to Shop
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <PageWrapper>
      <div className="bg-[#FAF8F5] min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm text-cherry-text mb-8">
            <Link href="/" className="hover:text-cherry-dark transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link href="/shop" className="hover:text-cherry-dark transition-colors">
              Shop
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link
              href={`/shop?category=${product.category.toLowerCase()}`}
              className="hover:text-cherry-dark transition-colors"
            >
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-cherry-dark font-medium truncate">
              {product.name}
            </span>
          </nav>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 mb-20">
            {/* Product Image */}
            <div className="relative aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden bg-white shadow-sm border border-cherry-50">
              <img
                src={product.image}
                alt={product.imageAlt || product.name}
                className="w-full h-full object-cover mix-blend-multiply"
              />
              {product.isNew && (
                <span className="absolute top-6 left-6 bg-white text-cherry-dark text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                  NEW ARRIVAL
                </span>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <div className="mb-6">
                <p className="text-cherry-700 font-medium text-sm mb-2 uppercase tracking-wider">
                  {product.category}
                </p>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-cherry-dark mb-4 leading-tight">
                  {product.name}
                </h1>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1 text-cherry-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-cherry-text">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-semibold text-cherry-dark">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-cherry-text line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="text-sm font-medium text-cherry-700 bg-cherry-50 px-2 py-1 rounded-md ml-2 border border-cherry-100">
                      Save {formatPrice(product.originalPrice - product.price)}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-cherry-text leading-relaxed mb-8">
                {product.description}
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-cherry-dark w-20">
                    Quantity
                  </span>
                  <div className="flex items-center border border-cherry-200 rounded-full bg-white shadow-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 text-cherry-text hover:text-cherry-dark transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium text-cherry-dark">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 text-cherry-text hover:text-cherry-dark transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mb-10">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-cherry-700 text-white rounded-full font-medium flex items-center justify-center gap-2 hover:bg-cherry-800 transition-colors shadow-lg shadow-cherry-700/20"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart - {formatPrice(product.price * quantity)}
                </button>
                <button
                  onClick={() => product && toggleFavorite(product.id)}
                  className={`p-4 border rounded-full transition-colors shadow-sm ${
                    isFavorite(product.id)
                      ? 'border-cherry-700 text-cherry-700 bg-cherry-50'
                      : 'border-cherry-200 bg-white text-cherry-dark hover:border-cherry-700 hover:text-cherry-700'
                  }`}
                  aria-label={isFavorite(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-t border-cherry-100">
                <div className="flex items-center gap-3 text-sm text-cherry-text">
                  <ShieldCheck className="w-5 h-5 text-cherry-gold" />
                  <span>Dermatologist Tested</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-cherry-text">
                  <Truck className="w-5 h-5 text-cherry-gold" />
                  <span>Free Shipping over {formatPrice(999)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-cherry-text">
                  <RotateCcw className="w-5 h-5 text-cherry-gold" />
                  <span>30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="pt-16 border-t border-cherry-100">
              <h2 className="text-2xl md:text-3xl font-serif text-cherry-dark mb-8 text-center">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

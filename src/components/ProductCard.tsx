'use client';

import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product, useCartStore } from '@/store/useCartStore';
import { motion } from 'framer-motion';
import { useCurrency } from '@/hooks/useCurrency';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, toggleFavorite, isFavorite } = useCartStore();
  const favorited = isFavorite(product.id);
  const { formatPrice } = useCurrency();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative bg-white rounded-2xl p-4 transition-all duration-300 hover:shadow-soft border border-transparent hover:border-cherry-100"
    >
      {/* Badges & Actions */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
        {product.isNew && (
          <span className="bg-white text-cherry-dark text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            NEW
          </span>
        )}
        {product.originalPrice && (
          <span className="bg-cherry-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
      </div>

      <button
        onClick={() => toggleFavorite(product.id)}
        className={`absolute top-6 right-6 z-10 p-2 bg-white rounded-full shadow-sm hover:scale-110 transition-all ${
          favorited ? 'text-cherry-500' : 'text-cherry-text hover:text-cherry-500'
        }`}
        aria-label={favorited ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
      </button>

      {/* Image */}
      <Link
        href={`/product/${product.id}`}
        className="block relative aspect-square rounded-xl overflow-hidden bg-cherry-50 mb-4"
      >
        <img
          src={product.image}
          alt={product.imageAlt || product.name}
          className="w-full h-full object-cover object-center mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Content */}
      <div>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-cherry-dark text-base mb-1 hover:text-cherry-500 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-cherry-gold">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating)
                    ? 'fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-cherry-text">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between gap-2 mt-3 min-w-0">
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-semibold text-cherry-dark text-sm sm:text-base truncate">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-cherry-text line-through truncate">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            className="flex-shrink-0 p-2.5 bg-white border border-cherry-200 rounded-full text-cherry-dark hover:bg-cherry-700 hover:text-white hover:border-cherry-700 transition-all"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

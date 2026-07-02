'use client';

import Link from 'next/link';
import { Heart, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { products } from '@/data/mockData';
import { ProductCard } from '@/components/ProductCard';
import { PageWrapper } from '@/components/PageWrapper';

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useCartStore();

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <PageWrapper>
      <div className="bg-[#FAF8F5] min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-serif text-cherry-dark mb-3">
              My Wishlist
            </h1>
            <p className="text-cherry-text">
              {favoriteProducts.length > 0
                ? `You have ${favoriteProducts.length} item${favoriteProducts.length > 1 ? 's' : ''} in your wishlist`
                : 'Your wishlist is empty'}
            </p>
          </div>

          {favoriteProducts.length > 0 ? (
            <>
              {/* Clear all button */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => favorites.forEach((id) => toggleFavorite(id))}
                  className="flex items-center gap-2 text-sm text-cherry-text hover:text-cherry-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Wishlist
                </button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoriteProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 bg-cherry-50 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-10 h-10 text-cherry-300" />
              </div>
              <h2 className="text-xl font-medium text-cherry-dark mb-2">
                No favorites yet
              </h2>
              <p className="text-cherry-text mb-8 text-center max-w-md">
                Start adding products to your wishlist by clicking the heart icon on any product.
              </p>
              <Link
                href="/shop"
                className="px-8 py-3 bg-cherry-700 text-white rounded-full font-medium hover:bg-cherry-800 transition-colors shadow-md"
              >
                Browse Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

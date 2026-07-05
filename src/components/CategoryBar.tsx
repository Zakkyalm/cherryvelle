'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { categories } from '@/data/mockData';
import { motion } from 'framer-motion';

export function CategoryBar() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || '';
  const isOffersActive = searchParams.get('offers') === 'true';

  return (
    <div className="w-full bg-white border-b border-cherry-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center md:justify-start lg:justify-center gap-1 py-2.5 overflow-x-auto scrollbar-hide">
          <Link
            href="/shop"
            className={`relative px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-all duration-200 ${
              activeCategory === 'all'
                ? 'bg-cherry-700 text-white shadow-sm'
                : 'text-cherry-text hover:text-cherry-700 hover:bg-cherry-50'
            }`}
          >
            All
          </Link>
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, duration: 0.3 }}
            >
              <Link
                href={`/shop?category=${category.id}`}
                className={`relative px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-all duration-200 inline-block ${
                  activeCategory === category.id
                    ? 'bg-cherry-700 text-white shadow-sm'
                    : 'text-cherry-text hover:text-cherry-700 hover:bg-cherry-50'
                }`}
              >
                {category.name}
              </Link>
            </motion.div>
          ))}
          <Link
            href="/shop?offers=true"
            className={`px-4 py-1.5 text-sm font-semibold rounded-full whitespace-nowrap transition-all duration-200 ml-2 ${
              isOffersActive
                ? 'bg-gradient-to-r from-cherry-gold to-cherry-goldLight text-cherry-dark shadow-md ring-2 ring-cherry-gold/50'
                : 'bg-gradient-to-r from-cherry-gold to-cherry-goldLight text-cherry-dark hover:shadow-md'
            }`}
          >
            Offers
          </Link>
        </nav>
      </div>
    </div>
  );
}

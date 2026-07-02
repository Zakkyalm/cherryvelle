'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { products, categories } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input when search opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter results
  const results = useMemo(() => {
    if (!query.trim()) return { products: [], categories: [] };

    const q = query.toLowerCase().trim();

    const matchedProducts = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    ).slice(0, 5);

    const matchedCategories = categories.filter(
      (c) => c.name.toLowerCase().includes(q)
    ).slice(0, 3);

    return { products: matchedProducts, categories: matchedCategories };
  }, [query]);

  const hasResults = results.products.length > 0 || results.categories.length > 0;

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Search Trigger Button (Desktop) */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 lg:px-4 py-2 bg-white border border-rose-200 rounded-full text-sm text-gray-600 hover:border-rose-300 hover:shadow-sm transition-all duration-200 w-44 lg:w-64"
        aria-label="Open search"
      >
        <Search className="w-4 h-4 text-rose-400" />
        <span className="text-gray-400">Search products...</span>
      </button>

      {/* Search Trigger Button (Mobile) */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden text-cherry-dark hover:text-cherry-gold transition-colors"
        aria-label="Open search"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Search Modal/Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
              onClick={handleClose}
            />

            {/* Search Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed top-0 left-0 right-0 z-50 bg-white shadow-2xl md:absolute md:top-full md:left-auto md:right-0 md:mt-2 md:rounded-2xl md:w-[480px] md:max-h-[70vh] overflow-hidden"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-cherry-100">
                <Search className="w-5 h-5 text-cherry-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for products, categories..."
                  className="flex-1 text-sm md:text-base text-cherry-dark placeholder:text-cherry-text/50 outline-none bg-transparent"
                  autoComplete="off"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="text-cherry-text/60 hover:text-cherry-dark transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="text-sm font-medium text-cherry-text hover:text-cherry-700 transition-colors ml-2"
                >
                  Cancel
                </button>
              </div>

              {/* Results */}
              <div className="overflow-y-auto max-h-[calc(70vh-72px)] md:max-h-[400px]">
                {!query.trim() && (
                  <div className="px-5 py-6">
                    <p className="text-xs font-semibold text-cherry-text/60 uppercase tracking-wider mb-3">
                      Popular Searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Vitamin C', 'Sunscreen', 'Moisturizer', 'Serum', 'Cleanser'].map(
                        (term) => (
                          <button
                            key={term}
                            onClick={() => setQuery(term)}
                            className="px-3 py-1.5 bg-cherry-50 text-cherry-dark text-sm rounded-full hover:bg-cherry-100 transition-colors"
                          >
                            {term}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

                {query.trim() && !hasResults && (
                  <div className="px-5 py-10 text-center">
                    <p className="text-cherry-text text-sm">
                      No results found for &quot;{query}&quot;
                    </p>
                    <p className="text-cherry-text/60 text-xs mt-1">
                      Try a different search term
                    </p>
                  </div>
                )}

                {/* Category Results */}
                {results.categories.length > 0 && (
                  <div className="px-5 pt-4 pb-2">
                    <p className="text-xs font-semibold text-cherry-text/60 uppercase tracking-wider mb-2">
                      Categories
                    </p>
                    <div className="space-y-1">
                      {results.categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/shop?category=${cat.id}`}
                          onClick={handleClose}
                          className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-cherry-50 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-cherry-100">
                              <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-sm font-medium text-cherry-dark">
                              {cat.name}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-cherry-text/40 group-hover:text-cherry-700 transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Results */}
                {results.products.length > 0 && (
                  <div className="px-5 pt-4 pb-4">
                    <p className="text-xs font-semibold text-cherry-text/60 uppercase tracking-wider mb-2">
                      Products
                    </p>
                    <div className="space-y-1">
                      {results.products.map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.id}`}
                          onClick={handleClose}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-cherry-50 transition-colors group"
                        >
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-cherry-100 flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-cherry-dark truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-cherry-text/60">
                              {product.category}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-semibold text-cherry-700">
                              ₹{product.price}
                            </p>
                            {product.originalPrice && (
                              <p className="text-xs text-cherry-text/50 line-through">
                                ₹{product.originalPrice}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* View All Link */}
                    <Link
                      href="/shop"
                      onClick={handleClose}
                      className="flex items-center justify-center gap-2 mt-4 py-2.5 text-sm font-medium text-cherry-700 hover:text-cherry-800 hover:bg-cherry-50 rounded-xl transition-colors"
                    >
                      View all results
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

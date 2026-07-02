'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Filter, ChevronDown } from 'lucide-react';
import { products, categories } from '@/data/mockData';
import { ProductCard } from '@/components/ProductCard';
import { PageWrapper } from '@/components/PageWrapper';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const [sortBy, setSortBy] = useState('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (categoryParam !== 'all') {
      result = result.filter(
        (p) => p.category.toLowerCase() === categoryParam.toLowerCase()
      );
    }
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return result;
  }, [categoryParam, sortBy]);

  return (
    <PageWrapper>
      <div className="bg-[#FAF8F5] min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif text-cherry-dark mb-4">
              {categoryParam === 'all'
                ? 'All Products'
                : categories.find((c) => c.id === categoryParam)?.name || 'Products'}
            </h1>
            <p className="text-cherry-text max-w-2xl mx-auto">
              Discover our full range of skincare products designed to nourish,
              protect, and enhance your natural beauty.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden flex justify-between items-center pb-4 border-b border-cherry-100">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 text-cherry-dark font-medium"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-cherry-text">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border-none bg-transparent font-medium text-cherry-dark focus:ring-0 cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Sidebar Filters */}
            <div className={`lg:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
              <div
                className={`space-y-8 ${
                  isFilterOpen
                    ? 'fixed inset-x-4 top-28 z-30 rounded-3xl bg-white p-6 shadow-2xl border border-cherry-100 lg:static lg:inset-auto lg:top-auto lg:bg-transparent lg:p-0 lg:shadow-none lg:border-transparent'
                    : 'lg:sticky lg:top-32'
                }`}
              >
                {isFilterOpen && (
                  <div className="lg:hidden flex justify-end">
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="text-sm font-medium text-cherry-dark hover:text-cherry-700"
                    >
                      Close
                    </button>
                  </div>
                )}
                <div>
                  <h3 className="font-serif font-semibold text-cherry-dark text-lg mb-4">
                    Categories
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        href="/shop"
                        onClick={() => { if (isFilterOpen) setIsFilterOpen(false); }}
                        className={`text-sm flex items-center justify-between w-full ${
                          categoryParam === 'all'
                            ? 'text-cherry-700 font-medium'
                            : 'text-cherry-text hover:text-cherry-dark'
                        }`}
                      >
                        <span>All Products</span>
                        <span className="bg-cherry-100 text-cherry-dark px-2 py-0.5 rounded-full text-xs">
                          {products.length}
                        </span>
                      </Link>
                    </li>
                    {categories.map((category) => (
                      <li key={category.id}>
                        <Link
                          href={`/shop?category=${category.id}`}
                          onClick={() => { if (isFilterOpen) setIsFilterOpen(false); }}
                          className={`text-sm flex items-center justify-between w-full ${
                            categoryParam === category.id
                              ? 'text-cherry-700 font-medium'
                              : 'text-cherry-text hover:text-cherry-dark'
                          }`}
                        >
                          <span>{category.name}</span>
                          <span className="bg-cherry-100 text-cherry-dark px-2 py-0.5 rounded-full text-xs">
                            {
                              products.filter(
                                (p) => p.category.toLowerCase() === category.id
                              ).length
                            }
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="hidden lg:block">
                  <h3 className="font-serif font-semibold text-cherry-dark text-lg mb-4">
                    Sort By
                  </h3>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full appearance-none bg-white border border-cherry-200 text-cherry-dark text-sm rounded-lg px-4 py-3 pr-8 focus:outline-none focus:border-cherry-400 focus:ring-1 focus:ring-cherry-400 cursor-pointer shadow-sm"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cherry-text pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="mb-6 text-sm text-cherry-text">
                Showing {filteredProducts.length} results
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-cherry-50">
                  <h3 className="text-xl font-serif text-cherry-dark mb-2">
                    No products found
                  </h3>
                  <p className="text-cherry-text">
                    Try adjusting your filters or category selection.
                  </p>
                  <Link
                    href="/shop"
                    className="mt-6 inline-block px-6 py-2 bg-cherry-700 text-white rounded-full text-sm font-medium hover:bg-cherry-800 transition-colors"
                  >
                    Clear Filters
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Package, Images, Tag, Grid3X3, Megaphone, ArrowRight,
  Star, Timer, CalendarDays,
} from 'lucide-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { StatCard } from '@/components/admin/StatCard';
import { DateFilter, DateFilterValue, getDateRangeForPreset } from '@/components/admin/DateFilter';
import { useAdminStore } from '@/store/useAdminStore';
import { getStockStatus } from '@/store/useAdminStore';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isWithinRange(dateStr: string | undefined, from: Date | null, to: Date | null): boolean {
  if (!from && !to) return true; // "All Time" — no filter
  if (!dateStr) return true;     // items without a date always pass through
  const d = new Date(dateStr + 'T00:00:00');
  if (from && d < from) return false;
  if (to && d > to) return false;
  return true;
}

const DEFAULT_FILTER: DateFilterValue = {
  preset: 'all',
  range: { from: null, to: null },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const {
    products,
    heroBanners,
    promoBarMessages,
    promoBanners,
    categories,
    limitedTimeOffers,
  } = useAdminStore();

  const [dateFilter, setDateFilter] = useState<DateFilterValue>(DEFAULT_FILTER);

  const { from, to } = dateFilter.range;
  const isFiltered = dateFilter.preset !== 'all';

  // Filtered subsets — products & banners are date-aware
  const filteredProducts = useMemo(
    () => products.filter((p) => isWithinRange(p.createdAt, from, to)),
    [products, from, to]
  );

  const filteredHeroBanners = useMemo(
    () => heroBanners.filter((b) => isWithinRange((b as any).createdAt, from, to)),
    [heroBanners, from, to]
  );

  const filteredLimitedOffers = useMemo(
    () => (limitedTimeOffers ?? []).filter((o) => isWithinRange((o as any).createdAt, from, to)),
    [limitedTimeOffers, from, to]
  );

  // Stats built from filtered data
  const stats = [
    {
      icon: Package,
      label: 'Total Products',
      value: filteredProducts.length,
      sub: `${filteredProducts.filter((p) => p.isNew).length} new arrivals`,
      color: 'cherry',
    },
    {
      icon: Images,
      label: 'Hero Banners',
      value: filteredHeroBanners.filter((b) => b.active).length,
      sub: `${filteredHeroBanners.length} total banners`,
      color: 'blue',
    },
    {
      icon: Grid3X3,
      label: 'Categories',
      value: categories.length,
      sub: 'Active categories',
      color: 'purple',
    },
    {
      icon: Timer,
      label: 'Limited Offers',
      value: filteredLimitedOffers.filter((o) => o.active).length,
      sub: `${filteredLimitedOffers.length} total offers`,
      color: 'gold',
    },
  ];

  const quickLinks = [
    { label: 'Manage Banners', desc: 'Edit hero carousel & limited time offers', href: '/admin/banners', icon: Images, color: 'bg-blue-50 text-blue-600' },
    { label: 'Promo Bar Messages', desc: 'Update scrolling ticker text', href: '/admin/promo-bar', icon: Megaphone, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Deal Banners', desc: 'Manage promotion cards', href: '/admin/deal-banners', icon: Tag, color: 'bg-amber-50 text-amber-600' },
    { label: 'Manage Categories', desc: 'Add, edit or remove categories', href: '/admin/categories', icon: Grid3X3, color: 'bg-purple-50 text-purple-600' },
    { label: 'Manage Products', desc: 'Full product CRUD', href: '/admin/products', icon: Package, color: 'bg-cherry-50 text-cherry-700' },
  ];

  return (
    <AdminShell title="Dashboard" subtitle="Welcome back, Administrator">

      {/* ── Date Filter Bar ────────────────────────────────────────────────── */}
      <div className="flex flex-row items-center justify-between gap-3 mb-5 sm:mb-6">
        <div className="flex items-center gap-2 min-w-0">
          <CalendarDays className="w-4 h-4 text-cherry-400 flex-shrink-0" />
          <span className="text-sm font-medium text-cherry-text truncate">
            {isFiltered ? 'Showing filtered results' : 'Showing all-time data'}
          </span>
          {isFiltered && (
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-cherry-100 text-cherry-700 text-xs font-semibold flex-shrink-0">
              Active filter
            </span>
          )}
        </div>
        <div className="flex-shrink-0">
          <DateFilter value={dateFilter} onChange={setDateFilter} />
        </div>
      </div>

      {/* ── Stats Grid ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {stats.map((s) => (
          <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} sub={s.sub} color={s.color} />
        ))}
      </div>

      {/* ── No-results notice ─────────────────────────────────────────────── */}
      {isFiltered && filteredProducts.length === 0 && (
        <div className="mb-4 sm:mb-6 rounded-2xl border border-cherry-100 bg-cherry-50/50 px-4 sm:px-6 py-4 sm:py-5 flex items-start sm:items-center gap-3">
          <CalendarDays className="w-5 h-5 text-cherry-400 flex-shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-sm text-cherry-text">
            No products were added in the selected date range. Try a wider range or{' '}
            <button
              onClick={() => setDateFilter(DEFAULT_FILTER)}
              className="font-semibold text-cherry-700 hover:underline"
            >
              clear the filter
            </button>
            .
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-cherry-100 p-4 sm:p-6">
            <h2 className="text-base font-semibold text-cherry-dark mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickLinks.map(({ label, desc, href, icon: Icon, color }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-center gap-3 p-3 sm:p-4 rounded-xl border border-cherry-100 hover:border-cherry-300 hover:shadow-sm transition-all"
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-cherry-dark group-hover:text-cherry-700 transition-colors leading-tight">{label}</p>
                    <p className="text-xs text-cherry-400 mt-0.5 line-clamp-1">{desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-cherry-300 group-hover:text-cherry-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Products — filtered */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-cherry-100 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-cherry-dark">
                {isFiltered ? 'Filtered Products' : 'Recent Products'}
              </h2>
              <Link href="/admin/products" className="text-xs text-cherry-500 hover:text-cherry-700 flex items-center gap-1 flex-shrink-0">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CalendarDays className="w-8 h-8 text-cherry-200 mb-2" />
                <p className="text-sm text-cherry-300">No products in this period</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProducts.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden bg-cherry-50 flex-shrink-0 border border-cherry-100">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-cherry-dark truncate">{p.name}</p>
                      <p className="text-xs text-cherry-400 truncate">{p.category} · ₹{p.price}</p>
                    </div>
                    <div className="flex items-center gap-1 text-cherry-gold flex-shrink-0">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs text-cherry-text">{p.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Low Stock & Out of Stock Products ────────────────────────────── */}
      {(() => {
        const lowStockProducts = products.filter((p) => {
          const status = getStockStatus(p);
          return status === 'low-stock' || status === 'out-of-stock';
        });
        if (lowStockProducts.length === 0) return null;
        return (
          <div className="mt-4 sm:mt-6 bg-white rounded-2xl border border-cherry-100 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Package className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <h2 className="text-base font-semibold text-cherry-dark truncate">Low Stock Products</h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold flex-shrink-0">
                  {lowStockProducts.length} item{lowStockProducts.length !== 1 ? 's' : ''}
                </span>
              </div>
              <Link href="/admin/products" className="text-xs text-cherry-500 hover:text-cherry-700 flex items-center gap-1 flex-shrink-0">
                Manage <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-cherry-50">
              {lowStockProducts.map((p) => {
                const status = getStockStatus(p);
                return (
                  <div key={p.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="w-9 h-9 rounded-lg overflow-hidden bg-cherry-50 flex-shrink-0 border border-cherry-100">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-cherry-dark truncate">{p.name}</p>
                      <p className="text-xs text-cherry-400 truncate">{p.category}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0 text-right">
                      <span className={`text-sm font-bold ${status === 'out-of-stock' ? 'text-red-500' : 'text-amber-500'}`}>
                        {p.stock} units
                      </span>
                      {status === 'out-of-stock' ? (
                        <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">OUT OF STOCK</span>
                      ) : (
                        <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
                          LOW · ≤{p.lowStockAlert ?? 5}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Store Overview banner */}
      <div className="mt-4 sm:mt-6 bg-gradient-to-r from-cherry-700 to-cherry-800 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base">
            {isFiltered ? 'Filtered Overview' : 'Store Overview'}
          </h3>
          <p className="text-white/70 text-sm mt-1 leading-relaxed">
            {filteredProducts.filter((p) => p.originalPrice).length} products on sale ·{' '}
            {filteredProducts.filter((p) => p.isNew).length} new arrivals ·{' '}
            {categories.length} categories active
          </p>
        </div>
        <Link
          href="/admin/products"
          className="w-full sm:w-auto text-center px-5 py-2.5 bg-white text-cherry-700 rounded-xl text-sm font-semibold hover:bg-cherry-50 transition-colors flex-shrink-0"
        >
          Manage Products
        </Link>
      </div>

    </AdminShell>
  );
}

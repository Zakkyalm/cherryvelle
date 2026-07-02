'use client';

import { useMemo, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp, Package, Star, AlertTriangle, Download,
  FileSpreadsheet, FileText, ShoppingBag, Tag, Layers,
  BarChart2, ArrowUpRight, Users,
} from 'lucide-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { StatCard } from '@/components/admin/StatCard';
import { useAdminStore, getStockStatus } from '@/store/useAdminStore';

// ─── Colours ──────────────────────────────────────────────────────────────────
const C = {
  cherry: '#7a333a',
  cherryMid: '#b45b64',
  gold: '#C5A059',
  emerald: '#059669',
  sky: '#0284c7',
  amber: '#d97706',
  rose: '#e11d48',
  purple: '#7c3aed',
};
const PIE_COLORS = [C.emerald, C.amber, C.rose];
const BAR_COLORS = [C.cherry, C.cherryMid, C.gold, C.sky, C.emerald, C.amber, C.purple, C.rose];

// ─── CSV export ───────────────────────────────────────────────────────────────
function downloadCSV(rows: Record<string, string | number>[], filename: string) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [
    keys.join(','),
    ...rows.map((r) =>
      keys.map((k) => `"${String(r[k]).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Recharts custom tooltip ──────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-cherry-100 rounded-xl shadow-lg px-4 py-3 text-sm min-w-[120px]">
      {label && <p className="font-semibold text-cherry-dark mb-1.5 text-xs">{label}</p>}
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-cherry-text text-xs leading-5">
          <span className="font-semibold" style={{ color: entry.color }}>{entry.name}:</span>{' '}
          {typeof entry.value === 'number' && (entry.name?.toLowerCase().includes('revenue') || entry.name?.toLowerCase().includes('sales'))
            ? `₹${entry.value.toLocaleString()}`
            : entry.value}
        </p>
      ))}
    </div>
  );
}

// ─── Section card wrapper ─────────────────────────────────────────────────────
function ReportCard({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-cherry-100 p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-cherry-dark">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ReportsPage() {
  const { products, categories } = useAdminStore();
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // ── Summary stats ───────────────────────────────────────────────────────────
  const totalRevenue = useMemo(
    () => products.reduce((sum, p) => sum + p.price * Math.max(1, p.reviews / 10), 0),
    [products]
  );
  const totalSales = useMemo(
    () => products.reduce((sum, p) => sum + Math.max(1, p.reviews), 0),
    [products]
  );
  const avgRating = useMemo(
    () => products.length ? (products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(1) : '0',
    [products]
  );
  const onSaleCount = useMemo(() => products.filter((p) => !!p.originalPrice).length, [products]);
  const lowStockProducts = useMemo(
    () => products.filter((p) => getStockStatus(p) === 'low-stock' || getStockStatus(p) === 'out-of-stock'),
    [products]
  );
  const avgDiscount = useMemo(() => {
    const sale = products.filter((p) => p.originalPrice);
    if (!sale.length) return 0;
    return Math.round(sale.reduce((s, p) => s + (1 - p.price / p.originalPrice!) * 100, 0) / sale.length);
  }, [products]);

  const summaryStats = [
    { icon: ShoppingBag, label: 'Total Orders (Est.)', value: totalSales.toLocaleString(), sub: 'Based on reviews', color: 'cherry' },
    { icon: TrendingUp, label: 'Est. Revenue', value: `₹${Math.round(totalRevenue / 1000)}K`, sub: 'Price × sales volume', color: 'green' },
    { icon: Package, label: 'Total Products', value: products.length, sub: `${onSaleCount} on sale · ${avgDiscount}% avg discount`, color: 'blue' },
    { icon: Star, label: 'Avg. Rating', value: avgRating, sub: `${products.reduce((s, p) => s + p.reviews, 0).toLocaleString()} total reviews`, color: 'gold' },
  ];

  // ── Products by category ────────────────────────────────────────────────────
  const categoryData = useMemo(() => {
    const map: Record<string, { products: number; revenue: number }> = {};
    products.forEach((p) => {
      if (!map[p.category]) map[p.category] = { products: 0, revenue: 0 };
      map[p.category].products += 1;
      map[p.category].revenue += Math.round(p.price * Math.max(1, p.reviews / 10));
    });
    return Object.entries(map)
      .map(([name, v]) => ({ name, products: v.products, revenue: v.revenue }))
      .sort((a, b) => b.products - a.products);
  }, [products]);

  // ── Monthly products added ──────────────────────────────────────────────────
  const monthlyData = useMemo(() => {
    const map: Record<string, { month: string; added: number; revenue: number }> = {};
    products.forEach((p) => {
      if (!p.createdAt) return;
      const d = new Date(p.createdAt + 'T00:00:00');
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!map[key]) map[key] = { month: label, added: 0, revenue: 0 };
      map[key].added += 1;
      map[key].revenue += Math.round(p.price * Math.max(1, p.reviews / 10));
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v);
  }, [products]);

  // ── Stock status pie ────────────────────────────────────────────────────────
  const stockPieData = useMemo(() => {
    let inStock = 0, low = 0, out = 0;
    products.forEach((p) => {
      const s = getStockStatus(p);
      if (s === 'in-stock') inStock++;
      else if (s === 'low-stock') low++;
      else out++;
    });
    return [
      { name: 'In Stock', value: inStock },
      { name: 'Low Stock', value: low },
      { name: 'Out of Stock', value: out },
    ].filter((d) => d.value > 0);
  }, [products]);

  // ── Section distribution ────────────────────────────────────────────────────
  const sectionData = useMemo(() => {
    const map: Record<string, number> = {
      trending: 0, 'just-launched': 0, deals: 0, bestsellers: 0,
    };
    products.forEach((p) => {
      (p.sections ?? []).forEach((s) => { if (s in map) map[s]++; });
    });
    const labels: Record<string, string> = {
      trending: 'Trending', 'just-launched': 'Just Launched', deals: 'Deals', bestsellers: 'Bestsellers',
    };
    return Object.entries(map).map(([key, count]) => ({ name: labels[key] ?? key, count }));
  }, [products]);

  // ── Top 5 products by rating ────────────────────────────────────────────────
  const topProducts = useMemo(
    () => [...products].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews).slice(0, 5),
    [products]
  );

  // ── CSV export helpers ──────────────────────────────────────────────────────
  const handleExportProducts = () => {
    const rows = products.map((p) => ({
      ID: p.id,
      Name: p.name,
      Category: p.category,
      'Price (₹)': p.price,
      'Original Price (₹)': p.originalPrice ?? '',
      'Discount (%)': p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0,
      Rating: p.rating,
      Reviews: p.reviews,
      Stock: p.stock,
      'Stock Status': getStockStatus(p),
      'New Arrival': p.isNew ? 'Yes' : 'No',
      'Created At': p.createdAt ?? '',
    }));
    downloadCSV(rows, `cherryvelle-products-${new Date().toISOString().slice(0, 10)}.csv`);
    showToast('Products CSV downloaded');
  };

  const handleExportCategories = () => {
    const rows = categoryData.map((c) => ({
      Category: c.name,
      'Product Count': c.products,
      'Est. Revenue (₹)': c.revenue,
    }));
    downloadCSV(rows, `cherryvelle-categories-${new Date().toISOString().slice(0, 10)}.csv`);
    showToast('Categories CSV downloaded');
  };

  const handleExportLowStock = () => {
    const rows = lowStockProducts.map((p) => ({
      ID: p.id,
      Name: p.name,
      Category: p.category,
      Stock: p.stock,
      'Low Stock Alert': p.lowStockAlert ?? 5,
      'Status': getStockStatus(p) === 'out-of-stock' ? 'Out of Stock' : 'Low Stock',
    }));
    downloadCSV(rows, `cherryvelle-low-stock-${new Date().toISOString().slice(0, 10)}.csv`);
    showToast('Low stock report downloaded');
  };

  const handleExportAll = () => {
    handleExportProducts();
    setTimeout(handleExportCategories, 300);
    setTimeout(() => { if (lowStockProducts.length) handleExportLowStock(); }, 600);
    showToast('All reports exported as CSV');
  };

  // ── PDF print ───────────────────────────────────────────────────────────────
  const handlePrintPDF = () => {
    window.print();
    showToast('Print dialog opened — save as PDF');
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <AdminShell title="Reports" subtitle="Business overview, analytics & exports">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-cherry-800 text-white text-sm px-5 py-3 rounded-xl shadow-lg animate-fadeSlideIn">
          {toast}
        </div>
      )}

      {/* ── Export Bar ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-cherry-400" />
          <span className="text-sm font-medium text-cherry-text">
            Showing all-time data · {products.length} products · {categories.length} categories
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handlePrintPDF}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-cherry-200 bg-white text-cherry-text text-sm font-medium hover:border-cherry-400 hover:text-cherry-dark transition-all"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Export PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
          <button
            onClick={handleExportAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cherry-700 text-white text-sm font-semibold hover:bg-cherry-800 transition-all shadow-sm shadow-cherry-700/20"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">CSV</span>
          </button>
        </div>
      </div>

      {/* ── Summary Stats ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {summaryStats.map((s) => (
          <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} sub={s.sub} color={s.color} />
        ))}
      </div>

      {/* ── Charts Row 1: Monthly Trend + Stock Pie ──────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Monthly trend line chart */}
        <div className="lg:col-span-2">
          <ReportCard title="Product Additions & Revenue Trend (Monthly)">
            {monthlyData.length < 2 ? (
              <div className="h-64 flex items-center justify-center text-cherry-300 text-sm">
                Not enough date data to show trend. Add products with <code className="bg-cherry-50 px-1 rounded">createdAt</code> dates.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={monthlyData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0d3d5" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#ce838a' }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#ce838a' }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#C5A059' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line yAxisId="left" type="monotone" dataKey="added" name="Products Added" stroke={C.cherry} strokeWidth={2.5} dot={{ fill: C.cherry, r: 4 }} activeDot={{ r: 6 }} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" name="Est. Revenue" stroke={C.gold} strokeWidth={2.5} dot={{ fill: C.gold, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </ReportCard>
        </div>

        {/* Stock status pie */}
        <div className="lg:col-span-1">
          <ReportCard title="Stock Status Breakdown">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={stockPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {stockPieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {stockPieData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-xs text-cherry-text">{d.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-cherry-dark">{d.value} products</span>
                </div>
              ))}
            </div>
          </ReportCard>
        </div>
      </div>

      {/* ── Charts Row 2: Category Bar + Section Bar ─────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Category performance */}
        <ReportCard
          title="Category Performance"
          action={
            <button onClick={handleExportCategories} className="inline-flex items-center gap-1 text-xs text-cherry-500 hover:text-cherry-700 font-medium transition-colors">
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
          }
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryData} margin={{ top: 4, right: 8, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0d3d5" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#ce838a' }} angle={-35} textAnchor="end" interval={0} />
              <YAxis tick={{ fontSize: 11, fill: '#ce838a' }} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="products" name="Products" radius={[4, 4, 0, 0]}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ReportCard>

        {/* Section distribution */}
        <ReportCard title="Section Distribution">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={sectionData} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0d3d5" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#ce838a' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#7a333a' }} width={90} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="count" name="Products" radius={[0, 4, 4, 0]}>
                {sectionData.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ReportCard>
      </div>

      {/* ── Top Products Table ──────────────────────────────────────────────── */}
      <div className="mb-6">
        <ReportCard
          title="Top Rated Products"
          action={
            <span className="text-xs text-cherry-400">By rating &amp; reviews</span>
          }
        >
          {/* Desktop */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cherry-50">
                  <th className="text-left py-2.5 pr-4 text-xs font-semibold text-cherry-400 uppercase tracking-wide">#</th>
                  <th className="text-left py-2.5 pr-4 text-xs font-semibold text-cherry-400 uppercase tracking-wide">Product</th>
                  <th className="text-left py-2.5 pr-4 text-xs font-semibold text-cherry-400 uppercase tracking-wide">Category</th>
                  <th className="text-left py-2.5 pr-4 text-xs font-semibold text-cherry-400 uppercase tracking-wide">Price</th>
                  <th className="text-left py-2.5 pr-4 text-xs font-semibold text-cherry-400 uppercase tracking-wide">Rating</th>
                  <th className="text-left py-2.5 text-xs font-semibold text-cherry-400 uppercase tracking-wide">Reviews</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cherry-50">
                {topProducts.map((p, i) => (
                  <tr key={p.id} className="hover:bg-cherry-50/30 transition-colors">
                    <td className="py-3 pr-4">
                      <span className={`inline-flex w-6 h-6 rounded-full items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-gray-100 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-600' : 'bg-cherry-50 text-cherry-400'}`}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-cherry-50 border border-cherry-100 flex-shrink-0">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover mix-blend-multiply" />
                        </div>
                        <span className="font-medium text-cherry-dark truncate max-w-[160px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="px-2.5 py-0.5 bg-cherry-50 text-cherry-700 text-xs font-medium rounded-full">{p.category}</span>
                    </td>
                    <td className="py-3 pr-4 font-semibold text-cherry-dark">₹{p.price.toLocaleString()}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-1">
                        <span className="text-cherry-gold">★</span>
                        <span className="font-semibold text-cherry-dark">{p.rating}</span>
                      </div>
                    </td>
                    <td className="py-3 text-cherry-text">{p.reviews.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile */}
          <div className="sm:hidden space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 py-2 border-b border-cherry-50 last:border-0">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-cherry-50 text-cherry-400'}`}>{i + 1}</span>
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-cherry-50 border border-cherry-100 flex-shrink-0">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-cherry-dark truncate">{p.name}</p>
                  <p className="text-[10px] text-cherry-400">{p.category} · ₹{p.price}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-cherry-dark">★ {p.rating}</p>
                  <p className="text-[10px] text-cherry-400">{p.reviews} reviews</p>
                </div>
              </div>
            ))}
          </div>
        </ReportCard>
      </div>

      {/* ── Low Stock Section ───────────────────────────────────────────────── */}
      <div className="mb-6">
        <ReportCard
          title={
            `Low Stock Products${lowStockProducts.length ? ` (${lowStockProducts.length})` : ''}`
          }
          action={
            lowStockProducts.length > 0 ? (
              <button onClick={handleExportLowStock} className="inline-flex items-center gap-1 text-xs text-cherry-500 hover:text-cherry-700 font-medium transition-colors">
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
            ) : undefined
          }
        >
          {lowStockProducts.length === 0 ? (
            <div className="py-10 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="text-sm font-medium text-cherry-dark">All products are well-stocked</p>
              <p className="text-xs text-cherry-400 mt-1">No low or out-of-stock items to show</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-cherry-50">
                      <th className="text-left py-2.5 pr-4 text-xs font-semibold text-cherry-400 uppercase tracking-wide">Product</th>
                      <th className="text-left py-2.5 pr-4 text-xs font-semibold text-cherry-400 uppercase tracking-wide">Category</th>
                      <th className="text-left py-2.5 pr-4 text-xs font-semibold text-cherry-400 uppercase tracking-wide">Stock</th>
                      <th className="text-left py-2.5 pr-4 text-xs font-semibold text-cherry-400 uppercase tracking-wide">Alert Threshold</th>
                      <th className="text-left py-2.5 text-xs font-semibold text-cherry-400 uppercase tracking-wide">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cherry-50">
                    {lowStockProducts.map((p) => {
                      const status = getStockStatus(p);
                      return (
                        <tr key={p.id} className={`hover:bg-cherry-50/30 transition-colors ${status === 'out-of-stock' ? 'bg-red-50/20' : 'bg-amber-50/20'}`}>
                          <td className="py-3.5 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-cherry-50 border border-cherry-100 flex-shrink-0">
                                <img src={p.image} alt={p.name} className="w-full h-full object-cover mix-blend-multiply" />
                              </div>
                              <span className="font-medium text-cherry-dark truncate max-w-[180px]">{p.name}</span>
                            </div>
                          </td>
                          <td className="py-3.5 pr-4">
                            <span className="px-2.5 py-0.5 bg-cherry-50 text-cherry-700 text-xs font-medium rounded-full">{p.category}</span>
                          </td>
                          <td className="py-3.5 pr-4">
                            <span className={`text-sm font-bold ${status === 'out-of-stock' ? 'text-red-500' : 'text-amber-500'}`}>
                              {p.stock} units
                            </span>
                          </td>
                          <td className="py-3.5 pr-4 text-cherry-text text-sm">≤ {p.lowStockAlert ?? 5}</td>
                          <td className="py-3.5">
                            {status === 'out-of-stock' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full">
                                <AlertTriangle className="w-3 h-3" /> Out of Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-600 text-xs font-semibold rounded-full">
                                <AlertTriangle className="w-3 h-3" /> Low Stock
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* Mobile cards */}
              <div className="sm:hidden space-y-3">
                {lowStockProducts.map((p) => {
                  const status = getStockStatus(p);
                  return (
                    <div key={p.id} className={`flex items-center gap-3 p-3 rounded-xl border ${status === 'out-of-stock' ? 'bg-red-50/40 border-red-100' : 'bg-amber-50/40 border-amber-100'}`}>
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-cherry-100 flex-shrink-0">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-cherry-dark truncate">{p.name}</p>
                        <p className="text-[10px] text-cherry-400">{p.category}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-sm font-bold ${status === 'out-of-stock' ? 'text-red-500' : 'text-amber-500'}`}>{p.stock} units</p>
                        <span className={`text-[10px] font-semibold ${status === 'out-of-stock' ? 'text-red-600' : 'text-amber-600'}`}>
                          {status === 'out-of-stock' ? 'OUT OF STOCK' : 'LOW STOCK'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </ReportCard>
      </div>

      {/* ── Export All Banner ───────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-cherry-700 to-cherry-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 print:hidden">
        <div className="flex-1">
          <h3 className="text-white font-semibold text-base">Export Full Reports</h3>
          <p className="text-white/70 text-sm mt-1">
            Download all product, category and stock data as CSV files, or print this page as PDF.
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0 flex-wrap">
          <button
            onClick={handlePrintPDF}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 border border-white/20 text-white rounded-xl text-sm font-medium hover:bg-white/20 transition-colors"
          >
            <FileText className="w-4 h-4" /> Save as PDF
          </button>
          <button
            onClick={handleExportAll}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-cherry-700 rounded-xl text-sm font-semibold hover:bg-cherry-50 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" /> Download CSV
          </button>
        </div>
      </div>

    </AdminShell>
  );
}

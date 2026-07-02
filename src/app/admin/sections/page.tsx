'use client';

import { useState, useMemo } from 'react';
import { X, Search, Plus, LayoutGrid } from 'lucide-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { useAdminStore, PRODUCT_SECTIONS, ProductSection } from '@/store/useAdminStore';

export default function SectionsPage() {
  const { products, assignSection, removeSection } = useAdminStore();
  const [activeSection, setActiveSection] = useState<ProductSection>('trending');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const sectionLabel = PRODUCT_SECTIONS.find((s) => s.key === activeSection)?.label ?? '';

  // Products already in the active section
  const sectionProducts = useMemo(
    () => products.filter((p) => (p.sections ?? []).includes(activeSection)),
    [products, activeSection]
  );

  // Products NOT yet in the active section, filtered by search
  const availableProducts = useMemo(() => {
    const notInSection = products.filter((p) => !(p.sections ?? []).includes(activeSection));
    if (!search.trim()) return notInSection;
    const q = search.toLowerCase();
    return notInSection.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [products, activeSection, search]);

  const handleAssign = (productId: string) => {
    assignSection(productId, activeSection);
    showToast('Product added to section');
  };

  const handleRemove = (productId: string) => {
    removeSection(productId, activeSection);
    showToast('Product removed from section');
  };

  return (
    <AdminShell
      title="Product Sections"
      subtitle="Control which products appear in each homepage section"
    >
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-cherry-800 text-white text-sm px-5 py-3 rounded-xl shadow-lg animate-fadeSlideIn">
          {toast}
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {PRODUCT_SECTIONS.map((sec) => {
          const count = products.filter((p) => (p.sections ?? []).includes(sec.key)).length;
          return (
            <button
              key={sec.key}
              onClick={() => { setActiveSection(sec.key); setSearch(''); }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                activeSection === sec.key
                  ? 'bg-cherry-700 text-white border-cherry-700 shadow-sm shadow-cherry-700/25'
                  : 'bg-white text-cherry-text border-cherry-200 hover:border-cherry-400 hover:text-cherry-dark'
              }`}
            >
              {sec.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  activeSection === sec.key
                    ? 'bg-white/20 text-white'
                    : 'bg-cherry-100 text-cherry-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ── Left: Products in this section ── */}
        <div>
          <h2 className="text-base font-semibold text-cherry-dark mb-3 flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-cherry-500" />
            {sectionLabel}
            <span className="text-xs text-cherry-400 font-normal">({sectionProducts.length} products)</span>
          </h2>

          {sectionProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-cherry-100 p-10 text-center">
              <p className="text-cherry-text text-sm">No products assigned to this section yet.</p>
              <p className="text-cherry-300 text-xs mt-1">Use the panel on the right to add products.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {sectionProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 bg-white rounded-xl border border-cherry-100 p-3 hover:border-cherry-200 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-cherry-50 flex-shrink-0 border border-cherry-100">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-cherry-dark truncate">{p.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs text-cherry-400">{p.category}</span>
                      <span className="text-xs font-semibold text-cherry-dark">₹{p.price}</span>
                      {p.sections && p.sections.length > 1 && (
                        <span className="text-[10px] bg-cherry-50 text-cherry-500 px-1.5 py-0.5 rounded-full font-medium">
                          +{p.sections.length - 1} other section{p.sections.length - 1 > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(p.id)}
                    className="p-1.5 rounded-lg text-cherry-300 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                    aria-label="Remove from section"
                    title="Remove from section"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Available products to add ── */}
        <div>
          <h2 className="text-base font-semibold text-cherry-dark mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-cherry-500" />
            Add Products
            <span className="text-xs text-cherry-400 font-normal">
              ({availableProducts.length} available)
            </span>
          </h2>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cherry-300" />
            <input
              className="admin-input pl-9 w-full"
              placeholder="Search by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {products.length === sectionProducts.length ? (
            <div className="bg-white rounded-2xl border border-cherry-100 p-10 text-center">
              <p className="text-cherry-text text-sm">All products are already in this section.</p>
            </div>
          ) : availableProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-cherry-100 p-10 text-center">
              <p className="text-cherry-text text-sm">No products match your search.</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {availableProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 bg-white rounded-xl border border-cherry-100 p-3 hover:border-cherry-200 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-cherry-50 flex-shrink-0 border border-cherry-100">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-cherry-dark truncate">{p.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs text-cherry-400">{p.category}</span>
                      <span className="text-xs font-semibold text-cherry-dark">₹{p.price}</span>
                      {p.sections && p.sections.length > 0 && (
                        <span className="text-[10px] bg-cherry-50 text-cherry-500 px-1.5 py-0.5 rounded-full font-medium">
                          In {p.sections.length} section{p.sections.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleAssign(p.id)}
                    className="p-1.5 rounded-lg text-cherry-400 hover:text-cherry-700 hover:bg-cherry-50 transition-colors flex-shrink-0"
                    aria-label="Add to section"
                    title="Add to section"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

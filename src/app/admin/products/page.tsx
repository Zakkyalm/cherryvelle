'use client';

import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Package, Search, Star, Grid3X3, X, ChevronDown, ChevronUp } from 'lucide-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { AdminModal } from '@/components/admin/AdminModal';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { useAdminStore, AdminProduct, Category, getStockStatus } from '@/store/useAdminStore';

const emptyProduct: Omit<AdminProduct, 'id'> = {
  name: '',
  price: 0,
  originalPrice: undefined,
  rating: 4.5,
  reviews: 0,
  stock: 0,
  lowStockAlert: 5,
  image: '',
  imageAlt: '',
  category: '',
  description: '',
  isNew: false,
};

const emptyCategory: Omit<Category, 'id'> = { name: '', count: 0, image: '', imageAlt: '' };

export default function ProductsPage() {
  const {
    products, categories,
    addProduct, updateProduct, deleteProduct,
    addCategory, updateCategory, deleteCategory,
  } = useAdminStore();

  // ── Product modal state ──────────────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [form, setForm] = useState<Omit<AdminProduct, 'id'>>(emptyProduct);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  // ── Filter / sort state ──────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterSale, setFilterSale] = useState('All');
  const [sortBy, setSortBy] = useState('name');

  // ── Category management (inline inside product modal) ────────────────────
  const [catPanelOpen, setCatPanelOpen] = useState(false);
  const [catEditing, setCatEditing] = useState<Category | null>(null);
  const [catForm, setCatForm] = useState<Omit<Category, 'id'>>(emptyCategory);
  const [catDeleteTarget, setCatDeleteTarget] = useState<string | null>(null);
  const [catModalOpen, setCatModalOpen] = useState(false);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyProduct, category: categories[0]?.name ?? '' });
    setCatPanelOpen(false);
    setModalOpen(true);
  };

  const openEdit = (p: AdminProduct) => {
    setEditing(p);
    setForm({ name: p.name, price: p.price, originalPrice: p.originalPrice, rating: p.rating, reviews: p.reviews, stock: p.stock, lowStockAlert: p.lowStockAlert ?? 5, image: p.image, imageAlt: p.imageAlt, category: p.category, description: p.description, isNew: p.isNew });
    setCatPanelOpen(false);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.price || !form.image || !form.imageAlt.trim()) return;
    const clean = { ...form, originalPrice: form.originalPrice || undefined };
    if (editing) { updateProduct(editing.id, clean); showToast('Product updated'); }
    else { addProduct(clean); showToast('Product added'); }
    setModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => { deleteProduct(id); setDeleteTarget(null); showToast('Product deleted'); };

  // Category CRUD
  const openAddCategory = () => { setCatEditing(null); setCatForm(emptyCategory); setCatModalOpen(true); };
  const openEditCategory = (c: Category) => { setCatEditing(c); setCatForm({ name: c.name, count: c.count, image: c.image, imageAlt: c.imageAlt }); setCatModalOpen(true); };

  const handleSaveCategory = () => {
    if (!catForm.name.trim()) return;
    if (catEditing) {
      updateCategory(catEditing.id, catForm);
      // keep product form in sync if the category name changed
      if (form.category === catEditing.name) setForm(f => ({ ...f, category: catForm.name }));
      showToast('Category updated');
    } else {
      addCategory(catForm);
      showToast('Category added');
    }
    setCatModalOpen(false);
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id);
    setCatDeleteTarget(null);
    showToast('Category deleted');
  };

  // ── Derived lists ────────────────────────────────────────────────────────
  const allFilterCategories = useMemo(() => ['All', ...categories.map(c => c.name)], [categories]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (searchQuery) list = list.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filterCategory !== 'All') list = list.filter(p => p.category === filterCategory);
    if (filterSale === 'On Sale') list = list.filter(p => !!p.originalPrice);
    if (filterSale === 'New') list = list.filter(p => !!p.isNew);
    if (sortBy === 'price_asc') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    else list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, searchQuery, filterCategory, filterSale, sortBy]);

  const discount = (price: number, original: number) => Math.round((1 - price / original) * 100);

  return (
    <AdminShell title="Products" subtitle="Create, edit and manage your product catalog">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-cherry-800 text-white text-sm px-5 py-3 rounded-xl shadow-lg animate-fadeSlideIn">
          {toast}
        </div>
      )}

      {/* Toolbar */}
      <div className="mb-6 space-y-3">
        {/* Row 1 — Search + Add */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cherry-300 pointer-events-none" />
            <input
              className="admin-input pl-9 h-10"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 h-10 px-4 bg-cherry-700 text-white rounded-xl text-sm font-semibold hover:bg-cherry-800 transition-colors shadow-sm shadow-cherry-700/25 whitespace-nowrap flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Row 2 — Filters */}
        <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-2">
          <select
            className="admin-input h-9 py-0 text-sm col-span-1 sm:flex-1 sm:min-w-0"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {allFilterCategories.map(c => <option key={c}>{c}</option>)}
          </select>
          <select
            className="admin-input h-9 py-0 text-sm col-span-1 sm:flex-1 sm:min-w-0"
            value={filterSale}
            onChange={(e) => setFilterSale(e.target.value)}
          >
            <option>All</option>
            <option>On Sale</option>
            <option>New</option>
          </select>
          <select
            className="admin-input h-9 py-0 text-sm col-span-1 sm:flex-1 sm:min-w-0"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort: Name</option>
            <option value="price_asc">Price ↑</option>
            <option value="price_desc">Price ↓</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        {/* Count */}
        <p className="text-xs text-cherry-400">{filtered.length} of {products.length} products</p>
      </div>

      {/* Products table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-cherry-100 p-16 text-center">
          <Package className="w-10 h-10 text-cherry-200 mx-auto mb-3" />
          <p className="text-cherry-text font-medium">{searchQuery || filterCategory !== 'All' ? 'No products match your filters' : 'No products yet'}</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block bg-white rounded-2xl border border-cherry-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cherry-50 bg-cherry-50/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-cherry-400 uppercase tracking-wide">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-cherry-400 uppercase tracking-wide">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-cherry-400 uppercase tracking-wide">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-cherry-400 uppercase tracking-wide">Rating</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-cherry-400 uppercase tracking-wide">Stock</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-cherry-400 uppercase tracking-wide">Tags</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-cherry-50">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-cherry-50/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-cherry-50 flex-shrink-0 border border-cherry-100">
                          <img src={p.image} alt={p.imageAlt || p.name} className="w-full h-full object-cover mix-blend-multiply" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-cherry-dark truncate max-w-[200px]">{p.name}</p>
                          <p className="text-xs text-cherry-400 font-mono">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 bg-cherry-50 text-cherry-700 text-xs font-medium rounded-full">{p.category}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div>
                        <span className="font-semibold text-cherry-dark">₹{p.price}</span>
                        {p.originalPrice && (
                          <>
                            <span className="text-xs text-cherry-300 line-through ml-1.5">₹{p.originalPrice}</span>
                            <span className="ml-1.5 text-[10px] bg-cherry-500 text-white px-1.5 py-0.5 rounded-full font-semibold">-{discount(p.price, p.originalPrice)}%</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-cherry-gold fill-current" />
                        <span className="text-cherry-dark font-medium">{p.rating}</span>
                        <span className="text-cherry-300 text-xs">({p.reviews})</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div>
                        <span className={`text-sm font-semibold ${
                          getStockStatus(p) === 'out-of-stock' ? 'text-red-500'
                          : getStockStatus(p) === 'low-stock' ? 'text-amber-500'
                          : 'text-emerald-600'
                        }`}>
                          {p.stock}
                        </span>
                        <span className="text-xs text-cherry-300 ml-1">units</span>
                        {getStockStatus(p) === 'out-of-stock' && (
                          <span className="ml-2 text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">OUT OF STOCK</span>
                        )}
                        {getStockStatus(p) === 'low-stock' && (
                          <span className="ml-2 text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full font-semibold">LOW STOCK</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1.5">
                        {p.isNew && <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-semibold rounded-full">NEW</span>}
                        {p.originalPrice && <span className="px-2 py-0.5 bg-cherry-50 text-cherry-600 text-[10px] font-semibold rounded-full">SALE</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-slate-600 transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards — 2 columns on all mobile, 2 columns on tablet */}
          <div className="lg:hidden grid grid-cols-2 gap-3">
            {filtered.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-cherry-100 overflow-hidden hover:border-cherry-300 hover:shadow-sm transition-all flex flex-col">
                <div className="flex flex-col gap-2 p-3">
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-cherry-50 border border-cherry-100">
                    <img src={p.image} alt={p.imageAlt || p.name} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-cherry-dark text-xs leading-tight line-clamp-2">{p.name}</p>
                    <p className="text-[10px] text-cherry-400 mt-0.5">{p.category}</p>
                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                      <span className="font-bold text-cherry-dark text-xs">₹{p.price}</span>
                      {p.originalPrice && <span className="text-[10px] text-cherry-300 line-through">₹{p.originalPrice}</span>}
                    </div>
                    <div className="flex items-center gap-0.5 mt-1">
                      <Star className="w-2.5 h-2.5 text-cherry-gold fill-current flex-shrink-0" />
                      <span className="text-[10px] text-cherry-text">{p.rating} ({p.reviews})</span>
                    </div>
                    <div className="mt-1">
                      <span className={`text-[10px] font-semibold ${
                        getStockStatus(p) === 'out-of-stock' ? 'text-red-500'
                        : getStockStatus(p) === 'low-stock' ? 'text-amber-500'
                        : 'text-emerald-600'
                      }`}>
                        {p.stock === 0 ? 'Out of Stock' : `${p.stock} in stock`}
                        {getStockStatus(p) === 'low-stock' && ' · Low Stock'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex border-t border-cherry-50 mt-auto">
                  <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1 py-2 text-[11px] text-slate-400 hover:text-slate-600 hover:bg-blue-50 transition-colors">
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <div className="w-px bg-cherry-50" />
                  <button onClick={() => setDeleteTarget(p.id)} className="flex-1 flex items-center justify-center gap-1 py-2 text-[11px] text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Add / Edit Product Modal ───────────────────────────────────────── */}
      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Product' : 'Add New Product'} size="lg">
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Product name */}
            <div className="sm:col-span-2">
              <label className="admin-label">Product Name *</label>
              <input className="admin-input" placeholder="e.g. Vitamin C Serum" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>

            {/* Price */}
            <div>
              <label className="admin-label">Price (₹) *</label>
              <input type="number" className="admin-input" placeholder="899" min={0} value={form.price || ''} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} />
            </div>

            {/* Original price */}
            <div>
              <label className="admin-label">Original Price (₹) <span className="text-cherry-300">(optional – shows sale badge)</span></label>
              <input type="number" className="admin-input" placeholder="1199" min={0} value={form.originalPrice || ''} onChange={(e) => setForm({ ...form, originalPrice: parseFloat(e.target.value) || undefined })} />
            </div>

            {/* ── Category field with inline management ──────────────────── */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="admin-label mb-0">Category *</label>
                <button
                  type="button"
                  onClick={() => setCatPanelOpen(v => !v)}
                  className="inline-flex items-center gap-1 text-xs text-cherry-500 hover:text-cherry-700 font-medium transition-colors"
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                  Manage categories
                  {catPanelOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {/* Category select */}
              <select
                className="admin-input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {categories.length === 0 && <option value="">— no categories yet —</option>}
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>

              {/* Inline category management panel */}
              {catPanelOpen && (
                <div className="mt-3 border border-cherry-100 rounded-xl overflow-hidden">
                  {/* Panel header */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-cherry-50/60 border-b border-cherry-100">
                    <span className="text-xs font-semibold text-cherry-600 uppercase tracking-wide">Categories ({categories.length})</span>
                    <button
                      type="button"
                      onClick={openAddCategory}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-cherry-700 hover:text-cherry-900 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> New category
                    </button>
                  </div>

                  {/* Category list */}
                  {categories.length === 0 ? (
                    <div className="px-4 py-6 text-center text-xs text-cherry-300">
                      No categories yet. Click "New category" to add one.
                    </div>
                  ) : (
                    <ul className="divide-y divide-cherry-50 max-h-52 overflow-y-auto">
                      {categories.map(cat => (
                        <li key={cat.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-cherry-50/40">
                          {/* Name */}
                          <span className="flex-1 text-sm font-medium text-cherry-dark truncate">{cat.name}</span>
                          {/* Count badge */}
                          <span className="text-[10px] text-cherry-300 flex-shrink-0">{cat.count} items</span>
                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => openEditCategory(cat)}
                              className="p-1 rounded-md hover:bg-blue-50 text-slate-400 hover:text-slate-600 transition-colors"
                              aria-label="Edit category"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setCatDeleteTarget(cat.id)}
                              className="p-1 rounded-md hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                              aria-label="Delete category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            {/* ── End category field ─────────────────────────────────────── */}

            {/* Rating */}
            <div>
              <label className="admin-label">Rating (0–5)</label>
              <input type="number" className="admin-input" step="0.1" min={0} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 0 })} />
            </div>

            {/* Reviews */}
            <div>
              <label className="admin-label">Review Count</label>
              <input type="number" className="admin-input" placeholder="128" min={0} value={form.reviews || ''} onChange={(e) => setForm({ ...form, reviews: parseInt(e.target.value) || 0 })} />
            </div>

            {/* Stock + Low Stock Alert — side by side */}
            <div>
              <label className="admin-label">Stock Quantity *</label>
              <input type="number" className="admin-input" placeholder="50" min={0} value={form.stock || ''} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} />
            </div>

            <div>
              <label className="admin-label">Low Stock Alert <span className="text-cherry-300">(units)</span></label>
              <input
                type="number"
                className="admin-input"
                placeholder="5"
                min={0}
                value={form.lowStockAlert ?? ''}
                onChange={(e) => setForm({ ...form, lowStockAlert: parseInt(e.target.value) || 0 })}
              />
              <p className="text-xs text-cherry-300 mt-1">Mark as Low Stock when quantity ≤ this value</p>
            </div>

            {/* Image */}
            <div className="sm:col-span-2">
              <ImageUpload label="Product Image" required value={form.image} onChange={(v) => setForm({ ...form, image: v })} altValue={form.imageAlt} onAltChange={(v) => setForm({ ...form, imageAlt: v })} altPlaceholder="e.g. Cherryvelle Vitamin C Serum product image" previewHeight="h-40" />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="admin-label">Description</label>
              <textarea className="admin-input min-h-[80px] resize-none" placeholder="Product description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            {/* New arrival checkbox */}
            <div className="sm:col-span-2 flex items-center gap-3">
              <input type="checkbox" id="isNew" checked={!!form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} className="w-4 h-4 accent-cherry-700" />
              <label htmlFor="isNew" className="text-sm font-medium text-cherry-dark">Mark as New Arrival (shows "NEW" badge)</label>
            </div>
          </div>

          <div className="flex gap-3 pt-2 border-t border-cherry-100">
            <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 border border-cherry-200 text-cherry-text rounded-xl text-sm font-medium hover:bg-cherry-50">Cancel</button>
            <button onClick={handleSave} disabled={!form.name.trim() || !form.price || !form.image || !form.imageAlt.trim()} className="flex-1 py-2.5 bg-cherry-700 text-white rounded-xl text-sm font-semibold hover:bg-cherry-800 disabled:opacity-50">
              {editing ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </div>
      </AdminModal>

      {/* ── Delete product confirm ─────────────────────────────────────────── */}
      <AdminModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Product?" size="sm">
        <p className="text-sm text-cherry-text mb-5">
          This will permanently remove <strong>{products.find(p => p.id === deleteTarget)?.name}</strong> from your catalog.
        </p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 border border-cherry-200 text-cherry-text rounded-xl text-sm font-medium hover:bg-cherry-50">Cancel</button>
          <button onClick={() => deleteTarget && handleDeleteProduct(deleteTarget)} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600">Delete</button>
        </div>
      </AdminModal>

      {/* ── Add / Edit Category Modal ──────────────────────────────────────── */}
      <AdminModal open={catModalOpen} onClose={() => setCatModalOpen(false)} title={catEditing ? 'Edit Category' : 'Add Category'}>
        <div className="space-y-4">
          <div>
            <label className="admin-label">Category Name *</label>
            <input className="admin-input" placeholder="e.g. Serums" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} />
          </div>

          <div>
            <label className="admin-label">Product Count</label>
            <input type="number" className="admin-input" placeholder="0" min={0} value={catForm.count} onChange={(e) => setCatForm({ ...catForm, count: parseInt(e.target.value) || 0 })} />
            <p className="text-xs text-cherry-300 mt-1">Display count shown on the category card</p>
          </div>

          <ImageUpload
            label="Category Image"
            value={catForm.image}
            onChange={(v) => setCatForm({ ...catForm, image: v })}
            altValue={catForm.imageAlt}
            onAltChange={(v) => setCatForm({ ...catForm, imageAlt: v })}
            altPlaceholder="e.g. Cherryvelle serums skincare category"
            previewHeight="h-32"
          />

          <div className="flex gap-3 pt-2">
            <button onClick={() => setCatModalOpen(false)} className="flex-1 py-2.5 border border-cherry-200 text-cherry-text rounded-xl text-sm font-medium hover:bg-cherry-50">Cancel</button>
            <button onClick={handleSaveCategory} disabled={!catForm.name.trim()} className="flex-1 py-2.5 bg-cherry-700 text-white rounded-xl text-sm font-semibold hover:bg-cherry-800 disabled:opacity-50">
              {catEditing ? 'Save Changes' : 'Add Category'}
            </button>
          </div>
        </div>
      </AdminModal>

      {/* ── Delete category confirm ────────────────────────────────────────── */}
      <AdminModal open={!!catDeleteTarget} onClose={() => setCatDeleteTarget(null)} title="Delete Category?" size="sm">
        <p className="text-sm text-cherry-text mb-5">
          This will permanently remove <strong>{categories.find(c => c.id === catDeleteTarget)?.name}</strong>. Products in this category won&apos;t be deleted.
        </p>
        <div className="flex gap-3">
          <button onClick={() => setCatDeleteTarget(null)} className="flex-1 py-2.5 border border-cherry-200 text-cherry-text rounded-xl text-sm font-medium hover:bg-cherry-50">Cancel</button>
          <button onClick={() => catDeleteTarget && handleDeleteCategory(catDeleteTarget)} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600">Delete</button>
        </div>
      </AdminModal>
    </AdminShell>
  );
}

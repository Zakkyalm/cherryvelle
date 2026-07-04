'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { X, Search, Plus, LayoutGrid, Pencil, Trash2, Check } from 'lucide-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { useAdminStore } from '@/store/useAdminStore';

export default function SectionsPage() {
  const {
    products,
    sectionDefs,
    assignSection,
    removeSection,
    addSectionDef,
    updateSectionDef,
    deleteSectionDef,
  } = useAdminStore();

  const [activeSection, setActiveSection] = useState<string>(() => sectionDefs[0]?.key ?? '');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  // ── Section CRUD state ──────────────────────────────────────────────────────
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [addingNew, setAddingNew] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [deleteConfirmKey, setDeleteConfirmKey] = useState<string | null>(null);

  const editInputRef = useRef<HTMLInputElement>(null);
  const newInputRef = useRef<HTMLInputElement>(null);

  // Keep activeSection valid if sections change
  useEffect(() => {
    if (!sectionDefs.find((s) => s.key === activeSection) && sectionDefs.length > 0) {
      setActiveSection(sectionDefs[0].key);
    }
  }, [sectionDefs, activeSection]);

  // Focus inputs when opened
  useEffect(() => { if (editingKey) editInputRef.current?.focus(); }, [editingKey]);
  useEffect(() => { if (addingNew) newInputRef.current?.focus(); }, [addingNew]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const activeDef = sectionDefs.find((s) => s.key === activeSection);
  const sectionLabel = activeDef?.label ?? '';

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

  // ── Section tab actions ─────────────────────────────────────────────────────
  const startEdit = (key: string, label: string) => {
    setActiveSection(key);
    setEditingKey(key);
    setEditValue(label);
    setDeleteConfirmKey(null);
    setAddingNew(false);
  };

  const commitEdit = () => {
    if (editingKey && editValue.trim()) {
      updateSectionDef(editingKey, editValue.trim());
      showToast('Section renamed');
    }
    setEditingKey(null);
  };

  const cancelEdit = () => setEditingKey(null);

  const handleDelete = (key: string) => {
    const wasActive = activeSection === key;
    deleteSectionDef(key);
    if (wasActive) setActiveSection(sectionDefs.filter((s) => s.key !== key)[0]?.key ?? '');
    setDeleteConfirmKey(null);
    showToast('Section deleted');
  };

  const commitAdd = () => {
    if (newLabel.trim()) {
      addSectionDef(newLabel.trim());
      showToast('Section created');
    }
    setAddingNew(false);
    setNewLabel('');
  };

  const cancelAdd = () => {
    setAddingNew(false);
    setNewLabel('');
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

      {/* ── Section Tabs ─────────────────────────────────────────────────────── */}
      <div className="mb-8 space-y-3">
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex flex-nowrap items-center gap-2 w-max sm:w-auto sm:flex-wrap pb-0.5">
        {sectionDefs.map((sec) => {
          const count = products.filter((p) => (p.sections ?? []).includes(sec.key)).length;
          const isActive = activeSection === sec.key;
          const isEditing = editingKey === sec.key;
          const awaitingDelete = deleteConfirmKey === sec.key;

          return (
            <div
              key={sec.key}
              className={`group inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all border flex-shrink-0 ${
                isActive
                  ? 'bg-cherry-700 text-white border-cherry-700 shadow-sm shadow-cherry-700/25'
                  : 'bg-white text-cherry-text border-cherry-200 hover:border-cherry-400 hover:text-cherry-dark'
              }`}
            >
              {/* Label / inline edit */}
              {isEditing ? (
                <>
                  <input
                    ref={editInputRef}
                    className={`w-32 text-sm outline-none px-0.5 border-b ${
                      isActive
                        ? 'bg-white/20 text-white placeholder-white/60 border-white/50'
                        : 'bg-transparent text-cherry-dark placeholder-cherry-300 border-cherry-400'
                    }`}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitEdit();
                      if (e.key === 'Escape') cancelEdit();
                    }}
                  />
                  <button
                    onClick={commitEdit}
                    className={`p-0.5 rounded ${isActive ? 'hover:bg-white/20 text-white' : 'hover:bg-cherry-50 text-cherry-600'}`}
                    title="Save"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className={`p-0.5 rounded ${isActive ? 'hover:bg-white/20 text-white' : 'hover:bg-cherry-50 text-cherry-400'}`}
                    title="Cancel"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : awaitingDelete ? (
                /* Normal tab view while modal is open */
                <>
                  <button
                    onClick={() => { setActiveSection(sec.key); setSearch(''); setDeleteConfirmKey(null); }}
                    className="flex items-center gap-1.5"
                  >
                    {sec.label}
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-cherry-100 text-cherry-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                  <span className="flex items-center gap-0.5 ml-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); startEdit(sec.key, sec.label); }}
                      className={`p-1 rounded transition-colors ${
                        isActive
                          ? 'text-white/60 hover:text-white hover:bg-white/15'
                          : 'text-cherry-300 hover:text-cherry-600 hover:bg-cherry-50'
                      }`}
                      title="Rename section"
                      aria-label="Rename section"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    {sectionDefs.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirmKey(sec.key); setEditingKey(null); }}
                        className={`p-1 rounded transition-colors ${
                          isActive
                            ? 'text-white/60 hover:text-red-300 hover:bg-white/15'
                            : 'text-cherry-300 hover:text-red-500 hover:bg-red-50'
                        }`}
                        title="Delete section"
                        aria-label="Delete section"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                </>
              ) : (
                /* Normal tab view */
                <>
                  <button
                    onClick={() => { setActiveSection(sec.key); setSearch(''); setDeleteConfirmKey(null); }}
                    className="flex items-center gap-1.5"
                  >
                    {sec.label}
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-cherry-100 text-cherry-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>

                  {/* Edit / Delete actions — always visible but subtle */}
                  <span className="flex items-center gap-0.5 ml-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); startEdit(sec.key, sec.label); }}
                      className={`p-1 rounded transition-colors ${
                        isActive
                          ? 'text-white/60 hover:text-white hover:bg-white/15'
                          : 'text-cherry-300 hover:text-cherry-600 hover:bg-cherry-50'
                      }`}
                      title="Rename section"
                      aria-label="Rename section"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    {sectionDefs.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirmKey(sec.key); setEditingKey(null); }}
                        className={`p-1 rounded transition-colors ${
                          isActive
                            ? 'text-white/60 hover:text-red-300 hover:bg-white/15'
                            : 'text-cherry-300 hover:text-red-500 hover:bg-red-50'
                        }`}
                        title="Delete section"
                        aria-label="Delete section"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                </>
              )}
            </div>
          );
        })}

        </div>
        </div>

        {/* ── Add new section — full width row ── */}
        {addingNew ? (
          <div className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium bg-white border border-cherry-400 shadow-sm">
            <input
              ref={newInputRef}
              className="flex-1 min-w-0 text-cherry-dark text-sm bg-transparent border-none outline-none placeholder-cherry-300 leading-none"
              placeholder="Section name…"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitAdd();
                if (e.key === 'Escape') cancelAdd();
              }}
            />
            <button
              onClick={commitAdd}
              className="p-1 text-cherry-600 hover:text-cherry-800 rounded flex-shrink-0"
              title="Create"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={cancelAdd}
              className="p-1 text-cherry-300 hover:text-cherry-600 rounded flex-shrink-0"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setAddingNew(true); setEditingKey(null); setDeleteConfirmKey(null); }}
            className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium bg-white border border-dashed border-cherry-300 text-cherry-400 hover:border-cherry-500 hover:text-cherry-600 transition-colors"
            title="Add new section"
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            New Section
          </button>
        )}
      </div>

      {/* ── Delete Confirmation Modal ────────────────────────────────────────── */}
      {deleteConfirmKey && (() => {
        const targetDef = sectionDefs.find((s) => s.key === deleteConfirmKey);
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setDeleteConfirmKey(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 flex flex-col gap-5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Icon + heading */}
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-1">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </div>
                <h2 className="text-base font-semibold text-cherry-dark">Delete Section?</h2>
                <p className="text-sm text-cherry-text">
                  Are you sure you want to delete{' '}
                  <span className="font-semibold text-cherry-dark">"{targetDef?.label}"</span>?
                  This cannot be undone.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmKey(null)}
                  className="flex-1 px-4 py-2 rounded-xl text-sm font-medium border border-cherry-200 text-cherry-text hover:bg-cherry-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmKey)}
                  className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Product assignment grid ─────────────────────────────────────────── */}
      {sectionDefs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-cherry-100 p-12 text-center">
          <p className="text-cherry-text text-sm">No sections yet. Create one above to get started.</p>
        </div>
      ) : (
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
      )}
    </AdminShell>
  );
}

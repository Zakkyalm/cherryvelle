'use client';

import { useState } from 'react';
import {
  Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  GripVertical, Star, Sparkles,
} from 'lucide-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { AdminModal } from '@/components/admin/AdminModal';
import { useAdminStore, FeatureItem } from '@/store/useAdminStore';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import * as LucideIcons from 'lucide-react';

// ── Available icons the user can pick from ────────────────────────────────────
const ICON_OPTIONS: string[] = [
  'Truck', 'ShieldCheck', 'RotateCcw', 'Gift', 'Star', 'Heart', 'Zap',
  'Package', 'BadgeCheck', 'Clock', 'Leaf', 'Tag', 'Percent', 'Award',
  'Headphones', 'ThumbsUp', 'Lock', 'Smile', 'Globe', 'Sparkles',
  'CreditCard', 'RefreshCcw', 'CircleCheck', 'Gem', 'Flame', 'Rocket',
  'HandHeart', 'Recycle', 'ShoppingBag', 'Box',
];

function LucideIcon({ name, className }: { name: string; className?: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as any)[name] as React.FC<{ className?: string }> | undefined;
  if (!Icon) return <Star className={className} />;
  return <Icon className={className} />;
}

const emptyItem: Omit<FeatureItem, 'id'> = {
  icon: 'Star',
  title: '',
  sub: '',
  minOrderINR: undefined,
  active: true,
};

export default function FeatureBarPage() {
  const {
    featureItems,
    addFeatureItem,
    updateFeatureItem,
    deleteFeatureItem,
    toggleFeatureItem,
    reorderFeatureItems,
  } = useAdminStore();
  const { getCurrencyConfig } = useCurrencyStore();

  // Admin previews always show the INR base value (what the admin is entering),
  // regardless of what currency the visitor has selected.
  const formatAdminPrice = (inrPrice: number): string => {
    const config = getCurrencyConfig('INR');
    const rounded = Math.round(inrPrice);
    return `${config.symbol}${rounded.toLocaleString('en-IN')}`;
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FeatureItem | null>(null);
  const [form, setForm] = useState<Omit<FeatureItem, 'id'>>(emptyItem);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const openAdd = () => { setEditing(null); setForm(emptyItem); setModalOpen(true); };
  const openEdit = (item: FeatureItem) => {
    setEditing(item);
    setForm({ icon: item.icon, title: item.title, sub: item.sub, minOrderINR: item.minOrderINR, active: item.active });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editing) {
      updateFeatureItem(editing.id, form);
      showToast('Item updated');
    } else {
      addFeatureItem(form);
      showToast('Item added');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteFeatureItem(id);
    setDeleteTarget(null);
    showToast('Item deleted');
  };

  // ── Drag-to-reorder ───────────────────────────────────────────────────────
  const handleDragStart = (id: string) => setDraggingId(id);
  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOverId(id);
  };
  const handleDrop = (targetId: string) => {
    if (!draggingId || draggingId === targetId) { setDraggingId(null); setDragOverId(null); return; }
    const items = [...featureItems];
    const from = items.findIndex((i) => i.id === draggingId);
    const to = items.findIndex((i) => i.id === targetId);
    const [moved] = items.splice(from, 1);
    items.splice(to, 0, moved);
    reorderFeatureItems(items);
    setDraggingId(null);
    setDragOverId(null);
  };
  const handleDragEnd = () => { setDraggingId(null); setDragOverId(null); };

  const activeCount = featureItems.filter((f) => f.active).length;

  return (
    <AdminShell
      title="Feature Bar"
      subtitle="Manage the trust/USP strip shown below the hero carousel"
    >
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-cherry-800 text-white text-sm px-5 py-3 rounded-xl shadow-lg animate-fadeSlideIn">
          {toast}
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cherry-50 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-cherry-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-cherry-dark">Feature Items</p>
            <p className="text-xs text-cherry-400">{activeCount} of {featureItems.length} active · drag to reorder</p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-cherry-700 text-white rounded-xl text-sm font-semibold hover:bg-cherry-800 transition-colors shadow-sm shadow-cherry-700/25 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* ── Live preview strip ───────────────────────────────────────────────── */}
      {featureItems.some((f) => f.active) && (
        <div className="mb-6 rounded-2xl border border-cherry-100 bg-white overflow-hidden">
          <div className="px-4 py-2.5 bg-cherry-50/60 border-b border-cherry-100">
            <span className="text-[10px] font-semibold text-cherry-400 uppercase tracking-wide">Live Preview</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-cherry-100">
            {featureItems.filter((f) => f.active).map((item) => (
              <div key={item.id} className="flex items-center gap-3 justify-center py-4 px-3">
                <span className="text-cherry-700 flex-shrink-0">
                  <LucideIcon name={item.icon} className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-cherry-dark leading-tight truncate">{item.title}</p>
                  <p className="text-xs text-cherry-text truncate">
                    {item.minOrderINR != null
                      ? `${item.sub} ${formatAdminPrice(item.minOrderINR)}+`
                      : item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Item list ────────────────────────────────────────────────────────── */}
      {featureItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-cherry-100 p-16 text-center">
          <Sparkles className="w-10 h-10 text-cherry-200 mx-auto mb-3" />
          <p className="text-cherry-text font-medium">No feature items yet</p>
          <p className="text-sm text-cherry-300 mt-1">Add items to display in the trust strip on the homepage</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {featureItems.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(item.id)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDrop={() => handleDrop(item.id)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 bg-white rounded-2xl border transition-all p-4 group ${
                item.active ? 'border-cherry-100 hover:border-cherry-300' : 'border-cherry-100 opacity-60'
              } ${draggingId === item.id ? 'opacity-40 scale-[0.98]' : ''} ${dragOverId === item.id && draggingId !== item.id ? 'border-cherry-400 shadow-sm shadow-cherry-400/20' : ''}`}
            >
              {/* Drag handle */}
              <GripVertical className="w-4 h-4 text-cherry-200 group-hover:text-cherry-400 cursor-grab active:cursor-grabbing flex-shrink-0 transition-colors" />

              {/* Icon preview */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${item.active ? 'bg-cherry-50 text-cherry-700' : 'bg-gray-50 text-gray-400'}`}>
                <LucideIcon name={item.icon} className="w-5 h-5" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-cherry-dark truncate">{item.title}</p>
                <p className="text-xs text-cherry-text truncate">
                  {item.minOrderINR != null
                    ? `${item.sub} ${formatAdminPrice(item.minOrderINR)}+`
                    : item.sub}
                </p>
              </div>

              {/* Icon name badge */}
              <span className="hidden sm:inline-block text-[10px] font-mono bg-cherry-50 text-cherry-400 px-2 py-1 rounded-lg flex-shrink-0">
                {item.icon}
              </span>

              {/* Active badge */}
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${item.active ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                {item.active ? 'Active' : 'Hidden'}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => toggleFeatureItem(item.id)}
                  className="p-1.5 rounded-lg hover:bg-cherry-50 transition-colors"
                  title={item.active ? 'Hide' : 'Show'}
                >
                  {item.active
                    ? <ToggleRight className="w-5 h-5 text-emerald-500" />
                    : <ToggleLeft className="w-5 h-5 text-cherry-300" />}
                </button>
                <button
                  onClick={() => openEdit(item)}
                  className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(item.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Modal ─────────────────────────────────────────────────── */}
      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Feature Item' : 'Add Feature Item'}
      >
        <div className="space-y-4">
          {/* Icon picker */}
          <div>
            <label className="admin-label">Icon</label>
            <div className="grid grid-cols-6 gap-2 mt-1 max-h-52 overflow-y-auto pr-1">
              {ICON_OPTIONS.map((iconName) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setForm({ ...form, icon: iconName })}
                  title={iconName}
                  className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl border text-center transition-all ${
                    form.icon === iconName
                      ? 'border-cherry-600 bg-cherry-50 text-cherry-700 shadow-sm shadow-cherry-700/15'
                      : 'border-cherry-100 hover:border-cherry-300 text-cherry-400 hover:text-cherry-600 bg-white'
                  }`}
                >
                  <LucideIcon name={iconName} className="w-5 h-5" />
                  <span className="text-[9px] font-mono leading-tight truncate w-full text-center">{iconName}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-cherry-300 mt-2">
              Selected: <span className="font-mono text-cherry-600">{form.icon}</span>
            </p>
          </div>

          {/* Title */}
          <div>
            <label className="admin-label">Title *</label>
            <input
              className="admin-input"
              placeholder="e.g. Free Delivery"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* Subtitle + inline price */}
          <div>
            <label className="admin-label">Subtitle</label>
            <input
              className="admin-input"
              placeholder="e.g. On orders above"
              value={form.sub}
              onChange={(e) => setForm({ ...form, sub: e.target.value })}
            />
            <p className="text-xs text-cherry-300 mt-1">
              If a price is set below, it will be appended automatically after the subtitle.
            </p>
          </div>

          {/* Price — shown inline below subtitle, clearly connected */}
          <div className="pl-3 border-l-2 border-cherry-100">
            <label className="admin-label">Price (INR base value)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cherry-400 text-sm font-medium">₹</span>
              <input
                type="number"
                min="0"
                step="1"
                className="admin-input pl-7"
                placeholder="e.g. 999 — leave empty for no price"
                value={form.minOrderINR ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({ ...form, minOrderINR: val === '' ? undefined : Number(val) });
                }}
              />
            </div>
            <p className="text-xs text-cherry-300 mt-1">
              Stored in INR — auto-converts to LKR, USD, or INR based on the visitor&apos;s currency.
            </p>
          </div>

          {/* Active */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="fiActive"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="w-4 h-4 accent-cherry-700"
            />
            <label htmlFor="fiActive" className="text-sm font-medium text-cherry-dark">
              Active (visible on homepage)
            </label>
          </div>

          {/* Preview */}
          <div className="border border-cherry-100 rounded-xl p-4 bg-cherry-50/40 flex items-center gap-3">
            <span className="text-cherry-700">
              <LucideIcon name={form.icon} className="w-5 h-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-cherry-dark">{form.title || 'Title preview'}</p>
              <p className="text-xs text-cherry-text">
                {form.minOrderINR != null
                  ? `${form.sub || 'Subtitle preview'} ${formatAdminPrice(form.minOrderINR)}+`
                  : (form.sub || 'Subtitle preview')}
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2 border-t border-cherry-100">
            <button
              onClick={() => setModalOpen(false)}
              className="flex-1 py-2.5 border border-cherry-200 text-cherry-text rounded-xl text-sm font-medium hover:bg-cherry-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!form.title.trim()}
              className="flex-1 py-2.5 bg-cherry-700 text-white rounded-xl text-sm font-semibold hover:bg-cherry-800 disabled:opacity-50"
            >
              {editing ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </div>
      </AdminModal>

      {/* ── Delete confirm ───────────────────────────────────────────────────── */}
      <AdminModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Feature Item?"
        size="sm"
      >
        <p className="text-sm text-cherry-text mb-5">
          This will permanently remove{' '}
          <strong>{featureItems.find((f) => f.id === deleteTarget)?.title}</strong>.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setDeleteTarget(null)}
            className="flex-1 py-2.5 border border-cherry-200 text-cherry-text rounded-xl text-sm font-medium hover:bg-cherry-50"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteTarget && handleDelete(deleteTarget)}
            className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </AdminModal>
    </AdminShell>
  );
}

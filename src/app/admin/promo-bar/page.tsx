'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Megaphone, Info } from 'lucide-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { AdminModal } from '@/components/admin/AdminModal';
import { useAdminStore, PromoBarMessage } from '@/store/useAdminStore';
import { useCurrency } from '@/hooks/useCurrency';

export default function PromoBarPage() {
  const { promoBarMessages, addPromoBarMessage, updatePromoBarMessage, deletePromoBarMessage, togglePromoBarMessage } = useAdminStore();
  const { formatPrice } = useCurrency();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PromoBarMessage | null>(null);
  const [text, setText] = useState('');
  const [priceINR, setPriceINR] = useState<number | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const openAdd = () => {
    setEditing(null);
    setText('');
    setPriceINR(undefined);
    setModalOpen(true);
  };

  const openEdit = (m: PromoBarMessage) => {
    setEditing(m);
    setText(m.text);
    setPriceINR(m.priceINR);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!text.trim()) return;
    const payload = { text, priceINR, active: true };
    if (editing) {
      updatePromoBarMessage(editing.id, payload);
      showToast('Message updated');
    } else {
      addPromoBarMessage(payload);
      showToast('Message added');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => { deletePromoBarMessage(id); setDeleteTarget(null); showToast('Message deleted'); };

  /** Resolve {price} placeholder for display purposes */
  const resolveText = (msg: PromoBarMessage) => {
    if (msg.priceINR != null) {
      return msg.text.replace('{price}', formatPrice(msg.priceINR));
    }
    return msg.text;
  };

  const activeMessages = promoBarMessages.filter(m => m.active);

  // Live preview of the form being edited
  const previewText = priceINR != null
    ? text.replace('{price}', formatPrice(priceINR))
    : text;

  return (
    <AdminShell title="Promo Bar" subtitle="Manage the scrolling ticker messages at the top of the homepage">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-cherry-800 text-white text-sm px-5 py-3 rounded-xl shadow-lg animate-fadeSlideIn">
          {toast}
        </div>
      )}

      {/* Preview */}
      {activeMessages.length > 0 && (
        <div className="bg-cherry-900 text-white py-2.5 px-4 rounded-xl mb-6 overflow-hidden">
          <p className="text-xs font-medium text-center opacity-70 mb-1">Live Preview</p>
          <div className="flex gap-8 overflow-hidden whitespace-nowrap">
            {[...activeMessages, ...activeMessages].map((m, i) => (
              <span key={i} className="text-sm font-medium tracking-wide flex-shrink-0">{resolveText(m)}</span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <p className="text-sm text-cherry-text">{activeMessages.length} of {promoBarMessages.length} messages active</p>
        <button onClick={openAdd} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-cherry-700 text-white rounded-xl text-sm font-semibold hover:bg-cherry-800 transition-colors shadow-sm shadow-cherry-700/25 w-full sm:w-auto">
          <Plus className="w-4 h-4" /> Add Message
        </button>
      </div>

      {promoBarMessages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-cherry-100 p-16 text-center">
          <Megaphone className="w-10 h-10 text-cherry-200 mx-auto mb-3" />
          <p className="text-cherry-text font-medium">No messages yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-cherry-100 overflow-hidden">
          <div className="divide-y divide-cherry-50">
            {promoBarMessages.map((msg, idx) => (
              <div key={msg.id} className={`flex items-center gap-4 px-5 py-4 transition-colors ${!msg.active ? 'opacity-50' : ''}`}>
                <span className="text-xs text-cherry-300 font-mono w-5 flex-shrink-0">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-cherry-dark truncate">{resolveText(msg)}</p>
                  {msg.priceINR != null && (
                    <p className="text-xs text-cherry-400 mt-0.5">Base price: ₹{msg.priceINR} (auto-converts)</p>
                  )}
                </div>
                <div className={`text-[10px] font-semibold px-2 py-1 rounded-full flex-shrink-0 ${msg.active ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                  {msg.active ? 'Active' : 'Hidden'}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => togglePromoBarMessage(msg.id)} className="p-1.5 rounded-lg hover:bg-cherry-50 transition-colors" title={msg.active ? 'Deactivate' : 'Activate'}>
                    {msg.active ? <ToggleRight className="w-5 h-5 text-emerald-500" /> : <ToggleLeft className="w-5 h-5 text-cherry-300" />}
                  </button>
                  <button onClick={() => openEdit(msg)} className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors text-slate-400 hover:text-slate-600">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(msg.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Message' : 'Add Promo Message'}>
        <div className="space-y-4">
          {/* Message text */}
          <div>
            <label className="admin-label">Message Text *</label>
            <input
              className="admin-input"
              placeholder="e.g. Free Shipping on Orders {price}+"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <p className="text-xs text-cherry-300 mt-1 flex items-start gap-1">
              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              Use <span className="font-mono bg-cherry-50 px-1 rounded mx-0.5 text-cherry-600">{'{price}'}</span> as a placeholder — it will be replaced by the converted price below.
            </p>
          </div>

          {/* Price field */}
          <div>
            <label className="admin-label">Price (INR base value)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cherry-400 text-sm font-medium">₹</span>
              <input
                type="number"
                min="0"
                step="1"
                className="admin-input pl-7"
                placeholder="e.g. 999 — leave empty if no price"
                value={priceINR ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setPriceINR(val === '' ? undefined : Number(val));
                }}
              />
            </div>
            <p className="text-xs text-cherry-300 mt-1">
              Stored in INR and auto-converted to the visitor&apos;s currency (LKR, USD, INR).
            </p>
          </div>

          {/* Live preview */}
          {text.trim() && (
            <div className="bg-cherry-900 text-white rounded-xl px-4 py-3">
              <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wide mb-1">Preview</p>
              <p className="text-sm font-medium">{previewText || '—'}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 border border-cherry-200 text-cherry-text rounded-xl text-sm font-medium hover:bg-cherry-50">Cancel</button>
            <button onClick={handleSave} disabled={!text.trim()} className="flex-1 py-2.5 bg-cherry-700 text-white rounded-xl text-sm font-semibold hover:bg-cherry-800 disabled:opacity-50">
              {editing ? 'Save Changes' : 'Add Message'}
            </button>
          </div>
        </div>
      </AdminModal>

      {/* Delete confirm */}
      <AdminModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Message?" size="sm">
        <p className="text-sm text-cherry-text mb-5">This message will be permanently removed.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 border border-cherry-200 text-cherry-text rounded-xl text-sm font-medium hover:bg-cherry-50">Cancel</button>
          <button onClick={() => deleteTarget && handleDelete(deleteTarget)} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600">Delete</button>
        </div>
      </AdminModal>
    </AdminShell>
  );
}

'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Images, GripVertical } from 'lucide-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { AdminModal } from '@/components/admin/AdminModal';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { useAdminStore, HeroBanner } from '@/store/useAdminStore';

const emptyBanner: Omit<HeroBanner, 'id'> = {
  image: '',
  imageAlt: '',
  offerText: '',
  offerSub: '',
  link: '/shop',
  active: true,
};

export default function HeroBannersPage() {
  const { heroBanners, addHeroBanner, updateHeroBanner, deleteHeroBanner, toggleHeroBanner } = useAdminStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<HeroBanner | null>(null);
  const [form, setForm] = useState<Omit<HeroBanner, 'id'>>(emptyBanner);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyBanner);
    setModalOpen(true);
  };

  const openEdit = (b: HeroBanner) => {
    setEditing(b);
    setForm({ image: b.image, imageAlt: b.imageAlt, offerText: b.offerText, offerSub: b.offerSub, link: b.link, active: b.active });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.image.trim() || !form.offerText.trim() || !form.imageAlt.trim()) return;
    if (editing) {
      updateHeroBanner(editing.id, form);
      showToast('Banner updated');
    } else {
      addHeroBanner(form);
      showToast('Banner added');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteHeroBanner(id);
    setDeleteTarget(null);
    showToast('Banner deleted');
  };

  return (
    <AdminShell title="Hero Banners" subtitle="Manage the homepage carousel images and offer text">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-cherry-800 text-white text-sm px-5 py-3 rounded-xl shadow-lg animate-fadeSlideIn">
          {toast}
        </div>
      )}

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-sm text-cherry-text">
            {heroBanners.filter(b => b.active).length} of {heroBanners.length} banners active
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-cherry-700 text-white rounded-xl text-sm font-semibold hover:bg-cherry-800 transition-colors shadow-sm shadow-cherry-700/25"
        >
          <Plus className="w-4 h-4" />
          Add Banner
        </button>
      </div>

      {/* Grid */}
      {heroBanners.length === 0 ? (
        <div className="bg-white rounded-2xl border border-cherry-100 p-16 text-center">
          <Images className="w-10 h-10 text-cherry-200 mx-auto mb-3" />
          <p className="text-cherry-text font-medium">No banners yet</p>
          <p className="text-sm text-cherry-300 mt-1">Add your first hero banner to get started</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {heroBanners.map((banner) => (
            <div
              key={banner.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden group ${banner.active ? 'border-cherry-100 hover:border-cherry-300' : 'border-cherry-100 opacity-60'}`}
            >
              {/* Image preview */}
              <div className="relative h-44 bg-cherry-50 overflow-hidden">
                {banner.image ? (
                  <img
                    src={banner.image}
                    alt={banner.imageAlt || banner.offerText}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Images className="w-8 h-8 text-cherry-200" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="text-white font-bold text-base leading-tight drop-shadow">{banner.offerText}</p>
                  <p className="text-white/80 text-sm">{banner.offerSub}</p>
                </div>
                {/* Status badge */}
                <div className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-1 rounded-full ${banner.active ? 'bg-emerald-500 text-white' : 'bg-gray-400 text-white'}`}>
                  {banner.active ? 'Active' : 'Hidden'}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-cherry-50">
                <span className="text-xs text-cherry-400 truncate flex-1 mr-2">{banner.link}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleHeroBanner(banner.id)}
                    className="p-1.5 rounded-lg hover:bg-cherry-50 transition-colors"
                    title={banner.active ? 'Deactivate' : 'Activate'}
                  >
                    {banner.active
                      ? <ToggleRight className="w-5 h-5 text-emerald-500" />
                      : <ToggleLeft className="w-5 h-5 text-cherry-300" />}
                  </button>
                  <button
                    onClick={() => openEdit(banner)}
                    className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors text-slate-400 hover:text-slate-600"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(banner.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Banner' : 'Add Hero Banner'}>
        <div className="space-y-4">
          <div>
            <ImageUpload
              label="Banner Image"
              required
              value={form.image}
              onChange={(v) => setForm({ ...form, image: v })}
              altValue={form.imageAlt}
              onAltChange={(v) => setForm({ ...form, imageAlt: v })}
              altPlaceholder="e.g. Cherryvelle skincare product banner"
              previewHeight="h-36"
            />
          </div>
          <div>
            <label className="admin-label">Offer Text *</label>
            <input
              className="admin-input"
              placeholder="e.g. Up To 30% Off"
              value={form.offerText}
              onChange={(e) => setForm({ ...form, offerText: e.target.value })}
            />
          </div>
          <div>
            <label className="admin-label">Sub Text</label>
            <input
              className="admin-input"
              placeholder="e.g. On Entire Brand!"
              value={form.offerSub}
              onChange={(e) => setForm({ ...form, offerSub: e.target.value })}
            />
          </div>
          <div>
            <label className="admin-label">Link</label>
            <input
              className="admin-input"
              placeholder="/shop"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="heroActive"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="w-4 h-4 accent-cherry-700"
            />
            <label htmlFor="heroActive" className="text-sm font-medium text-cherry-dark">Active (visible on homepage)</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 border border-cherry-200 text-cherry-text rounded-xl text-sm font-medium hover:bg-cherry-50 transition-colors">Cancel</button>
            <button
              onClick={handleSave}
              disabled={!form.image || !form.offerText.trim() || !form.imageAlt.trim()}
              className="flex-1 py-2.5 bg-cherry-700 text-white rounded-xl text-sm font-semibold hover:bg-cherry-800 transition-colors disabled:opacity-50"
            >
              {editing ? 'Save Changes' : 'Add Banner'}
            </button>
          </div>
        </div>
      </AdminModal>

      {/* Delete confirm modal */}
      <AdminModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Banner?" size="sm">
        <p className="text-sm text-cherry-text mb-5">This action cannot be undone. The banner will be permanently removed.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 border border-cherry-200 text-cherry-text rounded-xl text-sm font-medium hover:bg-cherry-50">Cancel</button>
          <button onClick={() => deleteTarget && handleDelete(deleteTarget)} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600">Delete</button>
        </div>
      </AdminModal>
    </AdminShell>
  );
}

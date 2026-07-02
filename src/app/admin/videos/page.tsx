'use client';

import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Video,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { AdminModal } from '@/components/admin/AdminModal';
import { MediaUpload } from '@/components/admin/MediaUpload';
import { useAdminStore, SiteVideo, VideoSlot, MediaContentType } from '@/store/useAdminStore';

const SLOT_OPTIONS: { value: VideoSlot; label: string; description: string }[] = [
  { value: 'main', label: 'Main Promo Section', description: '"See the Cherryvelle Glow" full-width area' },
  { value: 'collection-left', label: 'Featured Collection – Left', description: 'Left card in the 2-column banner' },
  { value: 'collection-right', label: 'Featured Collection – Right', description: 'Right card in the 2-column banner' },
];

const emptyItem: Omit<SiteVideo, 'id'> = {
  slot: 'main',
  label: '',
  contentType: 'video',
  src: '',
  poster: '',
  posterAlt: '',
  imageSrc: '',
  imageAlt: '',
  title: '',
  subtitle: '',
  linkHref: '',
  linkText: '',
  active: true,
};

export default function VideosPage() {
  const { videos, addVideo, updateVideo, deleteVideo, toggleVideo } = useAdminStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SiteVideo | null>(null);
  const [form, setForm] = useState<Omit<SiteVideo, 'id'>>(emptyItem);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyItem);
    setModalOpen(true);
  };

  const openEdit = (v: SiteVideo) => {
    setEditing(v);
    setForm({
      slot: v.slot,
      label: v.label,
      contentType: v.contentType ?? 'video',
      src: v.src,
      poster: v.poster,
      posterAlt: v.posterAlt,
      imageSrc: v.imageSrc ?? '',
      imageAlt: v.imageAlt ?? '',
      title: v.title,
      subtitle: v.subtitle,
      linkHref: v.linkHref,
      linkText: v.linkText,
      active: v.active,
    });
    setModalOpen(true);
  };

  const isSaveDisabled = () => {
    if (!form.title.trim()) return true;
    if (form.contentType === 'video' && !form.src.trim()) return true;
    if (form.contentType === 'image' && !form.imageSrc.trim()) return true;
    return false;
  };

  const handleSave = () => {
    if (isSaveDisabled()) return;
    if (editing) {
      updateVideo(editing.id, form);
      showToast('Item updated');
    } else {
      addVideo(form);
      showToast('Item added');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteVideo(id);
    setDeleteTarget(null);
    showToast('Item deleted');
  };

  const slotLabel = (slot: VideoSlot) =>
    SLOT_OPTIONS.find((s) => s.value === slot)?.label ?? slot;

  const slotDescription = (slot: VideoSlot) =>
    SLOT_OPTIONS.find((s) => s.value === slot)?.description ?? '';

  const activeCount = videos.filter((v) => v.active).length;

  return (
    <AdminShell title="Media Section" subtitle="Manage promotional videos and images displayed on the homepage">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-cherry-800 text-white text-sm px-5 py-3 rounded-xl shadow-lg animate-fadeSlideIn">
          {toast}
        </div>
      )}

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <p className="text-sm text-cherry-text">
          {activeCount} of {videos.length} item{videos.length !== 1 ? 's' : ''} active
        </p>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-cherry-700 text-white rounded-xl text-sm font-semibold hover:bg-cherry-800 transition-colors shadow-sm shadow-cherry-700/25"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Slot legend */}
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {SLOT_OPTIONS.map((slot) => {
          const assigned = videos.filter((v) => v.slot === slot.value);
          return (
            <div key={slot.value} className="bg-white rounded-xl border border-cherry-100 px-4 py-3 flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${assigned.some((v) => v.active) ? 'bg-emerald-500' : 'bg-cherry-200'}`} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-cherry-dark truncate">{slot.label}</p>
                <p className="text-xs text-cherry-400 truncate">{slot.description}</p>
                <p className="text-xs text-cherry-300 mt-0.5">
                  {assigned.length} item{assigned.length !== 1 ? 's' : ''} assigned
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Media cards */}
      {videos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-cherry-100 p-16 text-center">
          <Video className="w-10 h-10 text-cherry-200 mx-auto mb-3" />
          <p className="text-cherry-text font-medium">No items yet</p>
          <p className="text-sm text-cherry-300 mt-1">Add your first video or image to get started</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {videos.map((item) => {
            const isImage = (item.contentType ?? 'video') === 'image';
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all overflow-hidden group ${item.active ? 'border-cherry-100 hover:border-cherry-300' : 'border-cherry-100 opacity-60'}`}
              >
                {/* Preview */}
                <div className="relative h-44 bg-cherry-900 overflow-hidden">
                  {isImage ? (
                    <img
                      src={item.imageSrc}
                      alt={item.imageAlt || item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <video
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      poster={item.poster || undefined}
                      onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLVideoElement;
                        el.pause();
                        el.currentTime = 0;
                      }}
                    >
                      <source src={item.src} type="video/mp4" />
                    </video>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 p-4 pointer-events-none">
                    <p className="text-white font-bold text-sm leading-tight drop-shadow">{item.title}</p>
                    {item.subtitle && (
                      <p className="text-white/70 text-xs mt-0.5 line-clamp-2">{item.subtitle}</p>
                    )}
                  </div>

                  {/* Status badge */}
                  <div className={`absolute top-3 left-3 text-[10px] font-semibold px-2 py-1 rounded-full ${item.active ? 'bg-emerald-500 text-white' : 'bg-gray-400 text-white'}`}>
                    {item.active ? 'Active' : 'Hidden'}
                  </div>

                  {/* Content type badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm">
                    {isImage
                      ? <><ImageIcon className="w-3 h-3" /> Image</>
                      : <><Video className="w-3 h-3" /> Video</>
                    }
                  </div>
                </div>

                {/* Meta */}
                <div className="px-4 pt-3 pb-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-cherry-700 bg-cherry-50 px-2 py-0.5 rounded-full truncate">
                      {slotLabel(item.slot)}
                    </span>
                  </div>
                  <p className="text-xs text-cherry-300 truncate mt-1">
                    {isImage ? (item.imageSrc || '—') : (item.src || '—')}
                  </p>
                  {item.linkHref && (
                    <p className="text-xs text-cherry-400 flex items-center gap-1 mt-0.5 truncate">
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      {item.linkHref}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-cherry-50 mt-2">
                  <p className="text-xs text-cherry-300 truncate flex-1 mr-2">{slotDescription(item.slot)}</p>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleVideo(item.id)}
                      className="p-1.5 rounded-lg hover:bg-cherry-50 transition-colors"
                      title={item.active ? 'Deactivate' : 'Activate'}
                    >
                      {item.active
                        ? <ToggleRight className="w-5 h-5 text-emerald-500" />
                        : <ToggleLeft className="w-5 h-5 text-cherry-300" />}
                    </button>
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors text-slate-400 hover:text-slate-600"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Media Item' : 'Add Media Item'}
        size="lg"
      >
        <div className="space-y-4">
          {/* Content Type selector */}
          <div>
            <label className="admin-label">Content Type *</label>
            <div className="flex rounded-xl border border-cherry-100 overflow-hidden">
              {(['video', 'image'] as MediaContentType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm({ ...form, contentType: type })}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors
                    ${type === 'image' ? 'border-l border-cherry-100' : ''}
                    ${form.contentType === type
                      ? 'bg-cherry-700 text-white'
                      : 'bg-white text-cherry-400 hover:text-cherry-600 hover:bg-cherry-50'
                    }`}
                >
                  {type === 'video'
                    ? <><Video className="w-4 h-4" /> Video</>
                    : <><ImageIcon className="w-4 h-4" /> Image</>
                  }
                </button>
              ))}
            </div>
          </div>

          {/* Slot */}
          <div>
            <label className="admin-label">Display Slot *</label>
            <select
              className="admin-input"
              value={form.slot}
              onChange={(e) => setForm({ ...form, slot: e.target.value as VideoSlot })}
            >
              {SLOT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label} — {s.description}
                </option>
              ))}
            </select>
          </div>

          {/* Label */}
          <div>
            <label className="admin-label">Internal Label</label>
            <input
              className="admin-input"
              placeholder="e.g. Summer Campaign 2025"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
            />
          </div>

          {/* Media upload (video or image) */}
          <MediaUpload
            contentType={form.contentType}
            videoSrc={form.src}
            onVideoChange={(src) => setForm({ ...form, src })}
            poster={form.poster}
            posterAlt={form.posterAlt}
            onPosterChange={(poster) => setForm({ ...form, poster })}
            onPosterAltChange={(posterAlt) => setForm({ ...form, posterAlt })}
            imageSrc={form.imageSrc}
            imageAlt={form.imageAlt}
            onImageChange={(imageSrc) => setForm({ ...form, imageSrc })}
            onImageAltChange={(imageAlt) => setForm({ ...form, imageAlt })}
          />

          {/* Overlay title & subtitle */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="admin-label">Overlay Title *</label>
              <input
                className="admin-input"
                placeholder="e.g. See the Cherryvelle Glow"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="admin-label">Overlay Subtitle</label>
              <input
                className="admin-input"
                placeholder="e.g. Watch how our products transform your skin"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              />
            </div>
            <div>
              <label className="admin-label">Link URL <span className="text-cherry-300">(optional)</span></label>
              <input
                className="admin-input"
                placeholder="/shop"
                value={form.linkHref}
                onChange={(e) => setForm({ ...form, linkHref: e.target.value })}
              />
            </div>
            <div>
              <label className="admin-label">Link Text <span className="text-cherry-300">(optional)</span></label>
              <input
                className="admin-input"
                placeholder="e.g. Shop Now"
                value={form.linkText}
                onChange={(e) => setForm({ ...form, linkText: e.target.value })}
              />
            </div>
          </div>

          {/* Active */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="mediaActive"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="w-4 h-4 accent-cherry-700"
            />
            <label htmlFor="mediaActive" className="text-sm font-medium text-cherry-dark">
              Active (visible on homepage)
            </label>
          </div>

          <div className="flex gap-3 pt-2 border-t border-cherry-100">
            <button
              onClick={() => setModalOpen(false)}
              className="flex-1 py-2.5 border border-cherry-200 text-cherry-text rounded-xl text-sm font-medium hover:bg-cherry-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaveDisabled()}
              className="flex-1 py-2.5 bg-cherry-700 text-white rounded-xl text-sm font-semibold hover:bg-cherry-800 transition-colors disabled:opacity-50"
            >
              {editing ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </div>
      </AdminModal>

      {/* Delete confirm modal */}
      <AdminModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Item?" size="sm">
        <p className="text-sm text-cherry-text mb-5">
          This will permanently remove{' '}
          <strong>{videos.find((v) => v.id === deleteTarget)?.title}</strong> from the media list.
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

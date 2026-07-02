'use client';

import { useState } from 'react';
import {
  Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  Images, Timer, ChevronDown, ChevronUp, Clock, Tag,
} from 'lucide-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { AdminModal } from '@/components/admin/AdminModal';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { useAdminStore, HeroBanner, LimitedTimeOffer, PromoBanner, LTO_THEME_MAP } from '@/store/useAdminStore';

// ─── Hero Banner helpers ──────────────────────────────────────────────────────

const emptyHero: Omit<HeroBanner, 'id'> = {
  image: '',
  imageAlt: '',
  offerText: '',
  offerSub: '',
  link: '/shop',
  active: true,
};

// ─── LTO helpers ──────────────────────────────────────────────────────────────

const LTO_THEMES = [
  { label: 'Cherry (default)', value: 'cherry' },
  { label: 'Midnight', value: 'midnight' },
  { label: 'Forest', value: 'forest' },
  { label: 'Ocean', value: 'ocean' },
  { label: 'Sunset', value: 'sunset' },
];

const emptyLTO: Omit<LimitedTimeOffer, 'id'> = {
  headline: '',
  headlineAccent: '',
  subtext: '',
  couponCode: '',
  buttonText: 'Shop the Sale',
  buttonLink: '/shop',
  image: '',
  imageAlt: '',
  bgColor: 'cherry',
  active: true,
};

// ─── Deal Banner helpers ───────────────────────────────────────────────────────

const DEAL_BG_OPTIONS = [
  { label: 'Cherry', value: 'bg-gradient-to-r from-cherry-100 to-cherry-50', text: 'text-cherry-800' },
  { label: 'Amber', value: 'bg-gradient-to-r from-amber-50 to-yellow-50', text: 'text-amber-800' },
  { label: 'Emerald', value: 'bg-gradient-to-r from-emerald-50 to-green-50', text: 'text-emerald-800' },
  { label: 'Sky', value: 'bg-gradient-to-r from-sky-50 to-blue-50', text: 'text-sky-800' },
  { label: 'Purple', value: 'bg-gradient-to-r from-purple-50 to-violet-50', text: 'text-purple-800' },
  { label: 'Rose', value: 'bg-gradient-to-r from-rose-50 to-pink-50', text: 'text-rose-800' },
];

const emptyDeal: Omit<PromoBanner, 'id'> = {
  title: '',
  subtitle: '',
  bgColor: DEAL_BG_OPTIONS[0].value,
  textColor: DEAL_BG_OPTIONS[0].text,
  active: true,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function BannersPage() {
  const {
    heroBanners,
    addHeroBanner, updateHeroBanner, deleteHeroBanner, toggleHeroBanner,
    limitedTimeOffers,
    addLimitedTimeOffer, updateLimitedTimeOffer, deleteLimitedTimeOffer, toggleLimitedTimeOffer,
    promoBanners,
    addPromoBanner, updatePromoBanner, deletePromoBanner, togglePromoBanner,
  } = useAdminStore();

  const [toast, setToast] = useState('');
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const [heroOpen, setHeroOpen] = useState(true);
  const [ltoOpen, setLtoOpen] = useState(true);
  const [dealOpen, setDealOpen] = useState(true);

  // ── Hero modal state
  const [heroModal, setHeroModal] = useState(false);
  const [heroEditing, setHeroEditing] = useState<HeroBanner | null>(null);
  const [heroForm, setHeroForm] = useState<Omit<HeroBanner, 'id'>>(emptyHero);
  const [heroDeleteTarget, setHeroDeleteTarget] = useState<string | null>(null);

  const openAddHero = () => { setHeroEditing(null); setHeroForm(emptyHero); setHeroModal(true); };
  const openEditHero = (b: HeroBanner) => {
    setHeroEditing(b);
    setHeroForm({ image: b.image, imageAlt: b.imageAlt, offerText: b.offerText, offerSub: b.offerSub, link: b.link, active: b.active });
    setHeroModal(true);
  };
  const handleSaveHero = () => {
    if (!heroForm.image.trim() || !heroForm.offerText.trim() || !heroForm.imageAlt.trim()) return;
    if (heroEditing) { updateHeroBanner(heroEditing.id, heroForm); showToast('Hero banner updated'); }
    else { addHeroBanner(heroForm); showToast('Hero banner added'); }
    setHeroModal(false);
  };
  const handleDeleteHero = (id: string) => { deleteHeroBanner(id); setHeroDeleteTarget(null); showToast('Hero banner deleted'); };

  // ── LTO modal state
  const [ltoModal, setLtoModal] = useState(false);
  const [ltoEditing, setLtoEditing] = useState<LimitedTimeOffer | null>(null);
  const [ltoForm, setLtoForm] = useState<Omit<LimitedTimeOffer, 'id'>>(emptyLTO);
  const [ltoDeleteTarget, setLtoDeleteTarget] = useState<string | null>(null);

  const openAddLTO = () => { setLtoEditing(null); setLtoForm(emptyLTO); setLtoModal(true); };
  const openEditLTO = (o: LimitedTimeOffer) => {
    setLtoEditing(o);
    setLtoForm({ headline: o.headline, headlineAccent: o.headlineAccent, subtext: o.subtext, couponCode: o.couponCode, buttonText: o.buttonText, buttonLink: o.buttonLink, image: o.image, imageAlt: o.imageAlt, bgColor: o.bgColor, active: o.active });
    setLtoModal(true);
  };
  const handleSaveLTO = () => {
    if (!ltoForm.headline.trim()) return;
    if (ltoEditing) { updateLimitedTimeOffer(ltoEditing.id, ltoForm); showToast('Offer updated'); }
    else { addLimitedTimeOffer(ltoForm); showToast('Offer added'); }
    setLtoModal(false);
  };
  const handleDeleteLTO = (id: string) => { deleteLimitedTimeOffer(id); setLtoDeleteTarget(null); showToast('Offer deleted'); };

  // ── Deal Banner modal state
  const [dealModal, setDealModal] = useState(false);
  const [dealEditing, setDealEditing] = useState<PromoBanner | null>(null);
  const [dealForm, setDealForm] = useState<Omit<PromoBanner, 'id'>>(emptyDeal);
  const [dealDeleteTarget, setDealDeleteTarget] = useState<string | null>(null);

  const openAddDeal = () => { setDealEditing(null); setDealForm(emptyDeal); setDealModal(true); };
  const openEditDeal = (b: PromoBanner) => {
    setDealEditing(b);
    setDealForm({ title: b.title, subtitle: b.subtitle, bgColor: b.bgColor, textColor: b.textColor, active: b.active });
    setDealModal(true);
  };
  const handleDealBgChange = (val: string) => {
    const opt = DEAL_BG_OPTIONS.find(o => o.value === val);
    setDealForm({ ...dealForm, bgColor: val, textColor: opt?.text || 'text-gray-800' });
  };
  const handleSaveDeal = () => {
    if (!dealForm.title.trim()) return;
    if (dealEditing) { updatePromoBanner(dealEditing.id, dealForm); showToast('Deal banner updated'); }
    else { addPromoBanner(dealForm); showToast('Deal banner added'); }
    setDealModal(false);
  };
  const handleDeleteDeal = (id: string) => { deletePromoBanner(id); setDealDeleteTarget(null); showToast('Deal banner deleted'); };

  return (
    <AdminShell title="Banners" subtitle="Manage hero carousel banners and limited time offers">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-cherry-800 text-white text-sm px-5 py-3 rounded-xl shadow-lg animate-fadeSlideIn">
          {toast}
        </div>
      )}

      {/* ══════════════ HERO BANNERS ══════════════ */}
      <section className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <button onClick={() => setHeroOpen(v => !v)} className="flex items-center gap-2 text-left group">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Images className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-cherry-dark group-hover:text-cherry-700 transition-colors">Hero Banners</h2>
              <p className="text-xs text-cherry-400">{heroBanners.filter(b => b.active).length} of {heroBanners.length} active</p>
            </div>
            {heroOpen ? <ChevronUp className="w-4 h-4 text-cherry-300 ml-1" /> : <ChevronDown className="w-4 h-4 text-cherry-300 ml-1" />}
          </button>
          <button onClick={openAddHero} className="inline-flex items-center gap-2 px-4 py-2 bg-cherry-700 text-white rounded-xl text-sm font-semibold hover:bg-cherry-800 transition-colors shadow-sm shadow-cherry-700/25 self-start sm:self-auto">
            <Plus className="w-4 h-4" /> Add Hero Banner
          </button>
        </div>

        {heroOpen && (heroBanners.length === 0 ? (
          <div className="bg-white rounded-2xl border border-cherry-100 p-12 text-center">
            <Images className="w-10 h-10 text-cherry-200 mx-auto mb-3" />
            <p className="text-cherry-text font-medium">No hero banners yet</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {heroBanners.map((banner, idx) => (
              <div key={banner.id} className={`bg-white rounded-2xl border transition-all overflow-hidden group ${banner.active ? 'border-cherry-100 hover:border-cherry-300' : 'border-cherry-100 opacity-60'}`}>
                <div className="px-4 pt-3 pb-0">
                  <span className="text-[10px] font-semibold text-cherry-400 uppercase tracking-wider">Hero Banner {idx + 1}</span>
                </div>
                <div className="relative h-40 bg-cherry-50 overflow-hidden mx-4 mt-2 rounded-xl">
                  {banner.image ? (
                    <img src={banner.image} alt={banner.imageAlt || banner.offerText} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Images className="w-8 h-8 text-cherry-200" /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-xl" />
                  <div className="absolute bottom-0 left-0 p-3">
                    <p className="text-white font-bold text-sm leading-tight drop-shadow line-clamp-1">{banner.offerText}</p>
                    <p className="text-white/80 text-xs line-clamp-1">{banner.offerSub}</p>
                  </div>
                  <div className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${banner.active ? 'bg-emerald-500 text-white' : 'bg-gray-400 text-white'}`}>
                    {banner.active ? 'Active' : 'Hidden'}
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-cherry-400 truncate flex-1 mr-2">{banner.link}</span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => toggleHeroBanner(banner.id)} className="p-1.5 rounded-lg hover:bg-cherry-50 transition-colors">
                      {banner.active ? <ToggleRight className="w-5 h-5 text-emerald-500" /> : <ToggleLeft className="w-5 h-5 text-cherry-300" />}
                    </button>
                    <button onClick={() => openEditHero(banner)} className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors text-slate-400 hover:text-slate-600"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => setHeroDeleteTarget(banner.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>

      <div className="border-t border-cherry-100 mb-8" />

      {/* ══════════════ LIMITED TIME OFFERS ══════════════ */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <button onClick={() => setLtoOpen(v => !v)} className="flex items-center gap-2 text-left group">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Timer className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-cherry-dark group-hover:text-cherry-700 transition-colors">Limited Time Offers</h2>
              <p className="text-xs text-cherry-400">{limitedTimeOffers.filter(o => o.active).length} of {limitedTimeOffers.length} active</p>
            </div>
            {ltoOpen ? <ChevronUp className="w-4 h-4 text-cherry-300 ml-1" /> : <ChevronDown className="w-4 h-4 text-cherry-300 ml-1" />}
          </button>
          <button onClick={openAddLTO} className="inline-flex items-center gap-2 px-4 py-2 bg-cherry-700 text-white rounded-xl text-sm font-semibold hover:bg-cherry-800 transition-colors shadow-sm shadow-cherry-700/25 self-start sm:self-auto">
            <Plus className="w-4 h-4" /> Add Offer
          </button>
        </div>

        {ltoOpen && (limitedTimeOffers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-cherry-100 p-12 text-center">
            <Timer className="w-10 h-10 text-cherry-200 mx-auto mb-3" />
            <p className="text-cherry-text font-medium">No limited time offers yet</p>
            <p className="text-sm text-cherry-300 mt-1">Create your first offer to display on the homepage</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {limitedTimeOffers.map((offer) => {
              const theme = LTO_THEME_MAP[offer.bgColor] ?? LTO_THEME_MAP.cherry;
              return (
                <div key={offer.id} className={`rounded-2xl border border-cherry-100 overflow-hidden transition-all ${!offer.active ? 'opacity-60' : 'hover:shadow-md'}`}>
                  {/* Preview — mirrors the real banner design */}
                  <div className={`bg-gradient-to-r ${theme.bg} relative overflow-hidden`}>
                    <div className="grid grid-cols-[1fr_auto]">
                      <div className="p-5">
                        <div className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-white/90 text-[10px] font-medium mb-3">
                          <Clock className="w-3 h-3" /> Limited Time Offer
                        </div>
                        <p className="text-white font-bold text-sm leading-snug mb-0.5">{offer.headline || 'Headline'}</p>
                        {offer.headlineAccent && <p className={`font-bold text-sm ${theme.accent} mb-2`}>{offer.headlineAccent}</p>}
                        {offer.subtext && <p className="text-white/70 text-xs mb-3 line-clamp-2">{offer.subtext}</p>}
                        {offer.buttonText && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-cherry-gold text-cherry-dark px-3 py-1.5 rounded-full">
                            {offer.buttonText}
                          </span>
                        )}
                      </div>
                      {offer.image && (
                        <div className="w-20 relative self-stretch">
                          <img src={offer.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity" />
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Actions bar */}
                  <div className="bg-white flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${offer.active ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                        {offer.active ? 'Active' : 'Hidden'}
                      </span>
                      {offer.couponCode && <span className="text-xs font-mono text-cherry-400 truncate">{offer.couponCode}</span>}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => toggleLimitedTimeOffer(offer.id)} className="p-1.5 rounded-lg hover:bg-cherry-50 transition-colors">
                        {offer.active ? <ToggleRight className="w-5 h-5 text-emerald-500" /> : <ToggleLeft className="w-5 h-5 text-cherry-300" />}
                      </button>
                      <button onClick={() => openEditLTO(offer)} className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors text-slate-400 hover:text-slate-600"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => setLtoDeleteTarget(offer.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </section>

      <div className="border-t border-cherry-100 mb-8 mt-8" />

      {/* ══════════════ DEAL BANNERS ══════════════ */}
      <section className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <button onClick={() => setDealOpen(v => !v)} className="flex items-center gap-2 text-left group">
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
              <Tag className="w-4 h-4 text-rose-500" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-cherry-dark group-hover:text-cherry-700 transition-colors">Deal Banners</h2>
              <p className="text-xs text-cherry-400">{promoBanners.filter(b => b.active).length} of {promoBanners.length} active</p>
            </div>
            {dealOpen ? <ChevronUp className="w-4 h-4 text-cherry-300 ml-1" /> : <ChevronDown className="w-4 h-4 text-cherry-300 ml-1" />}
          </button>
          <button onClick={openAddDeal} className="inline-flex items-center gap-2 px-4 py-2 bg-cherry-700 text-white rounded-xl text-sm font-semibold hover:bg-cherry-800 transition-colors shadow-sm shadow-cherry-700/25 self-start sm:self-auto">
            <Plus className="w-4 h-4" /> Add Deal Banner
          </button>
        </div>

        {dealOpen && (promoBanners.length === 0 ? (
          <div className="bg-white rounded-2xl border border-cherry-100 p-12 text-center">
            <Tag className="w-10 h-10 text-cherry-200 mx-auto mb-3" />
            <p className="text-cherry-text font-medium">No deal banners yet</p>
            <p className="text-sm text-cherry-300 mt-1">Create promotional offer cards to display on the homepage</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {promoBanners.map((banner) => (
              <div key={banner.id} className={`rounded-2xl border border-cherry-100 overflow-hidden transition-all ${!banner.active ? 'opacity-60' : 'hover:shadow-sm'}`}>
                {/* Preview */}
                <div className={`${banner.bgColor} p-5 flex items-center gap-3`}>
                  <Tag className={`w-8 h-8 flex-shrink-0 ${banner.textColor}`} />
                  <div className="min-w-0">
                    <p className={`font-bold text-base truncate ${banner.textColor}`}>{banner.title}</p>
                    <p className={`text-sm opacity-80 truncate ${banner.textColor}`}>{banner.subtitle}</p>
                  </div>
                </div>
                {/* Actions */}
                <div className="bg-white flex items-center justify-between px-4 py-3">
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${banner.active ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                    {banner.active ? 'Active' : 'Hidden'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => togglePromoBanner(banner.id)} className="p-1.5 rounded-lg hover:bg-cherry-50 transition-colors" title={banner.active ? 'Deactivate' : 'Activate'}>
                      {banner.active ? <ToggleRight className="w-5 h-5 text-emerald-500" /> : <ToggleLeft className="w-5 h-5 text-cherry-300" />}
                    </button>
                    <button onClick={() => openEditDeal(banner)} className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors text-slate-400 hover:text-slate-600">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDealDeleteTarget(banner.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>

      {/* ══════════════ MODALS ══════════════ */}

      {/* Hero — Add/Edit */}
      <AdminModal open={heroModal} onClose={() => setHeroModal(false)} title={heroEditing ? 'Edit Hero Banner' : 'Add Hero Banner'}>
        <div className="space-y-4">
          <ImageUpload label="Banner Image" required value={heroForm.image} onChange={(v) => setHeroForm({ ...heroForm, image: v })} altValue={heroForm.imageAlt} onAltChange={(v) => setHeroForm({ ...heroForm, imageAlt: v })} altPlaceholder="e.g. Cherryvelle skincare product banner" previewHeight="h-36" />
          <div>
            <label className="admin-label">Offer Text *</label>
            <input className="admin-input" placeholder="e.g. Up To 30% Off" value={heroForm.offerText} onChange={(e) => setHeroForm({ ...heroForm, offerText: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Sub Text</label>
            <input className="admin-input" placeholder="e.g. On Entire Brand!" value={heroForm.offerSub} onChange={(e) => setHeroForm({ ...heroForm, offerSub: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Link</label>
            <input className="admin-input" placeholder="/shop" value={heroForm.link} onChange={(e) => setHeroForm({ ...heroForm, link: e.target.value })} />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="heroActive" checked={heroForm.active} onChange={(e) => setHeroForm({ ...heroForm, active: e.target.checked })} className="w-4 h-4 accent-cherry-700" />
            <label htmlFor="heroActive" className="text-sm font-medium text-cherry-dark">Active (visible on homepage)</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setHeroModal(false)} className="flex-1 py-2.5 border border-cherry-200 text-cherry-text rounded-xl text-sm font-medium hover:bg-cherry-50">Cancel</button>
            <button onClick={handleSaveHero} disabled={!heroForm.image || !heroForm.offerText.trim() || !heroForm.imageAlt.trim()} className="flex-1 py-2.5 bg-cherry-700 text-white rounded-xl text-sm font-semibold hover:bg-cherry-800 disabled:opacity-50">
              {heroEditing ? 'Save Changes' : 'Add Banner'}
            </button>
          </div>
        </div>
      </AdminModal>

      {/* Hero — Delete */}
      <AdminModal open={!!heroDeleteTarget} onClose={() => setHeroDeleteTarget(null)} title="Delete Hero Banner?" size="sm">
        <p className="text-sm text-cherry-text mb-5">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setHeroDeleteTarget(null)} className="flex-1 py-2.5 border border-cherry-200 text-cherry-text rounded-xl text-sm font-medium hover:bg-cherry-50">Cancel</button>
          <button onClick={() => heroDeleteTarget && handleDeleteHero(heroDeleteTarget)} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600">Delete</button>
        </div>
      </AdminModal>

      {/* LTO — Add/Edit */}
      <AdminModal open={ltoModal} onClose={() => setLtoModal(false)} title={ltoEditing ? 'Edit Limited Time Offer' : 'Add Limited Time Offer'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Headline *</label>
              <input className="admin-input" placeholder="e.g. Flat 20% Off" value={ltoForm.headline} onChange={(e) => setLtoForm({ ...ltoForm, headline: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Headline Accent</label>
              <input className="admin-input" placeholder="e.g. on Entire Range" value={ltoForm.headlineAccent} onChange={(e) => setLtoForm({ ...ltoForm, headlineAccent: e.target.value })} />
              <p className="text-[10px] text-cherry-300 mt-1">Displays below headline in gold color</p>
            </div>
          </div>
          <div>
            <label className="admin-label">Sub Text</label>
            <input className="admin-input" placeholder="e.g. Use code CHERRY20 at checkout. Valid on all skincare products." value={ltoForm.subtext} onChange={(e) => setLtoForm({ ...ltoForm, subtext: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Coupon Code</label>
              <input className="admin-input font-mono uppercase" placeholder="e.g. CHERRY20" value={ltoForm.couponCode} onChange={(e) => setLtoForm({ ...ltoForm, couponCode: e.target.value.toUpperCase() })} />
            </div>
            <div>
              <label className="admin-label">Button Text</label>
              <input className="admin-input" placeholder="e.g. Shop the Sale" value={ltoForm.buttonText} onChange={(e) => setLtoForm({ ...ltoForm, buttonText: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Button Link</label>
              <input className="admin-input" placeholder="/shop" value={ltoForm.buttonLink} onChange={(e) => setLtoForm({ ...ltoForm, buttonLink: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Color Theme</label>
              <select className="admin-input" value={ltoForm.bgColor} onChange={(e) => setLtoForm({ ...ltoForm, bgColor: e.target.value })}>
                {LTO_THEMES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <ImageUpload label="Right-side Image" value={ltoForm.image} onChange={(v) => setLtoForm({ ...ltoForm, image: v })} altValue={ltoForm.imageAlt} onAltChange={(v) => setLtoForm({ ...ltoForm, imageAlt: v })} altPlaceholder="e.g. Summer sale promotion banner" previewHeight="h-28" />

          {/* Live Preview */}
          {(() => {
            const theme = LTO_THEME_MAP[ltoForm.bgColor] ?? LTO_THEME_MAP.cherry;
            return (
              <div className={`bg-gradient-to-r ${theme.bg} rounded-xl overflow-hidden`}>
                <div className="grid grid-cols-[1fr_auto]">
                  <div className="p-5">
                    <div className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-white/90 text-[10px] font-medium mb-3">
                      <Clock className="w-3 h-3" /> Limited Time Offer
                    </div>
                    <p className="text-white font-bold text-sm leading-snug mb-0.5">{ltoForm.headline || 'Headline'}</p>
                    {ltoForm.headlineAccent && <p className={`font-bold text-sm ${theme.accent} mb-2`}>{ltoForm.headlineAccent}</p>}
                    {ltoForm.subtext && <p className="text-white/70 text-xs mb-3">{ltoForm.subtext}</p>}
                    {ltoForm.buttonText && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-cherry-gold text-cherry-dark px-3 py-1.5 rounded-full">
                        {ltoForm.buttonText}
                      </span>
                    )}
                  </div>
                  {ltoForm.image && (
                    <div className="w-24 relative self-stretch">
                      <img src={ltoForm.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity" />
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          <div className="flex items-center gap-3">
            <input type="checkbox" id="ltoActive" checked={ltoForm.active} onChange={(e) => setLtoForm({ ...ltoForm, active: e.target.checked })} className="w-4 h-4 accent-cherry-700" />
            <label htmlFor="ltoActive" className="text-sm font-medium text-cherry-dark">Active (visible on homepage)</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setLtoModal(false)} className="flex-1 py-2.5 border border-cherry-200 text-cherry-text rounded-xl text-sm font-medium hover:bg-cherry-50">Cancel</button>
            <button onClick={handleSaveLTO} disabled={!ltoForm.headline.trim()} className="flex-1 py-2.5 bg-cherry-700 text-white rounded-xl text-sm font-semibold hover:bg-cherry-800 disabled:opacity-50">
              {ltoEditing ? 'Save Changes' : 'Add Offer'}
            </button>
          </div>
        </div>
      </AdminModal>

      {/* LTO — Delete */}
      <AdminModal open={!!ltoDeleteTarget} onClose={() => setLtoDeleteTarget(null)} title="Delete Offer?" size="sm">
        <p className="text-sm text-cherry-text mb-5">This offer will be permanently removed.</p>
        <div className="flex gap-3">
          <button onClick={() => setLtoDeleteTarget(null)} className="flex-1 py-2.5 border border-cherry-200 text-cherry-text rounded-xl text-sm font-medium hover:bg-cherry-50">Cancel</button>
          <button onClick={() => ltoDeleteTarget && handleDeleteLTO(ltoDeleteTarget)} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600">Delete</button>
        </div>
      </AdminModal>

      {/* ══════════════ DEAL BANNER MODALS ══════════════ */}

      {/* Deal — Add/Edit */}
      <AdminModal open={dealModal} onClose={() => setDealModal(false)} title={dealEditing ? 'Edit Deal Banner' : 'Add Deal Banner'}>
        <div className="space-y-4">
          <div>
            <label className="admin-label">Title *</label>
            <input className="admin-input" placeholder="e.g. Buy 2 Get 1 Free" value={dealForm.title} onChange={(e) => setDealForm({ ...dealForm, title: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Subtitle</label>
            <input className="admin-input" placeholder="e.g. On all serums & moisturizers" value={dealForm.subtitle} onChange={(e) => setDealForm({ ...dealForm, subtitle: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Color Theme</label>
            <select className="admin-input" value={dealForm.bgColor} onChange={(e) => handleDealBgChange(e.target.value)}>
              {DEAL_BG_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          {/* Preview */}
          <div className={`${dealForm.bgColor} rounded-xl p-4 flex items-center gap-3`}>
            <Tag className={`w-6 h-6 ${dealForm.textColor}`} />
            <div>
              <p className={`font-bold text-sm ${dealForm.textColor}`}>{dealForm.title || 'Title preview'}</p>
              <p className={`text-xs opacity-80 ${dealForm.textColor}`}>{dealForm.subtitle || 'Subtitle preview'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="dealActive" checked={dealForm.active} onChange={(e) => setDealForm({ ...dealForm, active: e.target.checked })} className="w-4 h-4 accent-cherry-700" />
            <label htmlFor="dealActive" className="text-sm font-medium text-cherry-dark">Active</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setDealModal(false)} className="flex-1 py-2.5 border border-cherry-200 text-cherry-text rounded-xl text-sm font-medium hover:bg-cherry-50">Cancel</button>
            <button onClick={handleSaveDeal} disabled={!dealForm.title.trim()} className="flex-1 py-2.5 bg-cherry-700 text-white rounded-xl text-sm font-semibold hover:bg-cherry-800 disabled:opacity-50">
              {dealEditing ? 'Save Changes' : 'Add Banner'}
            </button>
          </div>
        </div>
      </AdminModal>

      {/* Deal — Delete */}
      <AdminModal open={!!dealDeleteTarget} onClose={() => setDealDeleteTarget(null)} title="Delete Deal Banner?" size="sm">
        <p className="text-sm text-cherry-text mb-5">This banner will be permanently removed.</p>
        <div className="flex gap-3">
          <button onClick={() => setDealDeleteTarget(null)} className="flex-1 py-2.5 border border-cherry-200 text-cherry-text rounded-xl text-sm font-medium hover:bg-cherry-50">Cancel</button>
          <button onClick={() => dealDeleteTarget && handleDeleteDeal(dealDeleteTarget)} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600">Delete</button>
        </div>
      </AdminModal>

    </AdminShell>
  );
}

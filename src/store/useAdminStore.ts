import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProductSection = string;

export interface SectionDef {
  key: string;   // slug-like identifier, e.g. "trending"
  label: string; // display name, e.g. "Trending Now"
}

// ─── Shop by Concern ──────────────────────────────────────────────────────────

export interface Concern {
  id: string;
  name: string;
}

export const DEFAULT_CONCERNS: Concern[] = [
  { id: 'acne',         name: 'Acne & Blemishes' },
  { id: 'aging',        name: 'Anti-Aging' },
  { id: 'dryness',      name: 'Dryness' },
  { id: 'pigmentation', name: 'Pigmentation' },
  { id: 'sensitivity',  name: 'Sensitive Skin' },
  { id: 'dullness',     name: 'Dull Skin' },
  { id: 'dark-circles', name: 'Dark Circles' },
  { id: 'pores',        name: 'Large Pores' },
];

// Maps LTO theme key → Tailwind bg gradient classes (used in preview & frontend)
export const LTO_THEME_MAP: Record<string, { bg: string; accent: string }> = {
  cherry:   { bg: 'from-cherry-700 via-cherry-600 to-cherry-800', accent: 'text-cherry-goldLight' },
  midnight: { bg: 'from-gray-900 via-gray-800 to-gray-900',       accent: 'text-yellow-300' },
  forest:   { bg: 'from-emerald-800 via-emerald-700 to-emerald-900', accent: 'text-emerald-200' },
  ocean:    { bg: 'from-sky-700 via-sky-600 to-sky-800',          accent: 'text-sky-200' },
  sunset:   { bg: 'from-rose-600 via-orange-500 to-rose-700',     accent: 'text-yellow-200' },
};

/** Legacy constant – kept for any imports that still reference it at build time.
 *  At runtime, use the `sectionDefs` array from the store instead. */
export const PRODUCT_SECTIONS: SectionDef[] = [
  { key: 'trending',      label: 'Trending Now' },
  { key: 'just-launched', label: 'Just Launched' },
  { key: 'deals',         label: 'Deals of the Day' },
  { key: 'bestsellers',   label: 'Bestsellers' },
];

const defaultSectionDefs: SectionDef[] = [
  { key: 'trending',      label: 'Trending Now' },
  { key: 'just-launched', label: 'Just Launched' },
  { key: 'deals',         label: 'Deals of the Day' },
  { key: 'bestsellers',   label: 'Bestsellers' },
];

export interface AdminProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  stock: number;
  lowStockAlert?: number; // threshold — if stock <= this value, product is "Low Stock"
  image: string;
  imageAlt: string;
  category: string;
  description: string;
  isNew?: boolean;
  sections?: ProductSection[];
  concerns?: string[]; // concern IDs from the concerns list
  createdAt?: string; // ISO date string e.g. "2024-12-01"
}

/** Returns the stock status for a product based on its lowStockAlert threshold */
export function getStockStatus(product: AdminProduct): 'out-of-stock' | 'low-stock' | 'in-stock' {
  if (product.stock === 0) return 'out-of-stock';
  const threshold = product.lowStockAlert ?? 5;
  if (product.stock <= threshold) return 'low-stock';
  return 'in-stock';
}

export interface HeroBanner {
  id: string;
  image: string;
  imageAlt: string;
  offerText: string;
  offerSub: string;
  link: string;
  active: boolean;
}

export interface PromoBarMessage {
  id: string;
  text: string;
  /** Optional price threshold stored in INR base price.
   *  When set, `{price}` in `text` is replaced at render time by the
   *  converted & formatted price in the visitor's selected currency. */
  priceINR?: number;
  active: boolean;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  bgColor: string;
  textColor: string;
  active: boolean;
}

export interface LimitedTimeOffer {
  id: string;
  headline: string;
  headlineAccent: string;
  subtext: string;
  couponCode: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  imageAlt: string;
  bgColor: string;
  active: boolean;
}

export interface Category {
  id: string;
  name: string;
  count: number;
  image: string;
  imageAlt: string;
}

// ─── Feature Bar (Trust/USP Strip) ───────────────────────────────────────────

export interface FeatureItem {
  id: string;
  icon: string;   // lucide icon name, e.g. "Truck"
  title: string;
  sub: string;
  /** Optional minimum order threshold stored in INR base price.
   *  When set, the subtitle is rendered dynamically via the currency system
   *  instead of using the static `sub` string. */
  minOrderINR?: number;
  active: boolean;
}

export type VideoSlot = 'main' | 'collection-left' | 'collection-right';
export type MediaContentType = 'video' | 'image';

export interface SiteVideo {
  id: string;
  slot: VideoSlot;
  label: string;
  contentType: MediaContentType; // 'video' | 'image'
  // Video-specific
  src: string;         // video URL / path
  poster: string;      // poster/thumbnail URL
  posterAlt: string;   // alt text for poster
  // Image-specific
  imageSrc: string;    // image URL / object URL
  imageAlt: string;    // alt text for the image
  // Shared overlay/CTA
  title: string;
  subtitle: string;
  linkHref: string;
  linkText: string;
  active: boolean;
}

// ─── Default seed data ────────────────────────────────────────────────────────

const defaultHeroBanners: HeroBanner[] = [
  { id: 'h1', image: '/hero card/img1.jpg', imageAlt: 'Exclusive gift skincare offer', offerText: 'Exclusive Gift', offerSub: 'Limited period offer', link: '/shop', active: true },
  { id: 'h2', image: '/hero card/img2.jpg', imageAlt: 'Up to 30% off on entire brand', offerText: 'Up To 30% Off', offerSub: 'On Entire Brand!', link: '/shop', active: true },
  { id: 'h3', image: '/hero card/img3.jpg', imageAlt: 'Up to 35% off on bestsellers', offerText: 'Upto 35% Off', offerSub: 'On Bestsellers', link: '/shop', active: true },
  { id: 'h4', image: '/hero card/img4.jpg', imageAlt: 'Cherryvelle bestseller skincare product', offerText: 'Bestseller', offerSub: '10,000+ Reviews', link: '/shop', active: true },
  { id: 'h5', image: '/hero card/img5.jpg', imageAlt: 'Buy 2 get 1 free on hydration products', offerText: 'Buy 2 Get 1 Free', offerSub: 'On all hydration products', link: '/shop', active: true },
  { id: 'h6', image: '/hero card/img6.jpg', imageAlt: 'New launch skincare product limited stock', offerText: 'New Launch', offerSub: 'Limited Stock!', link: '/shop', active: true },
];

const defaultPromoBarMessages: PromoBarMessage[] = [
  { id: 'pb1', text: 'Summer Sale LIVE — Up to 40% Off!', active: true },
  { id: 'pb2', text: 'Free Shipping on Orders {price}+', priceINR: 999, active: true },
  { id: 'pb3', text: 'Free Mini Kit on First Order', active: true },
  { id: 'pb4', text: '10,000+ 5-Star Reviews', active: true },
];

const defaultPromoBanners: PromoBanner[] = [
  { id: 'promo1', title: 'Buy 2 Get 1 Free', subtitle: 'On all serums & moisturizers', bgColor: 'bg-gradient-to-r from-cherry-100 to-cherry-50', textColor: 'text-cherry-800', active: true },
  { id: 'promo2', title: 'Flat ₹200 Off', subtitle: 'On orders above ₹1499', bgColor: 'bg-gradient-to-r from-amber-50 to-yellow-50', textColor: 'text-amber-800', active: true },
  { id: 'promo3', title: 'Free Shipping', subtitle: 'On all prepaid orders', bgColor: 'bg-gradient-to-r from-emerald-50 to-green-50', textColor: 'text-emerald-800', active: true },
];

const defaultLimitedTimeOffers: LimitedTimeOffer[] = [
  {
    id: 'lto1',
    headline: 'Flat 20% Off',
    headlineAccent: 'on Entire Range',
    subtext: 'Use code CHERRY20 at checkout. Valid on all skincare products.',
    couponCode: 'CHERRY20',
    buttonText: 'Shop the Sale',
    buttonLink: '/shop',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Cherryvelle skincare product sale promotion banner',
    bgColor: 'cherry',
    active: true,
  },
];

const defaultFeatureItems: FeatureItem[] = [
  { id: 'fi1', icon: 'Truck',       title: 'Free Delivery',   sub: 'On orders above',  minOrderINR: 999, active: true },
  { id: 'fi2', icon: 'ShieldCheck', title: '100% Authentic',  sub: 'Certified products',                 active: true },
  { id: 'fi3', icon: 'RotateCcw',   title: 'Easy Returns',    sub: '7-day policy',                       active: true },
  { id: 'fi4', icon: 'Gift',        title: 'Free Samples',    sub: 'With every order',                   active: true },
];

const defaultVideos: SiteVideo[] = [
  {
    id: 'vid1',
    slot: 'main',
    label: 'Main Promo Video',
    contentType: 'video',
    src: '/vdo.mp4',
    poster: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1200&q=80',
    posterAlt: 'Cherryvelle skincare product glow promotional video thumbnail',
    imageSrc: '',
    imageAlt: '',
    title: 'See the Cherryvelle Glow',
    subtitle: 'Watch how our products transform your skincare routine with visible results in just weeks.',
    linkHref: '',
    linkText: '',
    active: true,
  },
  {
    id: 'vid2',
    slot: 'collection-left',
    label: 'Featured Collection – Left Card',
    contentType: 'video',
    src: '/pro1.mp4',
    poster: '',
    posterAlt: '',
    imageSrc: '',
    imageAlt: '',
    title: 'Build Your Routine',
    subtitle: 'Step-by-step skincare sets tailored to your skin goals',
    linkHref: '/shop',
    linkText: 'Start Your Routine',
    active: true,
  },
  {
    id: 'vid3',
    slot: 'collection-right',
    label: 'Featured Collection – Right Card',
    contentType: 'video',
    src: '/pro2.mp4',
    poster: '',
    posterAlt: '',
    imageSrc: '',
    imageAlt: '',
    title: 'Gift Sets',
    subtitle: 'Luxury skincare bundles — perfect for every occasion',
    linkHref: '/shop',
    linkText: 'Shop Gift Sets',
    active: true,
  },
];

const defaultCategories: Category[] = [
  { id: 'cleansers', name: 'Cleansers', count: 12, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80', imageAlt: 'Cherryvelle cleansers skincare category' },
  { id: 'moisturizers', name: 'Moisturizers', count: 18, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80', imageAlt: 'Cherryvelle moisturizers skincare category' },
  { id: 'serums', name: 'Serums', count: 15, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80', imageAlt: 'Cherryvelle serums skincare category' },
  { id: 'sunscreen', name: 'Sunscreen', count: 10, image: '/Sunscreen.webp', imageAlt: 'Cherryvelle sunscreen SPF skincare category' },
  { id: 'masks', name: 'Masks', count: 8, image: '/mask.jpg', imageAlt: 'Cherryvelle face masks skincare category' },
  { id: 'lip-care', name: 'Lip Care', count: 6, image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80', imageAlt: 'Cherryvelle lip care skincare category' },
  { id: 'body-care', name: 'Body Care', count: 14, image: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?auto=format&fit=crop&w=400&q=80', imageAlt: 'Cherryvelle body care skincare category' },
  { id: 'eye-care', name: 'Eye Care', count: 7, image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=400&q=80', imageAlt: 'Cherryvelle eye care skincare category' },
];

const defaultProducts: AdminProduct[] = [
  { id: 'p1', name: 'Vitamin C Serum', price: 899, originalPrice: 1199, rating: 4.8, reviews: 128, stock: 50, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80', imageAlt: 'Cherryvelle Vitamin C Serum brightening skincare product', category: 'Serums', description: 'Brighten and even out your skin tone with our potent Vitamin C Serum.', isNew: true, sections: ['just-launched', 'deals', 'trending'], createdAt: '2025-06-28' },
  { id: 'p2', name: 'Hydrating Moisturizer', price: 699, originalPrice: 999, rating: 4.9, reviews: 96, stock: 30, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80', imageAlt: 'Cherryvelle Hydrating Moisturizer lightweight skincare product', category: 'Moisturizers', description: 'A lightweight, oil-free moisturizer that provides 24-hour hydration.', sections: ['bestsellers', 'trending'], createdAt: '2025-06-20' },
  { id: 'p3', name: 'Cherryvelle Sunscreen SPF 50', price: 599, originalPrice: 799, rating: 4.7, reviews: 74, stock: 45, image: '/Sunscreen.webp', imageAlt: 'Cherryvelle Sunscreen SPF 50 broad-spectrum sun protection', category: 'Sunscreen', description: 'Broad-spectrum protection without the white cast.', sections: ['deals', 'trending'], createdAt: '2025-06-10' },
  { id: 'p4', name: 'Rose Clay Mask', price: 499, originalPrice: 699, rating: 4.6, reviews: 64, stock: 20, image: '/mask.jpg', imageAlt: 'Cherryvelle Rose Clay Mask pore purifying skincare product', category: 'Masks', description: 'Purify and refine pores with our gentle Rose Clay Mask.', sections: ['deals'], createdAt: '2025-05-15' },
  { id: 'p5', name: 'Gentle Foaming Cleanser', price: 399, rating: 4.8, reviews: 210, stock: 80, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80', imageAlt: 'Cherryvelle Gentle Foaming Cleanser daily face wash skincare product', category: 'Cleansers', description: "Wash away dirt, oil, and makeup without disrupting your skin's natural moisture balance.", sections: ['bestsellers', 'trending'], createdAt: '2025-04-02' },
  { id: 'p6', name: 'Night Repair Cream', price: 1299, originalPrice: 1499, rating: 4.9, reviews: 85, stock: 15, image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80', imageAlt: 'Cherryvelle Night Repair Cream anti-aging overnight skincare product', category: 'Moisturizers', description: 'Wake up to rejuvenated skin.', isNew: true, sections: ['just-launched', 'bestsellers'], createdAt: '2025-06-25' },
  { id: 'p7', name: 'Hyaluronic Acid Serum', price: 799, rating: 4.7, reviews: 156, stock: 60, image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=600&q=80', imageAlt: 'Cherryvelle Hyaluronic Acid Serum deep hydration skincare product', category: 'Serums', description: 'Plump and hydrate your skin instantly.', sections: ['trending'], createdAt: '2025-03-18' },
  { id: 'p8', name: 'Exfoliating Toner', price: 549, originalPrice: 649, rating: 4.5, reviews: 92, stock: 35, image: 'https://images.unsplash.com/photo-1629367305173-4568e0638531?auto=format&fit=crop&w=600&q=80', imageAlt: 'Cherryvelle Exfoliating Toner AHA BHA skincare product', category: 'Cleansers', description: 'Gently sweep away dead skin cells with our 5% AHA/BHA blend.', sections: ['trending'], createdAt: '2025-02-05' },
];

// ─── Store ────────────────────────────────────────────────────────────────────

interface AdminState {
  products: AdminProduct[];
  heroBanners: HeroBanner[];
  promoBarMessages: PromoBarMessage[];
  promoBanners: PromoBanner[];
  categories: Category[];
  concerns: Concern[];

  // Products
  addProduct: (p: Omit<AdminProduct, 'id'>) => void;
  updateProduct: (id: string, p: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;
  assignSection: (productId: string, section: ProductSection) => void;
  removeSection: (productId: string, section: ProductSection) => void;

  // Section definitions (CRUD for the tab list)
  sectionDefs: SectionDef[];
  addSectionDef: (label: string) => void;
  updateSectionDef: (key: string, label: string) => void;
  deleteSectionDef: (key: string) => void;

  // Concerns
  addConcern: (c: Omit<Concern, 'id'>) => void;
  updateConcern: (id: string, c: Partial<Concern>) => void;
  deleteConcern: (id: string) => void;

  // Hero banners
  addHeroBanner: (b: Omit<HeroBanner, 'id'>) => void;
  updateHeroBanner: (id: string, b: Partial<HeroBanner>) => void;
  deleteHeroBanner: (id: string) => void;
  toggleHeroBanner: (id: string) => void;

  // Promo bar
  addPromoBarMessage: (m: Omit<PromoBarMessage, 'id'>) => void;
  updatePromoBarMessage: (id: string, m: Partial<PromoBarMessage>) => void;
  deletePromoBarMessage: (id: string) => void;
  togglePromoBarMessage: (id: string) => void;

  // Promo banners
  addPromoBanner: (b: Omit<PromoBanner, 'id'>) => void;
  updatePromoBanner: (id: string, b: Partial<PromoBanner>) => void;
  deletePromoBanner: (id: string) => void;
  togglePromoBanner: (id: string) => void;

  // Limited time offers
  limitedTimeOffers: LimitedTimeOffer[];
  addLimitedTimeOffer: (o: Omit<LimitedTimeOffer, 'id'>) => void;
  updateLimitedTimeOffer: (id: string, o: Partial<LimitedTimeOffer>) => void;
  deleteLimitedTimeOffer: (id: string) => void;
  toggleLimitedTimeOffer: (id: string) => void;

  // Categories
  addCategory: (c: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, c: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Videos
  videos: SiteVideo[];
  addVideo: (v: Omit<SiteVideo, 'id'>) => void;
  updateVideo: (id: string, v: Partial<SiteVideo>) => void;
  deleteVideo: (id: string) => void;
  toggleVideo: (id: string) => void;

  // Feature Bar items
  featureItems: FeatureItem[];
  addFeatureItem: (f: Omit<FeatureItem, 'id'>) => void;
  updateFeatureItem: (id: string, f: Partial<FeatureItem>) => void;
  deleteFeatureItem: (id: string) => void;
  toggleFeatureItem: (id: string) => void;
  reorderFeatureItems: (items: FeatureItem[]) => void;
}

const uid = () => Math.random().toString(36).slice(2, 9);

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      products: defaultProducts,
      heroBanners: defaultHeroBanners,
      promoBarMessages: defaultPromoBarMessages,
      promoBanners: defaultPromoBanners,
      categories: defaultCategories,
      concerns: DEFAULT_CONCERNS,
      videos: defaultVideos,
      limitedTimeOffers: defaultLimitedTimeOffers,
      sectionDefs: defaultSectionDefs,
      featureItems: defaultFeatureItems,
      // Products
      addProduct: (p) => set((s) => ({
        products: [
          ...s.products,
          { ...p, id: `p${uid()}`, createdAt: p.createdAt ?? new Date().toISOString().split('T')[0] },
        ],
      })),
      updateProduct: (id, p) => set((s) => ({ products: s.products.map((x) => (x.id === id ? { ...x, ...p } : x)) })),
      deleteProduct: (id) => set((s) => ({ products: s.products.filter((x) => x.id !== id) })),
      assignSection: (productId, section) =>
        set((s) => ({
          products: s.products.map((x) =>
            x.id === productId
              ? { ...x, sections: Array.from(new Set([...(x.sections ?? []), section])) }
              : x
          ),
        })),
      removeSection: (productId, section) =>
        set((s) => ({
          products: s.products.map((x) =>
            x.id === productId
              ? { ...x, sections: (x.sections ?? []).filter((sec) => sec !== section) }
              : x
          ),
        })),

      // Section definitions
      addSectionDef: (label) =>
        set((s) => {
          const key = label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + uid();
          return { sectionDefs: [...s.sectionDefs, { key, label }] };
        }),
      updateSectionDef: (key, label) =>
        set((s) => ({
          sectionDefs: s.sectionDefs.map((x) => (x.key === key ? { ...x, label } : x)),
        })),
      deleteSectionDef: (key) =>
        set((s) => ({
          sectionDefs: s.sectionDefs.filter((x) => x.key !== key),
          // Also strip this section key from all products
          products: s.products.map((p) => ({
            ...p,
            sections: (p.sections ?? []).filter((sec) => sec !== key),
          })),
        })),

      // Hero banners
      addHeroBanner: (b) => set((s) => ({ heroBanners: [...s.heroBanners, { ...b, id: `h${uid()}` }] })),
      updateHeroBanner: (id, b) => set((s) => ({ heroBanners: s.heroBanners.map((x) => (x.id === id ? { ...x, ...b } : x)) })),
      deleteHeroBanner: (id) => set((s) => ({ heroBanners: s.heroBanners.filter((x) => x.id !== id) })),
      toggleHeroBanner: (id) => set((s) => ({ heroBanners: s.heroBanners.map((x) => (x.id === id ? { ...x, active: !x.active } : x)) })),

      // Promo bar
      addPromoBarMessage: (m) => set((s) => ({ promoBarMessages: [...s.promoBarMessages, { ...m, id: `pb${uid()}` }] })),
      updatePromoBarMessage: (id, m) => set((s) => ({ promoBarMessages: s.promoBarMessages.map((x) => (x.id === id ? { ...x, ...m } : x)) })),
      deletePromoBarMessage: (id) => set((s) => ({ promoBarMessages: s.promoBarMessages.filter((x) => x.id !== id) })),
      togglePromoBarMessage: (id) => set((s) => ({ promoBarMessages: s.promoBarMessages.map((x) => (x.id === id ? { ...x, active: !x.active } : x)) })),

      // Promo banners
      addPromoBanner: (b) => set((s) => ({ promoBanners: [...s.promoBanners, { ...b, id: `promo${uid()}` }] })),
      updatePromoBanner: (id, b) => set((s) => ({ promoBanners: s.promoBanners.map((x) => (x.id === id ? { ...x, ...b } : x)) })),
      deletePromoBanner: (id) => set((s) => ({ promoBanners: s.promoBanners.filter((x) => x.id !== id) })),
      togglePromoBanner: (id) => set((s) => ({ promoBanners: s.promoBanners.map((x) => (x.id === id ? { ...x, active: !x.active } : x)) })),

      // Limited time offers
      addLimitedTimeOffer: (o) => set((s) => ({ limitedTimeOffers: [...s.limitedTimeOffers, { ...o, id: `lto${uid()}` }] })),
      updateLimitedTimeOffer: (id, o) => set((s) => ({ limitedTimeOffers: s.limitedTimeOffers.map((x) => (x.id === id ? { ...x, ...o } : x)) })),
      deleteLimitedTimeOffer: (id) => set((s) => ({ limitedTimeOffers: s.limitedTimeOffers.filter((x) => x.id !== id) })),
      toggleLimitedTimeOffer: (id) => set((s) => ({ limitedTimeOffers: s.limitedTimeOffers.map((x) => (x.id === id ? { ...x, active: !x.active } : x)) })),

      // Categories
      addCategory: (c) => set((s) => ({ categories: [...s.categories, { ...c, id: c.name.toLowerCase().replace(/\s+/g, '-') + '-' + uid() }] })),
      updateCategory: (id, c) => set((s) => ({ categories: s.categories.map((x) => (x.id === id ? { ...x, ...c } : x)) })),
      deleteCategory: (id) => set((s) => ({ categories: s.categories.filter((x) => x.id !== id) })),

      // Concerns
      addConcern: (c) => set((s) => ({ concerns: [...s.concerns, { ...c, id: c.name.toLowerCase().replace(/\s+/g, '-') + '-' + uid() }] })),
      updateConcern: (id, c) => set((s) => ({ concerns: s.concerns.map((x) => (x.id === id ? { ...x, ...c } : x)) })),
      deleteConcern: (id) => set((s) => ({
        concerns: s.concerns.filter((x) => x.id !== id),
        // Remove this concern from all products
        products: s.products.map((p) => ({ ...p, concerns: (p.concerns ?? []).filter((cid) => cid !== id) })),
      })),

      // Videos
      addVideo: (v) => set((s) => ({ videos: [...s.videos, { ...v, id: `vid${uid()}` }] })),
      updateVideo: (id, v) => set((s) => ({ videos: s.videos.map((x) => (x.id === id ? { ...x, ...v } : x)) })),
      deleteVideo: (id) => set((s) => ({ videos: s.videos.filter((x) => x.id !== id) })),
      toggleVideo: (id) => set((s) => ({ videos: s.videos.map((x) => (x.id === id ? { ...x, active: !x.active } : x)) })),

      // Feature Bar items
      addFeatureItem: (f) => set((s) => ({ featureItems: [...s.featureItems, { ...f, id: `fi${uid()}` }] })),
      updateFeatureItem: (id, f) => set((s) => ({ featureItems: s.featureItems.map((x) => (x.id === id ? { ...x, ...f } : x)) })),
      deleteFeatureItem: (id) => set((s) => ({ featureItems: s.featureItems.filter((x) => x.id !== id) })),
      toggleFeatureItem: (id) => set((s) => ({ featureItems: s.featureItems.map((x) => (x.id === id ? { ...x, active: !x.active } : x)) })),
      reorderFeatureItems: (items) => set(() => ({ featureItems: items })),
    }),    { name: 'admin-store' }
  )
);

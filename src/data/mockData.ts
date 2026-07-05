import { Product } from '../store/useCartStore';

export const categories = [
  {
    id: 'cleansers',
    name: 'Cleansers',
    count: 12,
    image:
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'moisturizers',
    name: 'Moisturizers',
    count: 18,
    image:
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'serums',
    name: 'Serums',
    count: 15,
    image:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'sunscreen',
    name: 'Sunscreen',
    count: 10,
    image: '/Sunscreen.webp',
  },
  {
    id: 'masks',
    name: 'Masks',
    count: 8,
    image: '/mask.jpg',
  },
  {
    id: 'lip-care',
    name: 'Lip Care',
    count: 6,
    image:
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'body-care',
    name: 'Body Care',
    count: 14,
    image:
      'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'eye-care',
    name: 'Eye Care',
    count: 7,
    image:
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=400&q=80',
  },
];

export const skinConcerns = [
  { id: 'acne', name: 'Acne & Blemishes', icon: 'Target', bgColor: 'bg-red-50', textColor: 'text-red-500' },
  { id: 'aging', name: 'Anti-Aging', icon: 'Sparkles', bgColor: 'bg-purple-50', textColor: 'text-purple-500' },
  { id: 'dryness', name: 'Dryness', icon: 'Droplets', bgColor: 'bg-sky-50', textColor: 'text-sky-500' },
  { id: 'pigmentation', name: 'Pigmentation', icon: 'Sun', bgColor: 'bg-amber-50', textColor: 'text-amber-500' },
  { id: 'sensitivity', name: 'Sensitive Skin', icon: 'Flower2', bgColor: 'bg-pink-50', textColor: 'text-pink-500' },
  { id: 'dullness', name: 'Dull Skin', icon: 'Diamond', bgColor: 'bg-indigo-50', textColor: 'text-indigo-500' },
  { id: 'dark-circles', name: 'Dark Circles', icon: 'Eye', bgColor: 'bg-slate-100', textColor: 'text-slate-600' },
  { id: 'pores', name: 'Large Pores', icon: 'Microscope', bgColor: 'bg-teal-50', textColor: 'text-teal-500' },
];

export const heroBanners = [
  {
    id: 1,
    title: 'Summer Skincare Sale',
    subtitle: 'Up to 40% Off on Bestsellers',
    cta: 'Shop Now',
    bgColor: 'from-cherry-700 to-cherry-900',
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'New Arrivals',
    subtitle: 'Fresh formulas for radiant skin',
    cta: 'Explore',
    bgColor: 'from-cherry-gold to-amber-600',
    image: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    title: 'Free Gift on ₹999+',
    subtitle: 'Mini luxury kit with every order',
    cta: 'Claim Offer',
    bgColor: 'from-rose-400 to-cherry-500',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1200&q=80',
  },
];

export const dealBanners = [
  {
    id: 1,
    title: 'Buy 2 Get 1 Free',
    subtitle: 'On all serums & moisturizers',
    bgColor: 'bg-gradient-to-r from-cherry-100 to-cherry-50',
    textColor: 'text-cherry-800',
    /** INR base amounts — null means this banner has no price values */
    discountAmount: null as number | null,
    minOrderAmount: null as number | null,
  },
  {
    id: 2,
    /** titleTemplate: use {discount} as placeholder for formatted price */
    title: 'Flat {discount} Off',
    subtitle: 'On orders above {minOrder}',
    bgColor: 'bg-gradient-to-r from-amber-50 to-yellow-50',
    textColor: 'text-amber-800',
    discountAmount: 200 as number | null,
    minOrderAmount: 1499 as number | null,
  },
  {
    id: 3,
    title: 'Free Shipping',
    subtitle: 'On all prepaid orders',
    bgColor: 'bg-gradient-to-r from-emerald-50 to-green-50',
    textColor: 'text-emerald-800',
    discountAmount: null as number | null,
    minOrderAmount: null as number | null,
  },
];

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Vitamin C Serum',
    price: 899,
    originalPrice: 1199,
    rating: 4.8,
    reviews: 128,
    image:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
    category: 'Serums',
    description:
      'Brighten and even out your skin tone with our potent Vitamin C Serum. Formulated with 15% pure L-ascorbic acid, it helps reduce the appearance of dark spots and fine lines.',
    isNew: true,
  },
  {
    id: 'p2',
    name: 'Hydrating Moisturizer',
    price: 699,
    originalPrice: 999,
    rating: 4.9,
    reviews: 96,
    image:
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80',
    category: 'Moisturizers',
    description:
      'A lightweight, oil-free moisturizer that provides 24-hour hydration. Infused with hyaluronic acid and ceramides to restore the skin barrier.',
  },
  {
    id: 'p3',
    name: 'Cherryvelle Sunscreen SPF 50',
    price: 599,
    originalPrice: 799,
    rating: 4.7,
    reviews: 74,
    image: '/Sunscreen.webp',
    category: 'Sunscreen',
    description:
      'Broad-spectrum protection without the white cast. This sheer sunscreen doubles as a makeup primer and leaves a dewy, radiant finish.',
  },
  {
    id: 'p4',
    name: 'Rose Clay Mask',
    price: 499,
    originalPrice: 699,
    rating: 4.6,
    reviews: 64,
    image: '/mask.jpg',
    category: 'Masks',
    description:
      'Purify and refine pores with our gentle Rose Clay Mask. Perfect for sensitive skin, it draws out impurities without stripping moisture.',
  },
  {
    id: 'p5',
    name: 'Gentle Foaming Cleanser',
    price: 399,
    rating: 4.8,
    reviews: 210,
    image:
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80',
    category: 'Cleansers',
    description:
      "Wash away dirt, oil, and makeup without disrupting your skin's natural moisture balance. Formulated with soothing aloe vera and chamomile.",
  },
  {
    id: 'p6',
    name: 'Night Repair Cream',
    price: 1299,
    originalPrice: 1499,
    rating: 4.9,
    reviews: 85,
    image:
      'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80',
    category: 'Moisturizers',
    description:
      'Wake up to rejuvenated skin. This rich night cream works while you sleep to repair daily damage and deeply nourish.',
    isNew: true,
  },
  {
    id: 'p7',
    name: 'Hyaluronic Acid Serum',
    price: 799,
    rating: 4.7,
    reviews: 156,
    image:
      'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=600&q=80',
    category: 'Serums',
    description:
      'Plump and hydrate your skin instantly. Our multi-molecular weight hyaluronic acid penetrates multiple layers of the skin for deep hydration.',
  },
  {
    id: 'p8',
    name: 'Exfoliating Toner',
    price: 549,
    originalPrice: 649,
    rating: 4.5,
    reviews: 92,
    image:
      'https://images.unsplash.com/photo-1629367305173-4568e0638531?auto=format&fit=crop&w=600&q=80',
    category: 'Cleansers',
    description:
      'Gently sweep away dead skin cells with our 5% AHA/BHA blend. Reveals smoother, brighter skin with regular use.',
  },
];

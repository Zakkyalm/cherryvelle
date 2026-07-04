'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Star,
  ShieldCheck,
  Droplets,
  Heart,
  Sparkles,
  Truck,
  RotateCcw,
  Tag,
  Zap,
  Clock,
  Gift,
  Target,
  Sun,
  Flower2,
  Diamond,
  Eye,
  Microscope,
} from 'lucide-react';
import { skinConcerns, dealBanners } from '@/data/mockData';
import { ProductCard } from '@/components/ProductCard';
import { PageWrapper } from '@/components/PageWrapper';
import { HeroCarousel } from '@/components/HeroCarousel';
import { motion } from 'framer-motion';
import { useAdminStore, LTO_THEME_MAP } from '@/store/useAdminStore';
import { useCurrency } from '@/hooks/useCurrency';

export default function HomePage() {
  const { videos, products, limitedTimeOffers, categories } = useAdminStore();
  const { formatPrice } = useCurrency();

  const bestsellers = products.filter((p) => (p.sections ?? []).includes('bestsellers'));
  const newArrivals = products.filter((p) => (p.sections ?? []).includes('just-launched'));
  const deals = products.filter((p) => (p.sections ?? []).includes('deals'));
  const trending = products.filter((p) => (p.sections ?? []).includes('trending'));
  const mainVideo = videos.find((v) => v.slot === 'main' && v.active);
  const collectionLeft = videos.find((v) => v.slot === 'collection-left' && v.active);
  const collectionRight = videos.find((v) => v.slot === 'collection-right' && v.active);

  // Map concern icon names to Lucide components
  const concernIconMap: Record<string, React.ReactNode> = {
    Target: <Target className="w-6 h-6" />,
    Sparkles: <Sparkles className="w-6 h-6" />,
    Droplets: <Droplets className="w-6 h-6" />,
    Sun: <Sun className="w-6 h-6" />,
    Flower2: <Flower2 className="w-6 h-6" />,
    Diamond: <Diamond className="w-6 h-6" />,
    Eye: <Eye className="w-6 h-6" />,
    Microscope: <Microscope className="w-6 h-6" />,
  };

  // Promotional ticker messages
  const promoMessages = [
    { icon: <Tag className="w-3.5 h-3.5 inline-block mr-1.5" />, text: 'Summer Sale LIVE — Up to 40% Off!' },
    { icon: <Truck className="w-3.5 h-3.5 inline-block mr-1.5" />, text: `Free Shipping on Orders ${formatPrice(999)}+` },
    { icon: <Gift className="w-3.5 h-3.5 inline-block mr-1.5" />, text: 'Free Mini Kit on First Order' },
    { icon: <Star className="w-3.5 h-3.5 inline-block mr-1.5 fill-current" />, text: '10,000+ 5-Star Reviews' },
  ];

  return (
    <PageWrapper>
      <div className="flex flex-col min-h-screen">
        {/* ── Promotional Ticker Bar ── */}
        <div className="bg-cherry-900 text-white py-2.5 overflow-hidden w-full">
          <div className="animate-marquee whitespace-nowrap flex items-center">
            {[...promoMessages, ...promoMessages, ...promoMessages].map((msg, i) => (
              <span
                key={i}
                className="text-xs sm:text-sm font-medium tracking-wide mx-8 inline-flex items-center"
              >
                {msg.icon}
                {msg.text}
              </span>
            ))}
          </div>
        </div>

        {/* ── Hero Banner Carousel ── */}
        <HeroCarousel />

        {/* ── Trust/USP Strip ── */}
        <section className="bg-white border-b border-cherry-100 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: <Truck className="w-5 h-5" />, title: 'Free Delivery', sub: `On orders ${formatPrice(999)}+` },
                { icon: <ShieldCheck className="w-5 h-5" />, title: '100% Authentic', sub: 'Certified products' },
                { icon: <RotateCcw className="w-5 h-5" />, title: 'Easy Returns', sub: '7-day policy' },
                { icon: <Gift className="w-5 h-5" />, title: 'Free Samples', sub: 'With every order' },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-3 justify-center py-2">
                  <span className="text-cherry-700">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-cherry-dark">{item.title}</p>
                    <p className="text-xs text-cherry-text">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Shop by Category (Circular Cards) ── */}
        <section className="py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-serif text-cherry-dark mb-8 text-center">
              Shop by Category
            </h2>
            <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide justify-start md:justify-center">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className="flex-shrink-0"
                >
                  <Link
                    href={`/shop?category=${category.id}`}
                    className="group flex flex-col items-center gap-3 w-24 sm:w-28"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-cherry-100 group-hover:border-cherry-400 transition-colors shadow-sm group-hover:shadow-md">
                      <img
                        src={category.image}
                        alt={category.imageAlt || category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-cherry-dark text-center group-hover:text-cherry-700 transition-colors">
                      {category.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Deal Banners Strip ── */}
        <section className="py-6 bg-[#FAF8F5]">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dealBanners.map((deal, index) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Link
                    href="/shop"
                    className={`block w-full ${deal.bgColor} rounded-2xl p-5 hover:shadow-md transition-shadow border border-cherry-100/50`}
                  >
                    <div className="flex items-center gap-3">
                      <Tag className={`w-8 h-8 ${deal.textColor}`} />
                      <div>
                        <p className={`font-bold text-base ${deal.textColor}`}>{deal.title}</p>
                        <p className={`text-sm opacity-80 ${deal.textColor}`}>{deal.subtitle}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Promotional Media Section (video or image) ── */}
        {mainVideo && (
        <section className="py-10 bg-white">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-serif text-cherry-dark mb-3">
                {mainVideo.title}
              </h2>
              {mainVideo.subtitle && (
                <p className="text-sm text-cherry-text max-w-md mx-auto">
                  {mainVideo.subtitle}
                </p>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-cherry-100 aspect-video md:aspect-auto md:h-[450px]"
            >
              {(mainVideo.contentType ?? 'video') === 'image' ? (
                <img
                  src={mainVideo.imageSrc}
                  alt={mainVideo.imageAlt || mainVideo.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={mainVideo.poster || undefined}
                >
                  <source src={mainVideo.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </motion.div>
          </div>
        </section>
        )}

        {/* ── Bestsellers Section ── */}
        {bestsellers.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-cherry-gold" />
                <h2 className="text-2xl md:text-3xl font-serif text-cherry-dark">
                  Bestsellers
                </h2>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1 text-sm font-medium text-cherry-700 hover:text-cherry-800 transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {bestsellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
        )}

        {/* ── Large Promo Banner — Dynamic Limited Time Offers ── */}
        {limitedTimeOffers.filter(o => o.active).map((offer, index) => {
          const theme = LTO_THEME_MAP[offer.bgColor] ?? LTO_THEME_MAP.cherry;
          return (
          <section key={offer.id} className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl overflow-hidden bg-gradient-to-r ${theme.bg}`}
            >
              <div className="grid md:grid-cols-2 items-center">
                <div className="p-8 md:p-12 lg:p-16 z-10">
                  <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-white/90 text-xs font-medium mb-4">
                    <Clock className="w-3.5 h-3.5" />
                    Limited Time Offer
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif text-white mb-2 leading-tight">
                    {offer.headline}
                    {offer.headlineAccent && (
                      <><br /><span className={theme.accent}>{offer.headlineAccent}</span></>
                    )}
                  </h2>
                  {offer.subtext && (
                    <p className="text-white/70 mb-6 max-w-sm text-sm">
                      {offer.subtext}
                    </p>
                  )}
                  {offer.couponCode && (
                    <p className="text-white/60 text-xs mb-4 font-mono tracking-widest">
                      CODE: <span className="text-white font-bold">{offer.couponCode}</span>
                    </p>
                  )}
                  <Link
                    href={offer.buttonLink || '/shop'}
                    className="inline-flex px-6 py-3 bg-cherry-gold text-cherry-dark rounded-full font-semibold items-center gap-2 hover:bg-cherry-goldLight transition-colors text-sm shadow-lg shadow-cherry-gold/20"
                  >
                    {offer.buttonText || 'Shop Now'}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="relative h-52 md:h-full min-h-[280px]">
                  {offer.image ? (
                    <img
                      src={offer.image}
                      alt={offer.imageAlt || offer.headline}
                      className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
                    />
                  ) : (
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_white_0%,_transparent_70%)]" />
                  )}
                </div>
              </div>
            </motion.div>
          </section>
          );
        })}

        {/* ── Shop by Concern ── */}
        <section className="py-12 bg-[#FAF8F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-serif text-cherry-dark mb-8 text-center">
              Shop by Concern
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {skinConcerns.map((concern, index) => (
                <motion.div
                  key={concern.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  <Link
                    href={`/shop?concern=${concern.id}`}
                    className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-white hover:shadow-md border border-transparent hover:border-cherry-100 transition-all"
                  >
                    <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${concern.bgColor} ${concern.textColor} group-hover:scale-110 transition-transform mb-1`}>
                      {concernIconMap[concern.icon] || <Target className="w-6 h-6" />}
                    </span>
                    <span className="text-xs font-medium text-cherry-dark text-center leading-tight group-hover:text-cherry-700 transition-colors">
                      {concern.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Deals of the Day ── */}
        {deals.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-cherry-500" />
                <h2 className="text-2xl md:text-3xl font-serif text-cherry-dark">
                  Deals of the Day
                </h2>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1 text-sm font-medium text-cherry-700 hover:text-cherry-800 transition-colors"
              >
                See All Deals <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {deals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
        )}

        {/* ── New Arrivals ── */}
        {newArrivals.length > 0 && (
          <section className="py-12 bg-[#FAF8F5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-cherry-gold fill-cherry-gold" />
                  <h2 className="text-2xl md:text-3xl font-serif text-cherry-dark">
                    Just Launched
                  </h2>
                </div>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1 text-sm font-medium text-cherry-700 hover:text-cherry-800 transition-colors"
                >
                  Explore New <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {newArrivals.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Featured Collection Banner ── */}
        {(collectionLeft || collectionRight) && (
        <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-4">
            {collectionLeft && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative rounded-2xl overflow-hidden h-56 md:h-64 group"
            >
              {(collectionLeft.contentType ?? 'video') === 'image' ? (
                <img
                  src={collectionLeft.imageSrc}
                  alt={collectionLeft.imageAlt || collectionLeft.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <video
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src={collectionLeft.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-xl font-serif text-white mb-2">{collectionLeft.title}</h3>
                {collectionLeft.subtitle && (
                  <p className="text-white/70 text-sm mb-3">{collectionLeft.subtitle}</p>
                )}
                {collectionLeft.linkHref && collectionLeft.linkText && (
                  <Link
                    href={collectionLeft.linkHref}
                    className="inline-flex items-center gap-1 text-sm font-medium text-cherry-goldLight hover:text-white transition-colors"
                  >
                    {collectionLeft.linkText} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </motion.div>
            )}
            {collectionRight && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative rounded-2xl overflow-hidden h-56 md:h-64 group"
            >
              {(collectionRight.contentType ?? 'video') === 'image' ? (
                <img
                  src={collectionRight.imageSrc}
                  alt={collectionRight.imageAlt || collectionRight.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <video
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src={collectionRight.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-xl font-serif text-white mb-2">{collectionRight.title}</h3>
                {collectionRight.subtitle && (
                  <p className="text-white/70 text-sm mb-3">{collectionRight.subtitle}</p>
                )}
                {collectionRight.linkHref && collectionRight.linkText && (
                  <Link
                    href={collectionRight.linkHref}
                    className="inline-flex items-center gap-1 text-sm font-medium text-cherry-goldLight hover:text-white transition-colors"
                  >
                    {collectionRight.linkText} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </motion.div>
            )}
          </div>
        </section>
        )}

        {/* ── Trending Now ── */}
        {trending.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-serif text-cherry-dark">
                Trending Now
              </h2>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1 px-5 py-2.5 border border-cherry-200 rounded-full text-sm font-medium text-cherry-dark hover:border-cherry-700 hover:text-cherry-700 transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {trending.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
        )}

        {/* ── Why Cherryvelle Strip ── */}
        <section className="py-14 bg-cherry-50 border-t border-cherry-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-serif text-cherry-dark mb-10 text-center">
              Why Choose Cherryvelle?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  icon: <Droplets className="w-7 h-7" />,
                  title: 'Natural Ingredients',
                  desc: 'Ethically sourced, plant-based formulas',
                },
                {
                  icon: <ShieldCheck className="w-7 h-7" />,
                  title: 'Dermatologist Tested',
                  desc: 'Clinically proven for all skin types',
                },
                {
                  icon: <Heart className="w-7 h-7" />,
                  title: 'Cruelty-Free',
                  desc: 'Never tested on animals',
                },
                {
                  icon: <Star className="w-7 h-7" />,
                  title: '10K+ Reviews',
                  desc: '4.8 average rating from real customers',
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="text-center p-6 bg-white rounded-2xl border border-cherry-100"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-cherry-50 text-cherry-700 mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-cherry-dark text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-cherry-text">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </PageWrapper>
  );
}

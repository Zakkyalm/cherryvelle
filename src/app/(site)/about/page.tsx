'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, ShieldCheck, Heart, Award, Users, Star } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' },
  }),
};

const values = [
  {
    icon: <Leaf className="w-6 h-6" />,
    title: 'Natural Ingredients',
    desc: 'Every formula starts with nature. We source botanicals, oils, and plant extracts that are kind to your skin and the planet.',
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: 'Dermatologist Tested',
    desc: 'Each product is clinically validated before it reaches you — safe for sensitive skin, effective for everyone.',
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Cruelty Free',
    desc: "No animal testing, ever. We believe beauty should never come at someone else's expense.",
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: 'Premium Quality',
    desc: 'Luxury-grade actives at accessible prices. We refuse to compromise on what goes on your skin.',
  },
];

const team = [
  {
    name: 'Layla Hassan',
    role: 'Founder & CEO',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    bio: 'A skincare obsessive and entrepreneur who built Cherryvelle from her kitchen lab into a brand trusted by thousands.',
  },
  {
    name: 'Sara Al-Khalid',
    role: 'Head of Formulations',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    bio: 'Cosmetic chemist with 12 years of experience crafting science-backed formulas that actually perform.',
  },
  {
    name: 'Nour Mansour',
    role: 'Creative Director',
    img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    bio: 'Shapes the visual world of Cherryvelle — from packaging design to campaign imagery.',
  },
];

const stats = [
  { value: '10K+', label: 'Happy Customers', icon: <Users className="w-5 h-5" /> },
  { value: '4.8★', label: 'Average Rating', icon: <Star className="w-5 h-5" /> },
  { value: '50+', label: 'Products', icon: <Award className="w-5 h-5" /> },
  { value: '100%', label: 'Cruelty Free', icon: <Heart className="w-5 h-5" /> },
];

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden w-full">

      {/* ── Hero ── */}
      <section className="relative min-h-[70vh] flex items-center bg-cherry-dark overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1600&q=80"
            alt="Cherryvelle lab"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cherry-dark via-cherry-dark/80 to-cherry-dark/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-28">
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="h-px w-10 bg-cherry-gold" />
            <span className="text-cherry-gold font-medium tracking-[0.2em] text-xs uppercase">Our Story</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-[clamp(2.8rem,7vw,5.5rem)] font-serif text-white leading-[1.05] tracking-tight mb-6 max-w-3xl"
          >
            Beauty Born from
            <br />
            <span className="italic text-cherry-gold">Passion & Purpose</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-white/60 text-lg leading-relaxed max-w-xl mb-10"
          >
            Cherryvelle was founded on a simple belief — that everyone deserves
            skincare that is honest, effective, and truly beautiful. We're a
            UK-based brand blending science with nature, one formula at a time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cherry-gold text-cherry-dark font-semibold rounded-full text-sm tracking-wide hover:bg-cherry-goldLight transition-colors shadow-lg shadow-cherry-gold/20"
            >
              Shop the Collection
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-cherry-700 py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center"
            >
              <div className="flex justify-center text-cherry-goldLight mb-2">{s.icon}</div>
              <p className="text-3xl font-serif font-bold text-white">{s.value}</p>
              <p className="text-white/60 text-xs mt-1 tracking-wide uppercase">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Brand Story ── */}
      <section className="py-24 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Images collage */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img
                    src="/Sunscreen.webp"
                    alt="Skincare sunscreen product"
                    className="w-full h-56 object-cover rounded-2xl shadow-md"
                  />
                  <img
                    src="/mask.jpg"
                    alt="Natural skincare mask packaging"
                    className="w-full h-40 object-cover rounded-2xl shadow-md"
                  />
                </div>
                <div className="space-y-4 pt-8">
                  <img
                    src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=600&q=80"
                    alt="Cherryvelle beauty"
                    className="w-full h-40 object-cover rounded-2xl shadow-md"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80"
                    alt="Skincare routine"
                    className="w-full h-56 object-cover rounded-2xl shadow-md"
                  />
                </div>
              </div>
              {/* floating badge */}
              <div className="absolute -bottom-4 right-0 bg-cherry-700 text-white rounded-2xl px-6 py-4 shadow-xl">
                <p className="text-2xl font-serif font-bold">5+ Years</p>
                <p className="text-white/70 text-xs tracking-wide">of crafting beauty</p>
              </div>
            </motion.div>

            {/* Copy */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-cherry-gold" />
                <span className="text-cherry-gold text-xs font-medium tracking-[0.2em] uppercase">Who We Are</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-serif text-cherry-dark leading-tight">
                More Than a Brand —<br />
                <span className="text-cherry-700">A Ritual</span>
              </h2>

              <p className="text-cherry-text leading-relaxed">
                Cherryvelle started as a personal quest for clean, effective skincare in a market full of empty promises.
                Founded in London, we set out to create formulas that honour the skin&apos;s natural intelligence — no fillers,
                no shortcuts, no compromises.
              </p>
              <p className="text-cherry-text leading-relaxed">
                Every product in our range is developed in collaboration with cosmetic chemists and dermatologists,
                using ingredients that are ethically sourced and sustainably packaged. We believe your skincare routine
                should feel like a moment of care, not a chore.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                {['Ethically Sourced', 'Sustainable Packaging', 'Vegan Formulas', 'UK Made'].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 rounded-full bg-cherry-100 text-cherry-700 text-xs font-medium border border-cherry-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Our Values ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8 bg-cherry-gold" />
              <span className="text-cherry-gold text-xs font-medium tracking-[0.2em] uppercase">What Drives Us</span>
              <span className="h-px w-8 bg-cherry-gold" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-cherry-dark">Our Values</h2>
            <p className="mt-4 text-cherry-text max-w-xl mx-auto">
              These aren&apos;t just words on a page — they&apos;re the principles baked into every batch we make.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group p-8 rounded-3xl border border-cherry-100 hover:border-cherry-300 hover:shadow-soft transition-all duration-300 bg-[#FAF8F5]"
              >
                <div className="w-12 h-12 rounded-2xl bg-cherry-100 flex items-center justify-center text-cherry-700 mb-5 group-hover:bg-cherry-700 group-hover:text-white transition-colors duration-300">
                  {v.icon}
                </div>
                <h3 className="text-lg font-serif text-cherry-dark mb-3">{v.title}</h3>
                <p className="text-sm text-cherry-text leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Meet the Team ── */}
      <section className="py-24 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8 bg-cherry-gold" />
              <span className="text-cherry-gold text-xs font-medium tracking-[0.2em] uppercase">The People</span>
              <span className="h-px w-8 bg-cherry-gold" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-cherry-dark">Meet the Team</h2>
            <p className="mt-4 text-cherry-text max-w-lg mx-auto">
              The passionate minds behind every product, every formula, every detail.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group text-center"
              >
                <div className="relative mb-6 mx-auto w-52 h-52 rounded-full overflow-hidden ring-4 ring-cherry-100 group-hover:ring-cherry-300 transition-all duration-300">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-serif text-cherry-dark">{member.name}</h3>
                <p className="text-cherry-gold text-sm font-medium tracking-wide mt-1 mb-3">{member.role}</p>
                <p className="text-sm text-cherry-text leading-relaxed max-w-xs mx-auto">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 bg-cherry-dark">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-cherry-gold text-sm font-medium tracking-[0.2em] uppercase mb-4">Join the Family</p>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
              Ready to discover your
              <br />
              <span className="italic text-cherry-gold">best skin?</span>
            </h2>
            <p className="text-white/60 mb-10 max-w-md mx-auto">
              Explore our curated collection of skincare essentials built for real results.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-4 bg-cherry-gold text-cherry-dark font-semibold rounded-full text-sm hover:bg-cherry-goldLight transition-colors shadow-lg"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white rounded-full text-sm hover:border-white/50 hover:bg-white/5 transition-all"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

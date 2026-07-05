'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const contactInfo = [
  {
    icon: <Mail className="w-5 h-5" />,
    label: 'Email Us',
    value: 'support@cherryvelle.co.uk',
    sub: 'We reply within 24 hours',
    href: 'mailto:support@cherryvelle.co.uk',
  },
  {
    icon: <Phone className="w-5 h-5" />,
    label: 'Call Us',
    value: '+44 (0) 20 7123 4567',
    sub: 'Mon – Fri, 9 am – 6 pm',
    href: 'tel:+442071234567',
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    label: 'Visit Us',
    value: '14 King Street, London, W6 9HU',
    sub: 'United Kingdom',
    href: 'https://maps.google.com',
  },
  {
    icon: <Clock className="w-5 h-5" />,
    label: 'Working Hours',
    value: 'Mon – Fri: 9 am – 6 pm',
    sub: 'Sat: 10 am – 4 pm',
    href: null,
  },
];

const faqs = [
  {
    q: 'How long does shipping take?',
    a: 'Standard UK delivery is 2–4 business days. Express (1–2 days) is available at checkout. International shipping takes 5–10 business days.',
  },
  {
    q: 'Do you offer returns?',
    a: "Yes — we accept returns within 30 days of purchase for unused, unopened products. Contact us and we'll guide you through the process.",
  },
  {
    q: 'Are your products suitable for sensitive skin?',
    a: 'All Cherryvelle products are dermatologist tested and free from harsh irritants. We always recommend patch-testing a new product first.',
  },
  {
    q: 'Can I track my order?',
    a: "Absolutely. You'll receive a confirmation email with a tracking link as soon as your order ships.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="overflow-hidden">

      {/* ── Hero ── */}
      <section className="relative bg-cherry-dark py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1600&q=80"
            alt="Contact Cherryvelle"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-cherry-dark/80 via-cherry-dark/60 to-cherry-dark" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span className="h-px w-8 bg-cherry-gold" />
            <span className="text-cherry-gold font-medium tracking-[0.2em] text-xs uppercase">Get in Touch</span>
            <span className="h-px w-8 bg-cherry-gold" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-[clamp(2.5rem,6vw,5rem)] font-serif text-white leading-tight mb-6"
          >
            We&apos;d Love to
            <br />
            <span className="italic text-cherry-gold">Hear from You</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-white/60 text-lg max-w-xl mx-auto"
          >
            Whether it&apos;s a question about an order, product advice, or just a hello —
            our team is here for you.
          </motion.p>
        </div>
      </section>

      {/* ── Contact cards ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, i) => (
              <motion.div
                key={item.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-4 p-7 rounded-3xl border border-cherry-100 hover:border-cherry-300 hover:shadow-soft transition-all duration-300 bg-[#FAF8F5] h-full"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-cherry-100 flex items-center justify-center text-cherry-700 group-hover:bg-cherry-700 group-hover:text-white transition-colors duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-cherry-gold tracking-widest uppercase mb-1">{item.label}</p>
                      <p className="text-cherry-dark font-medium text-sm">{item.value}</p>
                      <p className="text-cherry-text text-xs mt-1">{item.sub}</p>
                    </div>
                  </a>
                ) : (
                  <div className="flex flex-col gap-4 p-7 rounded-3xl border border-cherry-100 bg-[#FAF8F5] h-full">
                    <div className="w-11 h-11 rounded-2xl bg-cherry-100 flex items-center justify-center text-cherry-700">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-cherry-gold tracking-widest uppercase mb-1">{item.label}</p>
                      <p className="text-cherry-dark font-medium text-sm">{item.value}</p>
                      <p className="text-cherry-text text-xs mt-1">{item.sub}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form + Image ── */}
      <section className="py-20 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="h-px w-8 bg-cherry-gold" />
                <span className="text-cherry-gold text-xs font-medium tracking-[0.2em] uppercase">Send a Message</span>
              </div>
              <h2 className="text-4xl font-serif text-cherry-dark mb-8">Let&apos;s Talk</h2>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl p-12 text-center border border-cherry-100 shadow-soft"
                >
                  <div className="w-16 h-16 rounded-full bg-cherry-100 flex items-center justify-center mx-auto mb-6">
                    <Send className="w-7 h-7 text-cherry-700" />
                  </div>
                  <h3 className="text-2xl font-serif text-cherry-dark mb-3">Message Sent!</h3>
                  <p className="text-cherry-text">
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}
                    className="mt-8 px-8 py-3 border border-cherry-200 rounded-full text-sm font-medium text-cherry-dark hover:border-cherry-700 transition-colors"
                  >
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-cherry-100 shadow-soft space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-cherry-dark mb-2 tracking-wide">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Layla Hassan"
                        className="w-full px-4 py-3 rounded-xl border border-cherry-200 bg-[#FAF8F5] text-sm text-cherry-dark placeholder:text-cherry-200 focus:outline-none focus:ring-2 focus:ring-cherry-400 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-cherry-dark mb-2 tracking-wide">Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="hello@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-cherry-200 bg-[#FAF8F5] text-sm text-cherry-dark placeholder:text-cherry-200 focus:outline-none focus:ring-2 focus:ring-cherry-400 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-cherry-dark mb-2 tracking-wide">Subject</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-cherry-200 bg-[#FAF8F5] text-sm text-cherry-dark focus:outline-none focus:ring-2 focus:ring-cherry-400 focus:border-transparent transition appearance-none"
                    >
                      <option value="" disabled>Select a subject…</option>
                      <option value="order">Order Enquiry</option>
                      <option value="product">Product Question</option>
                      <option value="returns">Returns & Refunds</option>
                      <option value="wholesale">Wholesale</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-cherry-dark mb-2 tracking-wide">Message</label>
                    <textarea
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell us how we can help…"
                      className="w-full px-4 py-3 rounded-xl border border-cherry-200 bg-[#FAF8F5] text-sm text-cherry-dark placeholder:text-cherry-200 focus:outline-none focus:ring-2 focus:ring-cherry-400 focus:border-transparent transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-4 bg-cherry-700 text-white rounded-xl font-medium text-sm hover:bg-cherry-800 transition-colors shadow-md"
                  >
                    Send Message
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </motion.div>

            {/* Right side: image + social links */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-8"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80"
                  alt="Cherryvelle store"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cherry-dark/60 to-transparent flex items-end p-8">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Our London Studio</p>
                    <p className="text-white font-serif text-xl">14 King Street, W6 9HU</p>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="bg-white rounded-3xl p-8 border border-cherry-100">
                <h3 className="font-serif text-cherry-dark text-xl mb-1">Follow Along</h3>
                <p className="text-cherry-text text-sm mb-6">Stay connected for tips, new arrivals, and community love.</p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: <FaInstagram size={20} />, label: 'Instagram', handle: '@cherryvelle', href: 'https://instagram.com/cherryvelle', color: 'hover:bg-pink-50 hover:border-pink-200 hover:text-pink-600' },
                    { icon: <FaFacebook size={20} />, label: 'Facebook', handle: '/cherryvelle', href: 'https://facebook.com/cherryvelle', color: 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600' },
                    { icon: <FaWhatsapp size={20} />, label: 'WhatsApp', handle: 'Chat Now', href: 'https://wa.me/1234567890', color: 'hover:bg-green-50 hover:border-green-200 hover:text-green-600' },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border border-cherry-100 text-cherry-700 transition-all duration-200 text-center ${s.color}`}
                    >
                      {s.icon}
                      <span className="text-xs font-medium">{s.label}</span>
                      <span className="text-[10px] text-cherry-text">{s.handle}</span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8 bg-cherry-gold" />
              <span className="text-cherry-gold text-xs font-medium tracking-[0.2em] uppercase">Quick Answers</span>
              <span className="h-px w-8 bg-cherry-gold" />
            </div>
            <h2 className="text-4xl font-serif text-cherry-dark">Frequently Asked</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="rounded-2xl border border-cherry-100 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left bg-[#FAF8F5] hover:bg-cherry-50 transition-colors"
                >
                  <span className="font-medium text-cherry-dark text-sm">{faq.q}</span>
                  <span className={`text-cherry-gold text-xl font-light ml-4 transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 py-5 bg-white border-t border-cherry-100"
                  >
                    <p className="text-sm text-cherry-text leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

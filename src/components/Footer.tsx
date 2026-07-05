'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaInstagram, FaFacebook, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import PolicyModal from './PolicyModal';

type PolicyType = 'privacy' | 'terms';

export function Footer() {
  const [activePolicy, setActivePolicy] = useState<PolicyType | null>(null);

  return (
    <>
    {activePolicy && (
      <PolicyModal type={activePolicy} onClose={() => setActivePolicy(null)} />
    )}
    <footer className="pt-16 pb-8 border-t border-cherry-100 mt-auto" style={{ backgroundColor: '#fcf7f3' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 mb-12">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img
                src="/logo.jpg"
                alt="Glowvora Beauty"
                className="h-20 md:h-24 w-auto rounded-lg"
              />
            </Link>
            <p className="text-sm text-cherry-text leading-relaxed">
              Beauty. Elegance. Loyalty. Discover cosmetics that enhance your
              natural beauty.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://instagram.com/cherryvelle" target="_blank" rel="noopener noreferrer" className="text-cherry-text hover:text-cherry-700 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="https://facebook.com/cherryvelle" target="_blank" rel="noopener noreferrer" className="text-cherry-text hover:text-cherry-700 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="https://wa.me/447123456789" target="_blank" rel="noopener noreferrer" className="text-cherry-text hover:text-cherry-700 transition-colors">
                <FaWhatsapp size={20} />
              </a>
              <a href="https://youtube.com/@cherryvelle" target="_blank" rel="noopener noreferrer" className="text-cherry-text hover:text-cherry-700 transition-colors">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif font-semibold text-cherry-dark mb-4">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/shop" className="text-sm text-cherry-text hover:text-cherry-700 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=cleansers" className="text-sm text-cherry-text hover:text-cherry-700 transition-colors">
                  Cleansers
                </Link>
              </li>
              <li>
                <Link href="/shop?category=moisturizers" className="text-sm text-cherry-text hover:text-cherry-700 transition-colors">
                  Moisturizers
                </Link>
              </li>
              <li>
                <Link href="/shop?category=serums" className="text-sm text-cherry-text hover:text-cherry-700 transition-colors">
                  Serums
                </Link>
              </li>
              <li>
                <Link href="/shop?category=sunscreen" className="text-sm text-cherry-text hover:text-cherry-700 transition-colors">
                  Sunscreen
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-semibold text-cherry-dark mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-cherry-text hover:text-cherry-700 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-cherry-text hover:text-cherry-700 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-cherry-text hover:text-cherry-700 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-cherry-text hover:text-cherry-700 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>


        </div>

        <div className="pt-8 border-t border-cherry-200" />
      </div>

      {/* Oversized brand wordmark */}
      <div className="mt-12 w-full overflow-hidden select-none" aria-hidden="true">
        <h2 className="font-sans font-extrabold text-cherry-700 leading-none tracking-tighter text-center text-[clamp(3rem,14vw,14rem)]">
          Cherryvelle<span className="text-cherry-gold">.</span>
        </h2>
      </div>

      {/* Copyright — sits directly below the large wordmark */}
      <div className="mt-4 pb-2 px-4">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center">
          <p className="text-sm text-cherry-text whitespace-nowrap">
            &copy; {new Date().getFullYear()} Cherryvelle Cosmetics. All rights reserved.
          </p>
          <button
            onClick={() => setActivePolicy('privacy')}
            className="text-sm text-cherry-text hover:text-cherry-700 whitespace-nowrap underline-offset-2 hover:underline transition-colors"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActivePolicy('terms')}
            className="text-sm text-cherry-text hover:text-cherry-700 whitespace-nowrap underline-offset-2 hover:underline transition-colors"
          >
            Terms of Service
          </button>
          <span className="text-cherry-text/40 hidden sm:inline">·</span>
          <p className="text-sm text-cherry-text/60 tracking-wide whitespace-nowrap">
            Designed &amp; Developed by{' '}
            <a
              href="https://vynoq.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold transition-colors duration-300 hover:opacity-80"
              style={{ color: '#800020' }}
            >
              Vynoq.com
            </a>
          </p>
        </div>
      </div>
    </footer>
    </>
  );
}

'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
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
              <a href="#" className="text-cherry-text hover:text-cherry-700 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-cherry-text hover:text-cherry-700 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-cherry-text hover:text-cherry-700 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-cherry-text hover:text-cherry-700 transition-colors">
                <Youtube className="w-5 h-5" />
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

        <div className="pt-8 border-t border-cherry-200">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center">
            <p className="text-sm text-cherry-text whitespace-nowrap">
              &copy; {new Date().getFullYear()} Cherryvelle Cosmetics. All rights reserved.
            </p>
            <Link href="/privacy" className="text-sm text-cherry-text hover:text-cherry-700 whitespace-nowrap">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-cherry-text hover:text-cherry-700 whitespace-nowrap">
              Terms of Service
            </Link>
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
      </div>

      {/* Oversized brand wordmark */}
      <div className="mt-12 w-full overflow-hidden select-none" aria-hidden="true">
        <h2 className="font-sans font-extrabold text-cherry-700 leading-none tracking-tighter text-center text-[clamp(3rem,14vw,14rem)]">
          Cherryvelle<span className="text-cherry-gold">.</span>
        </h2>
      </div>
    </footer>
  );
}

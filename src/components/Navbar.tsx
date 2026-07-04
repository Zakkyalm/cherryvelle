'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { User, ShoppingBag, Menu, X, Heart, Globe, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { SearchBar } from '@/components/SearchBar';
import { CategoryBar } from '@/components/CategoryBar';
import { useCurrencyStore, CurrencyCode } from '@/store/useCurrencyStore';

function CurrencySwitcher() {
  const { selectedCurrency, selectCurrency, getEnabledCurrencies, getCurrencyConfig } =
    useCurrencyStore();
  const [open, setOpen] = useState(false);
  const enabledCurrencies = getEnabledCurrencies();
  const current = getCurrencyConfig(selectedCurrency);

  if (enabledCurrencies.length <= 1) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-cherry-dark hover:text-cherry-gold transition-colors text-xs font-medium"
        aria-label="Switch currency"
      >
        <Globe className="w-4 h-4" />
        <span>{current.code}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-cherry-100 overflow-hidden z-50 min-w-[160px]">
            {enabledCurrencies.map((c) => (
              <button
                key={c.code}
                onClick={() => { selectCurrency(c.code as CurrencyCode); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  selectedCurrency === c.code
                    ? 'bg-cherry-50 text-cherry-dark font-semibold'
                    : 'text-cherry-text hover:bg-cherry-50 hover:text-cherry-dark'
                }`}
              >
                <div className="text-left">
                  <p className="font-medium leading-none">{c.code}</p>
                  <p className="text-[10px] text-cherry-text mt-0.5">{c.symbol}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getCartCount, openCart, favorites } = useCartStore();
  const pathname = usePathname();
  const currentSearchParams = useSearchParams();

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/shop?category=all' },
    { name: 'About Us', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    const [basePath, queryString] = path.split('?');
    
    // Home link: only active on exact "/"
    if (basePath === '/' && pathname !== '/') return false;
    if (basePath === '/' && pathname === '/') return true;

    // For links with query params (e.g. "Categories" -> /shop?category=all),
    // only mark active if the pathname matches AND the query param is present
    if (queryString) {
      const params = new URLSearchParams(queryString);
      if (pathname !== basePath) return false;
      for (const [key, value] of params.entries()) {
        if (currentSearchParams.get(key) !== value) return false;
      }
      return true;
    }

    // For plain links (no query param), match pathname exactly
    // but exclude when there are category query params (that means "Categories" is active instead)
    if (basePath === '/shop') {
      if (currentSearchParams.has('category')) return false;
      return pathname === '/shop';
    }

    return pathname === basePath || pathname.startsWith(basePath + '/');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md" style={{ backgroundColor: '#fcf7f3' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <img
                  src="/logo.jpg"
                  alt="Glowvora Beauty"
                  className="h-20 md:h-24 w-auto rounded-lg"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-3 lg:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`text-xs lg:text-sm font-medium transition-colors hover:text-cherry-gold relative py-2 whitespace-nowrap ${
                    isActive(link.path) ? 'text-cherry-maroon' : 'text-cherry-dark'
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cherry-maroon rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop: Search + Icons */}
            <div className="hidden md:flex items-center space-x-4">
              <CurrencySwitcher />
              <SearchBar />
              <button className="text-cherry-dark hover:text-cherry-gold transition-colors">
                <User className="w-5 h-5" />
              </button>
              <Link
                href="/favorites"
                className="text-cherry-dark hover:text-cherry-gold transition-colors relative"
              >
                <Heart className="w-5 h-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-cherry-gold text-cherry-dark text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <button
                className="text-cherry-dark hover:text-cherry-gold transition-colors relative"
                onClick={openCart}
              >
                <ShoppingBag className="w-5 h-5" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-cherry-gold text-cherry-dark text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile: Search + Cart + Menu */}
            <div className="flex items-center md:hidden space-x-3">
              <CurrencySwitcher />
              <SearchBar />
              <Link href="/favorites" className="text-cherry-dark relative">
                <Heart className="w-5 h-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-cherry-gold text-cherry-dark text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <button className="text-cherry-dark relative" onClick={openCart}>
                <ShoppingBag className="w-5 h-5" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-cherry-gold text-cherry-dark text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-cherry-dark hover:text-cherry-gold"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-20 border-t border-cherry-900 shadow-lg z-30 overflow-x-hidden" style={{ backgroundColor: '#fcf7f3' }}>
            <div className="px-4 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(link.path)
                      ? 'text-cherry-maroon bg-cherry-900/10'
                      : 'text-cherry-dark hover:text-cherry-gold hover:bg-cherry-900/10'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile Category Links */}
              <div className="pt-3 mt-3 border-t border-cherry-900">
                <p className="px-3 text-xs font-semibold text-cherry-goldLight/60 uppercase tracking-wider mb-2">
                  Quick Categories
                </p>
                <div className="flex flex-wrap gap-2 px-3">
                  {['cleansers', 'moisturizers', 'serums', 'sunscreen', 'masks', 'lip-care', 'body-care', 'eye-care'].map(
                    (catId) => {
                      const cat = ['Cleansers', 'Moisturizers', 'Serums', 'Sunscreen', 'Masks', 'Lip Care', 'Body Care', 'Eye Care'];
                      const idx = ['cleansers', 'moisturizers', 'serums', 'sunscreen', 'masks', 'lip-care', 'body-care', 'eye-care'].indexOf(catId);
                      return (
                        <Link
                          key={catId}
                          href={`/shop?category=${catId}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="px-3 py-1.5 text-xs font-medium bg-cherry-900/10 border border-cherry-700/20 rounded-full text-cherry-dark hover:border-cherry-gold hover:text-cherry-gold transition-colors"
                        >
                          {cat[idx]}
                        </Link>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Category Bar - appears below navbar on desktop */}
      <CategoryBar />
    </>
  );
}

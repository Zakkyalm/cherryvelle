'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, X, CheckCircle2 } from 'lucide-react';
import { useCurrencyStore, CurrencyCode } from '@/store/useCurrencyStore';

export function CurrencyPickerModal() {
  const {
    hasSelectedCurrency,
    autoDetect,
    currencies,
    selectCurrency,
    dismissPicker,
    getEnabledCurrencies,
  } = useCurrencyStore();

  const [visible, setVisible] = useState(false);

  const enabledCurrencies = getEnabledCurrencies();

  useEffect(() => {
    // If the user already made a selection in this session, never show again
    if (hasSelectedCurrency) {
      setVisible(false);
      return;
    }

    if (autoDetect) {
      // Auto-detect mode: fetch the user's country from ipapi.co and map to a currency
      const controller = new AbortController();

      fetch('https://ipapi.co/json/', { signal: controller.signal })
        .then((res) => res.json())
        .then((data: { country_code?: string }) => {
          const countryCode = data?.country_code;
          if (countryCode) {
            // Find a matching enabled currency for this country
            const match = currencies.find(
              (c) => c.enabled && c.countryCodes.includes(countryCode)
            );
            if (match) {
              // Auto-select and skip the popup entirely
              selectCurrency(match.code);
              return;
            }
          }
          // No match found — fall back to the picker
          setTimeout(() => setVisible(true), 1200);
        })
        .catch(() => {
          // Network error or aborted — fall back to the picker
          setTimeout(() => setVisible(true), 1200);
        });

      return () => controller.abort();
    } else {
      // Manual mode: always show the picker so the user can choose
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [hasSelectedCurrency, autoDetect, currencies, selectCurrency]);

  const handleSelect = (code: CurrencyCode) => {
    selectCurrency(code);
    setVisible(false);
  };

  const handleDismiss = () => {
    dismissPicker();
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[70]"
            onClick={handleDismiss}
          />

          {/* Bottom sheet */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-3xl shadow-2xl"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-cherry-200 rounded-full" />
            </div>

            <div className="px-6 pb-8 pt-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cherry-50 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-cherry-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-cherry-dark leading-tight">
                      Choose your currency
                    </h2>
                    <p className="text-xs text-cherry-text mt-0.5">
                      Prices will update across the entire store
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-1.5 rounded-full text-cherry-text hover:text-cherry-dark hover:bg-cherry-50 transition-colors mt-0.5"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Currency options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {enabledCurrencies.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => handleSelect(c.code)}
                    className="flex items-center gap-4 p-4 rounded-2xl border-2 border-cherry-100 hover:border-cherry-700 hover:bg-cherry-50 transition-all text-left group"
                  >
                    <span className="text-3xl leading-none">{c.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-cherry-dark text-sm">{c.code}</p>
                      <p className="text-xs text-cherry-text truncate">{c.name}</p>
                      <p className="text-xs text-cherry-500 mt-0.5">{c.symbol}</p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-cherry-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </button>
                ))}
              </div>

              <p className="text-center text-xs text-cherry-text mt-5">
                You can change this anytime from the site navigation.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

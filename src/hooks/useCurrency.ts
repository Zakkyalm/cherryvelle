'use client';

import { useCurrencyStore } from '@/store/useCurrencyStore';

/**
 * Returns a `formatPrice` function that converts an INR base price
 * to the currently selected currency and formats it with the correct symbol.
 *
 * Usage:
 *   const { formatPrice, currency } = useCurrency();
 *   <span>{formatPrice(product.price)}</span>
 */
export function useCurrency() {
  const { selectedCurrency, getCurrencyConfig } = useCurrencyStore();
  const config = getCurrencyConfig(selectedCurrency);

  const formatPrice = (inrPrice: number): string => {
    const converted = inrPrice * config.rateFromINR;

    // Round to 2 decimal places; drop decimals if whole number
    const rounded =
      config.code === 'INR'
        ? Math.round(converted)
        : Math.round(converted * 100) / 100;

    const formatted =
      config.code === 'INR'
        ? rounded.toLocaleString('en-IN')
        : rounded.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

    return `${config.symbol}${formatted}`;
  };

  return { formatPrice, currency: config, selectedCurrency };
}

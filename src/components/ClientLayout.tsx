'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { LoadingScreen } from '@/components/LoadingScreen';
import { CurrencyPickerModal } from '@/components/CurrencyPickerModal';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
          <Navbar />
          <CartDrawer />
          <CurrencyPickerModal />

          <main className="flex-grow">
            {children}
          </main>

          <Footer />
          <WhatsAppButton />
        </div>
      )}
    </>
  );
}

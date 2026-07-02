import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cherryvelle',
  description: 'Luxury skincare crafted with nature\'s finest ingredients. Science-backed, cruelty-free, and made for you.',
  icons: {
    icon: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

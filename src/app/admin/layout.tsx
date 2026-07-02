import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Admin Panel – Cherryvelle',
  description: 'Cherryvelle store admin dashboard',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-root">
      {children}
    </div>
  );
}

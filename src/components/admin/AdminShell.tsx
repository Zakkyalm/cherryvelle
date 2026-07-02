'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Bell } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';

interface AdminShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AdminShell({ children, title, subtitle }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const auth = localStorage.getItem('admin_authenticated');
    if (!auth) {
      router.push('/admin/login');
    }
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-[#FAF8F5] overflow-hidden">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-cherry-100 flex items-center px-4 sm:px-6 gap-4 flex-shrink-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-cherry-text hover:text-cherry-dark"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-lg font-semibold text-cherry-dark truncate">{title}</h1>
            {subtitle && <p className="text-xs text-cherry-400 truncate hidden sm:block">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            <button className="relative text-cherry-text hover:text-cherry-dark p-1.5 rounded-lg hover:bg-cherry-50 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-cherry-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cherry-600 to-cherry-800 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, LogOut, AlertCircle } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';

interface AdminShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AdminShell({ children, title, subtitle }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const auth = localStorage.getItem('admin_authenticated');
    if (!auth) {
      router.push('/admin/login');
    }
  }, [router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    router.push('/admin/login');
  };

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-[#FAF8F5] overflow-hidden">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 sm:h-16 bg-white border-b border-cherry-100 flex items-center px-3 sm:px-4 lg:px-6 gap-3 flex-shrink-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-cherry-text hover:text-cherry-dark flex-shrink-0 p-1"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-sm sm:text-base lg:text-lg font-semibold text-cherry-dark truncate">{title}</h1>
            {subtitle && <p className="text-xs text-cherry-400 truncate hidden sm:block">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-cherry-600 to-cherry-800 flex items-center justify-center text-white text-xs font-bold shadow-sm hover:opacity-90 transition-opacity"
                aria-label="Profile menu"
              >
                A
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-xl border border-cherry-100 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-cherry-100">
                    <p className="text-xs font-semibold text-cherry-dark">Administrator</p>
                    <p className="text-[10px] text-cherry-400 mt-0.5">admin@cherryvelle.com</p>
                  </div>
                  <button
                    onClick={() => { setProfileOpen(false); setShowLogoutModal(true); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 xl:p-8">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-red-500" />
              </div>
            </div>
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-cherry-dark mb-2">Sign Out?</h2>
              <p className="text-sm text-cherry-text leading-relaxed">
                Are you sure you want to log out? You will need to sign in again to access the admin panel.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-cherry-200 text-sm font-medium text-cherry-dark hover:bg-cherry-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-sm font-medium text-white hover:bg-red-600 transition-colors shadow-sm shadow-red-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

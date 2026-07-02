'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Images,
  Package,
  Megaphone,
  LogOut,
  ChevronRight,
  X,
  Video,
  Layers,
  AlertCircle,
  BarChart2,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Banners', href: '/admin/banners', icon: Images },
  { label: 'Promo Bar', href: '/admin/promo-bar', icon: Megaphone },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Sections', href: '/admin/sections', icon: Layers },
  { label: 'Videos', href: '/admin/videos', icon: Video },
  { label: 'Reports', href: '/admin/reports', icon: BarChart2 },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = () => {
    localStorage.removeItem('admin_authenticated');
    router.push('/admin/login');
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-cherry-100 z-40 flex flex-col
          transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-cherry-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-cherry-100 shadow-sm flex-shrink-0">
              <Image
                src="/logo.jpg"
                alt="Cherryvelle"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-cherry-dark leading-none">Cherryvelle</p>
              <p className="text-[10px] text-cherry-400 mt-0.5">Admin Panel</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="lg:hidden text-cherry-400 hover:text-cherry-600">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <p className="text-[10px] font-semibold text-cherry-300 uppercase tracking-widest px-3 mb-2">
            Content Management
          </p>
          <ul className="space-y-0.5">
            {navItems.map(({ label, href, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                    ${isActive(href)
                      ? 'bg-cherry-700 text-white shadow-sm shadow-cherry-700/30'
                      : 'text-cherry-text hover:bg-cherry-50 hover:text-cherry-dark'}
                  `}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive(href) ? 'text-white' : 'text-cherry-400 group-hover:text-cherry-600'}`} />
                  {label}
                  {isActive(href) && <ChevronRight className="w-3.5 h-3.5 ml-auto text-white/70" />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-cherry-100 flex-shrink-0">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-8 h-8 rounded-full bg-cherry-100 flex items-center justify-center text-cherry-700 text-xs font-bold">
              A
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-cherry-dark truncate">Administrator</p>
              <p className="text-[10px] text-cherry-400 truncate">admin@cherryvelle.com</p>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />

          {/* Dialog */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-red-500" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-cherry-dark mb-2">
                Sign Out?
              </h2>
              <p className="text-sm text-cherry-text leading-relaxed">
                Are you sure you want to log out? You will need to sign in again to access the admin panel.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-cherry-200 text-sm font-medium text-cherry-dark hover:bg-cherry-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-sm font-medium text-white hover:bg-red-600 transition-colors shadow-sm shadow-red-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

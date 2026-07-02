'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Lock, User } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      // Simple hardcoded credentials – replace with real auth in production
      if (form.username === 'admin' && form.password === 'cherryvelle123') {
        localStorage.setItem('admin_authenticated', 'true');
        router.push('/admin');
      } else {
        setError('Invalid username or password.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cherry-50 via-white to-cherry-100 px-4 py-10">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-cherry-200/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-cherry-300/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cherry-100/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-cherry-100/80 overflow-hidden">

          {/* Top brand stripe */}
          <div className="h-1.5 w-full bg-gradient-to-r from-cherry-600 via-cherry-700 to-cherry-800" />

          <div className="px-8 pt-10 pb-10 sm:px-10">
            {/* Logo + branding */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative w-28 h-28 mb-5">
                {/* Soft glow ring behind logo */}
                <div className="absolute inset-0 rounded-full bg-cherry-100/60 blur-md scale-110" />
                <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-cherry-100 shadow-lg shadow-cherry-200/50">
                  <Image
                    src="/logo.jpg"
                    alt="Cherryvelle"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              <h1 className="text-2xl font-serif text-cherry-dark font-semibold tracking-tight">
                Admin Portal
              </h1>
              <p className="text-cherry-text text-sm mt-1.5 text-center leading-relaxed">
                Sign in to manage your Cherryvelle store
              </p>

              {/* Subtle divider */}
              <div className="flex items-center gap-3 w-full mt-6">
                <div className="flex-1 h-px bg-cherry-100" />
                <span className="text-[10px] font-semibold text-cherry-300 uppercase tracking-widest">
                  Secure Access
                </span>
                <div className="flex-1 h-px bg-cherry-100" />
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-cherry-dark mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cherry-400" />
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-cherry-200 focus:outline-none focus:border-cherry-500 focus:ring-2 focus:ring-cherry-200 transition-all bg-cherry-50/50 text-cherry-dark placeholder:text-cherry-300 text-sm"
                    placeholder="admin"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cherry-dark mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cherry-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-cherry-200 focus:outline-none focus:border-cherry-500 focus:ring-2 focus:ring-cherry-200 transition-all bg-cherry-50/50 text-cherry-dark placeholder:text-cherry-300 text-sm"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cherry-400 hover:text-cherry-600 transition-colors"
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100 flex items-start gap-2"
                >
                  <span className="mt-0.5 flex-shrink-0">⚠️</span>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-cherry-700 to-cherry-800 text-white rounded-xl font-semibold hover:from-cherry-800 hover:to-cherry-900 transition-all shadow-lg shadow-cherry-700/25 disabled:opacity-70 flex items-center justify-center gap-2 text-sm mt-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="text-center text-xs text-cherry-300 mt-6">
              Default: admin / cherryvelle123
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-cherry-300/70 mt-5">
          © {new Date().getFullYear()} Cherryvelle. All rights reserved.
        </p>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import {
  Settings,
  Globe,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Edit2,
  Check,
  X,
  ToggleLeft,
  ToggleRight,
  Info,
} from 'lucide-react';
import { AdminShell } from '@/components/admin/AdminShell';
import {
  useCurrencyStore,
  CurrencyCode,
  AdminRole,
  DEFAULT_CURRENCIES,
} from '@/store/useCurrencyStore';

const PERMISSION_LABELS: Record<string, string> = {
  manageProducts: 'Manage Products',
  manageBanners: 'Manage Banners',
  manageVideos: 'Manage Videos',
  managePromoBar: 'Manage Promo Bar',
  manageSections: 'Manage Sections',
  manageSettings: 'Manage Settings',
};

const ROLE_COLOURS: Record<AdminRole, string> = {
  super_admin: 'bg-cherry-100 text-cherry-800 border-cherry-200',
  content_manager: 'bg-blue-50 text-blue-700 border-blue-200',
  viewer: 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function SettingsPage() {
  const {
    currencies,
    autoDetect,
    rolePermissions,
    toggleCurrencyEnabled,
    updateCurrencyRate,
    setAutoDetect,
    updateRolePermission,
  } = useCurrencyStore();

  const [activeTab, setActiveTab] = useState<'currency' | 'roles'>('currency');
  const [savedBanner, setSavedBanner] = useState(false);
  const [expandedRole, setExpandedRole] = useState<AdminRole | null>('super_admin');
  const [editingRate, setEditingRate] = useState<CurrencyCode | null>(null);
  const [draftRate, setDraftRate] = useState('');

  const showSaved = () => {
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  const handleSaveRate = (code: CurrencyCode) => {
    const parsed = parseFloat(draftRate);
    if (!isNaN(parsed) && parsed > 0) {
      updateCurrencyRate(code, parsed);
      showSaved();
    }
    setEditingRate(null);
    setDraftRate('');
  };

  const handleCancelRate = () => {
    setEditingRate(null);
    setDraftRate('');
  };

  const handleResetCurrencies = () => {
    DEFAULT_CURRENCIES.forEach((c) => {
      updateCurrencyRate(c.code, c.rateFromINR);
    });
    showSaved();
  };

  return (
    <AdminShell title="Settings" subtitle="Manage currency, roles, and access permissions">
      {/* Saved banner */}
      {savedBanner && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-emerald-600 text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg whitespace-nowrap">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          Changes saved
        </div>
      )}

      <div className="max-w-7xl mx-auto">

        {/* Page header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cherry-100 flex items-center justify-center flex-shrink-0">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-cherry-700" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-cherry-dark">Site Settings</h2>
            <p className="text-[11px] sm:text-xs text-cherry-text">Cherryvelle admin configuration</p>
          </div>
        </div>

        {/* Tab bar — full width on mobile, capped on desktop */}
        <div className="flex gap-1 bg-cherry-50 p-1 rounded-xl mb-5 w-full sm:max-w-md">
          <button
            onClick={() => setActiveTab('currency')}
            className={`flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-1 justify-center ${
              activeTab === 'currency'
                ? 'bg-white text-cherry-dark shadow-sm'
                : 'text-cherry-text hover:text-cherry-dark'
            }`}
          >
            <Globe className="w-4 h-4 flex-shrink-0" />
            Currency
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-1 justify-center ${
              activeTab === 'roles'
                ? 'bg-white text-cherry-dark shadow-sm'
                : 'text-cherry-text hover:text-cherry-dark'
            }`}
          >
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            Role Access
          </button>
        </div>

        {/* ── CURRENCY TAB ── */}
        {activeTab === 'currency' && (
          <div className="flex flex-col lg:flex-row gap-5 items-start">

            {/* Main column */}
            <div className="w-full lg:flex-1 min-w-0 space-y-4">

              {/* Auto-detect card */}
              <div className="bg-white rounded-2xl border border-cherry-100 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Globe className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-cherry-dark text-sm">Auto-detect Currency</h3>
                      <p className="text-xs text-cherry-text mt-1 leading-relaxed">
                        Automatically detect the customer&apos;s country and select the matching
                        currency. If detection fails, the currency picker popup will appear.
                      </p>
                    </div>
                  </div>
                  {/* Touch-friendly toggle — min 44px tap target */}
                  <button
                    onClick={() => { setAutoDetect(!autoDetect); showSaved(); }}
                    className="flex-shrink-0 p-1 -mr-1 mt-0.5 touch-manipulation"
                    aria-label="Toggle auto-detect"
                  >
                    {autoDetect ? (
                      <ToggleRight className="w-9 h-9 sm:w-10 sm:h-10 text-cherry-700" />
                    ) : (
                      <ToggleLeft className="w-9 h-9 sm:w-10 sm:h-10 text-cherry-300" />
                    )}
                  </button>
                </div>
                {autoDetect && (
                  <div className="mt-4 flex items-start gap-2 text-xs text-amber-700 bg-amber-50 rounded-xl px-3 sm:px-4 py-3 border border-amber-100">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      Auto-detection uses ipapi.co. If the user&apos;s country doesn&apos;t match INR,
                      USD, or LKR, the picker popup will still appear.
                    </span>
                  </div>
                )}
              </div>

              {/* Currency list card */}
              <div className="bg-white rounded-2xl border border-cherry-100 overflow-hidden">
                {/* Card header */}
                <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 sm:py-4 border-b border-cherry-100">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-cherry-dark text-sm">Supported Currencies</h3>
                    <p className="text-xs text-cherry-text mt-0.5">
                      Enable / disable and set exchange rates{' '}
                      <span className="font-medium text-cherry-dark">(base: INR = 1)</span>
                    </p>
                  </div>
                  <button
                    onClick={handleResetCurrencies}
                    className="flex items-center gap-1.5 text-xs text-cherry-text hover:text-cherry-dark bg-cherry-50 hover:bg-cherry-100 px-3 py-2 rounded-lg transition-colors flex-shrink-0 touch-manipulation"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Reset Rates</span>
                    <span className="xs:hidden">Reset</span>
                  </button>
                </div>

                {/* Currency rows */}
                <div className="divide-y divide-cherry-50">
                  {currencies.map((c) => (
                    <div key={c.code} className="px-4 sm:px-5 py-4">

                      {/* Name row */}
                      <div className="flex items-center gap-3">
                        <span className="text-xl sm:text-2xl leading-none w-7 sm:w-8 text-center flex-shrink-0">
                          {c.flag}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="font-semibold text-cherry-dark text-sm">{c.code}</span>
                            <span className="text-xs text-cherry-text">{c.name}</span>
                            {!c.enabled && (
                              <span className="text-[10px] bg-red-50 text-red-500 border border-red-100 px-1.5 py-0.5 rounded-full font-medium">
                                Disabled
                              </span>
                            )}
                            {c.code === 'INR' && (
                              <span className="text-[10px] text-cherry-500 font-medium">Base currency</span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                            <span className="text-xs text-cherry-text">
                              Symbol:{' '}
                              <span className="font-mono font-semibold text-cherry-dark">{c.symbol}</span>
                            </span>
                            {c.code !== 'INR' && (
                              <span className="text-xs text-cherry-text">
                                1 INR ={' '}
                                <span className="font-medium text-cherry-dark">
                                  {c.rateFromINR} {c.code}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Toggle — 44px touch target */}
                        <button
                          onClick={() => { toggleCurrencyEnabled(c.code as CurrencyCode); showSaved(); }}
                          aria-label={`${c.enabled ? 'Disable' : 'Enable'} ${c.code}`}
                          className="flex-shrink-0 p-1 -mr-1 touch-manipulation"
                        >
                          {c.enabled ? (
                            <ToggleRight className="w-8 h-8 text-cherry-700" />
                          ) : (
                            <ToggleLeft className="w-8 h-8 text-cherry-300" />
                          )}
                        </button>
                      </div>

                      {/* Rate editor — no left indent on mobile to avoid overflow */}
                      {c.code !== 'INR' && (
                        <div className="mt-3 sm:ml-10">
                          {editingRate === c.code ? (
                            <div className="flex items-center gap-2 flex-wrap">
                              <input
                                type="number"
                                step="0.001"
                                min="0.001"
                                value={draftRate}
                                onChange={(e) => setDraftRate(e.target.value)}
                                className="w-28 text-sm px-3 py-2 border border-cherry-300 rounded-lg focus:outline-none focus:border-cherry-500 focus:ring-1 focus:ring-cherry-500"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveRate(c.code as CurrencyCode);
                                  if (e.key === 'Escape') handleCancelRate();
                                }}
                              />
                              <button
                                onClick={() => handleSaveRate(c.code as CurrencyCode)}
                                className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-2 rounded-lg transition-colors font-medium touch-manipulation"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Save
                              </button>
                              <button
                                onClick={handleCancelRate}
                                className="flex items-center gap-1 text-xs text-cherry-text bg-cherry-50 hover:bg-cherry-100 border border-cherry-200 px-3 py-2 rounded-lg transition-colors font-medium touch-manipulation"
                              >
                                <X className="w-3.5 h-3.5" />
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingRate(c.code as CurrencyCode);
                                setDraftRate(String(c.rateFromINR));
                              }}
                              className="flex items-center gap-1.5 text-xs text-cherry-text hover:text-cherry-dark bg-cherry-50 hover:bg-cherry-100 border border-cherry-100 px-3 py-2 rounded-lg transition-colors touch-manipulation"
                            >
                              <Edit2 className="w-3 h-3" />
                              Edit Rate
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar — stacks below on mobile, floats right on desktop */}
            <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-4">

              {/* How currency works */}
              <div className="bg-white rounded-2xl border border-cherry-100 px-4 sm:px-5 py-4 sm:py-5">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-cherry-500 flex-shrink-0" />
                  <p className="font-semibold text-cherry-dark text-sm">How currency works</p>
                </div>
                <ul className="space-y-2 text-xs text-cherry-text">
                  {[
                    'All base prices are stored in INR.',
                    'Exchange rates are applied client-side at display time.',
                    'Customers select their currency via a popup on first visit.',
                    'The selection is saved in localStorage and persists across sessions.',
                    'If auto-detect is on, customers matching IN / US / LK are auto-assigned.',
                    'Disabling a currency removes it from the customer picker.',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-cherry-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick stats — 2-col grid on mobile, list on desktop sidebar */}
              <div className="bg-white rounded-2xl border border-cherry-100 px-4 sm:px-5 py-4 sm:py-5">
                <p className="font-semibold text-cherry-dark text-sm mb-3">Currency Summary</p>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                  {[
                    { label: 'Total', value: currencies.length, colour: 'text-cherry-dark' },
                    { label: 'Enabled', value: currencies.filter((c) => c.enabled).length, colour: 'text-emerald-600' },
                    { label: 'Disabled', value: currencies.filter((c) => !c.enabled).length, colour: 'text-red-500' },
                  ].map(({ label, value, colour }) => (
                    <div key={label} className="flex items-center justify-between lg:flex-row gap-1">
                      <span className="text-xs text-cherry-text">{label}</span>
                      <span className={`text-sm font-semibold ${colour}`}>{value}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between col-span-2 lg:col-span-1">
                    <span className="text-xs text-cherry-text">Auto-detect</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${autoDetect ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {autoDetect ? 'On' : 'Off'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── ROLES TAB ── */}
        {activeTab === 'roles' && (
          <div className="flex flex-col lg:flex-row gap-5 items-start">

            {/* Main column */}
            <div className="w-full lg:flex-1 min-w-0 space-y-4">

              {/* Warning banner */}
              <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 sm:px-5 py-4 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  Role permissions are stored locally and enforced on the admin panel UI.
                  Since this project uses localStorage-based auth, ensure your deployment
                  restricts the admin route at the server level for production use.
                </p>
              </div>

              {rolePermissions.map((rp) => {
                const isExpanded = expandedRole === rp.role;
                const permKeys = Object.keys(rp.permissions) as (keyof typeof rp.permissions)[];
                const enabledCount = permKeys.filter((k) => k in PERMISSION_LABELS && rp.permissions[k]).length;

                return (
                  <div
                    key={rp.role}
                    className="bg-white rounded-2xl border border-cherry-100 overflow-hidden"
                  >
                    {/* Role header — touch-friendly */}
                    <button
                      onClick={() => setExpandedRole(isExpanded ? null : rp.role)}
                      className="w-full flex items-center justify-between px-4 sm:px-5 py-4 text-left hover:bg-cherry-50/60 active:bg-cherry-50 transition-colors gap-3 touch-manipulation"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-cherry-50 flex items-center justify-center flex-shrink-0">
                          <ShieldCheck className="w-4 h-4 text-cherry-400" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="font-semibold text-cherry-dark text-sm">{rp.label}</span>
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${ROLE_COLOURS[rp.role]}`}>
                              {rp.role.replace('_', ' ')}
                            </span>
                          </div>
                          {/* Allow wrapping on mobile instead of truncating */}
                          <p className="text-xs text-cherry-text mt-0.5 line-clamp-2 sm:truncate">{rp.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-cherry-text bg-cherry-50 border border-cherry-100 px-2 py-1 rounded-lg whitespace-nowrap">
                          {enabledCount}/{permKeys.length}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-cherry-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-cherry-400" />
                        )}
                      </div>
                    </button>

                    {/* Permission grid */}
                    {isExpanded && (
                      <div className="border-t border-cherry-100 px-4 sm:px-5 py-4 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
                          {permKeys.filter((key) => key in PERMISSION_LABELS).map((key) => {
                            const enabled = rp.permissions[key];
                            const isSuperAdmin = rp.role === 'super_admin';
                            return (
                              <div
                                key={key}
                                className={`flex items-center justify-between gap-3 px-3 sm:px-4 py-3 rounded-xl border transition-colors ${
                                  enabled ? 'bg-cherry-50 border-cherry-200' : 'bg-gray-50 border-gray-200'
                                }`}
                              >
                                <span className="text-sm text-cherry-dark font-medium leading-snug">
                                  {PERMISSION_LABELS[key]}
                                </span>
                                <button
                                  onClick={() => {
                                    if (!isSuperAdmin) {
                                      updateRolePermission(rp.role, key, !enabled);
                                      showSaved();
                                    }
                                  }}
                                  disabled={isSuperAdmin}
                                  aria-label={`${enabled ? 'Disable' : 'Enable'} ${PERMISSION_LABELS[key]}`}
                                  title={isSuperAdmin ? 'Super Admin always has full access' : undefined}
                                  className={`flex-shrink-0 p-0.5 touch-manipulation ${isSuperAdmin ? 'cursor-not-allowed opacity-60' : ''}`}
                                >
                                  {enabled ? (
                                    <ToggleRight className="w-7 h-7 text-cherry-700" />
                                  ) : (
                                    <ToggleLeft className="w-7 h-7 text-cherry-300" />
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                        {rp.role === 'super_admin' && (
                          <p className="text-xs text-cherry-text pt-1">
                            Super Admin permissions cannot be modified — this role always has full access.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-4">

              {/* Role overview */}
              <div className="bg-white rounded-2xl border border-cherry-100 px-4 sm:px-5 py-4 sm:py-5">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-cherry-500 flex-shrink-0" />
                  <p className="font-semibold text-cherry-dark text-sm">Role Overview</p>
                </div>
                <div className="space-y-3">
                  {[
                    { role: 'super_admin' as AdminRole, label: 'Super Admin', desc: 'Full unrestricted access to all features.' },
                    { role: 'content_manager' as AdminRole, label: 'Content Manager', desc: 'Can manage content but not settings.' },
                    { role: 'viewer' as AdminRole, label: 'Viewer', desc: 'Read-only access to the admin panel.' },
                  ].map((r) => (
                    <div key={r.role} className="flex items-start gap-2.5">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border flex-shrink-0 mt-0.5 ${ROLE_COLOURS[r.role]}`}>
                        {r.label}
                      </span>
                      <p className="text-xs text-cherry-text leading-relaxed">{r.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Permissions summary */}
              <div className="bg-white rounded-2xl border border-cherry-100 px-4 sm:px-5 py-4 sm:py-5">
                <p className="font-semibold text-cherry-dark text-sm mb-3">Permissions Summary</p>
                <div className="space-y-3">
                  {rolePermissions.map((rp) => {
                    const permKeys = Object.keys(rp.permissions) as (keyof typeof rp.permissions)[];
                    const enabledCount = permKeys.filter((k) => k in PERMISSION_LABELS && rp.permissions[k]).length;
                    const total = permKeys.filter((k) => k in PERMISSION_LABELS).length;
                    const pct = total > 0 ? Math.round((enabledCount / total) * 100) : 0;
                    return (
                      <div key={rp.role}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-cherry-dark font-medium">{rp.label}</span>
                          <span className="text-xs text-cherry-text">{enabledCount}/{total}</span>
                        </div>
                        <div className="w-full h-1.5 bg-cherry-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cherry-500 rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </AdminShell>
  );
}

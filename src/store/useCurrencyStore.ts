import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CurrencyCode = 'INR' | 'USD' | 'LKR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  /** Exchange rate relative to INR (INR = 1.0 base) */
  rateFromINR: number;
  enabled: boolean;
  /** ISO 3166-1 alpha-2 country codes that map to this currency */
  countryCodes: string[];
}

export const DEFAULT_CURRENCIES: CurrencyConfig[] = [
  {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    flag: '🇮🇳',
    rateFromINR: 1,
    enabled: true,
    countryCodes: ['IN'],
  },
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    rateFromINR: 0.012,
    enabled: true,
    countryCodes: ['US', 'AS', 'GU', 'MP', 'PR', 'VI', 'UM'],
  },
  {
    code: 'LKR',
    symbol: 'Rs',
    name: 'Sri Lankan Rupee',
    flag: '🇱🇰',
    rateFromINR: 3.65,
    enabled: true,
    countryCodes: ['LK'],
  },
];

export type AdminRole = string; // was: 'super_admin' | 'content_manager' | 'viewer'

export interface RolePermission {
  role: AdminRole;
  label: string;
  description: string;
  /** Built-in roles (super_admin, content_manager, viewer) cannot be deleted */
  isBuiltIn?: boolean;
  permissions: {
    manageProducts: boolean;
    manageBanners: boolean;
    manageVideos: boolean;
    managePromoBar: boolean;
    manageSections: boolean;
    manageSettings: boolean;
  };
}

export const DEFAULT_ROLE_PERMISSIONS: RolePermission[] = [
  {
    role: 'super_admin',
    label: 'Super Admin',
    description: 'Full access to all features and settings',
    isBuiltIn: true,
    permissions: {
      manageProducts: true,
      manageBanners: true,
      manageVideos: true,
      managePromoBar: true,
      manageSections: true,
      manageSettings: true,
    },
  },
  {
    role: 'content_manager',
    label: 'Content Manager',
    description: 'Can manage content but not settings or reports',
    isBuiltIn: true,
    permissions: {
      manageProducts: true,
      manageBanners: true,
      manageVideos: true,
      managePromoBar: true,
      manageSections: true,
      manageSettings: false,
    },
  },
  {
    role: 'viewer',
    label: 'Viewer',
    description: 'Read-only access to all sections',
    isBuiltIn: true,
    permissions: {
      manageProducts: false,
      manageBanners: false,
      manageVideos: false,
      managePromoBar: false,
      manageSections: false,
      manageSettings: false,
    },
  },
];

interface CurrencyState {
  /** Currently selected currency code */
  selectedCurrency: CurrencyCode;
  /** Whether the customer has already made a selection (suppresses popup) */
  hasSelectedCurrency: boolean;
  /** Whether auto-detection is preferred */
  autoDetect: boolean;
  /** Per-currency config (admin can edit rates & toggle enabled) */
  currencies: CurrencyConfig[];
  /** Role permissions (admin managed) */
  rolePermissions: RolePermission[];

  // Customer actions
  selectCurrency: (code: CurrencyCode) => void;
  dismissPicker: () => void;

  // Admin currency actions
  updateCurrencyRate: (code: CurrencyCode, rate: number) => void;
  toggleCurrencyEnabled: (code: CurrencyCode) => void;
  setAutoDetect: (value: boolean) => void;

  // Admin role actions
  updateRolePermission: (
    role: AdminRole,
    permission: keyof RolePermission['permissions'],
    value: boolean
  ) => void;
  addRole: (role: Omit<RolePermission, 'role' | 'isBuiltIn'> & { role?: string }) => void;
  updateRole: (role: AdminRole, updates: Pick<RolePermission, 'label' | 'description'>) => void;
  deleteRole: (role: AdminRole) => void;

  // Helpers
  getCurrencyConfig: (code?: CurrencyCode) => CurrencyConfig;
  getEnabledCurrencies: () => CurrencyConfig[];
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      selectedCurrency: 'INR',
      hasSelectedCurrency: false,
      autoDetect: false,
      currencies: DEFAULT_CURRENCIES,
      rolePermissions: DEFAULT_ROLE_PERMISSIONS,

      selectCurrency: (code) =>
        set({ selectedCurrency: code, hasSelectedCurrency: true }),

      dismissPicker: () => set({ hasSelectedCurrency: true }),

      updateCurrencyRate: (code, rate) =>
        set((s) => ({
          currencies: s.currencies.map((c) =>
            c.code === code ? { ...c, rateFromINR: rate } : c
          ),
        })),

      toggleCurrencyEnabled: (code) =>
        set((s) => ({
          currencies: s.currencies.map((c) =>
            c.code === code ? { ...c, enabled: !c.enabled } : c
          ),
        })),

      setAutoDetect: (value) => set({ autoDetect: value }),

      updateRolePermission: (role, permission, value) =>
        set((s) => ({
          rolePermissions: s.rolePermissions.map((rp) =>
            rp.role === role
              ? { ...rp, permissions: { ...rp.permissions, [permission]: value } }
              : rp
          ),
        })),

      addRole: (newRole) => {
        const uid = () => Math.random().toString(36).slice(2, 9);
        const roleKey = newRole.role
          ? newRole.role
          : newRole.label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') + '_' + uid();
        set((s) => ({
          rolePermissions: [
            ...s.rolePermissions,
            {
              ...newRole,
              role: roleKey,
              isBuiltIn: false,
            } as RolePermission,
          ],
        }));
      },

      updateRole: (role, updates) =>
        set((s) => ({
          rolePermissions: s.rolePermissions.map((rp) =>
            rp.role === role ? { ...rp, ...updates } : rp
          ),
        })),

      deleteRole: (role) =>
        set((s) => ({
          rolePermissions: s.rolePermissions.filter((rp) => rp.role !== role || rp.isBuiltIn),
        })),

      getCurrencyConfig: (code) => {
        const { currencies, selectedCurrency } = get();
        return (
          currencies.find((c) => c.code === (code ?? selectedCurrency)) ??
          currencies[0]
        );
      },

      getEnabledCurrencies: () => get().currencies.filter((c) => c.enabled),
    }),
    {
      name: 'currency-store',
      // Persist everything so admin settings AND customer choice survive reloads
    }
  )
);

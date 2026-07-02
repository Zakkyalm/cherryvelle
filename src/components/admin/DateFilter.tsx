'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';

export type QuickPreset = 'today' | 'last7' | 'thisMonth' | 'thisYear' | 'custom' | 'all';

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface DateFilterValue {
  preset: QuickPreset;
  range: DateRange;
}

interface DateFilterProps {
  value: DateFilterValue;
  onChange: (value: DateFilterValue) => void;
}

const PRESETS: { key: QuickPreset; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'last7', label: 'Last 7 Days' },
  { key: 'thisMonth', label: 'This Month' },
  { key: 'thisYear', label: 'This Year' },
  { key: 'custom', label: 'Custom Range' },
  { key: 'all', label: 'All Time' },
];

export function getDateRangeForPreset(preset: QuickPreset): DateRange {
  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

  switch (preset) {
    case 'today':
      return { from: startOfDay(now), to: endOfDay(now) };
    case 'last7': {
      const from = new Date(now);
      from.setDate(from.getDate() - 6);
      return { from: startOfDay(from), to: endOfDay(now) };
    }
    case 'thisMonth':
      return {
        from: new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0),
        to: endOfDay(now),
      };
    case 'thisYear':
      return {
        from: new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0),
        to: endOfDay(now),
      };
    case 'all':
    default:
      return { from: null, to: null };
  }
}

function formatDate(d: Date | null): string {
  if (!d) return '';
  return d.toISOString().split('T')[0]; // yyyy-mm-dd for input[type=date]
}

function parseDate(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s + 'T00:00:00');
  return isNaN(d.getTime()) ? null : d;
}

function displayLabel(value: DateFilterValue): string {
  if (value.preset === 'all') return 'All Time';
  if (value.preset !== 'custom') {
    return PRESETS.find((p) => p.key === value.preset)?.label ?? 'All Time';
  }
  // custom
  const { from, to } = value.range;
  if (!from && !to) return 'Custom Range';
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  if (from && to) return `${fmt(from)} – ${fmt(to)}`;
  if (from) return `From ${fmt(from)}`;
  if (to) return `Until ${fmt(to)}`;
  return 'Custom Range';
}

export function DateFilter({ value, onChange }: DateFilterProps) {
  const [open, setOpen] = useState(false);
  const [customFrom, setCustomFrom] = useState(formatDate(value.range.from));
  const [customTo, setCustomTo] = useState(formatDate(value.range.to));
  const [dropdownAlign, setDropdownAlign] = useState<'left' | 'right'>('left');
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Determine alignment so the panel stays within the viewport
  useEffect(() => {
    if (!open || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const panelWidth = 320; // w-80 = 20rem = 320px
    const spaceOnRight = window.innerWidth - rect.left;
    setDropdownAlign(spaceOnRight >= panelWidth ? 'left' : 'right');
  }, [open]);

  const selectPreset = (preset: QuickPreset) => {
    if (preset === 'custom') {
      // stay open to let user enter dates
      onChange({ preset: 'custom', range: { from: parseDate(customFrom), to: parseDate(customTo) } });
      return;
    }
    const range = getDateRangeForPreset(preset);
    onChange({ preset, range });
    setOpen(false);
  };

  const applyCustom = () => {
    const from = parseDate(customFrom);
    const to = parseDate(customTo);
    // if to exists, set to end of that day
    const toEndOfDay = to ? new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59, 999) : null;
    onChange({ preset: 'custom', range: { from, to: toEndOfDay } });
    setOpen(false);
  };

  const clearFilter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomFrom('');
    setCustomTo('');
    onChange({ preset: 'all', range: { from: null, to: null } });
  };

  const isActive = value.preset !== 'all';

  return (
    <div className="relative" ref={panelRef}>
      {/* Trigger button */}
      <button
        ref={buttonRef}
        onClick={() => setOpen((o) => !o)}
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all
          ${isActive
            ? 'border-cherry-500 bg-cherry-50 text-cherry-700 shadow-sm'
            : 'border-cherry-200 bg-white text-cherry-text hover:border-cherry-300 hover:text-cherry-dark'}
        `}
      >
        <Calendar className="w-4 h-4 flex-shrink-0" />
        <span className="hidden sm:inline truncate max-w-[160px]">{displayLabel(value)}</span>
        <span className="sm:hidden">Filter</span>
        {isActive ? (
          <button
            onClick={clearFilter}
            className="ml-0.5 text-cherry-400 hover:text-cherry-600 transition-colors"
            aria-label="Clear date filter"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <ChevronDown className={`w-3.5 h-3.5 transition-transform text-cherry-400 ${open ? 'rotate-180' : ''}`} />
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className={`absolute top-full mt-2 z-50 bg-white rounded-2xl shadow-xl border border-cherry-100 w-72 sm:w-80 p-4 animate-in fade-in slide-in-from-top-2 duration-150 ${dropdownAlign === 'right' ? 'right-0' : 'left-0'}`}>
          {/* Quick presets */}
          <p className="text-[10px] font-semibold text-cherry-300 uppercase tracking-widest mb-2.5">
            Quick Filters
          </p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {PRESETS.filter((p) => p.key !== 'custom').map(({ key, label }) => (
              <button
                key={key}
                onClick={() => selectPreset(key)}
                className={`
                  px-3 py-2 rounded-xl text-xs font-medium text-left transition-all border
                  ${value.preset === key
                    ? 'bg-cherry-700 text-white border-cherry-700 shadow-sm'
                    : 'border-cherry-100 text-cherry-text hover:border-cherry-300 hover:bg-cherry-50 hover:text-cherry-dark'}
                `}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Custom range */}
          <div className="border-t border-cherry-100 pt-4">
            <p className="text-[10px] font-semibold text-cherry-300 uppercase tracking-widest mb-2.5">
              Custom Range
            </p>
            <div className="space-y-2.5">
              <div>
                <label className="text-xs text-cherry-text mb-1 block font-medium">From</label>
                <input
                  type="date"
                  value={customFrom}
                  max={customTo || undefined}
                  onChange={(e) => {
                    setCustomFrom(e.target.value);
                    onChange({ preset: 'custom', range: { from: parseDate(e.target.value), to: parseDate(customTo) } });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-cherry-200 text-sm text-cherry-dark bg-white focus:outline-none focus:ring-2 focus:ring-cherry-300 focus:border-cherry-400 transition-all"
                />
              </div>
              <div>
                <label className="text-xs text-cherry-text mb-1 block font-medium">To</label>
                <input
                  type="date"
                  value={customTo}
                  min={customFrom || undefined}
                  onChange={(e) => {
                    setCustomTo(e.target.value);
                    onChange({ preset: 'custom', range: { from: parseDate(customFrom), to: parseDate(e.target.value) } });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-cherry-200 text-sm text-cherry-dark bg-white focus:outline-none focus:ring-2 focus:ring-cherry-300 focus:border-cherry-400 transition-all"
                />
              </div>
              <button
                onClick={applyCustom}
                disabled={!customFrom && !customTo}
                className="w-full py-2.5 rounded-xl bg-cherry-700 text-white text-sm font-semibold hover:bg-cherry-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Apply Range
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

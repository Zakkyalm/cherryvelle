import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}

export function StatCard({ icon: Icon, label, value, sub, color = 'cherry' }: StatCardProps) {
  const colorMap: Record<string, string> = {
    cherry: 'bg-cherry-50 text-cherry-700',
    gold: 'bg-amber-50 text-amber-600',
    green: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-sky-50 text-sky-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-cherry-100 flex items-center gap-4 hover:shadow-sm transition-shadow">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[color] || colorMap.cherry}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-cherry-dark leading-none">{value}</p>
        <p className="text-sm text-cherry-text mt-0.5 font-medium">{label}</p>
        {sub && <p className="text-xs text-cherry-300 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

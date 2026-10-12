// Reusable KPI Stat Card Component

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'green' | 'amber' | 'blue' | 'neutral' | 'red';
  trend?: {
    value: string;
    isPositive: boolean;
  };
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'green',
  trend,
  onClick,
}) => {
  const variantStyles = {
    green: {
      bg: 'bg-white',
      iconBg: 'bg-farm-100 text-farm-800',
      border: 'border-slate-200/90 hover:border-farm-400',
    },
    amber: {
      bg: 'bg-white',
      iconBg: 'bg-amber-100 text-amber-800',
      border: 'border-slate-200/90 hover:border-amber-400',
    },
    blue: {
      bg: 'bg-white',
      iconBg: 'bg-blue-100 text-blue-800',
      border: 'border-slate-200/90 hover:border-blue-400',
    },
    red: {
      bg: 'bg-white',
      iconBg: 'bg-red-100 text-red-800',
      border: 'border-slate-200/90 hover:border-red-400',
    },
    neutral: {
      bg: 'bg-white',
      iconBg: 'bg-slate-100 text-slate-700',
      border: 'border-slate-200/90 hover:border-slate-300',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      onClick={onClick}
      className={`${style.bg} ${style.border} rounded-2xl p-4 sm:p-5 border shadow-xs transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${style.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-2.5">
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </div>

        {(subtitle || trend) && (
          <div className="flex items-center gap-2 mt-1.5">
            {trend && (
              <span
                className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
                  trend.isPositive
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {trend.isPositive ? '+' : ''}{trend.value}
              </span>
            )}
            {subtitle && (
              <span className="text-xs text-slate-500 truncate">{subtitle}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

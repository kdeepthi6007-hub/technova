// Accessible Badge Component for Agricultural Statuses

import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'green' | 'amber' | 'blue' | 'red' | 'purple' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'md',
}) => {
  const variantStyles = {
    green: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    blue: 'bg-sky-100 text-sky-800 border-sky-200',
    red: 'bg-rose-100 text-rose-800 border-rose-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-semibold',
    md: 'text-xs px-2.5 py-1 font-bold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg border ${variantStyles[variant]} ${sizeStyles[size]} tracking-wide`}
    >
      {label}
    </span>
  );
};

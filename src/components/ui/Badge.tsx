import React from 'react';

type BadgeVariant = 'high' | 'medium' | 'low' | 'pending' | 'approved' | 'modified' | 'not_submitted' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
  pending: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  modified: 'bg-orange-100 text-orange-800',
  not_submitted: 'bg-gray-100 text-gray-800',
  default: 'bg-gray-100 text-gray-800',
};

const Badge = React.memo<BadgeProps>(({ variant = 'default', children, className = '' }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';
export default Badge;

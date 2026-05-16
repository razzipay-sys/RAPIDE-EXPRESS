import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-white/10 text-white',
        orange: 'border-transparent bg-rapide-orange-muted text-rapide-orange border-rapide-orange/20',
        success: 'border-transparent bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        warning: 'border-transparent bg-amber-500/10 text-amber-400 border-amber-500/20',
        danger: 'border-transparent bg-red-500/10 text-red-400 border-red-500/20',
        info: 'border-transparent bg-blue-500/10 text-blue-400 border-blue-500/20',
        outline: 'border-white/20 text-white/70',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

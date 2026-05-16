'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import * as React from 'react';

import { cn } from '../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rapide-orange focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 select-none',
  {
    variants: {
      variant: {
        primary:
          'bg-rapide-gradient text-white shadow-rapide hover:shadow-rapide-lg active:scale-[0.98]',
        secondary:
          'bg-dark-surface-2 text-white border border-dark-border hover:border-dark-border-strong hover:bg-dark-surface-3 active:scale-[0.98]',
        ghost:
          'text-white/70 hover:text-white hover:bg-white/5 active:scale-[0.98]',
        outline:
          'border border-rapide-orange/40 text-rapide-orange hover:bg-rapide-orange-muted active:scale-[0.98]',
        danger:
          'bg-red-600/90 text-white hover:bg-red-600 active:scale-[0.98]',
        glass:
          'bg-white/5 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10 active:scale-[0.98]',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-sm',
        lg: 'h-14 px-8 text-base',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };

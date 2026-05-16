'use client';

import * as React from 'react';

import { cn } from '../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, type, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-white/70"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              'flex h-12 w-full rounded-xl border bg-dark-surface-2 px-4 py-2 text-sm text-white',
              'placeholder:text-white/30',
              'border-dark-border focus:border-rapide-orange/60 focus:outline-none focus:ring-2 focus:ring-rapide-orange/20',
              'transition-colors duration-200',
              'disabled:cursor-not-allowed disabled:opacity-50',
              leftIcon && 'pl-11',
              rightIcon && 'pr-11',
              error && 'border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20',
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="text-xs text-white/40">{hint}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };

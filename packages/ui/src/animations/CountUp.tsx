'use client';

import { animate } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface CountUpProps {
  from?: number;
  to: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function CountUp({
  from = 0,
  to,
  duration = 1.5,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const controls = animate(from, to, {
      duration,
      ease: 'easeOut',
      onUpdate(value) {
        node.textContent = prefix + value.toFixed(decimals) + suffix;
      },
    });

    return () => controls.stop();
  }, [from, to, duration, decimals, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {from.toFixed(decimals)}
      {suffix}
    </span>
  );
}

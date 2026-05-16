'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';

interface RiderPosition {
  riderId: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  timestamp: string;
}

interface UseRiderTrackingOptions {
  deliveryId: string;
  enabled?: boolean;
}

export function useRiderTracking({ deliveryId, enabled = true }: UseRiderTrackingOptions) {
  const [position, setPosition] = useState<RiderPosition | null>(null);
  const [smoothPosition, setSmoothPosition] = useState<{ lat: number; lng: number } | null>(null);
  const animFrameRef = useRef<number>(0);
  const targetRef = useRef<{ lat: number; lng: number } | null>(null);
  const currentRef = useRef<{ lat: number; lng: number } | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // Lerp animation loop for smooth marker movement
  const animatePosition = useCallback(() => {
    if (!targetRef.current || !currentRef.current) return;

    const LERP_FACTOR = 0.08;
    const newLat = currentRef.current.lat + (targetRef.current.lat - currentRef.current.lat) * LERP_FACTOR;
    const newLng = currentRef.current.lng + (targetRef.current.lng - currentRef.current.lng) * LERP_FACTOR;

    const delta = Math.abs(newLat - targetRef.current.lat) + Math.abs(newLng - targetRef.current.lng);
    if (delta > 0.000001) {
      currentRef.current = { lat: newLat, lng: newLng };
      setSmoothPosition({ lat: newLat, lng: newLng });
      animFrameRef.current = requestAnimationFrame(animatePosition);
    } else {
      currentRef.current = targetRef.current;
      setSmoothPosition(targetRef.current);
    }
  }, []);

  useEffect(() => {
    if (!enabled || !deliveryId) return;

    const channel = supabase
      .channel(`delivery:${deliveryId}`)
      .on('broadcast', { event: 'rider_location' }, ({ payload }: { payload: RiderPosition }) => {
        setPosition(payload);
        targetRef.current = { lat: payload.latitude, lng: payload.longitude };

        if (!currentRef.current) {
          currentRef.current = { lat: payload.latitude, lng: payload.longitude };
          setSmoothPosition(currentRef.current);
        }

        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = requestAnimationFrame(animatePosition);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [deliveryId, enabled, supabase, animatePosition]);

  return { position, smoothPosition };
}

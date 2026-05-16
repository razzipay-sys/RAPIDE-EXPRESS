'use client';

import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';

interface Delivery {
  id: string;
  trackingCode: string;
  status: string;
  pickupAddress: string;
  dropoffAddress: string;
  totalFare: number;
  currency: string;
  estimatedMinutes?: number;
  rider?: {
    id: string;
    rating: number;
    vehicleType: string;
    user: { fullName: string; avatarUrl?: string };
  };
  timeline: Array<{
    id: string;
    status: string;
    description?: string;
    createdAt: string;
  }>;
  createdAt: string;
}

export function useDelivery() {
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDelivery = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ data: Delivery }>(`/deliveries/${id}`);
      setDelivery(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMyDeliveries = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ data: Delivery[] }>(`/deliveries/me?page=${page}`);
      setDeliveries(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createDelivery = useCallback(async (payload: Record<string, unknown>) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.post<{ data: Delivery }>('/deliveries', payload);
      setDelivery(res.data);
      return res.data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la création';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { delivery, deliveries, isLoading, error, fetchDelivery, fetchMyDeliveries, createDelivery };
}

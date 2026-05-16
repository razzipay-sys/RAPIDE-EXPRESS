import { create } from 'zustand';
import type { ParcelCategory, PaymentMethod } from '@rapide/types';

export interface WizardAddresses {
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  pickupContactName: string;
  pickupContactPhone: string;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  recipientName: string;
  recipientPhone: string;
}

export interface WizardParcel {
  parcelCategory: ParcelCategory | null;
  weightKg: number | null;
  deliveryNotes: string;
  parcelImageUrl: string | null;
}

export interface WizardOptions {
  isPriority: boolean;
  isInsured: boolean;
  isScheduled: boolean;
  scheduledFor: string | null;
}

export interface WizardPricing {
  baseFare: number;
  distanceFare: number;
  weightSurcharge: number;
  surgeMultiplier: number;
  priorityPremium: number;
  insuranceFee: number;
  totalFare: number;
  distanceKm: number;
  estimatedMinutes: number;
  currency: string;
}

export interface WizardPayment {
  paymentMethod: PaymentMethod | null;
}

interface DeliveryWizardState {
  currentStep: number;
  addresses: WizardAddresses;
  parcel: WizardParcel;
  options: WizardOptions;
  pricing: WizardPricing | null;
  payment: WizardPayment;
  isSubmitting: boolean;

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setAddresses: (addresses: Partial<WizardAddresses>) => void;
  setParcel: (parcel: Partial<WizardParcel>) => void;
  setOptions: (options: Partial<WizardOptions>) => void;
  setPricing: (pricing: WizardPricing) => void;
  setPayment: (payment: Partial<WizardPayment>) => void;
  setSubmitting: (submitting: boolean) => void;
  reset: () => void;
}

const initialAddresses: WizardAddresses = {
  pickupAddress: '',
  pickupLat: 0,
  pickupLng: 0,
  pickupContactName: '',
  pickupContactPhone: '',
  dropoffAddress: '',
  dropoffLat: 0,
  dropoffLng: 0,
  recipientName: '',
  recipientPhone: '',
};

const initialParcel: WizardParcel = {
  parcelCategory: null,
  weightKg: null,
  deliveryNotes: '',
  parcelImageUrl: null,
};

const initialOptions: WizardOptions = {
  isPriority: false,
  isInsured: false,
  isScheduled: false,
  scheduledFor: null,
};

const initialPayment: WizardPayment = {
  paymentMethod: null,
};

export const useDeliveryWizardStore = create<DeliveryWizardState>((set) => ({
  currentStep: 1,
  addresses: initialAddresses,
  parcel: initialParcel,
  options: initialOptions,
  pricing: null,
  payment: initialPayment,
  isSubmitting: false,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 5) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),
  setAddresses: (a) => set((s) => ({ addresses: { ...s.addresses, ...a } })),
  setParcel: (p) => set((s) => ({ parcel: { ...s.parcel, ...p } })),
  setOptions: (o) => set((s) => ({ options: { ...s.options, ...o } })),
  setPricing: (pricing) => set({ pricing }),
  setPayment: (p) => set((s) => ({ payment: { ...s.payment, ...p } })),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  reset: () =>
    set({
      currentStep: 1,
      addresses: initialAddresses,
      parcel: initialParcel,
      options: initialOptions,
      pricing: null,
      payment: initialPayment,
      isSubmitting: false,
    }),
}));

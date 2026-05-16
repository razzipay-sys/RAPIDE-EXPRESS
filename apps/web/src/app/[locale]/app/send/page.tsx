'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useDeliveryWizardStore } from '@/store/delivery-wizard.store';
import { useDelivery } from '@/hooks/useDelivery';
import { apiClient } from '@/lib/api';
import { formatXOF } from '@rapide/utils';
import { ParcelCategory, PaymentMethod } from '@rapide/types';

const TOTAL_STEPS = 5;

const PARCEL_CATEGORIES = [
  { value: ParcelCategory.DOCUMENTS, label: 'Documents', icon: '📄' },
  { value: ParcelCategory.ELECTRONICS, label: 'Électronique', icon: '📱' },
  { value: ParcelCategory.FOOD, label: 'Alimentation', icon: '🍔' },
  { value: ParcelCategory.CLOTHING, label: 'Vêtements', icon: '👕' },
  { value: ParcelCategory.MEDICINE, label: 'Médicaments', icon: '💊' },
  { value: ParcelCategory.FRAGILE, label: 'Fragile', icon: '🔮' },
  { value: ParcelCategory.CASH, label: 'Espèces', icon: '💵' },
  { value: ParcelCategory.OTHER, label: 'Autre', icon: '📦' },
];

const PAYMENT_METHODS = [
  { value: PaymentMethod.MOBILE_MONEY, label: 'Mobile Money', desc: 'MTN, Moov, Wave', icon: '📲' },
  { value: PaymentMethod.WALLET, label: 'Portefeuille Rapide', desc: 'Solde disponible', icon: '💳' },
  { value: PaymentMethod.CASH_ON_DELIVERY, label: 'Paiement à la livraison', desc: 'En espèces', icon: '💵' },
];

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5 px-4 py-4">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
            i < current ? 'bg-rapide-orange' : i === current - 1 ? 'bg-rapide-orange' : 'bg-white/10'
          }`}
        />
      ))}
    </div>
  );
}

function Step1Addresses() {
  const { addresses, setAddresses, nextStep } = useDeliveryWizardStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!addresses.pickupAddress) errs.pickupAddress = 'Requis';
    if (!addresses.dropoffAddress) errs.dropoffAddress = 'Requis';
    if (!addresses.recipientPhone) errs.recipientPhone = 'Requis';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) nextStep();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-white/50 font-medium block mb-1.5">Adresse de collecte *</label>
        <input
          value={addresses.pickupAddress}
          onChange={(e) => setAddresses({ pickupAddress: e.target.value, pickupLat: 6.3654, pickupLng: 2.3158 })}
          placeholder="Ex: Rue du Commerce, Cotonou"
          className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder-white/30 focus:outline-none focus:border-rapide-orange transition-colors text-sm"
        />
        {errors.pickupAddress && <p className="text-red-400 text-xs mt-1">{errors.pickupAddress}</p>}
      </div>

      <div>
        <label className="text-xs text-white/50 font-medium block mb-1.5">Contact collecte</label>
        <input
          value={addresses.pickupContactName}
          onChange={(e) => setAddresses({ pickupContactName: e.target.value })}
          placeholder="Nom du contact"
          className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder-white/30 focus:outline-none focus:border-rapide-orange transition-colors text-sm mb-2"
        />
        <input
          value={addresses.pickupContactPhone}
          onChange={(e) => setAddresses({ pickupContactPhone: e.target.value })}
          placeholder="Téléphone du contact"
          type="tel"
          className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder-white/30 focus:outline-none focus:border-rapide-orange transition-colors text-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-white/10" />
        <div className="h-6 w-6 rounded-full bg-rapide-orange/20 border border-rapide-orange/30 flex items-center justify-center">
          <svg className="h-3 w-3 text-rapide-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <div>
        <label className="text-xs text-white/50 font-medium block mb-1.5">Adresse de livraison *</label>
        <input
          value={addresses.dropoffAddress}
          onChange={(e) => setAddresses({ dropoffAddress: e.target.value, dropoffLat: 6.3700, dropoffLng: 2.3200 })}
          placeholder="Ex: Akpakpa, Cotonou"
          className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder-white/30 focus:outline-none focus:border-rapide-orange transition-colors text-sm"
        />
        {errors.dropoffAddress && <p className="text-red-400 text-xs mt-1">{errors.dropoffAddress}</p>}
      </div>

      <div>
        <label className="text-xs text-white/50 font-medium block mb-1.5">Destinataire *</label>
        <input
          value={addresses.recipientName}
          onChange={(e) => setAddresses({ recipientName: e.target.value })}
          placeholder="Nom complet"
          className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder-white/30 focus:outline-none focus:border-rapide-orange transition-colors text-sm mb-2"
        />
        <input
          value={addresses.recipientPhone}
          onChange={(e) => setAddresses({ recipientPhone: e.target.value })}
          placeholder="Téléphone *"
          type="tel"
          className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder-white/30 focus:outline-none focus:border-rapide-orange transition-colors text-sm"
        />
        {errors.recipientPhone && <p className="text-red-400 text-xs mt-1">{errors.recipientPhone}</p>}
      </div>

      <button
        onClick={handleNext}
        className="w-full h-12 rounded-xl bg-rapide-gradient font-semibold text-white shadow-rapide hover:shadow-rapide-lg transition-all"
      >
        Continuer →
      </button>
    </div>
  );
}

function Step2Parcel() {
  const { parcel, setParcel, nextStep, prevStep } = useDeliveryWizardStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!parcel.parcelCategory) errs.category = 'Choisissez une catégorie';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs text-white/50 font-medium block mb-3">Catégorie du colis *</label>
        <div className="grid grid-cols-4 gap-2">
          {PARCEL_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setParcel({ parcelCategory: cat.value })}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                parcel.parcelCategory === cat.value
                  ? 'border-rapide-orange bg-rapide-orange-muted'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="text-[10px] text-white/70 text-center leading-tight">{cat.label}</span>
            </button>
          ))}
        </div>
        {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
      </div>

      <div>
        <label className="text-xs text-white/50 font-medium block mb-1.5">Poids estimé (kg)</label>
        <input
          type="number"
          value={parcel.weightKg ?? ''}
          onChange={(e) => setParcel({ weightKg: e.target.value ? Number(e.target.value) : null })}
          placeholder="Optionnel"
          min={0}
          step={0.1}
          className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder-white/30 focus:outline-none focus:border-rapide-orange transition-colors text-sm"
        />
      </div>

      <div>
        <label className="text-xs text-white/50 font-medium block mb-1.5">Instructions pour le coursier</label>
        <textarea
          value={parcel.deliveryNotes}
          onChange={(e) => setParcel({ deliveryNotes: e.target.value })}
          placeholder="Ex: Fragile, appeler avant la livraison..."
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-rapide-orange transition-colors text-sm resize-none"
        />
      </div>

      <div className="flex gap-3">
        <button onClick={prevStep} className="flex-1 h-12 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all">
          ← Retour
        </button>
        <button
          onClick={() => { if (validate()) nextStep(); }}
          className="flex-2 flex-[2] h-12 rounded-xl bg-rapide-gradient font-semibold text-white shadow-rapide hover:shadow-rapide-lg transition-all"
        >
          Continuer →
        </button>
      </div>
    </div>
  );
}

function Step3Options() {
  const { options, setOptions, nextStep, prevStep } = useDeliveryWizardStore();

  return (
    <div className="space-y-4">
      <div
        onClick={() => setOptions({ isPriority: !options.isPriority })}
        className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
          options.isPriority ? 'border-rapide-orange bg-rapide-orange-muted' : 'border-white/10 bg-white/5'
        }`}
      >
        <span className="text-2xl">⚡</span>
        <div className="flex-1">
          <p className="text-white font-medium text-sm">Livraison express</p>
          <p className="text-white/40 text-xs">Priorité haute — +30% du tarif</p>
        </div>
        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
          options.isPriority ? 'border-rapide-orange bg-rapide-orange' : 'border-white/20'
        }`}>
          {options.isPriority && <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
        </div>
      </div>

      <div
        onClick={() => setOptions({ isInsured: !options.isInsured })}
        className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
          options.isInsured ? 'border-blue-400 bg-blue-500/10' : 'border-white/10 bg-white/5'
        }`}
      >
        <span className="text-2xl">🛡️</span>
        <div className="flex-1">
          <p className="text-white font-medium text-sm">Assurance colis</p>
          <p className="text-white/40 text-xs">Protection jusqu&apos;à 500 000 XOF — +5% du tarif</p>
        </div>
        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
          options.isInsured ? 'border-blue-400 bg-blue-400' : 'border-white/20'
        }`}>
          {options.isInsured && <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
        </div>
      </div>

      <div
        onClick={() => setOptions({ isScheduled: !options.isScheduled })}
        className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
          options.isScheduled ? 'border-purple-400 bg-purple-500/10' : 'border-white/10 bg-white/5'
        }`}
      >
        <span className="text-2xl">🗓️</span>
        <div className="flex-1">
          <p className="text-white font-medium text-sm">Livraison programmée</p>
          <p className="text-white/40 text-xs">Choisissez l&apos;heure de collecte</p>
        </div>
        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
          options.isScheduled ? 'border-purple-400 bg-purple-400' : 'border-white/20'
        }`}>
          {options.isScheduled && <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
        </div>
      </div>

      {options.isScheduled && (
        <input
          type="datetime-local"
          value={options.scheduledFor ?? ''}
          onChange={(e) => setOptions({ scheduledFor: e.target.value })}
          className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-rapide-orange transition-colors text-sm"
        />
      )}

      <div className="flex gap-3">
        <button onClick={prevStep} className="flex-1 h-12 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all">
          ← Retour
        </button>
        <button onClick={nextStep} className="flex-[2] h-12 rounded-xl bg-rapide-gradient font-semibold text-white shadow-rapide hover:shadow-rapide-lg transition-all">
          Voir le tarif →
        </button>
      </div>
    </div>
  );
}

function Step4Pricing() {
  const { addresses, parcel, options, pricing, setPricing, nextStep, prevStep } = useDeliveryWizardStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (pricing) return;

    const estimate = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await apiClient.post<{ data: typeof pricing }>('/pricing/estimate', {
          pickupLat: addresses.pickupLat,
          pickupLng: addresses.pickupLng,
          dropoffLat: addresses.dropoffLat,
          dropoffLng: addresses.dropoffLng,
          parcelCategory: parcel.parcelCategory,
          weightKg: parcel.weightKg,
          isPriority: options.isPriority,
          isInsured: options.isInsured,
        });
        if (res.data) setPricing(res.data);
      } catch {
        setError('Impossible de calculer le tarif. Réessayez.');
      } finally {
        setIsLoading(false);
      }
    };

    estimate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="h-8 w-8 rounded-full border-2 border-rapide-orange border-t-transparent animate-spin" />
        <p className="text-white/50 text-sm">Calcul du tarif...</p>
      </div>
    );
  }

  if (error || !pricing) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <p className="text-red-400 text-sm">{error || 'Erreur de calcul'}</p>
        <button onClick={prevStep} className="text-white/50 text-sm hover:text-white">← Retour</button>
      </div>
    );
  }

  const rows = [
    { label: 'Tarif de base', value: formatXOF(pricing.baseFare) },
    { label: 'Distance (km)', value: formatXOF(pricing.distanceFare) },
    ...(pricing.weightSurcharge > 0 ? [{ label: 'Supplément poids', value: formatXOF(pricing.weightSurcharge) }] : []),
    ...(pricing.surgeActive ? [{ label: `Surge ×${pricing.surgeMultiplier}`, value: '—' }] : []),
    ...(pricing.priorityPremium > 0 ? [{ label: 'Express', value: formatXOF(pricing.priorityPremium) }] : []),
    ...(pricing.insuranceFee > 0 ? [{ label: 'Assurance', value: formatXOF(pricing.insuranceFee) }] : []),
  ];

  return (
    <div className="space-y-4">
      <div className="bg-dark-surface border border-white/[0.06] rounded-2xl p-5 space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-white/50 text-sm">{row.label}</span>
            <span className="text-white text-sm">{row.value}</span>
          </div>
        ))}
        <div className="border-t border-white/[0.06] pt-3 flex items-center justify-between">
          <span className="font-semibold text-white">Total</span>
          <span className="font-bold text-rapide-orange text-lg">{formatXOF(pricing.totalFare)}</span>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2">
        <svg className="h-4 w-4 text-rapide-orange flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-white/60 text-xs">Livraison estimée en <span className="text-white font-medium">{pricing.estimatedMinutes} min</span></p>
      </div>

      <div className="flex gap-3">
        <button onClick={prevStep} className="flex-1 h-12 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all">
          ← Retour
        </button>
        <button onClick={nextStep} className="flex-[2] h-12 rounded-xl bg-rapide-gradient font-semibold text-white shadow-rapide hover:shadow-rapide-lg transition-all">
          Payer {formatXOF(pricing.totalFare)} →
        </button>
      </div>
    </div>
  );
}

function Step5Payment() {
  const { payment, setPayment, pricing, addresses, parcel, options, isSubmitting, setSubmitting, reset } =
    useDeliveryWizardStore();
  const { createDelivery } = useDelivery();
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!payment.paymentMethod) { setError('Choisissez un mode de paiement'); return; }
    setError('');
    setSubmitting(true);
    try {
      const delivery = await createDelivery({
        pickupAddress: addresses.pickupAddress,
        pickupLat: addresses.pickupLat,
        pickupLng: addresses.pickupLng,
        pickupContactName: addresses.pickupContactName,
        pickupContactPhone: addresses.pickupContactPhone,
        dropoffAddress: addresses.dropoffAddress,
        dropoffLat: addresses.dropoffLat,
        dropoffLng: addresses.dropoffLng,
        recipientName: addresses.recipientName,
        recipientPhone: addresses.recipientPhone,
        parcelCategory: parcel.parcelCategory,
        weightKg: parcel.weightKg,
        deliveryNotes: parcel.deliveryNotes,
        isPriority: options.isPriority,
        isInsured: options.isInsured,
        isScheduled: options.isScheduled,
        scheduledFor: options.scheduledFor,
        paymentMethod: payment.paymentMethod,
      });
      reset();
      router.push(`/app/track/${delivery.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la commande');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {PAYMENT_METHODS.map((method) => (
          <div
            key={method.value}
            onClick={() => setPayment({ paymentMethod: method.value })}
            className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
              payment.paymentMethod === method.value
                ? 'border-rapide-orange bg-rapide-orange-muted'
                : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}
          >
            <span className="text-2xl">{method.icon}</span>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{method.label}</p>
              <p className="text-white/40 text-xs">{method.desc}</p>
            </div>
            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
              payment.paymentMethod === method.value ? 'border-rapide-orange bg-rapide-orange' : 'border-white/20'
            }`}>
              {payment.paymentMethod === method.value && (
                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              )}
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      {pricing && (
        <div className="bg-dark-surface border border-white/[0.06] rounded-xl p-3 flex items-center justify-between">
          <span className="text-white/50 text-sm">Total à payer</span>
          <span className="font-bold text-rapide-orange">{formatXOF(pricing.totalFare)}</span>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isSubmitting || !payment.paymentMethod}
        className="w-full h-12 rounded-xl bg-rapide-gradient font-semibold text-white shadow-rapide hover:shadow-rapide-lg transition-all disabled:opacity-50"
      >
        {isSubmitting ? 'Traitement...' : 'Confirmer la commande'}
      </button>
    </div>
  );
}

const STEPS = [
  { title: 'Adresses', component: Step1Addresses },
  { title: 'Colis', component: Step2Parcel },
  { title: 'Options', component: Step3Options },
  { title: 'Tarif', component: Step4Pricing },
  { title: 'Paiement', component: Step5Payment },
];

export default function SendPage() {
  const { currentStep } = useDeliveryWizardStore();
  const StepComponent = STEPS[currentStep - 1]?.component ?? Step1Addresses;

  return (
    <div className="min-h-full bg-dark flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="font-display font-bold text-white text-xl">Envoyer un colis</h1>
        </div>
        <p className="text-white/40 text-xs">Étape {currentStep} sur {TOTAL_STEPS} — {STEPS[currentStep - 1]?.title}</p>
      </div>

      <StepIndicator current={currentStep} total={TOTAL_STEPS} />

      <div className="flex-1 px-4 pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <StepComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

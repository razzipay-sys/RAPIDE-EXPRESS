import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function roundToNearest5(n: number): number {
  return Math.round(n / 5) * 5;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { pickupLat, pickupLng, dropoffLat, dropoffLng, parcelCategory, weightKg, isPriority, isInsured } = body;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Find applicable pricing zone
    const { data: zones } = await supabase
      .from('pricing_zones')
      .select('*')
      .eq('is_active', true)
      .limit(1);

    const zone = zones?.[0] ?? { base_fare: 500, per_km_rate: 150, min_fare: 500, currency: 'XOF' };

    const distanceKm = haversineKm(pickupLat, pickupLng, dropoffLat, dropoffLng);
    const baseFare = Number(zone.base_fare);
    const distanceFare = distanceKm * Number(zone.per_km_rate);

    // Weight surcharge (>= 5kg: +250 XOF)
    const weightSurcharge = weightKg >= 5 ? 250 : 0;

    // Surge from Redis (simplified — read from DB surge_config if available)
    const surgeMultiplier = 1.0;
    const surgeActive = false;

    const baseTotal = (baseFare + distanceFare + weightSurcharge) * surgeMultiplier;
    const priorityPremium = isPriority ? baseTotal * 0.3 : 0;
    const insuranceFee = isInsured ? Math.max(500, baseTotal * 0.05) : 0;

    const totalFare = Math.max(
      Number(zone.min_fare),
      roundToNearest5(baseTotal + priorityPremium + insuranceFee),
    );

    const platformFee = roundToNearest5(totalFare * 0.2);
    const riderEarning = totalFare - platformFee;
    const estimatedMinutes = Math.round(distanceKm * 3 + 5);

    return new Response(
      JSON.stringify({
        data: {
          baseFare,
          distanceFare: roundToNearest5(distanceFare),
          weightSurcharge,
          surgeMultiplier,
          surgeActive,
          priorityPremium: roundToNearest5(priorityPremium),
          insuranceFee: roundToNearest5(insuranceFee),
          totalFare,
          platformFee,
          riderEarning,
          currency: zone.currency ?? 'XOF',
          distanceKm: Math.round(distanceKm * 100) / 100,
          estimatedMinutes,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});

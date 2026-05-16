import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// This edge function is called by a Postgres AFTER INSERT trigger on deliveries
// to fan-out the dispatch job to the NestJS API queue.
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { record } = await req.json();
    const deliveryId = record?.id;

    if (!deliveryId) {
      return new Response(JSON.stringify({ error: 'No delivery ID' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Notify the NestJS API to queue the dispatch job
    const apiUrl = Deno.env.get('API_INTERNAL_URL');
    if (apiUrl) {
      await fetch(`${apiUrl}/api/v1/internal/dispatch/${deliveryId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Key': Deno.env.get('API_INTERNAL_SECRET') ?? '',
        },
      });
    }

    return new Response(JSON.stringify({ status: 'dispatched', deliveryId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});

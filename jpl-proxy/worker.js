const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, OPTIONS',
  'access-control-allow-headers': 'Accept',
  'cache-control': 'public, max-age=300',
  'vary': 'Origin',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'content-type': 'application/json; charset=utf-8' },
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/sbdb') return json({ error: 'Not found.' }, 404);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });
    if (request.method !== 'GET') return json({ error: 'Use GET for object search.' }, 405);

    const query = url.searchParams.get('query')?.trim();
    if (!query) return json({ error: 'Enter an object name or designation.' }, 400);
    if (query.length > 120) return json({ error: 'Search is limited to 120 characters.' }, 400);

    const target = new URL('https://ssd-api.jpl.nasa.gov/sbdb.api');
    target.searchParams.set('sstr', query);
    target.searchParams.set('full-prec', 'true');
    try {
      const upstream = await fetch(target, { headers: { Accept: 'application/json' } });
      return new Response(await upstream.text(), {
        status: upstream.status,
        headers: { ...corsHeaders, 'content-type': 'application/json; charset=utf-8' },
      });
    } catch {
      return json({ error: 'Could not reach JPL right now. Try again shortly.' }, 502);
    }
  },
};

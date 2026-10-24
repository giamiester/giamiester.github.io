async function proxyJpl(query) {
  if (!query) return Response.json({ error: 'Enter an object name or designation.' }, { status: 400 });
  if (query.length > 120) return Response.json({ error: 'Search is limited to 120 characters.' }, { status: 400 });

  const target = new URL('https://ssd-api.jpl.nasa.gov/sbdb.api');
  target.searchParams.set('sstr', query);
  target.searchParams.set('full-prec', 'true');
  try {
    const upstream = await fetch(target, { headers: { Accept: 'application/json' } });
    return new Response(await upstream.text(), {
      status: upstream.status,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=300' },
    });
  } catch {
    return Response.json({ error: 'Could not reach JPL right now. Try again shortly.' }, { status: 502 });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/sbdb') {
      if (request.method !== 'GET') return Response.json({ error: 'Use GET for object search.' }, { status: 405 });
      return proxyJpl(url.searchParams.get('query')?.trim() || '');
    }
    return env.ASSETS.fetch(request);
  },
};

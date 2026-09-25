// Railway health check.
export const GET = () => new Response('ok', { headers: { 'cache-control': 'no-store' } });

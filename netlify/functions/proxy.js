export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get('url');

  if (!target) {
    return new Response('Missing url parameter', { status: 400 });
  }

  // Only allow http(s) URLs
  if (!/^https?:\/\//i.test(target)) {
    return new Response('Invalid URL', { status: 400 });
  }

  const upstream = await fetch(target);
  const body = await upstream.arrayBuffer();

  return new Response(body, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') ?? 'application/octet-stream',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export const config = {
  path: '/proxy',
};

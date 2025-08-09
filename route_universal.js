// app/api/handy/route.js
import { NextResponse } from 'next/server';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, X-Connection-Key'
};

function json(data, status = 200) {
  return new NextResponse(JSON.stringify(data, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors }
  });
}

export async function GET() {
  return json({ ok: true, hint: 'POST { action: "edge" | "deny" | "let-me-come" } to control Handy.' });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: cors });
}

export async function POST(req) {
  // Try to read JSON; fall back to text
  let body = null;
  try { body = await req.json(); } catch {}
  if (!body) {
    try { const text = await req.text(); body = JSON.parse(text || '{}'); } catch { body = {}; }
  }

  const action = (body?.action || '').toString();

  const map = {
    'edge':        { speed: 25, stroke: 90, message: 'Starting edge routine' },
    'deny':        { speed: 5,  stroke: 40, message: 'Denied. Slow + short.' },
    'let-me-come': { speed: 35, stroke: 100, message: 'Letting you finish…' },
  };
  const params = map[action] || { speed: 20, stroke: 80, message: 'Default stroking' };

  const apiKey   = process.env.HANDY_API_KEY || '';
  const deviceId = process.env.HANDY_DEVICE_ID || '';

  // Demo if missing key
  if (!apiKey) {
    return json({
      ok: true,
      mode: 'demo',
      received: { action },
      wouldSend: { speed: params.speed, stroke: params.stroke, deviceId: deviceId || '(none)' },
      message: params.message,
      note: 'Add HANDY_API_KEY (and HANDY_DEVICE_ID) in Vercel to control the device.'
    });
  }

  try {
    // Example API endpoint; some accounts use different paths/naming.
    const endpoint = 'https://www.handyfeeling.com/api/handy/v2/setMode';
    const payload = {
      mode: 1, // example mode
      speed: params.speed,
      stroke: params.stroke
    };
    // Include both headers (some variants expect one or the other)
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey
    };
    if (deviceId) {
      headers['X-Connection-Key'] = deviceId;
    }

    const r = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    return json({
      ok: r.ok,
      received: { action },
      sent: { ...payload, headersSent: Object.keys(headers) },
      apiEndpoint: endpoint,
      apiResponse: data
    }, r.ok ? 200 : r.status || 502);
  } catch (e) {
    return json({
      ok: false,
      error: e?.message || String(e),
      received: { action },
      tried: { speed: params.speed, stroke: params.stroke, deviceId: deviceId || null }
    }, 500);
  }
}

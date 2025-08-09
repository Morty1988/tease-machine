import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('mode') || 'edge';
  const apiKey = process.env.HANDY_API_KEY;

  // Demo-modus hvis ingen API-nøkkel
  if (!apiKey) {
    return NextResponse.json({
      mode,
      demo: true,
      wouldSend: commandForMode(mode)
    });
  }

  try {
    const response = await fetch('https://www.handyfeeling.com/api/v1/set-mode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
      body: JSON.stringify(commandForMode(mode))
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function commandForMode(mode) {
  switch (mode) {
    case 'edge':
      return { speed: 30, stroke: 80 };
    case 'deny':
      return { speed: 0, stroke: 0 };
    case 'come':
      return { speed: 80, stroke: 100 };
    default:
      return { speed: 20, stroke: 50 };
  }
}

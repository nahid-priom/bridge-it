import { NextResponse } from 'next/server';
import {
  getSoftwareDemoConfigBySlug,
  getSoftwareDemoSnapshot,
  initSoftwareDemoSession,
} from '@/lib/services/software-demo.service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const demoSlug = searchParams.get('demoSlug');
  const sessionId = searchParams.get('sessionId');

  if (!demoSlug || !sessionId) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  const config = await getSoftwareDemoConfigBySlug(demoSlug);
  if (!config) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await initSoftwareDemoSession(config.id, sessionId, config.business_type);
  const snapshot = await getSoftwareDemoSnapshot(config.id, sessionId);

  return NextResponse.json({ config, snapshot });
}

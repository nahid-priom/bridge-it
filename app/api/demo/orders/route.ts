import { NextResponse } from 'next/server';
import { getDemoConfigBySlug, getDemoOrdersBySession } from '@/lib/services/ecommerce-demo.service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const demoSlug = searchParams.get('demoSlug');
  const sessionId = searchParams.get('sessionId');

  if (!demoSlug || !sessionId) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  const config = await getDemoConfigBySlug(demoSlug);
  if (!config) return NextResponse.json({ orders: [] });

  const orders = await getDemoOrdersBySession(config.id, sessionId);
  return NextResponse.json({ orders });
}

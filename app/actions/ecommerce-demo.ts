'use server';

import { getDemoConfigBySlug, createDemoOrder } from '@/lib/services/ecommerce-demo.service';

export async function submitDemoOrderAction(input: {
  demoSlug: string;
  sessionId: string;
  customer_name: string;
  customer_phone: string;
  customer_address?: string;
  quantity: number;
  product_name: string;
  product_slug?: string;
  unit_price: number;
}) {
  const config = await getDemoConfigBySlug(input.demoSlug);
  if (!config) return { error: 'Demo not found' };

  const order = await createDemoOrder({
    demo_config_id: config.id,
    session_id: input.sessionId,
    customer_name: input.customer_name,
    customer_phone: input.customer_phone,
    customer_address: input.customer_address,
    items: [
      {
        product_name: input.product_name,
        product_slug: input.product_slug,
        quantity: input.quantity,
        unit_price: input.unit_price,
      },
    ],
  });

  if (!order) return { error: 'Failed to create demo order' };
  return { orderNumber: order.order_number, orderId: order.id };
}

export async function submitDemoCartOrderAction(input: {
  demoSlug: string;
  sessionId: string;
  customer_name: string;
  customer_phone: string;
  customer_address?: string;
  items: { product_name: string; product_slug?: string; quantity: number; unit_price: number; variant_label?: string }[];
}) {
  const config = await getDemoConfigBySlug(input.demoSlug);
  if (!config) return { error: 'Demo not found' };

  const order = await createDemoOrder({
    demo_config_id: config.id,
    session_id: input.sessionId,
    customer_name: input.customer_name,
    customer_phone: input.customer_phone,
    customer_address: input.customer_address,
    items: input.items,
  });

  if (!order) return { error: 'Failed to create demo order' };
  return { orderNumber: order.order_number, orderId: order.id };
}

export async function updateDemoCourierStatusAction(orderId: string, status: string, courierStatus?: string) {
  const { updateDemoOrderStatus } = await import('@/lib/services/ecommerce-demo.service');
  const ok = await updateDemoOrderStatus(orderId, status, courierStatus);
  return { success: ok };
}

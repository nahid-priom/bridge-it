'use client';

import { useTransition } from 'react';
import { updateWebsiteOrderStatusAction } from '@/app/actions/ecommerce-showcase';
import { WEBSITE_ORDER_STATUSES } from '../config/constants';
import type { WebsiteOrder } from '../types';
import { isShowcaseEditorRole } from '../config/roles';
import type { AuthProfile } from '@/lib/auth/types';
import { FieldSelect } from '@/components/ui/FieldSelect';
import { formatBdt } from '@/lib/format/currency';

export function WebsiteOrderInbox({
  orders,
  profile,
}: {
  orders: WebsiteOrder[];
  profile: AuthProfile;
}) {
  const canEdit = isShowcaseEditorRole(profile.role);
  const [pending, startTransition] = useTransition();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-black">Website orders</h1>
      <div className="overflow-x-auto rounded-2xl border border-border-subtle">
        <table className="w-full text-sm">
          <thead className="border-b border-border-subtle text-left text-text-muted">
            <tr>
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Website</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border-subtle align-top">
                <td className="p-3 font-mono text-xs">{order.order_number}</td>
                <td className="p-3">
                  <p className="font-semibold">{order.customer_name}</p>
                  <p className="text-xs text-text-muted">{order.phone}</p>
                  {order.business_name ? (
                    <p className="text-xs text-text-muted">{order.business_name}</p>
                  ) : null}
                </td>
                <td className="p-3">
                  <p>{order.project_title}</p>
                  <p className="text-xs text-text-muted">{order.package_name}</p>
                </td>
                <td className="p-3">{formatBdt(order.amount)}</td>
                <td className="p-3">
                  {canEdit ? (
                    <FieldSelect
                      defaultValue={order.status}
                      disabled={pending}
                      onChange={(event) =>
                        startTransition(async () => {
                          await updateWebsiteOrderStatusAction(
                            order.id,
                            event.target.value as WebsiteOrder['status']
                          );
                        })
                      }
                      className="px-2 py-1"
                    >
                      {WEBSITE_ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status.replace('_', ' ')}
                        </option>
                      ))}
                    </FieldSelect>
                  ) : (
                    order.status
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 ? <p className="p-6 text-sm text-text-muted">No website orders yet.</p> : null}
      </div>
    </div>
  );
}

'use client';

import { useTransition } from 'react';
import { updateLeadStatusAction } from '@/app/actions/ecommerce-showcase';
import { LEAD_STATUSES } from '../config/constants';
import type { ProjectLead } from '../types';
import { isShowcaseEditorRole } from '../config/roles';
import type { AuthProfile } from '@/lib/auth/types';
import { FieldSelect } from '@/components/ui/FieldSelect';

export function LeadInbox({ leads, profile }: { leads: ProjectLead[]; profile: AuthProfile }) {
  const canEdit = isShowcaseEditorRole(profile.role);
  const [pending, startTransition] = useTransition();

  return (
    <div>
      <h1 className="font-display text-2xl font-black mb-6">Project leads</h1>
      <div className="overflow-x-auto rounded-2xl border border-border-subtle">
        <table className="w-full text-sm">
          <thead className="text-left text-text-muted border-b border-border-subtle">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Business</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-border-subtle align-top">
                <td className="p-3">
                  <p className="font-semibold">{lead.name}</p>
                  {lead.message ? <p className="text-xs text-text-muted mt-1 max-w-xs">{lead.message}</p> : null}
                </td>
                <td className="p-3">{lead.phone}</td>
                <td className="p-3">{lead.business_name ?? '—'}</td>
                <td className="p-3">
                  {canEdit ? (
                    <FieldSelect
                      defaultValue={lead.status}
                      disabled={pending}
                      onChange={(event) =>
                        startTransition(async () => {
                          await updateLeadStatusAction(lead.id, event.target.value as ProjectLead['status']);
                        })
                      }
                      className="px-2 py-1"
                    >
                      {LEAD_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status.replace('_', ' ')}
                        </option>
                      ))}
                    </FieldSelect>
                  ) : (
                    lead.status
                  )}
                </td>
                <td className="p-3 text-text-muted">{new Date(lead.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 ? <p className="p-6 text-sm text-text-muted">No leads yet.</p> : null}
      </div>
    </div>
  );
}

-- Client dashboard data is served via marketplace_orders / marketplace_wallets (unified migration).
-- Demo fallback remains in lib/client-dashboard/demo-data.ts when no rows exist for the buyer.

-- Example: insert wallet for a buyer
-- insert into public.client_wallets (client_id, balance, pending_balance)
-- values ('<user-uuid>', 48500, 18500)
-- on conflict (client_id) do nothing;

comment on table public.client_projects is 'Buyer client portal — active freelance projects';
comment on table public.client_orders is 'Buyer orders for services and products';

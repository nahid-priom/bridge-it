-- Allow authenticated users to read consultation requests that match their profile contact info.
drop policy if exists "Users read own consultation requests" on public.consultation_requests;
create policy "Users read own consultation requests"
  on public.consultation_requests for select
  to authenticated
  using (
    (
      email is not null
      and email = (select p.email from public.profiles p where p.id = auth.uid())
    )
    or (
      phone is not null
      and phone = (select p.phone from public.profiles p where p.id = auth.uid())
    )
  );

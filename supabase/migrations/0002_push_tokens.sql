create table if not exists public.push_tokens (
  user_id uuid not null references auth.users (id) on delete cascade,
  token text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, token)
);

alter table public.push_tokens enable row level security;
create policy "owner can manage their tokens" on public.push_tokens
for all using (user_id = auth.uid()) with check (user_id = auth.uid());
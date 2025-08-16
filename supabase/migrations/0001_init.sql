-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Profiles table referencing auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  full_name text,
  role text not null default 'customer' check (role in ('admin','customer')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are viewable by user or admin" on public.profiles
for select using (
  auth.uid() = id or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "user can update own profile" on public.profiles
for update using (auth.uid() = id);

-- Products
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'usd',
  image_url text,
  active boolean not null default true,
  stock integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "products are viewable by all" on public.products for select using (true);

create policy "only admin can insert products" on public.products for insert
with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

create policy "only admin can update products" on public.products for update using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Orders
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  total_cents integer not null,
  currency text not null default 'usd',
  status text not null default 'pending' check (status in ('pending','paid','failed','refunded')),
  payment_intent_id text,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "orders viewable by owner or admin" on public.orders for select using (
  user_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

create policy "owner can insert own order" on public.orders for insert with check (user_id = auth.uid());

-- Notifications (for realtime/edge function triggers)
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null,
  payload jsonb not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;
create policy "notifications readable by owner" on public.notifications for select using (user_id = auth.uid());
create policy "notifications insert by edge function" on public.notifications for insert with check (true);

-- Storage bucket suggestion (create in dashboard): product-images
-- RLS can be configured via storage policies UI

-- Trigger to keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_set_updated_at before update on public.products
for each row execute function public.set_updated_at();
-- ============================================================
-- Meridian — Supabase şeması
-- Supabase Dashboard > SQL Editor içine yapıştırıp çalıştırın.
-- ============================================================

-- 1) CATEGORIES
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

alter table public.categories enable row level security;

create policy "Herkes kategorileri görebilir"
  on public.categories for select
  using (true);

-- 2) PRODUCTS
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories (id) on delete set null,
  name text not null,
  slug text not null unique,
  price numeric(10, 2) not null default 0,
  stock integer not null default 0,
  description text not null default '',
  images text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Herkes ürünleri görebilir"
  on public.products for select
  using (true);

-- 3) PROFILES — her auth.users kaydı için otomatik oluşturulur
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Kullanıcılar kendi profilini görebilir"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Kullanıcılar kendi profilini güncelleyebilir"
  on public.profiles for update
  using (auth.uid() = id);

-- Yeni bir auth.users kaydı oluştuğunda (e-posta/şifre veya Google ile
-- kayıt) otomatik olarak profiles tablosuna bir satır ekler.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4) ORDERS
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'beklemede',
  total_amount numeric(10, 2) not null default 0,
  currency text not null default 'try',
  shipping_address text not null default '',
  stripe_checkout_session_id text,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "Kullanıcılar kendi siparişini oluşturabilir"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Kullanıcılar kendi siparişlerini görebilir"
  on public.orders for select
  using (auth.uid() = user_id);

-- NOT: update/delete için herhangi bir public politika yok. Sipariş
-- durumu (ödendi/kargoda/vb.) sadece Stripe webhook'unun kullandığı
-- service role anahtarıyla değiştirilebilir — bu RLS'i tamamen bypass
-- eder, bu yüzden ayrı bir "update" politikasına gerek yoktur.

-- 5) ORDER_ITEMS
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  unit_price numeric(10, 2) not null,
  quantity integer not null default 1
);

alter table public.order_items enable row level security;

create policy "Kullanıcılar kendi sipariş kalemlerini oluşturabilir"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and orders.user_id = auth.uid()
    )
  );

create policy "Kullanıcılar kendi sipariş kalemlerini görebilir"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and orders.user_id = auth.uid()
    )
  );

-- 6) Stok düşürme fonksiyonu — webhook'tan çağrılır (service role ile,
-- RLS bypass edilir), tek bir atomik UPDATE ile negatif stoğu önler.
create or replace function public.decrement_stock(p_product_id uuid, p_quantity integer)
returns void
language sql
as $$
  update public.products
  set stock = greatest(stock - p_quantity, 0)
  where id = p_product_id;
$$;

-- 7) İndeksler
create index if not exists products_category_idx on public.products (category_id);
create index if not exists orders_user_idx on public.orders (user_id);
create index if not exists order_items_order_idx on public.order_items (order_id);

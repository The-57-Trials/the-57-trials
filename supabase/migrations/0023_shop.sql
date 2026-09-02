-- 0023: the Trial Shop (D17). Milestone merch at 15/30/45(*) moves from
-- included to earned-right-to-buy — see docs/00-decisions.md D17 and
-- docs/04-product.md 4.6. (*45's actual free item, the Trial Blazer
-- hoodie, is unaffected — it's earned via the bonus trial, not the shop.)
--
-- MODEL ONLY. No checkout is wired here on purpose — merch still needs
-- real quotes (doc 14 gate 1.4) before prices are anything but
-- placeholders, and a shop selling placeholder prices is worse than no
-- shop. When checkout is built, follow the existing create-checkout /
-- billing-portal edge function pattern (service role only touches
-- shop_orders; Stripe is the source of truth for payment state) rather
-- than a client-callable RPC that could be spoofed into marking an order
-- paid.

create table public.shop_products (
  id           integer generated always as identity primary key,
  code         text not null unique,
  title        text not null,
  description  text not null default '',
  unlocked_at  integer not null references public.trials(num),
  price_pence  integer,  -- null = not yet priced; never show as buyable until set
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

alter table public.shop_products enable row level security;

-- Browsing the shop needs no special access — the trial-reached and
-- active-Circuit-Pass gates apply to purchasing, not looking.
create policy shop_products_select on public.shop_products
  for select to authenticated
  using (active);

grant select (id, code, title, description, unlocked_at, price_pence)
  on public.shop_products to authenticated;

create table public.shop_orders (
  id                  bigint generated always as identity primary key,
  user_id             uuid not null references public.profiles(id) on delete cascade,
  product_id          integer not null references public.shop_products(id),
  status              text not null default 'pending'
                        check (status in ('pending', 'paid', 'shipped', 'cancelled')),
  stripe_payment_intent_id text,
  ship_to_name        text,
  ship_to_line1       text,
  ship_to_line2       text,
  ship_to_city        text,
  ship_to_postcode    text,
  ship_to_country     text,
  created_at          timestamptz not null default now(),
  shipped_at          timestamptz
);

alter table public.shop_orders enable row level security;

create policy shop_orders_select on public.shop_orders
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

grant select (id, product_id, status, created_at, shipped_at)
  on public.shop_orders to authenticated;
-- No insert/update grant to authenticated: orders are written by the
-- checkout edge function (service role) once it exists, exactly like
-- entry_paid/circuit_active are today. A member can look, never write.

-- Seed the three shop-eligible milestones. Prices null until quoted.
insert into public.shop_products (code, title, description, unlocked_at) values
  ('BIB',   'The Bib',            'A real race bib, correct material, permanent number, 5757 in the corner. Posted flat.', 15),
  ('PATCH', 'Patch + Stamped Card', 'Records your bib number and the date you cleared Trial 30.', 30);

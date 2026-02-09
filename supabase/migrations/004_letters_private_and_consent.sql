-- Private letters (not shown on wall) and promotional use consent
alter table public.letters
  add column if not exists is_private boolean not null default false,
  add column if not exists promo_consent boolean not null default false;

comment on column public.letters.is_private is 'When true, letter is not shown on the public wall.';
comment on column public.letters.promo_consent is 'User agreed that their submission may be used in promotional content.';

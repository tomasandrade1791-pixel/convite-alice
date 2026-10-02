-- Painel administrativo do Convite Alice
-- Execute este arquivo UMA VEZ no SQL Editor do Supabase.
-- O painel usa autenticação do Supabase e só libera leitura/edição para:
-- tomasandrade1791@gmail.com

create extension if not exists pgcrypto;

create table if not exists public.alice_evento (
  id integer primary key default 1 check (id = 1),
  data_evento text not null default '2026-10-25',
  horario text not null default 'A definir',
  local text not null default 'Rua Leoberto Leal, 250 — Vorstadt',
  updated_at timestamptz not null default now()
);

insert into public.alice_evento (id, data_evento, horario, local)
values (1, '2026-10-25', 'A definir', 'Rua Leoberto Leal, 250 — Vorstadt')
on conflict (id) do nothing;

create table if not exists public.alice_presentes (
  id bigint generated always as identity primary key,
  categoria text not null,
  nome text not null unique,
  quantidade integer not null default 0 check (quantidade >= 0),
  updated_at timestamptz not null default now()
);

insert into public.alice_presentes (categoria, nome, quantidade) values
('🍼 Higiene e cuidados','Pacote de fraldas M',5),
('🍼 Higiene e cuidados','Pacote de fraldas G',5),
('🍼 Higiene e cuidados','Pacote de fraldas XG',5),
('🍼 Higiene e cuidados','Lenços umedecidos',0),
('🍼 Higiene e cuidados','Sabonete líquido para bebê',0),
('🍼 Higiene e cuidados','Creme/pomada para assaduras',0),
('🍼 Higiene e cuidados','Kit de higiene para bebê',0),
('🍼 Higiene e cuidados','Fraldas de pano',0),
('👕 Roupinhas','Meias',0),
('👕 Roupinhas','Casaquinho',0),
('👕 Roupinhas','Touquinha',0),
('👕 Roupinhas','Babadores',0),
('🛁 Banho','Toalha de banho',0),
('🛁 Banho','Toalha com capuz',0),
('🛁 Banho','Kit de toalhinhas',0),
('🍼 Alimentação','Escova para mamadeira',0),
('🍼 Alimentação','Babador impermeável',0),
('🍼 Alimentação','Paninhos de boca',0),
('🛏️ Quarto e sono','Lençol para berço',0),
('🛏️ Quarto e sono','Protetor de colchão',0),
('🛏️ Quarto e sono','Manta',0),
('🛏️ Quarto e sono','Cueiro',0),
('🛏️ Quarto e sono','Cobertor apropriado para bebê',0),
('🎀 Presentes especiais','Manta personalizada',0),
('🎀 Presentes especiais','Toalha personalizada',0),
('🎀 Presentes especiais','Kit de saída da maternidade',0),
('🎀 Presentes especiais','Vale-presente de loja infantil',0),
('⭐ Opção livre','Presente escolhido livremente — algo que o convidado considere útil para a Alice ou a mamãe.',0)
on conflict (nome) do nothing;

create table if not exists public.alice_confirmacoes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  confirmou boolean not null,
  presentes text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.alice_mensagens (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  mensagem text not null,
  created_at timestamptz not null default now()
);

alter table public.alice_evento enable row level security;
alter table public.alice_presentes enable row level security;
alter table public.alice_confirmacoes enable row level security;
alter table public.alice_mensagens enable row level security;

drop policy if exists evento_public_read on public.alice_evento;
drop policy if exists evento_admin_write on public.alice_evento;
drop policy if exists presentes_public_read on public.alice_presentes;
drop policy if exists presentes_admin_write on public.alice_presentes;
drop policy if exists confirmacoes_public_insert on public.alice_confirmacoes;
drop policy if exists confirmacoes_admin_read on public.alice_confirmacoes;
drop policy if exists mensagens_public_insert on public.alice_mensagens;
drop policy if exists mensagens_admin_read on public.alice_mensagens;

create policy evento_public_read on public.alice_evento
for select to anon, authenticated using (true);

create policy evento_admin_write on public.alice_evento
for all to authenticated
using ((select auth.jwt() ->> 'email') = 'tomasandrade1791@gmail.com')
with check ((select auth.jwt() ->> 'email') = 'tomasandrade1791@gmail.com');

create policy presentes_public_read on public.alice_presentes
for select to anon, authenticated using (true);

create policy presentes_admin_write on public.alice_presentes
for all to authenticated
using ((select auth.jwt() ->> 'email') = 'tomasandrade1791@gmail.com')
with check ((select auth.jwt() ->> 'email') = 'tomasandrade1791@gmail.com');

create policy confirmacoes_public_insert on public.alice_confirmacoes
for insert to anon, authenticated
with check (char_length(trim(nome)) > 0 and cardinality(presentes) <= 20);

create policy confirmacoes_admin_read on public.alice_confirmacoes
for select to authenticated
using ((select auth.jwt() ->> 'email') = 'tomasandrade1791@gmail.com');

create policy mensagens_public_insert on public.alice_mensagens
for insert to anon, authenticated
with check (char_length(trim(nome)) > 0 and char_length(trim(mensagem)) between 1 and 500);

create policy mensagens_admin_read on public.alice_mensagens
for select to authenticated
using ((select auth.jwt() ->> 'email') = 'tomasandrade1791@gmail.com');

grant select on public.alice_evento, public.alice_presentes to anon, authenticated;
grant insert on public.alice_confirmacoes, public.alice_mensagens to anon, authenticated;
grant select on public.alice_confirmacoes, public.alice_mensagens to authenticated;
grant update on public.alice_evento, public.alice_presentes to authenticated;
grant insert, delete on public.alice_presentes to authenticated;

create or replace function public.alice_get_presentes()
returns table (nome text, quantidade integer, reservados bigint)
language sql
security definer
set search_path = public
as $$
  select p.nome,
         p.quantidade,
         count(c.id) filter (where c.confirmou and p.nome = any(c.presentes))::bigint as reservados
  from public.alice_presentes p
  left join public.alice_confirmacoes c on true
  group by p.id, p.nome, p.quantidade
  order by p.id;
$$;

grant execute on function public.alice_get_presentes() to anon, authenticated;

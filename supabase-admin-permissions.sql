-- CORREÇÃO DAS PERMISSÕES DO ADMIN — Convite Alice
-- IMPORTANTE: este SQL NÃO apaga nem reseta dados.
-- Ele apenas libera o acesso correto às tabelas que o convite já usa.
-- Execute UMA VEZ no SQL Editor do Supabase.

alter table public.alice_evento enable row level security;
alter table public.alice_presentes enable row level security;
alter table public.alice_confirmacoes enable row level security;
alter table public.alice_mensagens enable row level security;

-- Remove somente as políticas com estes nomes, se já existirem.
drop policy if exists "Admin read event" on public.alice_evento;
drop policy if exists "Admin update event" on public.alice_evento;
drop policy if exists "Admin read gifts" on public.alice_presentes;
drop policy if exists "Admin update gifts" on public.alice_presentes;
drop policy if exists "Admin read confirmations" on public.alice_confirmacoes;
drop policy if exists "Public insert confirmations" on public.alice_confirmacoes;
drop policy if exists "Admin read messages" on public.alice_mensagens;
drop policy if exists "Public insert messages" on public.alice_mensagens;

-- EVENTO: somente o Admin lê/altera.
create policy "Admin read event"
on public.alice_evento
for select
to authenticated
using ((select auth.jwt() ->> 'email') = 'tomasandrade1791@gmail.com');

create policy "Admin update event"
on public.alice_evento
for update
to authenticated
using ((select auth.jwt() ->> 'email') = 'tomasandrade1791@gmail.com')
with check ((select auth.jwt() ->> 'email') = 'tomasandrade1791@gmail.com');

-- PRESENTES: somente o Admin lê/altera quantidades.
create policy "Admin read gifts"
on public.alice_presentes
for select
to authenticated
using ((select auth.jwt() ->> 'email') = 'tomasandrade1791@gmail.com');

create policy "Admin update gifts"
on public.alice_presentes
for update
to authenticated
using ((select auth.jwt() ->> 'email') = 'tomasandrade1791@gmail.com')
with check ((select auth.jwt() ->> 'email') = 'tomasandrade1791@gmail.com');

-- CONFIRMAÇÕES: convidados podem inserir; somente o Admin lê.
create policy "Public insert confirmations"
on public.alice_confirmacoes
for insert
to anon, authenticated
with check (true);

create policy "Admin read confirmations"
on public.alice_confirmacoes
for select
to authenticated
using ((select auth.jwt() ->> 'email') = 'tomasandrade1791@gmail.com');

-- CARTINHAS: convidados podem inserir; somente o Admin lê.
create policy "Public insert messages"
on public.alice_mensagens
for insert
to anon, authenticated
with check (true);

create policy "Admin read messages"
on public.alice_mensagens
for select
to authenticated
using ((select auth.jwt() ->> 'email') = 'tomasandrade1791@gmail.com');

-- Garante os privilégios SQL necessários sem conceder leitura ao anon.
grant select, update on public.alice_evento to authenticated;
grant select, update on public.alice_presentes to authenticated;
grant select on public.alice_confirmacoes to authenticated;
grant insert on public.alice_confirmacoes to anon, authenticated;
grant select on public.alice_mensagens to authenticated;
grant insert on public.alice_mensagens to anon, authenticated;

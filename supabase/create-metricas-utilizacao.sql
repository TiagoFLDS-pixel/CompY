-- Cria a tabela de monitorizacao agregada e anonima de utilizacao da CompY.
-- Este script nao recolhe medicamentos, pares pesquisados, utilizadores, IP,
-- localizacao, user agent, cookies ou identificadores persistentes.

begin;

create extension if not exists pgcrypto;

create table if not exists public.metricas_utilizacao (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),
  numero_medicamentos smallint not null,
  numero_pares smallint not null,
  tem_incompatibilidade boolean not null default false,
  tem_variavel boolean not null default false,
  tem_sem_dados boolean not null default false,
  base_consultada text not null check (
    base_consultada in ('supabase', 'fallback_local')
  ),
  versao_base date not null default date '2026-05-09'
);

alter table public.metricas_utilizacao enable row level security;

revoke all on public.metricas_utilizacao from anon;
revoke all on public.metricas_utilizacao from authenticated;

grant insert on public.metricas_utilizacao to anon;
grant insert on public.metricas_utilizacao to authenticated;

drop policy if exists "Permitir insert anonimo de metricas agregadas" on public.metricas_utilizacao;

create policy "Permitir insert anonimo de metricas agregadas"
on public.metricas_utilizacao
for insert
to anon, authenticated
with check (
  numero_medicamentos between 2 and 6
  and numero_pares between 1 and 15
  and base_consultada in ('supabase', 'fallback_local')
  and versao_base = date '2026-05-09'
);

commit;

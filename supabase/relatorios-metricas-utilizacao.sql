-- Relatorios agregados de utilizacao da CompY.
-- Executar no Supabase SQL Editor com uma conta autorizada.

-- Total de consultas registadas.
select count(*) as total_consultas
from public.metricas_utilizacao;

-- Consultas por semana.
select
  date_trunc('week', criado_em) as semana,
  count(*) as total_consultas
from public.metricas_utilizacao
group by semana
order by semana;

-- Consultas por mes.
select
  date_trunc('month', criado_em) as mes,
  count(*) as total_consultas
from public.metricas_utilizacao
group by mes
order by mes;

-- Media de medicamentos por consulta.
select
  round(avg(numero_medicamentos)::numeric, 2) as media_medicamentos
from public.metricas_utilizacao;

-- Media de pares por consulta.
select
  round(avg(numero_pares)::numeric, 2) as media_pares
from public.metricas_utilizacao;

-- Percentagem de consultas com pelo menos uma incompatibilidade.
select
  round(100.0 * avg(case when tem_incompatibilidade then 1 else 0 end), 1) as percentagem_com_incompatibilidade
from public.metricas_utilizacao;

-- Percentagem de consultas com pelo menos um resultado variavel.
select
  round(100.0 * avg(case when tem_variavel then 1 else 0 end), 1) as percentagem_com_variavel
from public.metricas_utilizacao;

-- Percentagem de consultas com pelo menos um par sem dados.
select
  round(100.0 * avg(case when tem_sem_dados then 1 else 0 end), 1) as percentagem_com_sem_dados
from public.metricas_utilizacao;

-- Distribuicao por base tecnica consultada.
select
  base_consultada,
  count(*) as total_consultas
from public.metricas_utilizacao
group by base_consultada
order by total_consultas desc;

-- Relatorios agregados de utilizacao da CompY.
-- Executar no Supabase SQL Editor com conta autorizada.
-- As consultas nao devolvem medicamentos, pares pesquisados, IPs ou utilizadores.

-- Volume total por tipo de evento.
select
  event_name,
  count(*) as total_eventos
from public.usage_events
group by event_name
order by total_eventos desc;

-- Frequencia diaria de uso.
select
  date_trunc('day', occurred_at) as dia,
  event_name,
  count(*) as total_eventos
from public.usage_events
group by dia, event_name
order by dia desc, event_name;

-- Analises por semana e dispositivo aproximado.
select
  date_trunc('week', occurred_at) as semana,
  device_type,
  count(*) as total_analises,
  round(avg(selected_count)::numeric, 2) as media_medicamentos,
  round(avg(pair_count)::numeric, 2) as media_pares
from public.usage_events
where event_name = 'analysis_run'
group by semana, device_type
order by semana desc, device_type;

-- Totais agregados por categoria de resultado.
select
  count(*) as total_analises,
  coalesce(sum(pair_count), 0) as pares_avaliados,
  coalesce(sum(compatible_count), 0) as compativeis,
  coalesce(sum(incompatible_count), 0) as incompativeis,
  coalesce(sum(variable_count), 0) as variaveis,
  coalesce(sum(no_data_count), 0) as sem_dados,
  coalesce(sum(alert_count), 0) as alertas_relevantes
from public.usage_events
where event_name = 'analysis_run';

-- Percentagem de analises com pelo menos um par sem dados.
select
  round(
    100.0 * avg(case when no_data_count > 0 then 1 else 0 end),
    1
  ) as percentagem_analises_com_sem_dados
from public.usage_events
where event_name = 'analysis_run';

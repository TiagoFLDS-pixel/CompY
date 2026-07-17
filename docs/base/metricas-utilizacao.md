# Métricas anónimas de utilização

## Objetivo

Registar volume e frequência de uso da CompY para relatórios institucionais, sem guardar dados de doentes, prescrições reais, profissionais, medicamentos selecionados ou pares exatos.

## Arquitetura proposta

- A app envia eventos agregados para a Edge Function `log-usage`.
- A Edge Function valida o payload, rejeita qualquer campo não permitido e insere em `public.usage_events`.
- A tabela `usage_events` tem RLS ativo e não concede leitura ou escrita pública.
- A chave `service_role` fica apenas no backend da Edge Function, configurada como segredo Supabase.
- O browser usa apenas a chave pública anon existente para chamar a Edge Function.
- A Edge Function só devolve CORS para origens permitidas.
- O corpo do pedido é limitado a 8192 bytes e deve usar `Content-Type: application/json`.

## Eventos registados

- `app_open`
- `analysis_run`
- `alert_expanded`
- `base_status_viewed`

## Payload permitido

Campos comuns:

```json
{
  "event_name": "app_open",
  "timestamp": "2026-07-04T12:00:00.000Z",
  "app_version": "CompY v0.9.0-beta",
  "base_version": "2026-05-09",
  "environment": "protótipo/demonstração",
  "device_type": "desktop"
}
```

Campos adicionais de `analysis_run`:

```json
{
  "event_name": "analysis_run",
  "timestamp": "2026-07-04T12:00:00.000Z",
  "app_version": "CompY v0.9.0-beta",
  "base_version": "2026-05-09",
  "environment": "protótipo/demonstração",
  "device_type": "mobile",
  "selected_count": 4,
  "pair_count": 6,
  "compatible_count": 2,
  "incompatible_count": 1,
  "variable_count": 1,
  "no_data_count": 2,
  "alert_count": 3
}
```

## Dados que não são registados

- Nome, número ou identificador de doente.
- Nome ou identificador de profissional.
- IP completo.
- Texto livre.
- Medicamentos selecionados.
- Pares exatos de medicamentos.
- Diagnósticos, prescrições ou qualquer dado clínico individual.

## Como desativar métricas

No ficheiro `config.supabase.js`, definir:

```js
window.METRICS_ENABLED = false;
```

Quando desativadas, a app não envia eventos.

Na fase pré-ativação, as métricas devem permanecer desativadas.

## Controlos pré-ativação

- Origem permitida: `https://tiagoflds-pixel.github.io`.
- Tamanho máximo do payload: 8192 bytes.
- Métodos permitidos: `POST` e `OPTIONS`.
- `POST` exige `Content-Type: application/json`.
- Campos fora da whitelist são rejeitados.
- Eventos fora da whitelist são rejeitados.
- Contadores devem ser inteiros, não negativos e dentro dos limites definidos.
- Para `analysis_run`, a soma dos resultados deve bater certo com `pair_count`.

## Como aplicar a infraestrutura

1. Rever `supabase/create-usage-events.sql`.
2. Executar o SQL no Supabase com conta autorizada.
3. Publicar a Edge Function `supabase/functions/log-usage`.
4. Configurar os segredos da Edge Function:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Confirmar que a allowlist de CORS corresponde ao domínio institucional/publicado.
6. Confirmar que a tabela não tem policies públicas de leitura.
7. Testar com um evento `analysis_run` de exemplo.
8. Ativar `window.METRICS_ENABLED = true` apenas depois da validação.

## Como consultar números para relatório

Usar `supabase/relatorios-usage-events.sql`, por exemplo:

- total de eventos por tipo;
- frequência diária de uso;
- análises por semana e por dispositivo aproximado;
- totais agregados por categoria de resultado;
- percentagem de análises com pelo menos um par sem dados.

## Falhas de logging

O logging é não bloqueante. Se a Edge Function estiver indisponível, a análise de compatibilidade continua normalmente e a falha fica apenas no console do browser.

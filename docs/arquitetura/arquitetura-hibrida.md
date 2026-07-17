# Arquitetura híbrida da CompY

## Objetivo

A arquitetura híbrida permite que a CompY use o Supabase como fonte preferencial de dados, mantendo o snapshot local em `data/compatibilidades.js` como camada de segurança, demonstração e funcionamento fechado/local.

O objetivo é garantir continuidade da análise quando o backend não está disponível, sem interpretar falhas técnicas como compatibilidade clínica e sem alterar a base clínica validada.

## Modos de funcionamento

A app é configurada em `config.supabase.js` através das opções:

```js
window.BACKEND_MODE = "hybrid"; // "hybrid" | "supabase" | "local"
window.SUPABASE_ENABLED = true;
window.LOCAL_FALLBACK_ENABLED = true;
window.METRICS_ENABLED = false;
```

### `hybrid`

Modo recomendado para utilização normal com conectividade.

Comportamento:
- tenta consultar primeiro o Supabase através da RPC `obter_compatibilidade(med_a, med_b)`;
- se o Supabase responder, usa o resultado do Supabase;
- se houver falha de rede, timeout, RPC indisponível ou configuração ausente, usa o snapshot local, desde que `LOCAL_FALLBACK_ENABLED=true`;
- identifica claramente quando o snapshot local foi usado por falha do Supabase.

Usar quando:
- a instituição quer o Supabase como fonte principal;
- é importante manter uma alternativa segura caso o backend falhe;
- a app pode ser usada em ambientes com conectividade variável.

### `supabase`

Modo estrito para usar apenas o backend.

Comportamento:
- consulta apenas o Supabase;
- se o Supabase falhar, não usa o snapshot local;
- mostra um resultado seguro de ausência de dados/indisponibilidade;
- nunca interpreta falha técnica como compatibilidade.

Usar quando:
- a instituição quer garantir que só a base central é usada;
- não se aceita fallback local por política interna;
- a validação operacional depende exclusivamente do backend.

### `local`

Modo fechado/offline.

Comportamento:
- ignora o Supabase;
- usa apenas `data/compatibilidades.js`;
- não faz chamadas ao backend para compatibilidade.

Usar quando:
- a app é usada como demo institucional;
- se pretende uma versão fechada/local;
- não há conectividade;
- o ambiente não deve depender de serviços externos.

## Como a app escolhe a fonte

A camada única de acesso à compatibilidade decide a fonte com base em `BACKEND_MODE`:

- `hybrid`: Supabase primeiro; snapshot local se Supabase falhar.
- `supabase`: Supabase apenas; sem fallback.
- `local`: snapshot local apenas.

O snapshot local só é usado como fallback automático no modo `hybrid` quando `LOCAL_FALLBACK_ENABLED=true`.

Se não houver informação no Supabase nem no snapshot local, a app mantém a mensagem segura de “sem dados disponíveis”. Esta situação não é considerada compatível.

## Indicação na interface

Nos resultados por par, a app indica a origem consultada:

- `Base consultada: Supabase`
- `Base consultada: Snapshot local`
- `Supabase indisponível — usado snapshot local`

No painel “Estado da base”, a app apresenta:

- modo atual (`hybrid`, `supabase` ou `local`);
- estado do Supabase;
- estado do fallback local;
- data do snapshot local;
- contagem de medicamentos locais;
- contagem de pares locais.

## Falha do Supabase

No modo `hybrid`, uma falha do Supabase leva a app a consultar o snapshot local, quando o fallback está ativo.

No modo `supabase`, uma falha do Supabase não ativa fallback local. A app mostra uma resposta segura, indicando indisponibilidade ou ausência de dados, sem sugerir compatibilidade.

No modo `local`, o Supabase não é usado, portanto falhas do Supabase não afetam a análise local.

## Papel do snapshot local

O snapshot local em `data/compatibilidades.js` funciona como:

- fallback de segurança no modo híbrido;
- base de demonstração institucional;
- base para versão fechada/local;
- camada de funcionamento sem dependência de rede.

Este snapshot não substitui a governança da base principal. Deve ser tratado como uma fotografia validada numa data específica.

## Limitações do snapshot local

O snapshot local:

- pode ficar desatualizado face à base central;
- exige atualização manual ou workflow controlado;
- não permite auditoria centralizada em tempo real;
- não deve ser interpretado como fonte dinâmica;
- não resolve ausência de dados clínicos quando um par não está registado.

Quando o snapshot local devolve “sem dados”, isso significa apenas ausência de registo na base disponível. Não significa compatibilidade nem ausência de interação.

## Métricas anónimas

As métricas anónimas são independentes da escolha da fonte clínica.

Com `METRICS_ENABLED=false`, a app não envia eventos.

Quando ativadas, as métricas devem continuar não bloqueantes:

- falhas de envio não interrompem a análise;
- não são guardados dados de doentes;
- não são guardados profissionais;
- não são guardados medicamentos selecionados;
- não são guardados pares exatos;
- não é guardado texto livre.

As métricas devem limitar-se a contadores agregados e metadados técnicos não identificáveis.

## Recomendação institucional

Para ambiente institucional com backend disponível, recomenda-se:

```js
window.BACKEND_MODE = "hybrid";
window.SUPABASE_ENABLED = true;
window.LOCAL_FALLBACK_ENABLED = true;
window.METRICS_ENABLED = false;
```

Este modo privilegia o Supabase, mantém continuidade operacional com o snapshot local e evita ativar métricas antes da aprovação institucional.

Para ambientes fechados, demonstrações ou utilização offline, recomenda-se:

```js
window.BACKEND_MODE = "local";
window.SUPABASE_ENABLED = false;
window.LOCAL_FALLBACK_ENABLED = true;
window.METRICS_ENABLED = false;
```

## Privacidade

A CompY não usa dados de doentes para calcular compatibilidade.

A arquitetura híbrida avalia apenas medicamentos selecionados na interface e consulta a base de compatibilidade configurada. A configuração de métricas anónimas, quando desativada, impede envio de eventos. Quando vier a ser ativada, deve manter a regra de não recolher dados de doentes, profissionais, medicamentos selecionados, pares exatos ou texto livre.

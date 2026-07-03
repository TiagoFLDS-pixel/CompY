# Checklist de demonstração institucional da CompY

## 1. Objetivo da app

A CompY é uma aplicação web para apoiar a avaliação rápida de compatibilidade de medicamentos em via Y. A app permite selecionar 2 a 6 medicamentos, avaliar os pares possíveis e apresentar um resumo da análise com contagem por categoria.

O objetivo da demonstração é mostrar o potencial da ferramenta como apoio à decisão, treino e padronização visual da consulta de compatibilidades, sem substituir validação farmacêutica.

## 2. Enquadramento

A CompY deve ser apresentada como protótipo de apoio à decisão/treino em contexto institucional.

Pontos a reforçar durante a apresentação:

- A ferramenta não toma decisões clínicas autonomamente.
- Os resultados devem ser confirmados em protocolo local e/ou por farmacêutico clínico.
- A app foi preparada para demonstrar fluxo, usabilidade, integração com base estruturada e comportamento seguro perante ausência de dados.

## 3. Dados tratados

A CompY não trata dados de doentes.

Não são introduzidos nem armazenados:

- nome do doente;
- número de processo;
- data de nascimento;
- dados demográficos;
- diagnósticos;
- prescrições individualizadas;
- identificadores pessoais.

Os dados usados na demonstração são apenas combinações de IDs de medicamentos selecionados na interface.

## 4. Fonte clínica usada

Fonte clínica apresentada na app:

- Stabilis / IPO-Porto SMI;
- base validada: 09/05/2026.

Caso específico documentado para sulfato_magnesio:

- Tabela de compatibilidade do sítio Y com solventes usuais — IPO-Porto / SMI — Stabilis — atualização 09/05/2026.

## 5. Base consultada

A app consulta a base principal no Supabase.

Ponto técnico para a demonstração:

- A interface mostra "Base consultada: Supabase".
- A app mantém comportamento seguro para pares sem registo.
- A RPC usada pela app para compatibilidade é `obter_compatibilidade(med_a, med_b)`.

## 6. Limitações clínicas

Limitações a explicar explicitamente:

- "Sem dados" não significa compatível nem ausência de interação.
- Compatibilidade física em Y-site não garante estabilidade química.
- Compatibilidade física em Y-site não garante adequação clínica ao doente.
- A interpretação depende de concentração, diluente, tempo de contacto, temperatura, material da linha, velocidade de perfusão, contexto clínico e protocolo institucional.
- A CompY não substitui validação farmacêutica, consulta de fontes oficiais atualizadas ou decisão clínica.

## 7. Checklist antes da demo

Antes de apresentar aos informáticos/IPO:

- Confirmar que a app abre no GitHub Pages ou no ambiente definido para demonstração.
- Confirmar que a versão visível aparece como `CompY v0.9.0-beta`.
- Confirmar que aparece `Base validada: 09/05/2026`.
- Confirmar que aparece `Fonte clínica: Stabilis / IPO-Porto SMI`.
- Confirmar que aparece `Base consultada: Supabase`.
- Confirmar que aparece `Ambiente: protótipo/demonstração`.
- Confirmar que a secção "Fontes e limitações" está visível.
- Confirmar que a pesquisa de pares sem dados mostra mensagem segura.
- Confirmar que o bloco "Resumo da análise" aparece após verificar compatibilidade.
- Confirmar que os alertas de bólus/grupo aparecem quando aplicável.
- Confirmar que a ligação à internet está estável.
- Se a app estiver instalada como PWA no telemóvel, limpar/atualizar cache antes da demo.
- Ter preparado um plano B: abrir em janela anónima ou noutro browser se houver cache antiga.

## 8. Casos de demonstração

### Caso 1 — par compatível

Medicamentos:

- `sulfato_magnesio`
- `glucose_5`

Resultado esperado:

- compatível;
- resumo com 1 par avaliado e 1 compatível.

Mensagem a reforçar:

- A app apresenta uma classificação estruturada e mantém a recomendação de validação institucional.

### Caso 2 — par incompatível

Medicamentos:

- `sulfato_magnesio`
- `furosemida`

Resultado esperado:

- incompatível;
- resumo com 1 par avaliado e 1 incompatível.

Mensagem a reforçar:

- O estado incompatível orienta para via exclusiva ou estratégia alternativa, sem substituir decisão clínica.

### Caso 3 — par variável/dados conflitantes

Medicamentos:

- `sulfato_magnesio`
- `propofol`

Resultado esperado:

- variável/dados conflitantes;
- resumo com 1 par avaliado e 1 variável/dados conflitantes;
- alerta de bólus/grupo se aplicável.

Mensagem a reforçar:

- A app diferencia dados variáveis de compatibilidade positiva ou negativa.

### Caso 4 — par sem dados

Medicamentos:

- `sulfato_magnesio`
- `albumina_humana`

Resultado esperado:

- sem dados;
- resumo com 1 par avaliado e 1 sem dados;
- mensagem segura: ausência de dados não implica compatibilidade ou ausência de interação.

Mensagem a reforçar:

- Este é um comportamento de segurança importante para evitar falso conforto.

### Caso 5 — combinação com 4 medicamentos

Medicamentos sugeridos:

- `sulfato_magnesio`
- `glucose_5`
- `furosemida`
- `propofol`

Resultado esperado:

- 6 pares avaliados;
- resumo da análise visível antes dos resultados par-a-par;
- contagem distribuída por compatíveis, incompatíveis, variáveis/dados conflitantes e sem dados, conforme registos existentes na base.

Mensagem a reforçar:

- A app avalia a combinação em pares e mostra uma visão agregada antes do detalhe.

### Caso 6 — alerta de bólus/grupo

Medicamentos sugeridos:

- `dexmedetomidina`
- `cloreto_potassio`

Resultado esperado:

- alerta de bólus/grupo visível;
- resumo com alertas relevantes;
- resultados par-a-par mantidos abaixo do resumo.

Mensagem a reforçar:

- Além da compatibilidade, a app destaca riscos operacionais relevantes quando medicamentos partilham a via.

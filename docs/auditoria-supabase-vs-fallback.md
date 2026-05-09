# Auditoria Supabase vs fallback local

Data da auditoria: 2026-05-09

## Resumo executivo

Esta auditoria compara a base principal Supabase com o ficheiro local `data/compatibilidades.js`, usado apenas como fallback técnico da CompY. A decisão de produto é tratar o Supabase como base canónica e o fallback local como um snapshot de segurança.

A lista de medicamentos está alinhada: existem 47 medicamentos no Supabase e 47 medicamentos na base local, sem medicamentos exclusivos de um lado. Nas compatibilidades, não foram encontradas classificações divergentes nos pares comuns, nem ids órfãos. No entanto, há desalinhamento de cobertura: 7 pares existem apenas no Supabase e 91 pares existem apenas no fallback local.

## Números principais

| Indicador | Resultado |
| --- | ---: |
| Medicamentos no Supabase | 47 |
| Medicamentos no fallback local | 47 |
| Medicamentos só no Supabase | 0 |
| Medicamentos só no fallback local | 0 |
| Linhas de compatibilidade no Supabase | 417 |
| Pares únicos no Supabase | 417 |
| Entradas de compatibilidade no fallback local | 985 |
| Pares únicos no fallback local | 501 |
| Pares só no Supabase | 7 |
| Pares só no fallback local | 91 |
| Pares comuns com classificação divergente | 0 |
| Duplicados bidirecionais no Supabase | 0 |
| Duplicados bidirecionais no fallback local | 484 |
| IDs órfãos no Supabase | 0 |
| IDs órfãos no fallback local | 0 |

## Base canónica e fallback

O Supabase deve ser entendido como a base principal da CompY. É a fonte que a aplicação consulta em funcionamento normal para carregar medicamentos ativos e obter compatibilidades através da RPC `obter_compatibilidade`.

A base local no GitHub deve funcionar apenas como fallback técnico. Isto significa que ela só deve ser usada quando houver falha técnica na ligação ao Supabase, e não como substituto clínico silencioso. Idealmente, o fallback local deve espelhar o Supabase, para que uma falha temporária de rede não mude o comportamento clínico esperado da app.

## Pares só no Supabase

Estes 7 pares existem no Supabase, mas não existem no fallback local. A ação sugerida é adicioná-los ao snapshot local após confirmação operacional, para que o fallback espelhe a base canónica.

- `bicarbonato_sodio` (Bicarbonato de Sódio) + `cloreto_calcio` (Cloreto de Cálcio) - incompativel
- `sulfato_magnesio` (Sulfato de Magnésio) + `bicarbonato_sodio` (Bicarbonato de Sódio) - incompativel
- `sulfato_magnesio` (Sulfato de Magnésio) + `cloreto_calcio` (Cloreto de Cálcio) - incompativel
- `sulfato_magnesio` (Sulfato de Magnésio) + `fosfato_potassio` (Fosfato de Potássio) - variavel
- `sulfato_magnesio` (Sulfato de Magnésio) + `gluconato_calcio` (Gluconato de Cálcio) - incompativel
- `octreotido_acetato` (Octreótido (Acetato)) + `omeprazol_sodico` (Omeprazol (Sódico)) - compativel
- `vasopressina` (Vasopressina) + `vancomicina_cloridrato` (Vancomicina (Cloridrato)) - compativel

Ver também: `docs/pares-so-supabase.csv`.

## Pares só no fallback local

Foram identificados 91 pares que existem no fallback local, mas não existem no Supabase. Como o Supabase é a base canónica, estes pares devem ser tratados como pendentes de revisão clínica. Eles não devem ser migrados automaticamente.

O ficheiro `docs/pares-so-fallback.csv` contém a lista completa destes 91 pares, com uma coluna para revisão clínica manual.

## Duplicados bidirecionais no fallback local

O fallback local contém 484 pares duplicados nos dois sentidos. Isto significa que o mesmo par aparece como A+B e também como B+A.

Isto não causa erro imediato porque a lógica local da app já procura compatibilidade nos dois sentidos. Mesmo assim, a duplicação torna o ficheiro mais difícil de manter e aumenta o risco de inconsistências futuras caso um dos sentidos seja alterado e o outro não.

Numa etapa futura, a base local deve ser simplificada para manter apenas pares únicos, usando a mesma lógica bidirecional já existente na aplicação.

## Risco clínico e técnico do desalinhamento

O principal risco é comportamental durante falha técnica do Supabase. Em funcionamento normal, a app consulta o Supabase. Se o Supabase devolver zero resultados, a app apresenta corretamente "sem dados registados". Porém, se houver falha técnica e a app cair no fallback local, os 91 pares exclusivos do fallback podem passar a aparecer como compatíveis, incompatíveis ou variáveis, mesmo não estando presentes na base canónica.

Isto pode criar diferença entre o comportamento normal e o comportamento em fallback. Por prudência clínica, os pares só existentes no fallback devem ser revistos antes de qualquer migração para o Supabase.

## Recomendações de próximos passos

1. Rever clinicamente o ficheiro `docs/pares-so-fallback.csv`.
2. Para cada par só no fallback, decidir se deve ser migrado para o Supabase, removido futuramente do fallback, ou mantido apenas como pendente.
3. Adicionar os 7 pares só no Supabase ao fallback local numa etapa posterior, se a intenção for manter um snapshot de segurança fiel.
4. Criar uma rotina periódica de auditoria só de leitura para repetir esta comparação.
5. Simplificar futuramente o fallback local para pares únicos, sem duplicação A+B e B+A.

## Ficheiros gerados

- `docs/pares-so-fallback.csv`: pares presentes apenas no fallback local, para revisão clínica.
- `docs/pares-so-supabase.csv`: pares presentes apenas no Supabase, candidatos a entrada no snapshot local.

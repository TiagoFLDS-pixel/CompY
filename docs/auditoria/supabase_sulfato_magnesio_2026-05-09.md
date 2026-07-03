# Validacao Supabase - sulfato_magnesio

Data da validacao: 2026-07-03

## Contexto

Esta auditoria documenta a verificacao da base principal Supabase para a atualizacao ja validada localmente do farmaco canonico `sulfato_magnesio`, baseada na fonte clinica:

Tabela de compatibilidade do sitio Y com solventes usuais — IPO-Porto / SMI — Stabilis — atualizacao 09/05/2026.

## Estrutura Supabase encontrada

Foram identificadas as seguintes estruturas relevantes:

- Tabela `medicamentos`
  - `id`
  - `nome`
  - `tipo`
  - `ativo`
  - `criado_em`

- Tabela `compatibilidades`
  - `id`
  - `medicamento_a_id`
  - `medicamento_b_id`
  - `classificacao`
  - `fonte`
  - `data_fonte`
  - `observacoes`
  - `validado`
  - `criado_em`

- RPC usada pela app:
  - `obter_compatibilidade(med_a, med_b)`

## Tabelas envolvidas

- `medicamentos`
- `compatibilidades`

## Resultado do dry-run

Foi realizado dry-run antes de qualquer operacao de escrita.

Resultado:

- Nenhum dado foi escrito no Supabase.
- Os 26 pares esperados com `sulfato_magnesio` ja existiam.
- Nao foram encontrados conflitos de classificacao.
- Nao foram adicionados pares classificados como "sem dados".

Distribuicao dos 26 pares encontrados:

- 17 compativeis
- 5 incompativeis
- 4 variaveis

## Exemplos validados via RPC

Foram validados exemplos atraves da RPC `obter_compatibilidade(med_a, med_b)`:

- `sulfato_magnesio` + `glucose_5` = `compativel`
- `sulfato_magnesio` + `furosemida` = `incompativel`
- `sulfato_magnesio` + `propofol` = `variavel`
- `sulfato_magnesio` + `remifentanil_cloridrato` = `compativel`

## Nota sobre diferenca de ID local/Supabase

Foi identificada uma diferenca de nomenclatura entre a base local e o Supabase:

- ID local: `remifentanilo_cloridrato`
- ID Supabase: `remifentanil_cloridrato`

O mapeamento foi considerado inequivoco nesta validacao, porque existia uma correspondencia unica e ativa no Supabase para Remifentanil/Remifentanilo.

## Conclusao

O Supabase ja estava coerente com a atualizacao local de `sulfato_magnesio`.

Nao foi necessaria qualquer escrita, insercao, atualizacao ou remocao de dados. Como nao houve alteracoes no Supabase, nenhuma reversao e necessaria.

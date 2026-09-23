# Preparação e administração IV

Módulo experimental para registar informação de preparação e administração de medicamentos.

## Estado

- Visível em modo experimental na página principal.
- Identificado claramente como conteúdo não validado.
- Sem medicamentos ou recomendações clínicas pré-preenchidas.
- Os registos validados no formulário podem ser exportados como JSON; ainda não são enviados ao Supabase.

## Visibilidade

Em `config.js`, o módulo está ativo através de:

```js
PREPARACAO_MEDICAMENTOS: true
```

O formulário não contém recomendações clínicas pré-preenchidas e não envia dados ao Supabase.

## Campos estruturados

- medicamento, apresentação e via;
- líquido e volume de reconstituição;
- líquido e volume final de diluição;
- concentração final mínima, recomendada e máxima, com unidade;
- taxa de perfusão mínima, recomendada e máxima, com unidade, ou duração;
- observações e efeitos adversos relevantes;
- fonte, data de consulta e estado de validação.

O estado `validado` exige identificação do validador e data de validação.

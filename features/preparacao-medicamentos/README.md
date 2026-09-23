# Preparação e administração IV

Módulo experimental para registar informação de preparação e administração de medicamentos.

## Estado

- Visível através do botão `Teste`, junto ao botão `Sobre`.
- Identificado claramente como conteúdo não validado.
- Sem medicamentos ou recomendações clínicas pré-preenchidas.
- A base clínica ainda não é enviada ao Supabase.

## Visibilidade

Em `config.js`, o módulo está ativo através de:

```js
PREPARACAO_MEDICAMENTOS: true
```

O formulário não contém recomendações clínicas pré-preenchidas e não envia dados ao Supabase.

## Fluxo da interface

- medicamento, dose total, apresentação e tipo de acesso;
- número de frascos necessários;
- diluição habitual e menor volume permitido pela concentração máxima validada;
- diluente, tempo de administração, observações e efeitos adversos.

A Anfotericina B surge apenas com a apresentação de 50 mg informada pelo utilizador. Não existem ainda recomendações clínicas associadas.

# Changelog da base de compatibilidades

Registo humano das alterações feitas à base de compatibilidades da CompY.

## Formato recomendado

```markdown
## YYYY-MM-DD — updateId

- Fármaco base:
- Fonte:
- Data da fonte:
- Responsável/revisor:
- Pares novos:
- Pares já existentes e ignorados:
- Conflitos:
- Pares sem dados não adicionados:
- Backup pré-aplicação:
- Relatório:
- Observações:
```

## 2026-07-04 — criação do workflow de atualização

- Criada estrutura `updates/pending`, `updates/approved` e `updates/applied`.
- Criados scripts de validação, dry-run e aplicação segura no Supabase.
- Nenhuma alteração clínica aplicada.
- Nenhuma escrita no Supabase.


# Backup de compatibilidades CompY — 2026-07-03

## Finalidade

Este backup guarda uma cópia rastreável da base local de compatibilidades da CompY e, quando disponível, uma exportação por leitura da base principal no Supabase.

## Origem dos dados

- Base local/GitHub: `data/compatibilidades.js`, copiada para `compatibilidades.js`.
- Supabase: tabelas `medicamentos` e `compatibilidades`, exportadas por leitura para JSON quando o acesso está configurado.
- Commit associado: `aad44645d282dcd5738b88ecf28b79fb01138550`.
- Branch associada: `main`.

## Como restaurar ou comparar

Para restaurar a base local, comparar primeiro `compatibilidades.js` deste backup com `data/compatibilidades.js` atual e só depois substituir manualmente se a reposição for aprovada.

Para comparar Supabase, usar os ficheiros `supabase_medicamentos.json` e `supabase_compatibilidades.json` como fotografia de leitura. Qualquer reposição no Supabase deve ser feita por procedimento separado, revisto e com permissões adequadas.

## Limitações

- Este backup é uma fotografia no momento da execução.
- A exportação Supabase depende de acesso de leitura configurado e das políticas RLS ativas.
- O backup não valida clinicamente novos pares; apenas preserva o estado observado.
- Compatibilidade física em Y-site não garante estabilidade química nem adequação clínica.

## Privacidade

Este backup não contém dados de doentes, identificadores pessoais, processos clínicos, diagnósticos ou prescrições individualizadas.

## Supabase

- Modo usado: leitura apenas.
- Escrita no Supabase: não.
- Exportação Supabase realizada: sim.

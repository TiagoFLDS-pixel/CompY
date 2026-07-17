# Workflow de atualização da base de compatibilidades

Este fluxo permite atualizar a base principal de compatibilidades da CompY por patches JSON controlados, com validação local, dry-run no Supabase e aplicação explícita apenas quando aprovada.

## Objetivos

- Evitar edição manual direta da base.
- Rastrear fonte, responsável/revisor e observações de cada atualização.
- Validar IDs, duplicados, conflitos internos e pares sem dados antes de qualquer operação.
- Fazer dry-run por leitura no Supabase antes de aplicar.
- Inserir apenas pares novos.
- Bloquear conflitos e evitar sobrescrita de estados existentes.
- Não expor chaves ou tokens.

## Estrutura

- `updates/pending/`: patches em preparação.
- `updates/approved/`: patches revistos e aprovados para dry-run/aplicação.
- `updates/applied/`: relatórios finais de aplicação.
- `scripts/validate-update.js`: valida o patch localmente.
- `scripts/dry-run-update-supabase.js`: compara o patch com o Supabase, só leitura.
- `scripts/apply-update-supabase.js`: aplica pares novos com `--apply`, após backup e sem conflitos.
- `docs/base/changelog-base.md`: registo humano das alterações da base.

## Formato do patch JSON

Usar nomes de campos ASCII para reduzir problemas de encoding:

```json
{
  "updateId": "2026-07-04-sulfato-magnesio-exemplo",
  "drugId": "sulfato_magnesio",
  "fonte": "Tabela de compatibilidade do sítio Y com solventes usuais — IPO-Porto / SMI — Stabilis",
  "dataFonte": "2026-05-09",
  "responsavelRevisor": "Nome / Farmácia clínica",
  "compativeis": [
    "glucose_5"
  ],
  "incompativeis": [
    "furosemida"
  ],
  "variaveis": [
    "propofol"
  ],
  "semDadosNaoAdicionar": [
    "albumina_humana_20"
  ],
  "observacoes": "Pares extraídos de tabela validada; pares sem dados mantidos fora da base."
}
```

Também são aceites, para compatibilidade humana, as chaves `compatíveis`, `incompatíveis`, `variáveis`, `data da fonte`, `responsável/revisor` e `pares sem dados que não devem ser adicionados`.

## Criar um patch

1. Criar um ficheiro em `updates/pending/`, por exemplo:

```text
updates/pending/2026-07-04-nome-do-farmaco.json
```

2. Preencher todos os campos obrigatórios.
3. Colocar pares sem dados apenas em `semDadosNaoAdicionar`.
4. Não incluir pares sem dados nas listas `compativeis`, `incompativeis` ou `variaveis`.

## Validar localmente

Executar:

```bash
node scripts/validate-update.js updates/pending/2026-07-04-nome-do-farmaco.json
```

A validação:

- confirma formato do patch;
- confirma se todos os IDs existem em `MEDICAMENTOS`;
- deteta duplicados;
- deteta conflitos internos;
- bloqueia pares marcados como sem dados se forem adicionados como classificados.

Se passar, mover o patch para `updates/approved/` após revisão humana.

## Dry-run no Supabase

Definir variáveis de ambiente fora do código:

```bash
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

Ou, para ambientes controlados:

```bash
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Executar:

```bash
node scripts/dry-run-update-supabase.js updates/approved/2026-07-04-nome-do-farmaco.json
```

O dry-run:

- consulta Supabase apenas por leitura;
- lista pares novos;
- lista pares já existentes com o mesmo estado;
- lista conflitos entre estado atual e estado do patch;
- não escreve nada.

## Aplicar no Supabase

A aplicação exige a flag explícita `--apply`:

```bash
node scripts/apply-update-supabase.js updates/approved/2026-07-04-nome-do-farmaco.json --apply
```

O script:

- executa dry-run antes de aplicar;
- bloqueia se houver conflito;
- cria backup pré-aplicação em `backups/compatibilidades/pre-apply-...`;
- insere apenas pares novos;
- ignora pares já existentes com o mesmo estado;
- não sobrescreve estados existentes;
- gera relatório em `updates/applied/<updateId>-report.json`.

## Reverter

Não há reversão automática nesta primeira versão.

Procedimento recomendado:

1. Identificar o relatório em `updates/applied/<updateId>-report.json`.
2. Consultar o backup pré-aplicação criado em `backups/compatibilidades/pre-apply-...`.
3. Preparar um plano de reversão revisto pela equipa técnica/farmacêutica.
4. Executar remoção/correção no Supabase apenas com aprovação explícita.
5. Registar a reversão em `docs/base/changelog-base.md`.

## Regras de segurança

- Nunca escrever chaves/tokens no repositório.
- Nunca aplicar sem dry-run.
- Nunca aplicar sem `--apply`.
- Nunca adicionar pares sem dados como se fossem compatíveis.
- Nunca sobrescrever estados existentes sem processo próprio de aprovação.
- Não alterar `data/compatibilidades.js` diretamente neste fluxo.


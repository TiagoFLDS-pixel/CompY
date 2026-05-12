# Ficha Técnica da CompY

## Identificação

- Nome da aplicação: CompY
- Tipo: PWA experimental de apoio e treino
- Área: compatibilidade medicamentosa em via Y
- Base de referência: base validada CompY de 09/05/2026

## Objetivo

A CompY tem como objetivo apoiar a consulta rápida de compatibilidade medicamentosa em via Y, apresentando resultados por pares de medicamentos selecionados.

A aplicação não substitui protocolos institucionais, fontes oficiais atualizadas, avaliação clínica individual nem validação pela farmácia clínica.

## Público-Alvo

- Enfermeiros
- Farmacêuticos hospitalares
- Médicos

## Contexto De Utilização

A CompY foi pensada para contextos hospitalares onde a administração simultânea por via intravenosa é frequente e pode exigir decisão rápida, nomeadamente:

- Cuidados Intensivos
- Cuidados Intermédios
- Bloco Operatório
- Outros contextos com perfusões intravenosas concomitantes

## Âmbito Clínico

A aplicação avalia combinações de medicamentos em pares e apresenta um estado de compatibilidade em via Y. A informação deve ser interpretada como apoio à consulta e não como autorização automática para administração conjunta.

## Fonte Clínica Dos Dados

A fonte clínica/científica de referência usada na base da CompY é:

- Stabilis

A informação foi tratada, normalizada e estruturada para utilização na aplicação.

## Validação Interna

- Validação CompY: 09/05/2026
- Estado: base validada internamente para utilização experimental e de treino

A validação interna não transforma a aplicação em dispositivo médico nem dispensa confirmação em fontes oficiais e/ou com a farmácia clínica.

## Dimensão Da Base Validada

- Medicamentos ativos: 47
- Pares únicos de compatibilidade: 527

## Arquitetura Dos Dados

### Supabase

O Supabase é a base técnica principal consultada pela aplicação. Deve ser entendido como infraestrutura de armazenamento e consulta dos dados, não como fonte clínica/científica.

### Fallback Local

O ficheiro local `data/compatibilidades.js` funciona como base técnica de segurança. Deve ser usado apenas em caso de falha técnica na ligação ao Supabase.

O fallback local deve espelhar a base validada para reduzir diferenças de comportamento quando a aplicação funciona sem acesso ao Supabase.

## Classificações Apresentadas

### Compatível

Indica compatibilidade provável em via Y de acordo com a base validada. Deve ser confirmada conforme o contexto clínico, concentração, diluente, tempo de contacto e protocolo local.

### Incompatível

Indica incompatibilidade provável em via Y. Deve ser considerada via exclusiva, alternativa de administração ou confirmação com a farmácia clínica.

### Variável

Indica compatibilidade dependente de condições específicas ou informação controversa. Requer confirmação em fonte oficial atualizada e/ou com a farmácia clínica.

### Sem Dados

Indica ausência de registo na base validada para aquele par. Não deve ser interpretado como compatível.

## Conduta Perante “Sem Dados”

Quando a aplicação apresentar ausência de dados, a conduta recomendada é confirmar em fonte oficial atualizada e/ou com a farmácia clínica antes de qualquer decisão de administração conjunta.

Ausência de registo não significa compatibilidade.

## Limitações

- A CompY é uma ferramenta experimental de apoio/treino.
- Não deve ser usada isoladamente para decisões clínicas reais.
- Não substitui protocolos institucionais.
- Não substitui validação farmacêutica.
- Não substitui fontes oficiais atualizadas.
- A compatibilidade pode depender de concentração, diluente, temperatura, tempo de contacto, formulação e contexto clínico.
- A base pode não contemplar todas as apresentações comerciais, concentrações ou condições locais de administração.

## Estado Experimental

A CompY encontra-se em fase de protótipo experimental. A sua utilização deve ser prudente e enquadrada como apoio à consulta, treino e melhoria progressiva da base de conhecimento.

## Monitorização Agregada De Utilização

A CompY pode registar eventos agregados e anónimos de utilização quando é feita uma verificação com pelo menos dois medicamentos selecionados.

Esta monitorização tem como objetivo apoiar a avaliação de implementação e adesão durante o período experimental. A métrica representa o número de verificações realizadas, não o número de utilizadores únicos.

São registados apenas dados agregados da consulta, como número de medicamentos selecionados, número de pares avaliados, presença de incompatibilidade, resultado variável, ausência de dados, base técnica consultada e versão da base.

Não são guardados nomes de utilizadores, logins, IP, localização, user agent, cookies, identificadores de dispositivo, identificadores persistentes, profissão, serviço, medicamentos pesquisados ou pares exatos pesquisados.

## Segurança E Prudência Clínica

Os resultados devem ser interpretados de forma conservadora. Em caso de dúvida, ausência de dados, resultados variáveis ou contexto clínico crítico, deve ser privilegiada a confirmação com a farmácia clínica e/ou fontes institucionais.

## Manutenção Futura

Recomenda-se:

- revisão periódica da base validada;
- auditoria regular entre Supabase e fallback local;
- registo datado das alterações à base;
- revisão clínica antes de adicionar novos pares;
- manutenção de uma distinção clara entre fonte clínica, validação interna e base técnica consultada;
- avaliação futura de campos adicionais, como nível de evidência ou comentário clínico estruturado.

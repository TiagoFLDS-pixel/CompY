# CompY Compatibilidade em Via Y

Ferramenta de apoio rápido à decisão para avaliação de compatibilidade de medicamentos em administração simultânea por via intravenosa (via Y).

## Objetivo

O **CompY** foi desenvolvido como uma ferramenta de bolso para suporte à prática clínica, permitindo a verificação rápida da compatibilidade entre múltiplos fármacos administrados em perfusão concomitante.

Destina-se a contextos onde a administração em via Y é frequente e crítica para a segurança do doente, nomeadamente:
- Cuidados Intensivos
- Cuidados Intermédios
- Bloco Operatório

## Público-alvo

- Enfermeiros
- Farmacêuticos hospitalares
- Médicos

## Funcionalidades principais

- Seleção de múltiplos medicamentos (≥2)
- Avaliação automática de compatibilidade par-a-par
- Classificação do resultado:
  - Compatível
  - Incompatível
  - Compatibilidade variável
  - Não identificado
- Alertas de risco clínico (ex.: risco de bólus inadvertido)
- Normalização inteligente de nomes de medicamentos
- Validação interna da consistência da base de dados

##  Estado do projeto

Este projeto encontra-se em fase de:

**Protótipo experimental com validação em ambiente clínico (Cuidados Intensivos)**

Os dados de utilização (frequência, adesão e padrões de uso) serão monitorizados até ao final de 2026 com fins de avaliação.

##  Fonte dos dados

Os dados de compatibilidade foram obtidos a partir da aplicação:

- **Stabilis® 4.0**

A informação foi tratada, normalizada e estruturada para integração numa base de dados própria.

## Atualização da base de dados

Atualmente, a base de dados é:

- Atualizada manualmente
- Sujeita a validação pela farmácia do IPO- Porto

Evoluções futuras poderão incluir:
- Integração com fontes externas
- Atualização semi-automática ou automatizada

## Limitações e segurança

- Esta ferramenta **não substitui** a validação farmacêutica nem os protocolos institucionais
- A ausência de dados não implica compatibilidade
- A compatibilidade pode depender de:
  - concentração
  - diluente
  - temperatura
  - tempo de contacto

**Recomenda-se sempre a confirmação em consulta farmacêutica.**


## Analytics e utilização

A aplicação integra recolha de métricas de utilização (ex.: número de verificações realizadas), com o objetivo de:

- Avaliar adesão
- Compreender padrões de uso
- Apoiar futuras melhorias

A recolha de dados decorre até 30/11/2026.

##  Como utilizar

1. Selecionar dois ou mais medicamentos
2. Clicar em "Verificar compatibilidade"
3. Analisar os resultados apresentados por combinação

##  Execução local

```bash
# Clonar repositório
git clone https://github.com/TiagoFLDS-pixel/CompY.git

# Abrir o ficheiro
index.html

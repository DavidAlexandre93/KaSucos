# Revisão Completa da Aplicação KaSucos (Checklist 1-14)

Data da revisão: 2026-03-06
Escopo avaliado: frontend React/Vite, configuração de build/deploy, documentação e scripts de validação locais.

## Metodologia e checks executados

- `npm run validate:code` (passou): 31 arquivos escaneados, sem arquivos inalcançáveis e sem duplicações de 8+ linhas.
- `npm run build` (passou): build de produção gerado com sucesso.
- `npm audit --omit=dev` (não conclusivo): falhou por `403 Forbidden` no endpoint de advisory do npm (limitação de ambiente/rede).

---

## Resumo executivo

A aplicação está funcional, com build saudável e organização básica por componentes/seções. Os principais gaps estão em **arquitetura (App e mini-game muito grandes)**, **testes (ausentes)**, **segurança operacional (falta de hardening e validações sistemáticas)** e **governança de qualidade em CI (sem lint/test/coverage/SAST)**. Não há backend próprio neste repositório, então itens de API/server-side foram avaliados como N/A ou parcialmente aplicáveis.

---

## 1) Arquitetura & Design

### Pontos positivos
- Separação por áreas (`components/layout`, `components/sections`, `data`, `hooks`, `lib`).
- Uso de hooks para preocupações específicas (`useLanguage`, `useGSAP`).

### Problemas
- **Médio**: `App.jsx` concentra múltiplas responsabilidades (estado de carrinho, navegação, splash, animações globais, regras de checkout), elevando acoplamento e dificultando manutenção.
- **Médio**: `FabricaDeSucosSection.jsx` mistura UI, regras de jogo, persistência local, integração remota e ranking em um único arquivo muito extenso.
- **Baixo**: `README` descreve uma estrutura (`features/...`) que não corresponde ao layout real atual de `src`.

### Recomendações
- Extrair lógica de carrinho/checkout para hooks (`useCart`, `useCheckout`).
- Separar engine do mini-game em módulos (`game-engine`, `ranking-service`, `storage`).
- Atualizar diagrama/árvore no README para refletir a estrutura real.

---

## 2) Clean Code & Qualidade

### Pontos positivos
- Nomenclatura geral legível e intenção clara em boa parte das funções.
- Script interno de validação de código já existe.

### Problemas
- **Médio**: funções longas e com alto volume de lógica imperativa no mini-game.
- **Médio**: vários `catch {}` silenciosos sem observabilidade (erros suprimidos sem log).
- **Baixo**: duplicação conceitual de labels/traduções em alguns pontos (risco de drift entre arquivos de i18n e labels locais).
- **Médio**: ausência de lint configurado no pipeline reduz consistência automática.

### Recomendações
- Introduzir ESLint + Prettier e tornar `lint` obrigatório no CI.
- Padronizar tratamento de erro com utilitário de logging (mesmo no frontend).
- Reduzir complexidade ciclomática no mini-game com funções puras e serviços.

---

## 3) Boas práticas de API (backend)

### Status
- **N/A para backend próprio**: não há API server no repositório.
- **Parcial (integração direta via Supabase REST)**: há chamadas HTTP no cliente para ranking/likes.

### Problemas (integração cliente)
- **Médio**: contrato de erro não padronizado para UI (falhas costumam cair em fallback silencioso).
- **Baixo**: sem camadas DTO/normalização centralizada para respostas do Supabase.

### Recomendações
- Criar uma camada de cliente (`services/supabaseClient.js`) com normalização e error-shape comum.

---

## 4) Segurança (obrigatório)

### Pontos positivos
- Segredos sensíveis de integração configurados via variáveis de ambiente (`.env.example`), sem hardcode explícito no código-fonte.

### Riscos e gaps
- **Médio**: chamada a geolocalização por IP em `useLanguage` sem timeout/retry/control de falha refinado.
- **Médio**: sem evidência de headers de segurança/CSP explícitos para deploy estático.
- **Médio**: ausência de rate limit e proteção adicional na camada de persistência (dependência total de políticas Supabase).
- **Baixo**: sem evidência de processo automatizado de SCA/SAST no CI além de Dependabot.

### Recomendações
- Definir CSP/headers de segurança no host (Vercel/GitHub Pages/CDN).
- Criar wrapper de `fetch` com timeout (AbortController) e retries com limite para integrações externas.
- Adicionar pipeline de segurança (CodeQL/Semgrep + `npm audit` em contexto com acesso ao registry).

---

## 5) Tratamento de Erros & Confiabilidade

### Problemas
- **Médio**: vários caminhos de erro são silenciosos, preservando UX mas dificultando diagnóstico.
- **Médio**: sem timeout explícito em chamadas externas (`fetch`).
- **Baixo**: sem estratégia central para retries/backoff.

### Recomendações
- Implementar `fetchWithTimeout` e política de retry somente para operações idempotentes.
- Padronizar fallback + logging (telemetria leve para erros recuperáveis).

---

## 6) Performance & Escalabilidade

### Pontos positivos
- Build pequeno/moderado para SPA com assets sob controle no estado atual.

### Problemas
- **Médio**: mini-game e animações intensivas no thread principal podem degradar em dispositivos de baixo desempenho.
- **Baixo**: sem lazy loading de seções pesadas (potencial de otimização de bundle inicial).

### Recomendações
- Code splitting por seção não crítica e carregamento tardio do mini-game.
- Instrumentar Web Vitals e monitorar FPS/long tasks no jogo.

---

## 7) Banco de Dados & Migrações

### Status
- **Parcial/N/A**: banco está fora do repositório (Supabase). Há instruções SQL no README, mas não existe pasta versionada de migrações.

### Problemas
- **Médio**: ausência de versionamento de migrações junto ao código.

### Recomendações
- Adotar controle de migrações (Supabase CLI ou pasta `db/migrations`) no repo.

---

## 8) Observabilidade

### Problemas
- **Alta**: não há logging estruturado, métricas ou tracing.
- **Médio**: sem health/readiness (menos crítico por ser SPA estática, mas útil para endpoints auxiliares se surgirem).

### Recomendações
- Incluir monitoramento de frontend (erro JS, latência de requests, eventos críticos).
- Definir SLIs mínimos: erro de carregamento, falha de integração, tempo de interação inicial.

---

## 9) Testes

### Problemas
- **Alta**: ausência de suíte de testes unitários, integração e E2E.
- **Alta**: sem cobertura mínima definida e sem gates de qualidade.

### Recomendações
- Base inicial: Vitest + Testing Library (unit/integration) e Playwright (E2E fluxos críticos).
- Cobertura alvo inicial: 70% com foco em carrinho/checkout/mini-game (subir gradualmente para 80%+).

---

## 10) Frontend

### Pontos positivos
- Boas práticas de componentização em várias seções.
- Existem esforços de acessibilidade (aria-label, aria-pressed em interações principais).

### Problemas
- **Médio**: estado e efeitos concentrados em componentes muito grandes.
- **Baixo**: acessibilidade pode evoluir com testes automatizados (axe/lighthouse CI).

### Recomendações
- Refatorar componentes “god component”.
- Adicionar testes de a11y automáticos no pipeline.

---

## 11) CI/CD & Qualidade Automatizada

### Pontos positivos
- Workflows CI/CD existentes e deploy automatizado para GitHub Pages.
- Dependabot ativo para npm e GitHub Actions.

### Problemas
- **Alta**: CI valida apenas build (sem lint/test/coverage/gates).
- **Médio**: sem SAST/SCA obrigatório no pipeline.

### Recomendações
- Pipeline mínimo: lint + test + build + coverage gate.
- Incluir análise estática de segurança e dependências.

---

## 12) Docker/Infra

### Status
- **N/A no estado atual**: não há Dockerfile/docker-compose/IaC no repositório.

### Recomendação
- Se for requisito operacional, incluir stack mínima de container para padronizar ambiente local/CI.

---

## 13) Documentação

### Pontos positivos
- README com setup básico, scripts e instruções de integração Supabase.

### Problemas
- **Médio**: README desatualizado quanto à estrutura real de pastas.
- **Médio**: faltam seções mais completas (arquitetura real, troubleshooting, padrão de contribuição, estratégia de testes/coverage).

### Recomendações
- Reestruturar README com checklist operacional completo e alinhado ao código atual.

---

## 14) Entregáveis do review

## Lista priorizada de problemas

### Alta prioridade
1. Ausência de testes automatizados e de gates de qualidade no CI.
2. Ausência de observabilidade mínima (erros/métricas) no frontend.
3. CI sem lint/test/coverage e sem segurança estática obrigatória.

### Média prioridade
1. Componentes monolíticos (`App`, `FabricaDeSucosSection`) com alto acoplamento.
2. Tratamento de erro silencioso e sem timeout/retry padronizado.
3. Segurança operacional incompleta (headers/CSP/SCA executável no pipeline).
4. README desatualizado em arquitetura e lacunas de documentação operacional.
5. Migrações de banco fora de versionamento no repo.

### Baixa prioridade
1. Melhorias incrementais de a11y automatizada.
2. Ajustes de performance por lazy loading e métricas de runtime.

## Sugestões de refatoração (antes/depois)

### Exemplo 1: timeout de integração externa
**Antes**
```js
const response = await fetch(url);
```

**Depois**
```js
async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}
```

### Exemplo 2: extração de lógica de carrinho
**Antes**: regras de add/remove/total embutidas no `App`.

**Depois**: `useCart()` retornando API coesa (`items`, `addItem`, `removeItem`, `totalItems`, `totalAmount`) e reduzindo responsabilidades do componente de página.

## Plano de ação proposto

### Quick wins (1-2 sprints)
1. Adicionar ESLint/Prettier e comando `npm run lint`.
2. Incluir Vitest + Testing Library com testes do carrinho/checkout.
3. Atualizar CI para `lint + test + build` com gate de coverage inicial.
4. Implementar `fetchWithTimeout` e logging padronizado para falhas recuperáveis.
5. Atualizar README para refletir estrutura real e incluir troubleshooting.

### Refactor maior (3-6 sprints)
1. Quebrar `FabricaDeSucosSection` em módulos por responsabilidade (engine, efeitos, ranking, UI).
2. Introduzir camada `services` para integrações externas (Supabase/IP geolocation).
3. Instrumentar observabilidade (erros JS, web vitals, telemetria de fluxos críticos).
4. Versionar migrações de banco no repositório.


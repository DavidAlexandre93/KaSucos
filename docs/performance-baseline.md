# Baseline e plano de performance/estabilidade

## 1) Baseline medido antes das mudanças

### Metas iniciais (frontend estático + chamadas externas)
- p95 de chamadas externas (Supabase / geolocalização): **< 800ms**.
- p99 de chamadas externas: **< 1500ms**.
- Taxa de erro em chamadas externas: **< 1%**.
- Build de produção (Vite): **< 3s**.
- Bundle JS principal gzip: **< 80kB**.

### Medição coletada no repositório
Comando de build (antes da otimização de chunks):
- `npm run build` + medição por script Python.
- Resultado observado: `build_time_seconds=2.31`, `max_rss_kb=205592`.
- Chunk principal JS: `84.75 kB` gzip (`dist/assets/index-8dwfm0HK.js`).

## 2) Mudanças implementadas

### Observabilidade e métricas reais
- Métricas HTTP no cliente por rota/método/status com latência e erro (`recordHttpMetric`).
- Buckets de latência para facilitar p95/p99 aproximado por histogramas.
- Contadores para eventos relevantes (ex.: circuito aberto).
- Marcação de performance de navegação (`app_navigation`) e flush de resumo em `console.table`.

### Chamadas externas resilientes
- Retry apenas para erros transitórios (`408`, `429`, `5xx`) e exceções de rede.
- Exponential backoff + jitter para reduzir rajadas sincronizadas.
- Circuit breaker simples por rota HTTP (abre após falhas consecutivas e entra em cooldown).
- Timeouts já existentes mantidos com `AbortController`.

### Frontend performance
- Code splitting com `React.lazy` + `Suspense` para áreas pesadas:
  - Fábrica de Sucos
  - Dicas/Informações
  - Depoimentos
- Resultado: redução do bundle inicial e criação de chunks dedicados.

### Redução de chamadas externas repetidas
- Cache local (TTL de 24h) para idioma detectado por geolocalização.
- Evita consulta a `ipapi.co` a cada visita sem necessidade.

## 3) Resultado pós-mudança

Comando de build (depois das otimizações):
- `build_time_seconds=2.16`, `max_rss_kb=211400`.
- Chunk principal JS gzip caiu para `70.22 kB` (`dist/assets/index-C14NeYal.js`).
- Chunks lazy carregados sob demanda:
  - `FabricaDeSucosSection` gzip `14.95 kB`
  - `DicasInformacoesSection` gzip `1.80 kB`
  - `DepoimentosSection` gzip `0.48 kB`

## 4) Cenário de carga sugerido para próxima etapa

1. Executar app em produção local (`npm run build && npm run preview`).
2. Simular 3 fluxos críticos com múltiplos usuários virtuais:
   - Navegação da home até catálogo/combos.
   - Interação completa no jogo da fábrica.
   - Likes no blog com sincronização Supabase.
3. Coletar por rota:
   - latência p50/p95/p99,
   - taxa de erro,
   - frequência de retries/circuit-breaker,
   - saturação de chamadas externas.
4. Validar alarmes operacionais:
   - alta de p95/p99,
   - pico de erros 5xx/timeout,
   - circuito aberto recorrente.

## 5) Itens da checklist não aplicáveis diretamente neste projeto

- N+1 / índices / EXPLAIN / lock tuning: dependem do banco em produção e SQL dos serviços externos (Supabase), fora do código frontend.
- Pool de conexões DB e transações longas: não há camada de backend própria neste repositório.

Esses pontos continuam recomendados no backend que atende o projeto (quando houver serviço dedicado além do Supabase REST).

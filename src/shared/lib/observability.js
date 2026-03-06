const DEFAULT_BUCKETS_MS = [100, 250, 500, 1000, 2000, 4000];

function resolveGlobalStore() {
  if (typeof window === "undefined") return null;

  if (!window.__kasucosMetrics) {
    window.__kasucosMetrics = {
      http: [],
      marks: [],
      counters: {},
      summary: {
        route: {},
      },
    };
  }

  return window.__kasucosMetrics;
}

function buildLatencyBuckets(durationMs, buckets = DEFAULT_BUCKETS_MS) {
  const result = {};
  for (const bucket of buckets) {
    result[`le_${bucket}`] = durationMs <= bucket ? 1 : 0;
  }
  result.gt_max = durationMs > buckets[buckets.length - 1] ? 1 : 0;
  return result;
}

export function incrementCounter(name, tags = {}) {
  const store = resolveGlobalStore();
  if (!store) return;

  const key = JSON.stringify({ name, tags });
  store.counters[key] = (store.counters[key] || 0) + 1;
}

export function recordHttpMetric({ route, method = "GET", status, durationMs, source = "frontend", ok }) {
  const store = resolveGlobalStore();
  if (!store) return;

  const metric = {
    ts: Date.now(),
    type: "http_client",
    route,
    method,
    status,
    source,
    ok,
    durationMs,
    buckets: buildLatencyBuckets(durationMs),
  };

  store.http.push(metric);

  const routeSummary = store.summary.route[route] || {
    requests: 0,
    errors: 0,
    durationTotalMs: 0,
    maxDurationMs: 0,
  };

  routeSummary.requests += 1;
  routeSummary.errors += ok ? 0 : 1;
  routeSummary.durationTotalMs += durationMs;
  routeSummary.maxDurationMs = Math.max(routeSummary.maxDurationMs, durationMs);

  store.summary.route[route] = routeSummary;
}

export function recordPerformanceMark(name, durationMs, metadata = {}) {
  const store = resolveGlobalStore();
  if (!store) return;

  store.marks.push({
    ts: Date.now(),
    name,
    durationMs,
    metadata,
  });
}

export function flushMetricsToConsole() {
  const store = resolveGlobalStore();
  if (!store) return;

  const routeSummaries = Object.entries(store.summary.route).map(([route, summary]) => ({
    route,
    requests: summary.requests,
    errors: summary.errors,
    errorRate: summary.requests ? Number((summary.errors / summary.requests).toFixed(4)) : 0,
    avgDurationMs: summary.requests ? Number((summary.durationTotalMs / summary.requests).toFixed(2)) : 0,
    maxDurationMs: Number(summary.maxDurationMs.toFixed(2)),
  }));

  if (routeSummaries.length) {
    console.table(routeSummaries);
  }
}

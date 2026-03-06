import { incrementCounter, recordHttpMetric } from "./observability.js";

const CIRCUIT_BREAKER_STATE = new Map();

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isAbortError(error) {
  return error?.name === "AbortError";
}

function isRetriableStatus(status) {
  return status === 408 || status === 429 || status >= 500;
}

function withJitter(baseDelayMs) {
  const jitter = Math.random() * (baseDelayMs * 0.25);
  return baseDelayMs + jitter;
}

function getCircuitKey(url, method = "GET") {
  const parsedUrl = new URL(url, typeof window !== "undefined" ? window.location.origin : "http://localhost");
  return `${method.toUpperCase()} ${parsedUrl.origin}${parsedUrl.pathname}`;
}

function isCircuitOpen(circuit) {
  return circuit?.openUntil && Date.now() < circuit.openUntil;
}

function shouldOpenCircuit(circuit, failureThreshold = 3) {
  return (circuit?.failures || 0) >= failureThreshold;
}

function updateCircuitOnSuccess(circuitKey) {
  CIRCUIT_BREAKER_STATE.set(circuitKey, {
    failures: 0,
    openUntil: 0,
  });
}

function updateCircuitOnFailure(circuitKey, coolDownMs = 4000) {
  const current = CIRCUIT_BREAKER_STATE.get(circuitKey) || { failures: 0, openUntil: 0 };
  const next = {
    failures: current.failures + 1,
    openUntil: current.openUntil,
  };

  if (shouldOpenCircuit(next)) {
    next.openUntil = Date.now() + coolDownMs;
  }

  CIRCUIT_BREAKER_STATE.set(circuitKey, next);
}

export async function fetchWithTimeout(url, options = {}, timeoutMs = 6000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchWithRetry(url, options = {}, config = {}) {
  const {
    retries = 1,
    timeoutMs = 6000,
    retryDelayMs = 250,
    maxRetryDelayMs = 2000,
    method = options.method || "GET",
    source = "frontend",
    circuitBreaker = {
      enabled: true,
      failureThreshold: 3,
      coolDownMs: 4000,
    },
  } = config;

  const circuitKey = getCircuitKey(url, method);

  if (circuitBreaker?.enabled && isCircuitOpen(CIRCUIT_BREAKER_STATE.get(circuitKey))) {
    incrementCounter("http_client.circuit_open", { route: circuitKey });
    throw new Error(`Circuito aberto para ${circuitKey}`);
  }

  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const requestStart = performance.now();

    try {
      const response = await fetchWithTimeout(url, options, timeoutMs);
      const durationMs = performance.now() - requestStart;
      const requestRoute = getCircuitKey(url, method);
      const retriableStatus = isRetriableStatus(response.status);

      recordHttpMetric({
        route: requestRoute,
        method,
        status: response.status,
        durationMs,
        source,
        ok: response.ok,
      });

      if (!response.ok && retriableStatus && attempt < retries) {
        updateCircuitOnFailure(circuitKey, circuitBreaker?.coolDownMs);
        const delay = Math.min(maxRetryDelayMs, retryDelayMs * (2 ** attempt));
        await wait(withJitter(delay));
        continue;
      }

      if (response.ok) {
        updateCircuitOnSuccess(circuitKey);
      } else if (retriableStatus) {
        updateCircuitOnFailure(circuitKey, circuitBreaker?.coolDownMs);
      }

      return response;
    } catch (error) {
      const durationMs = performance.now() - requestStart;
      const requestRoute = getCircuitKey(url, method);

      recordHttpMetric({
        route: requestRoute,
        method,
        status: isAbortError(error) ? 408 : 0,
        durationMs,
        source,
        ok: false,
      });

      lastError = error;
      updateCircuitOnFailure(circuitKey, circuitBreaker?.coolDownMs);
      if (attempt === retries) break;

      const delay = Math.min(maxRetryDelayMs, retryDelayMs * (2 ** attempt));
      await wait(withJitter(delay));
    }
  }

  throw lastError;
}

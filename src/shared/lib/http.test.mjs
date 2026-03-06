import test from "node:test";
import assert from "node:assert/strict";
import { fetchWithRetry } from "./http.js";

test("fetchWithRetry faz retry apenas para status transitório", async () => {
  let calls = 0;
  global.fetch = async () => {
    calls += 1;
    if (calls === 1) {
      return new Response("erro", { status: 503 });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  };

  const response = await fetchWithRetry("https://example.com/api", {}, {
    retries: 2,
    retryDelayMs: 1,
    maxRetryDelayMs: 2,
    circuitBreaker: { enabled: false },
  });

  assert.equal(response.status, 200);
  assert.equal(calls, 2);
});

test("fetchWithRetry não reexecuta para status não-retriable", async () => {
  let calls = 0;
  global.fetch = async () => {
    calls += 1;
    return new Response("not found", { status: 404 });
  };

  const response = await fetchWithRetry("https://example.com/not-found", {}, {
    retries: 2,
    retryDelayMs: 1,
    maxRetryDelayMs: 2,
    circuitBreaker: { enabled: false },
  });

  assert.equal(response.status, 404);
  assert.equal(calls, 1);
});

test("fetchWithRetry respeita limite de tentativas em erro de rede", async () => {
  let calls = 0;
  global.fetch = async () => {
    calls += 1;
    throw new TypeError("Network error");
  };

  await assert.rejects(
    () => fetchWithRetry("https://example.com/unstable", {}, {
      retries: 2,
      retryDelayMs: 1,
      maxRetryDelayMs: 2,
      circuitBreaker: { enabled: false },
    }),
    /Network error/,
  );

  assert.equal(calls, 3);
});

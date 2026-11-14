/// <reference types="node" />
// One test per failure mode of api(), with fetch stubbed. No real network.
import { afterEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { api, ApiError, shouldRetry } from './api.ts';

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});
const stub = (impl: () => Promise<Response>) => {
  globalThis.fetch = impl as typeof fetch;
};
const fails =
  (kind: string, extra: Partial<ApiError> = {}) =>
  (err: unknown) =>
    err instanceof ApiError &&
    err.kind === kind &&
    Object.entries(extra).every(([k, v]) => err[k as keyof ApiError] === v);

describe('api', () => {
  it('returns the parsed body on 2xx', async () => {
    stub(async () => Response.json({ id: 1 }));
    assert.deepEqual(await api('/x'), { id: 1 });
  });

  it('maps a non-2xx to an http error carrying the server message', async () => {
    stub(async () => Response.json({ message: 'record not found' }, { status: 400 }));
    await assert.rejects(api('/x'), fails('http', { status: 400, message: 'record not found' }));
  });

  it('falls back to the status line when the error body has no message', async () => {
    stub(async () => new Response('oops', { status: 502, statusText: 'Bad Gateway' }));
    await assert.rejects(api('/x'), fails('http', { status: 502, message: '502 Bad Gateway' }));
  });

  it('maps a fetch rejection to a network error', async () => {
    stub(() => Promise.reject(new TypeError('Failed to fetch')));
    await assert.rejects(api('/x'), fails('network'));
  });

  it('maps an unparseable 2xx body to a parse error', async () => {
    stub(async () => new Response('<html>'));
    await assert.rejects(api('/x'), fails('parse', { status: 200 }));
  });

  it('rethrows an abort untouched', async () => {
    const ctrl = new AbortController();
    ctrl.abort();
    const abort = new DOMException('aborted', 'AbortError');
    stub(() => Promise.reject(abort));
    await assert.rejects(api('/x', { signal: ctrl.signal }), (err) => err === abort);
  });
});

describe('shouldRetry', () => {
  it('retries only network errors, up to 3 times', () => {
    assert.equal(shouldRetry(0, new ApiError('network', '')), true);
    assert.equal(shouldRetry(3, new ApiError('network', '')), false);
    assert.equal(shouldRetry(0, new ApiError('http', '', 500)), false);
    assert.equal(shouldRetry(0, new ApiError('parse', '')), false);
    assert.equal(shouldRetry(0, new Error('adapter bug')), false);
  });
});

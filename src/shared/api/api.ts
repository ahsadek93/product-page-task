const BASE_URL = 'https://api.easy-orders.net/api/v1';

// network: no response reached us. http: the server answered with a non-2xx. parse: a 2xx whose body wasn't JSON.
export type ApiErrorKind = 'network' | 'http' | 'parse';

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;

  constructor(kind: ApiErrorKind, message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(BASE_URL + path, init);
  } catch (err) {
    // An abort must reach TanStack Query untouched so it can cancel quietly.
    if (init?.signal?.aborted) throw err;
    throw new ApiError('network', 'Network request failed');
  }

  if (!res.ok) {
    // The API sends { message } on errors; fall back to the status line when it doesn't.
    const body = await res.json().catch(() => null);
    const message = typeof body?.message === 'string' ? body.message : `${res.status} ${res.statusText}`;
    throw new ApiError('http', message, res.status);
  }

  try {
    return (await res.json()) as T;
  } catch (err) {
    if (init?.signal?.aborted) throw err;
    throw new ApiError('parse', 'Response was not valid JSON', res.status);
  }
}

// Only a request that never got an answer is worth repeating; a server reply won't change on retry.
export const shouldRetry = (failureCount: number, error: unknown) =>
  error instanceof ApiError && error.kind === 'network' && failureCount < 3;

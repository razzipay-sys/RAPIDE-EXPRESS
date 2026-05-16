import { getSupabase } from './supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

async function getAuthToken(): Promise<string | null> {
  const supabase = getSupabase();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { skipAuth, ...init } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };

  if (!skipAuth) {
    const token = await getAuthToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Network error' } }));
    throw new Error(error.error?.message ?? `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: 'DELETE' }),
};

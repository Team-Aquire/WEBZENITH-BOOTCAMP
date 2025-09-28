import type { MovieDetails, MovieSummary } from './types';

const API_BASE = 'https://www.omdbapi.com/';

// Read from env; allow fallback to localStorage at runtime
export function getApiKey(): string | undefined {
  const envKey = import.meta.env.VITE_OMDB_API_KEY as string | undefined;
  if (envKey) return envKey;
  try {
    return localStorage.getItem('omdb_api_key') || undefined;
  } catch {
    return undefined;
  }
}

const cache = new Map<string, any>();

async function request<T>(params: Record<string, string>): Promise<T> {
  const apiKey = getApiKey();
  const url = new URL(API_BASE);
  Object.entries({ ...params, apikey: apiKey ?? '' }).forEach(([k, v]) =>
    url.searchParams.set(k, v)
  );

  const key = url.toString();
  if (cache.has(key)) return cache.get(key);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Network error: ${res.status}`);
  const data = await res.json();
  if (data.Response === 'False') throw new Error(data.Error || 'API error');
  cache.set(key, data);
  return data as T;
}

export async function searchMovies(query: string, page = 1): Promise<{ Search: MovieSummary[]; totalResults: number }>
{
  const data = await request<any>({ s: query, page: String(page) });
  return { Search: data.Search as MovieSummary[], totalResults: Number(data.totalResults || 0) };
}

export async function getMovie(id: string): Promise<MovieDetails> {
  return request<MovieDetails>({ i: id, plot: 'short' });
}

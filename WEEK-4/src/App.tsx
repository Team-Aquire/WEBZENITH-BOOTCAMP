import { useEffect, useMemo, useState } from 'react';
import { searchMovies, getMovie, getApiKey } from './api';
import type { MovieDetails, MovieSummary } from './types';
import SearchBar from './components/SearchBar';
import MovieList from './components/MovieList';
import MovieDetailsModal from './components/MovieDetailsModal';

export default function App() {
  const [apiKey, setApiKey] = useState<string | undefined>(() => getApiKey());
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MovieSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<MovieDetails | null>(null);

  const totalPages = useMemo(() => (total ? Math.ceil(total / 10) : 0), [total]);

  useEffect(() => {
    if (!apiKey) return;
    try {
      localStorage.setItem('omdb_api_key', apiKey);
    } catch {}
  }, [apiKey]);

  async function runSearch(q: string, p = 1) {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const { Search, totalResults } = await searchMovies(q.trim(), p);
      setResults(Search || []);
      setTotal(totalResults || 0);
      setPage(p);
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  async function openDetails(id: string) {
    try {
      setLoading(true);
      const data = await getMovie(id);
      setSelected(data);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch details');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🎬 Movie Search</h1>
        </div>
      </header>

      <main>
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          onSearch={() => runSearch(query, 1)}
          loading={loading}
          disabled={!apiKey}
        />

        {!apiKey && (
          <p className="hint">Enter your OMDb key to start searching. Get one free at omdbapi.com.</p>
        )}

        {error && <div className="error">{error}</div>}

        <MovieList
          movies={results}
          onSelect={(m) => openDetails(m.imdbID)}
          loading={loading}
          emptyMessage={query ? 'No results found.' : 'Try searching for a movie title.'}
        />

        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => runSearch(query, page - 1)}>Prev</button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button disabled={page === totalPages} onClick={() => runSearch(query, page + 1)}>Next</button>
          </div>
        )}
      </main>

      <footer className="footer">Built with React + Vite • Week 4</footer>

      {selected && (
        <MovieDetailsModal movie={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

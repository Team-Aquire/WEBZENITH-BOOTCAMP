import type { MovieSummary } from '../types';
import MovieCard from './MovieCard';

type Props = {
  movies: MovieSummary[];
  onSelect: (movie: MovieSummary) => void;
  loading?: boolean;
  emptyMessage?: string;
};

export default function MovieList({ movies, onSelect, loading, emptyMessage }: Props) {
  if (loading) return <div className="loading">Loading...</div>;
  if (!movies?.length) return <div className="empty">{emptyMessage || 'No movies'}</div>;
  return (
    <div className="grid">
      {movies.map((m) => (
        <MovieCard key={m.imdbID} movie={m} onClick={() => onSelect(m)} />
      ))}
    </div>
  );
}

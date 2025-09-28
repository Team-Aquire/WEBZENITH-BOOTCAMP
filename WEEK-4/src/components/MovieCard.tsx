import type { MovieSummary } from '../types';

type Props = {
  movie: MovieSummary;
  onClick: () => void;
};

export default function MovieCard({ movie, onClick }: Props) {
  const poster = movie.Poster && movie.Poster !== 'N/A'
    ? movie.Poster
    : 'https://via.placeholder.com/300x445?text=No+Poster';
  return (
    <button className="card" onClick={onClick} aria-label={`View ${movie.Title} details`}>
      <img src={poster} alt={`${movie.Title} poster`} />
      <div className="meta">
        <h3>{movie.Title}</h3>
        <p>{movie.Year}</p>
      </div>
    </button>
  );
}

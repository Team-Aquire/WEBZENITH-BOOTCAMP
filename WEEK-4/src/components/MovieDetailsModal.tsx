import { useEffect } from 'react';
import type { MovieDetails } from '../types';

type Props = {
  movie: MovieDetails;
  onClose: () => void;
};

export default function MovieDetailsModal({ movie, onClose }: Props) {
  const poster = movie.Poster && movie.Poster !== 'N/A'
    ? movie.Poster
    : 'https://via.placeholder.com/300x445?text=No+Poster';

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="close" onClick={onClose} aria-label="Close">×</button>
        <div className="modal-content">
          <img src={poster} alt={`${movie.Title} poster`} />
          <div className="details">
            <h2>{movie.Title} <span className="year">({movie.Year})</span></h2>
            {movie.Plot && <p className="plot">{movie.Plot}</p>}
            <ul className="facts">
              {movie.Genre && <li><strong>Genre:</strong> {movie.Genre}</li>}
              {movie.Runtime && <li><strong>Runtime:</strong> {movie.Runtime}</li>}
              {movie.Director && <li><strong>Director:</strong> {movie.Director}</li>}
              {movie.Actors && <li><strong>Actors:</strong> {movie.Actors}</li>}
              {movie.imdbRating && <li><strong>IMDb:</strong> {movie.imdbRating}</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

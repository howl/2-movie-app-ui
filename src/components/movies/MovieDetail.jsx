import { FavoriteButton } from '../favorites/FavoriteButton.jsx';
import './MovieDetail.scss';

export const MovieDetail = ({ movie, isFavorite, onToggleFavorite }) => {
  return (
    <div className="movie-detail">
      <div className="movie-detail-poster">
        {movie.image ? (
          <img src={movie.image} alt={movie.title} />
        ) : (
          <div className="movie-detail-placeholder">Sin póster</div>
        )}
      </div>
      <div className="movie-detail-info">
        <h1>{movie.title}</h1>
        <span>{movie.year}</span>
        <span>{movie.director}</span>
        <span>{movie.genres?.join(', ')}</span>
        <span>{movie.duration} min</span>
        <p>{movie.synopsis}</p>
        {onToggleFavorite && (
          <FavoriteButton isFavorite={isFavorite} onToggle={onToggleFavorite} />
        )}
      </div>
    </div>
  );
};

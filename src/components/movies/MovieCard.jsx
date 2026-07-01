import { Link } from 'react-router';
import { FavoriteButton } from '../favorites/FavoriteButton.jsx';

export const MovieCard = ({ movie, isFavorite, onToggleFavorite }) => {
  return (
    <div className="movie-card">
      <Link to={`/movies/${movie._id}`}>
        {movie.image ? (
          <img src={movie.image} alt={movie.title} className="movie-card-poster" />
        ) : (
          <div className="movie-card-placeholder">Sin póster</div>
        )}
        <div className="movie-card-info">
          <h3>{movie.title}</h3>
          <span>{movie.year}</span>
          <span>{movie.director}</span>
          <span>{movie.genres?.join(', ')}</span>
        </div>
      </Link>
      <FavoriteButton isFavorite={isFavorite} onToggle={onToggleFavorite} />
    </div>
  );
};

import { MovieCard } from '../movies/MovieCard.jsx';
import './FavoritesList.scss';

export const FavoritesList = ({ movies, onToggleFavorite }) => {
  if (!movies || movies.length === 0) {
    return <p className="favorites-list-empty">No tienes películas favoritas</p>;
  }

  return (
    <div className="favorites-list">
      {movies.map((movie) => (
        <MovieCard
          key={movie._id}
          movie={movie}
          isFavorite={true}
          onToggleFavorite={() => onToggleFavorite?.(movie._id)}
        />
      ))}
    </div>
  );
};

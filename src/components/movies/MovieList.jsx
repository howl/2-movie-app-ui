import { MovieCard } from './MovieCard.jsx';

export const MovieList = ({ movies, isFavorite, onToggleFavorite }) => {
  if (!movies || movies.length === 0) {
    return <p className="movie-list-empty">No se encontraron películas</p>;
  }

  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <MovieCard
          key={movie._id}
          movie={movie}
          isFavorite={isFavorite?.(movie._id)}
          onToggleFavorite={() => onToggleFavorite?.(movie._id)}
        />
      ))}
    </div>
  );
};

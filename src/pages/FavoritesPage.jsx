import { useEffect } from 'react';
import { FavoritesList } from '../components/favorites/FavoritesList.jsx';
import { ErrorMessage } from '../components/common/ErrorMessage.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { movieService } from '../services/movieService.js';

export const FavoritesPage = () => {
  const favoritesFetch = useFetch();

  useEffect(() => {
    favoritesFetch.execute(movieService.getFavorites);
  }, []);

  const handleRemoveFavorite = async (movieId) => {
    try {
      await movieService.removeFavorite(movieId);
      favoritesFetch.execute(movieService.getFavorites);
    } catch {
      // already handled
    }
  };

  if (favoritesFetch.loading) return <p>Cargando...</p>;
  if (favoritesFetch.error) return <ErrorMessage message={favoritesFetch.error} />;

  return (
    <div className="favorites-page">
      <h1>Mis favoritos</h1>
      <FavoritesList
        movies={favoritesFetch.data?.msg}
        onToggleFavorite={handleRemoveFavorite}
      />
    </div>
  );
};

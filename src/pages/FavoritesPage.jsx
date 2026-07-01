import { useEffect } from 'react';
import { movieService } from '../services/movieService.js';
import { useFetch } from '../hooks/useFetch.js';
import { FavoritesList } from '../components/favorites/FavoritesList.jsx';
import { Loading } from '../components/common/Loading.jsx';
import { ErrorMessage } from '../components/common/ErrorMessage.jsx';
import './FavoritesPage.scss';

export const FavoritesPage = () => {
  const favoritesFetch = useFetch();

  useEffect(() => {
    favoritesFetch.execute(movieService.getFavorites);
  }, []);

  const handleRemoveFavorite = async (movieId) => {
    await movieService.removeFavorite(movieId);
    favoritesFetch.execute(movieService.getFavorites);
  };

  if (favoritesFetch.loading) return <Loading />;
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

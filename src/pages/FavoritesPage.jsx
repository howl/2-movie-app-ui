import { useEffect } from 'react';
import { movieService } from '../services/movieService.js';
import { useFetch } from '../hooks/useFetch.js';
import { FavoritesList } from '../components/favorites/FavoritesList.jsx';
import { Loading } from '../components/common/Loading.jsx';
import { ErrorMessage } from '../components/common/ErrorMessage.jsx';
import './FavoritesPage.scss';

export const FavoritesPage = () => {
  const { data: favData, loading: favLoading, error: favError, execute: executeFav } = useFetch();

  useEffect(() => {
    executeFav(movieService.getFavorites);
  }, [executeFav]);

  const handleRemoveFavorite = async (movieId) => {
    await movieService.removeFavorite(movieId);
    executeFav(movieService.getFavorites);
  };

  if (favLoading) return <Loading />;
  if (favError) return <ErrorMessage message={favError} />;

  return (
    <div className="favorites-page">
      <h1>Mis favoritos</h1>
      <FavoritesList
        movies={favData?.msg}
        onToggleFavorite={handleRemoveFavorite}
      />
    </div>
  );
};

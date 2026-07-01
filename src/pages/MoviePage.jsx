import { useParams } from 'react-router';
import { useEffect } from 'react';
import { MovieDetail } from '../components/movies/MovieDetail.jsx';
import { Loading } from '../components/common/Loading.jsx';
import { ErrorMessage } from '../components/common/ErrorMessage.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { movieService } from '../services/movieService.js';

export const MoviePage = () => {
  const { id } = useParams();
  const movieFetch = useFetch();
  const favoritesFetch = useFetch();

  useEffect(() => {
    movieFetch.execute(movieService.getById, id);
  }, [id]);

  useEffect(() => {
    favoritesFetch.execute(movieService.getFavorites);
  }, []);

  if (movieFetch.loading) return <Loading />;
  if (movieFetch.error) return <ErrorMessage message={movieFetch.error} />;
  if (!movieFetch.data) return null;

  const movie = movieFetch.data.msg;
  const isFavorite = favoritesFetch.data?.msg?.some((fav) => fav._id === id);

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await movieService.removeFavorite(id);
      } else {
        await movieService.addFavorite(id);
      }
      favoritesFetch.execute(movieService.getFavorites);
    } catch {
      // handled
    }
  };

  return (
    <MovieDetail
      movie={movie}
      isFavorite={isFavorite}
      onToggleFavorite={handleToggleFavorite}
    />
  );
};

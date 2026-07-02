import { useEffect } from 'react';
import { useParams } from 'react-router';
import { movieService } from '../services/movieService.js';
import { useFetch } from '../hooks/useFetch.js';
import { MovieDetail } from '../components/movies/MovieDetail.jsx';
import { Loading } from '../components/common/Loading.jsx';
import { ErrorMessage } from '../components/common/ErrorMessage.jsx';
import './MoviePage.scss';

export const MoviePage = () => {
  const { id } = useParams();
  const { data: movieData, loading: movieLoading, error: movieError, execute: executeMovie } = useFetch();
  const { data: favData, execute: executeFav } = useFetch();

  useEffect(() => {
    executeMovie(movieService.getById, id);
  }, [id, executeMovie]);

  useEffect(() => {
    executeFav(movieService.getFavorites);
  }, [executeFav]);

  if (movieLoading) return <Loading />;
  if (movieError) return <ErrorMessage message={movieError} />;
  if (!movieData) return null;

  const movie = movieData.msg;
  const isFavorite = favData?.msg?.some((fav) => fav._id === id);

  const handleToggleFavorite = async () => {
    if (isFavorite) {
      await movieService.removeFavorite(id);
    } else {
      await movieService.addFavorite(id);
    }
    executeFav(movieService.getFavorites);
  };

  return (
    <MovieDetail
      movie={movie}
      isFavorite={isFavorite}
      onToggleFavorite={handleToggleFavorite}
    />
  );
};

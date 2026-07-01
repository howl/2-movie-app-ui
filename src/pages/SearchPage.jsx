import { movieService } from '../services/movieService.js';
import { useFetch } from '../hooks/useFetch.js';
import { SearchBar } from '../components/movies/SearchBar.jsx';
import { MovieList } from '../components/movies/MovieList.jsx';
import { Loading } from '../components/common/Loading.jsx';
import { ErrorMessage } from '../components/common/ErrorMessage.jsx';
import './SearchPage.scss';

export const SearchPage = () => {
  const searchFetch = useFetch();
  const favoritesFetch = useFetch();

  const handleSearch = (title) => {
    searchFetch.execute(movieService.search, title);
  };

  const handleToggleFavorite = async (movieId) => {
    await movieService.addFavorite(movieId);
    favoritesFetch.execute(movieService.getFavorites);
  };

  const isFavorite = (movieId) => {
    return favoritesFetch.data?.msg?.some((fav) => fav._id === movieId);
  };

  return (
    <div className="search-page">
      <SearchBar onSearch={handleSearch} />
      {searchFetch.loading && <Loading />}
      {searchFetch.error && <ErrorMessage message={searchFetch.error} />}
      <MovieList
        movies={searchFetch.data?.msg || searchFetch.data?.peliculas}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
};

import { movieService } from '../services/movieService.js';
import { useFetch } from '../hooks/useFetch.js';
import { SearchBar } from '../components/movies/SearchBar.jsx';
import { MovieList } from '../components/movies/MovieList.jsx';
import { Loading } from '../components/common/Loading.jsx';
import { ErrorMessage } from '../components/common/ErrorMessage.jsx';
import './SearchPage.scss';

export const SearchPage = () => {
  const { data: searchData, loading: searchLoading, error: searchError, execute: executeSearch } = useFetch();
  const { data: favData, execute: executeFav } = useFetch();

  const handleSearch = (title) => {
    executeSearch(movieService.search, title);
  };

  const handleToggleFavorite = async (movieId) => {
    await movieService.addFavorite(movieId);
    executeFav(movieService.getFavorites);
  };

  const isFavorite = (movieId) => {
    return favData?.msg?.some((fav) => fav._id === movieId);
  };

  return (
    <div className="search-page">
      <SearchBar onSearch={handleSearch} />
      {searchLoading && <Loading />}
      {searchError && <ErrorMessage message={searchError} />}
      <MovieList
        movies={searchData?.msg || searchData?.peliculas}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
};

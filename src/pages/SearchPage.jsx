import { SearchBar } from '../components/movies/SearchBar.jsx';
import { MovieList } from '../components/movies/MovieList.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { movieService } from '../services/movieService.js';

export const SearchPage = () => {
  const searchFetch = useFetch();
  const favoritesFetch = useFetch();

  const handleSearch = (title) => {
    searchFetch.execute(movieService.search, title);
  };

  const handleToggleFavorite = async (movieId) => {
    try {
      await movieService.addFavorite(movieId);
      favoritesFetch.execute(movieService.getFavorites);
    } catch {
      // already handled
    }
  };

  const isFavorite = (movieId) => {
    return favoritesFetch.data?.msg?.some((fav) => fav._id === movieId);
  };

  return (
    <div className="search-page">
      <SearchBar onSearch={handleSearch} />
      {searchFetch.loading && <p>Cargando...</p>}
      {searchFetch.error && <p className="error">{searchFetch.error}</p>}
      <MovieList
        movies={searchFetch.data?.msg || searchFetch.data?.peliculas}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
};

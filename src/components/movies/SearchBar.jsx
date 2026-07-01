import { useState, useEffect } from 'react';
import './SearchBar.scss';

export const SearchBar = ({ onSearch }) => {
  const [term, setTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(term);
    }, 300);

    return () => clearTimeout(timer);
  }, [term, onSearch]);

  return (
    <form className="search-bar" onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        placeholder="Buscar películas..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <button type="submit">Buscar</button>
    </form>
  );
};

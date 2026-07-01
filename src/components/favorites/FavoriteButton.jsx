import './FavoriteButton.scss';

export const FavoriteButton = ({ isFavorite, onToggle, loading }) => {
  return (
    <button
      className={`favorite-button ${isFavorite ? 'favorite-button--active' : ''}`}
      onClick={onToggle}
      disabled={loading}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {loading ? '...' : isFavorite ? '★' : '☆'}
    </button>
  );
};

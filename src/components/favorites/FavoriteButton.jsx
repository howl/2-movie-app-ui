import './FavoriteButton.scss';

export const FavoriteButton = ({ isFavorite, onToggle }) => {
  return (
    <button
      className={`favorite-button ${isFavorite ? 'favorite-button--active' : ''}`}
      onClick={onToggle}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorite ? '★' : '☆'}
    </button>
  );
};

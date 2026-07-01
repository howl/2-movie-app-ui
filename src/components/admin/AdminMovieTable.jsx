import './AdminMovieTable.scss';

export const AdminMovieTable = ({ movies, onEdit, onDelete }) => {
  if (!movies || movies.length === 0) {
    return <p className="admin-table-empty">No hay películas en el catálogo</p>;
  }

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Título</th>
          <th>Año</th>
          <th>Director</th>
          <th>Duración</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {movies.map((movie) => (
          <tr key={movie._id}>
            <td>{movie.title}</td>
            <td>{movie.year}</td>
            <td>{movie.director}</td>
            <td>{movie.duration} min</td>
            <td>
              <button onClick={() => onEdit(movie)}>Editar</button>
              <button onClick={() => {
                if (window.confirm('¿Eliminar esta película?')) {
                  onDelete(movie._id);
                }
              }}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

import { useState } from 'react';

export const AdminMovieForm = ({ onSubmit, initialData, success, error, loading }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [year, setYear] = useState(initialData?.year || '');
  const [director, setDirector] = useState(initialData?.director || '');
  const [duration, setDuration] = useState(initialData?.duration || '');
  const [synopsis, setSynopsis] = useState(initialData?.synopsis || '');
  const [genres, setGenres] = useState(initialData?.genres?.join(', ') || '');
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('year', String(year));
    formData.append('director', director);
    formData.append('duration', String(duration));
    formData.append('synopsis', synopsis);
    genres.split(',').forEach((g) => formData.append('genres[]', g.trim()));
    if (image) {
      formData.append('image', image);
    }
    onSubmit(formData);
  };

  const isEditing = !!initialData;

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      {success && <p className="admin-form-success">{success}</p>}
      {error && <p className="admin-form-error">{error}</p>}

      <label>Título<input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
      <label>Año<input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} /></label>
      <label>Director<input value={director} onChange={(e) => setDirector(e.target.value)} /></label>
      <label>Duración (min)<input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} /></label>
      <label>Sinopsis<textarea value={synopsis} onChange={(e) => setSynopsis(e.target.value)} /></label>
      <label>Géneros<input value={genres} onChange={(e) => setGenres(e.target.value)} placeholder="Acción, Drama" /></label>
      <label>Imagen<input type="file" onChange={(e) => setImage(e.target.files[0])} /></label>

      <button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear película'}
      </button>
    </form>
  );
};

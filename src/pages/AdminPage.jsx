import { useState, useEffect } from 'react';
import { AdminMovieTable } from '../components/admin/AdminMovieTable.jsx';
import { AdminMovieForm } from '../components/admin/AdminMovieForm.jsx';
import { Loading } from '../components/common/Loading.jsx';
import { ErrorMessage } from '../components/common/ErrorMessage.jsx';
import { adminService } from '../services/adminService.js';
import { useFetch } from '../hooks/useFetch.js';

export const AdminPage = () => {
  const [view, setView] = useState('list');
  const [editingMovie, setEditingMovie] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const moviesFetch = useFetch();

  useEffect(() => {
    moviesFetch.execute(adminService.getAll);
  }, []);

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setView('form');
    setSuccess(null);
    setFormError(null);
  };

  const handleDelete = async (id) => {
    try {
      await adminService.remove(id);
      moviesFetch.execute(adminService.getAll);
    } catch {
      // ErrorBoundary handles it
    }
  };

  const handleCreate = () => {
    setEditingMovie(null);
    setView('form');
    setSuccess(null);
    setFormError(null);
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    setFormError(null);
    setSuccess(null);
    try {
      if (editingMovie) {
        await adminService.update(editingMovie._id, formData);
      } else {
        await adminService.create(formData);
      }
      setSuccess(editingMovie ? 'Película actualizada correctamente' : 'Película creada correctamente');
      moviesFetch.execute(adminService.getAll);
    } catch (err) {
      setFormError(err.message || 'Error al guardar la película');
    } finally {
      setFormLoading(false);
    }
  };

  if (view === 'form') {
    return (
      <div className="admin-page">
        <h1>{editingMovie ? 'Editar película' : 'Nueva película'}</h1>
        <button onClick={() => { setView('list'); setSuccess(null); setFormError(null); }}>Volver al listado</button>
        <AdminMovieForm
          onSubmit={handleFormSubmit}
          initialData={editingMovie}
          success={success}
          error={formError}
          loading={formLoading}
        />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h1>Administrar películas</h1>
      <button onClick={handleCreate}>Nueva película</button>
      {moviesFetch.loading && <Loading />}
      {moviesFetch.error && <ErrorMessage message={moviesFetch.error} />}
      <AdminMovieTable
        movies={moviesFetch.data?.movies}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

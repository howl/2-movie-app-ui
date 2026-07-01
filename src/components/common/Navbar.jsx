import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth.js';
import './Navbar.scss';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Movie App</Link>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        {isAuthenticated && <Link to="/favorites">Favorites</Link>}
        {isAdmin && <Link to="/admin/movies">Admin</Link>}
      </div>
      <div className="navbar-user">
        {isAuthenticated ? (
          <>
            <span className="navbar-username">{user?.name}</span>
            <button onClick={handleLogout}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

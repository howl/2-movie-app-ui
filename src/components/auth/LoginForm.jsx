import { Link } from 'react-router';

export const LoginForm = ({ onSubmit, errors, loading }) => {
  return (
    <form className="login-form" onSubmit={onSubmit}>
      <label>
        Email
        <input type="email" name="email" />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </label>
      <label>
        Password
        <input type="password" name="password" />
        {errors.password && <span className="field-error">{errors.password}</span>}
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Cargando...' : 'Iniciar sesión'}
      </button>
      <Link to="/signup">Signup</Link>
    </form>
  );
};

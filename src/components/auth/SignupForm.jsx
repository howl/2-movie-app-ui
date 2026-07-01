import { Link } from 'react-router';

export const SignupForm = ({ onSubmit, errors, loading }) => {
  return (
    <form className="signup-form" onSubmit={onSubmit}>
      <label>
        Name
        <input type="text" name="name" />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </label>
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
        {loading ? 'Cargando...' : 'Crear cuenta'}
      </button>
      <Link to="/login">Login</Link>
    </form>
  );
};

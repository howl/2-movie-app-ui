import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';
import { LoginForm } from '../components/auth/LoginForm.jsx';
import { authService } from '../services/authService.js';
import { useForm } from '../hooks/useForm.js';
import { isValidEmail, isRequired } from '../utils/validators.js';
import { ErrorMessage } from '../components/common/ErrorMessage.jsx';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const form = useForm(
    { email: '', password: '' },
    {
      email: (v) => (!isValidEmail(v) ? 'Email inválido' : null),
      password: (v) => (!isRequired(v) ? 'Contraseña requerida' : null),
    },
  );

  const handleLogin = form.handleSubmit(async () => {
    try {
      const response = await authService.login(form.values.email, form.values.password);
      login(response.user, response.token);
      navigate(from, { replace: true });
    } catch (error) {
      form.setErrors({ general: error.message });
    }
  });

  return (
    <div className="login-page">
      <h1>Iniciar sesión</h1>
      {form.errors.general && <ErrorMessage message={form.errors.general} />}
      <LoginForm onSubmit={handleLogin} errors={form.errors} />
    </div>
  );
};

import { useNavigate } from 'react-router';
import { authService } from '../services/authService.js';
import { useAuth } from '../hooks/useAuth.js';
import { useForm } from '../hooks/useForm.js';
import { isValidEmail, isValidPassword, isRequired } from '../utils/validators.js';
import { SignupForm } from '../components/auth/SignupForm.jsx';
import { ErrorMessage } from '../components/common/ErrorMessage.jsx';
import './SignupPage.scss';

export const SignupPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm(
    { name: '', email: '', password: '' },
    {
      name: (v) => (!isRequired(v) ? 'Nombre requerido' : v.length < 3 ? 'Mínimo 3 caracteres' : null),
      email: (v) => (!isValidEmail(v) ? 'Email inválido' : null),
      password: (v) => (!isValidPassword(v) ? 'Debe tener 8+ caracteres, letras y números' : null),
    },
  );

  const handleSignup = form.handleSubmit(async () => {
    try {
      const response = await authService.signup(form.values.name, form.values.email, form.values.password);
      login(response.user, response.token);
      navigate('/', { replace: true });
    } catch (error) {
      form.setErrors({ general: error.message });
    }
  });

  return (
    <div className="signup-page">
      <h1>Crear cuenta</h1>
      {form.errors.general && <ErrorMessage message={form.errors.general} />}
      <SignupForm onSubmit={handleSignup} errors={form.errors} />
    </div>
  );
};

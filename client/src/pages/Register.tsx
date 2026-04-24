import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validación frontend
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError('La contraseña debe tener al menos 1 mayúscula');
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError('La contraseña debe tener al menos 1 minúscula');
      return;
    }
    if (!/\d/.test(password)) {
      setError('La contraseña debe tener al menos 1 número');
      return;
    }

    setLoading(true);

    try {
      await register(email, password);
      navigate('/login');
    } catch (err: unknown) {
      setError('Error al registrar. Verificá los datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="auth-form">
        <div className="auth-header">
          <h1>Registrarse</h1>
          <p>Creá tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p className="error">{error}</p>}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <small style={{ color: 'var(--text)', fontSize: '12px' }}>
              Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número
            </small>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Cargando...' : 'Registrarse'}
          </button>
        </form>

        <div className="auth-footer">
          ¿Ya tenés cuenta? <a href="/login">Iniciar Sesión</a>
        </div>
      </div>
    </div>
  );
}

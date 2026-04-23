import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.register({ email, password, name });
      localStorage.setItem('token', response.access_token);
      navigate('/products');
    } catch (err: unknown) {
      setError('Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Registrarse</h1>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}

        <div>
          <label>Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Registrarse'}
        </button>
      </form>

      <p>
        ¿Ya tenés cuenta? <a href="/login">Iniciar Sesión</a>
      </p>
    </div>
  );
}

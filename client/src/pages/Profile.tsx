import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useCart } from '../context/CartContext';
import type { User } from '../types';

export function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    clearCart();
    navigate('/login');
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="page">
      <h1>Mi Perfil</h1>
      {user && (
        <div>
          <p>Email: {user.email}</p>
          <p>ID: {user.id}</p>
          <p>Estado: {user.isActive ? 'Activo' : 'Inactivo'}</p>
        </div>
      )}
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
}
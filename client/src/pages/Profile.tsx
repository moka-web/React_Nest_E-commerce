import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export function Profile() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const { clearCart } = useCart();

  useEffect(() => {
    console.log('Profile render, loading:', loading, 'user:', user);
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  const handleLogout = () => {
    logout();
    clearCart();
    navigate('/login');
  };

  if (loading) return <div className="page">Cargando...</div>;
  if (!user) return null;

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <div className="page">
      <h1>Mi Perfil</h1>
      
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">{getInitials(user.email)}</div>
          <div className="profile-info">
            <h2>{user.email}</h2>
            <p>{user.isActive ? 'Activo' : 'Inactivo'}</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-detail">
            <label>Email</label>
            <span>{user.email}</span>
          </div>
          <div className="profile-detail">
            <label>ID</label>
            <span>{user.id}</span>
          </div>
        </div>

        <button onClick={handleLogout} className="btn-logout">
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
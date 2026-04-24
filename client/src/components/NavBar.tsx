import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export function NavBar() {
  const { items } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/products">Tienda</Link>
      </div>
      <div className="nav-links">
        <Link to="/products">Productos</Link>
        
        {user ? (
          <>
            <Link to="/cart">Carrito ({totalItems})</Link>
            <Link to="/orders">Pedidos</Link>
            <Link to="/profile">Perfil</Link>
            <button onClick={handleLogout} className="btn-logout-nav">
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
}
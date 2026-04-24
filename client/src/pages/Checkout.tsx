import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';

export function Checkout() {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countryCode, setCountryCode] = useState('AR');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      for (const item of items) {
        await orderService.create({
          productVariationId: item.id,
          countryCode,
          quantity: item.quantity,
        });
      }
      clearCart();
      navigate('/orders');
    } catch {
      setError('Error al procesar el pedido. Verificá stock.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="page">
        <h1>Checkout</h1>
        <div className="empty-cart">
          <p>Tu carrito está vacío</p>
          <Link to="/products" className="btn" style={{ marginTop: '16px' }}>
            Ver Productos
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page">
        <h1>Checkout</h1>
        <div className="empty-cart">
          <p>Debes iniciar sesión para comprar</p>
          <Link to="/login" className="btn" style={{ marginTop: '16px' }}>
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="page">
      <h1>Checkout</h1>
      
      <div className="checkout-layout">
        <div className="checkout-section">
          <h2>Información de Entrega</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>País de entrega:</label>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              >
                <option value="AR">Argentina</option>
                <option value="US">Estados Unidos</option>
                <option value="ES">España</option>
                <option value="EG">Egipto</option>
              </select>
            </div>

            {error && <div className="error">{error}</div>}

            <button type="submit" disabled={loading}>
              {loading ? 'Procesando...' : 'Confirmar Pedido'}
            </button>
          </form>
        </div>

        <div className="checkout-section">
          <h2>Resumen de Compra</h2>
          
          <ul className="checkout-items">
            {items.map((item) => (
              <li key={item.id} className="checkout-item">
                <span className="checkout-item-name">
                  {item.name || item.title}
                </span>
                <span className="checkout-item-qty">
                  x{item.quantity}
                </span>
              </li>
            ))}
          </ul>
          
          <div className="checkout-total">
            <span>Total</span>
            <span>{totalItems} items</span>
          </div>
        </div>
      </div>
    </div>
  );
}
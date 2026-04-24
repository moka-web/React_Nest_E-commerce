import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';

export function Checkout() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countryCode, setCountryCode] = useState('AR');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

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
      setError('Error al procesar pedido');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="page">
        <h1>Checkout</h1>
        <p>Tu carrito está vacío</p>
        <Link to="/products">Ver Productos</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>País:</label>
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
          >
            <option value="AR">Argentina</option>
            <option value="US">Estados Unidos</option>
            <option value="ES">España</option>
          </select>
        </div>

        <h2>Resumen</h2>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.name} x{item.quantity}
            </li>
          ))}
        </ul>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Procesando...' : 'Confirmar Pedido'}
        </button>
      </form>
    </div>
  );
}
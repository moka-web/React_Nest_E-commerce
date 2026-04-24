import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export function Cart() {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="page">
        <h1>Carrito</h1>
        <div className="empty-cart">
          <p>Tu carrito está vacío</p>
          <Link to="/products" className="btn" style={{ marginTop: '16px' }}>
            Ver Productos
          </Link>
        </div>
      </div>
    );
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="page">
      <h1>Carrito</h1>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <Link to={`/products/${item.id}`}>{item.name || item.title}</Link>
              </td>
              <td>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.id, Number(e.target.value))
                  }
                />
              </td>
              <td>{item.quantity} x</td>
              <td>
                <button onClick={() => removeItem(item.id)} className="btn-delete">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="cart-actions">
        <div className="cart-total">
          <p>Total de items: {totalItems}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={clearCart} className="btn-delete">
            Vaciar Carrito
          </button>
          <Link to="/checkout" className="btn">
            Proceder al Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export function Cart() {
  const { items, removeItem, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="page">
        <h1>Carrito</h1>
        <p>Tu carrito está vacío</p>
        <Link to="/products">Ver Productos</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Carrito</h1>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>
                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  onChange={(e) =>
                    updateQuantity(item.id, Number(e.target.value))
                  }
                />
              </td>
              <td>
                <button onClick={() => removeItem(item.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="cart-total">
        <p>Total de items: {items.reduce((sum, i) => sum + i.quantity, 0)}</p>
        <button onClick={clearCart}>Vaciar Carrito</button>
        <Link to="/checkout">Continuar Compra</Link>
      </div>
    </div>
  );
}
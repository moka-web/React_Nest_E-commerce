import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import type { Order } from '../types';

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    orderService
      .getAll()
      .then(setOrders)
      .catch(() => setError('Error al cargar pedidos'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleCancel = async (orderId: number) => {
    if (!confirm('¿Querés cancelar este pedido?')) return;
    try {
      await orderService.cancel(orderId);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o));
    } catch {
      setError('No se puede cancelar');
    }
  };

  const getStatusLabel = ( status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'Pendiente',
      CONFIRMED: 'Confirmado',
      CANCELLED: 'Cancelado',
      FULFILLED: 'Completado',
    };
    return labels[status] || status;
  };

  const getStatusClass = (status: string) => {
    const classes: Record<string, string> = {
      PENDING: 'status-pending',
      CONFIRMED: 'status-confirmed',
      CANCELLED: 'status-cancelled',
      FULFILLED: 'status-fulfilled',
    };
    return classes[status] || '';
  };

  if (!user) {
    return (
      <div className="page">
        <h1>Mis Pedidos</h1>
        <div className="empty-cart">
          <p>Debes iniciar sesión</p>
          <Link to="/login" className="btn" style={{ marginTop: '16px' }}>
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <div className="page">Cargando...</div>;
  if (error) return <div className="page">{error}</div>;

  return (
    <div className="page">
      <h1>Mis Pedidos</h1>
      
      {orders.length === 0 ? (
        <div className="empty-cart">
          <p>No tenés pedidos aún</p>
          <Link to="/products" className="btn" style={{ marginTop: '16px' }}>
            Ver Productos
          </Link>
        </div>
      ) : (
        <table className="cart-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cantidad</th>
              <th>País</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.quantity}</td>
                <td>{order.countryCode}</td>
                <td>
                  <span className={`status ${getStatusClass(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td>
                  {order.status === 'PENDING' && (
                    <button 
                      onClick={() => handleCancel(order.id)}
                      className="btn-delete"
                    >
                      Cancelar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {orders.length > 0 && (
        <div className="page-footer">
          <Link to="/products" className="btn">
            Seguir Comprando
          </Link>
        </div>
      )}
    </div>
  );
}
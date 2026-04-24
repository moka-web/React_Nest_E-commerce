import { useNotifications } from '../context/NotificationContext';

export function Notifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } =
    useNotifications();

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      WELCOME: 'Bienvenida',
      ORDER_CONFIRMATION: 'Pedido',
      ORDER_CANCELLED: 'Cancelación',
      PRODUCT_CREATED: 'Producto',
      SYSTEM: 'Sistema',
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      WELCOME: '👋',
      ORDER_CONFIRMATION: '📦',
      ORDER_CANCELLED: '❌',
      PRODUCT_CREATED: '🏷️',
      SYSTEM: '⚙️',
    };
    return icons[type] || '📌';
  };

  if (loading && notifications.length === 0) {
    return <div className="page">Cargando...</div>;
  }

  return (
    <div className="page">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <h1>Notificaciones</h1>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="btn" style={{ background: 'var(--code-bg)', color: 'var(--text)' }}>
            Marcar todas como leídas
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="empty-cart">
          <p>No tenés notificaciones</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-card ${notification.read ? 'read' : 'unread'}`}
              onClick={() => !notification.read && markAsRead(notification.id)}
              style={{
                padding: '16px',
                marginBottom: '12px',
                borderRadius: '8px',
                border: `1px solid ${notification.read ? 'var(--border)' : 'var(--accent)'}`,
                background: notification.read ? 'var(--bg)' : 'var(--accent-bg)',
                cursor: notification.read ? 'default' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>{getTypeIcon(notification.type)}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-h)' }}>
                      {notification.title}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text)' }}>
                      {getTypeLabel(notification.type)}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text)', margin: '8px 0 0', fontSize: '14px' }}>
                    {notification.message}
                  </p>
                  <span style={{ fontSize: '12px', color: 'var(--text)', opacity: 0.7 }}>
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
                {!notification.read && (
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
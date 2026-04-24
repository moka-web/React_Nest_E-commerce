# Frontend — React + TypeScript + Vite

Cliente web del e-commerce full stack.

## 🛠️ Stack

- **React** 19.2
- **TypeScript**
- **Vite** 8
- **React Router** v7
- **Axios** (HTTP client)

## 📁 Estructura

```
src/
├── api/
│   └── axios.ts          # Configuración de axios con interceptors
├── components/
│   ├── NavBar.tsx        # Navegación
│   └── ProductCard.tsx   # Tarjeta de producto
├── context/
│   ├── AuthContext.tsx   # Estado de autenticación
│   ├── CartContext.tsx    # Carrito de compras
│   └── NotificationContext.tsx  # Notificaciones
├── pages/
│   ├── Login.tsx         # Login
│   ├── Register.tsx      # Registro
│   ├── Products.tsx      # Lista de productos
│   ├── ProductDetail.tsx # Detalle de producto
│   ├── CreateProduct.tsx # Crear producto (Merchant)
│   ├── Cart.tsx          # Carrito
│   ├── Checkout.tsx      # Checkout
│   ├── Orders.tsx        # Pedidos
│   ├── Profile.tsx       # Perfil de usuario
│   └── Notifications.tsx # Notificaciones
├── services/
│   ├── authService.ts
│   ├── productService.ts
│   ├── orderService.ts
│   └── notificationService.ts
├── types/
│   └── index.ts          # Tipos TypeScript
├── App.tsx               # Componente principal
└── main.tsx              # Entry point
```

## 🚀 Cómo Levantar

```bash
npm install
npm run dev
```

## 🔗 Variables de Entorno

Crear `.env.development`:
```bash
VITE_API_URL=http://localhost:3000
```

Para producción (Vercel), setear `VITE_API_URL` en el dashboard.

## 🔐 Autenticación

El frontend maneja JWT con:
- **localStorage** para guardar el token
- **Interceptor de Axios** para agregar el token a cada request
- **AuthContext** para estado global de usuario

### Estructura del Token JWT

```typescript
{
  id: number,
  email: string,
  roles: [{ id: number, name: string }]
}
```

## 🛒 Carrito

- Manejado con React Context (`CartContext`)
- No persiste entre sesiones (se pierde al cerrar el navegador)
- Agrega productos por variation ID

## 📱 Páginas

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/` | Redirect | Redirige a `/products` |
| `/login` | Login | Iniciar sesión |
| `/register` | Register | Registrarse (con selección de rol) |
| `/products` | Products | Lista de productos |
| `/products/:id` | ProductDetail | Detalle de producto |
| `/products/new` | CreateProduct | Crear producto (Merchant+) |
| `/cart` | Cart | Carrito de compras |
| `/checkout` | Checkout | Finalizar compra |
| `/orders` | Orders | Mis pedidos |
| `/profile` | Profile | Mi perfil |
| `/notifications` | Notifications | Notificaciones |

## 🎨 Roles y Vistas

| Rol | puede ver |
|-----|-----------|
| Customer | Productos, carrito, pedidos, perfil |
| Merchant | Lo anterior + crear productos |
| Admin | Todo |

## 🔌 API Endpoints Consumidos

| Servicio | Endpoint | Método |
|----------|----------|--------|
| auth | `/auth/login` | POST |
| auth | `/auth/register` | POST |
| user | `/user/profile` | GET |
| product | `/product` | GET |
| product | `/product/:id` | GET |
| product | `/product/create` | POST |
| order | `/order` | POST |
| order | `/order` | GET |
| notification | `/notification` | GET |
| notification | `/notification/read/:id` | PATCH |
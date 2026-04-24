# Frontend — React E-commerce Client

Cliente web del e-commerce full stack.

## Stack

- **React** 19
- **TypeScript**
- **Vite** 8
- **React Router** v7
- **Axios**

## Estructura

```
src/
├── api/
│   └── axios.ts           # Configuración HTTP con interceptors
├── components/
│   ├── NavBar.tsx        # Navegación
│   └── ProductCard.tsx   # Tarjeta de producto
├── context/
│   ├── AuthContext.tsx   # Estado de autenticación
│   ├── CartContext.tsx    # Carrito de compras
│   └── NotificationContext.tsx  # Notificaciones
├── pages/
│   ├── Login.tsx         # Login
│   ├── Register.tsx      # Registro (con selección de rol)
│   ├── Products.tsx      # Lista de productos
│   ├── ProductDetail.tsx # Detalle de producto
│   ├── CreateProduct.tsx # Crear producto (merchant)
│   ├── Cart.tsx          # Carrito
│   ├── Checkout.tsx      # Checkout
│   ├── Orders.tsx        # Pedidos
│   ├── Profile.tsx       # Perfil
│   └── Notifications.tsx # Notificaciones
├── services/
│   ├── authService.ts
│   ├── productService.ts
│   ├── orderService.ts
│   └── notificationService.ts
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx
```

## Cómo Levantar

```bash
npm install
npm run dev
```

## Variables de Entorno

Crear `.env.development`:
```bash
VITE_API_URL=http://localhost:3000
```

Para Vercel: setear `VITE_API_URL` en Project Settings.

## Rutas

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/login` | Login | Iniciar sesión |
| `/register` | Register | Registrarse (Customer o Merchant) |
| `/products` | Products | Lista de productos |
| `/products/:id` | ProductDetail | Detalle de producto |
| `/products/new` | CreateProduct | Crear producto (merchant+) |
| `/cart` | Cart | Carrito de compras |
| `/checkout` | Checkout | Finalizar compra |
| `/orders` | Orders | Mis pedidos |
| `/profile` | Profile | Mi perfil |
| `/notifications` | Notifications | Notificaciones |

## Autenticación

- JWT almacenado en `localStorage`
- Axios interceptor agrega `Authorization: Bearer <token>`
- `AuthContext` provee estado global de usuario

## API Consumida

| Servicio | Método | Endpoint |
|----------|--------|----------|
| auth | POST | `/auth/login` |
| auth | POST | `/auth/register` |
| user | GET | `/user/profile` |
| product | GET | `/product` |
| product | GET | `/product/:id` |
| product | POST | `/product/create` |
| order | GET | `/order` |
| order | POST | `/order` |
| order | PATCH | `/order/:id/cancel` |
| notification | GET | `/notification` |
| notification | PATCH | `/notification/read/:id` |
| notification | PATCH | `/notification/read-all` |
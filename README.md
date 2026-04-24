# E-commerce Full Stack

Aplicacion web full stack de e-commerce construida con **Nest.js** (backend) y **React** (frontend).

## Links

| Servicio | URL |
|----------|-----|
| **Frontend** (Vercel) | https://react-nest-e-commerce.vercel.app |
| **Backend** (Render) | https://react-nest-e-commerce-2.onrender.com |
| **Swagger** (Docs API) | https://react-nest-e-commerce-2.onrender.com/api |

## Stack Tecnologico

### Backend
- **Framework**: Nest.js 9.x
- **Lenguaje**: TypeScript
- **ORM**: TypeORM
- **Base de datos**: PostgreSQL
- **Autenticacion**: JWT
- **Documentacion**: Swagger
- **Testing**: Jest
- **Contenedor**: Docker

### Frontend
- **Framework**: React 19
- **Build tool**: Vite
- **Lenguaje**: TypeScript
- **Router**: React Router v7
- **HTTP Client**: Axios
- **Estilos**: CSS Modules

## Arquitectura

### Backend — Event-Driven Architecture

El backend implementa una **Arquitectura Basada en Eventos** para desacoplar módulos y manejar la lógica de negocio asíncrona.

```
Acción → Controlador → Servicio → EventEmitter → Consumidor
```

**Flujo de eventos:**
1. El usuario realiza una acción (registro, creación de producto, pedido)
2. El servicio ejecuta la acción principal
3. Se emite un evento con los datos relevantes
4. Los consumidores escuchan y reaccionan (notificaciones, emails, etc.)

**Eventos disponibles:**
| Evento | Trigger | Acciones |
|--------|---------|----------|
| `UserRegistered` | Registro | Bienvenida |
| `ProductCreated` | Crear producto | Notificación |
| `OrderCreated` | Crear pedido | Confirmación, actualizar stock |
| `StockLow` | Stock ≤ 5 | Alerta |
| `OutOfStock` | Stock = 0 | Alerta |

### Frontend — Feature-Based Structure

```
client/src/
├── api/              # Configuración de axios
├── components/       # Componentes reutilizables
├── context/          # React Context (Auth, Cart, Notifications)
├── pages/            # Páginas de la app
├── services/         # Servicios API
└── types/            # Tipos TypeScript
```

## Patrones Implementados

| Patrón | Uso |
|--------|-----|
| **Repository** | Módulos con consultas complejas: `user`, `product`, `role` |
| **Event Emitter** | Desacoplamiento de lógica secundaria (notificaciones) |

### Modelo de Datos (Roles)

- `Customer` (id: 1) — Puede comprar
- `Merchant` (id: 2) — Puede vender/crear productos  
- `Admin` (id: 3) — Acceso total

## 🚀 Cómo Levantar Localmente

### Prerrequisitos
- Node.js 18+
- Docker (para PostgreSQL)
- npm o yarn

### 1. Clonar y levantar la base de datos

```bash
git clone https://github.com/moka-web/React_Nest_E-commerce.git
cd React_Nest_E-commerce
docker-compose up -d
```

### 2. Backend

```bash
cd api
npm install
npm run migration:run
npm run seed:run
npm run start:dev
```

El backend corre en `http://localhost:3000`
Swagger disponible en `http://localhost:3000/api`

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

El frontend corre en `http://localhost:5173`

### Variables de entorno

**Backend (`api/.env`):**
```bash
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=ecommerce
DATABASE_USER=postgres
DATABASE_PASSWORD=password

# JWT
JWT_SECRET=tu-secret-key
JWT_EXPIRES_IN=1d

# Admin user (para seeding)
ADMIN_USER_EMAIL=admin@example.com
ADMIN_USER_PASSWORD=Admin123!

# App
PORT=3000
```

**Frontend (`client/.env.development`):**
```bash
VITE_API_URL=http://localhost:3000
```

## Estructura del Proyecto

```
React_Nest_E-commerce/
├── api/                    # Backend Nest.js
│   ├── src/
│   │   ├── api/           # Módulos (auth, product, order, user, role)
│   │   ├── common/        # Helpers compartidos
│   │   ├── config/        # Configuración
│   │   ├── core/          # EventEmitter, interceptors
│   │   ├── database/      # Entities, migrations, seeds
│   │   └── errors/       # Errores custom
│   └── README.md          # Documentación detallada del backend
│
├── client/                 # Frontend React
│   ├── src/
│   │   ├── api/           # Axios config
│   │   ├── components/    # UI components
│   │   ├── context/       # State management
│   │   ├── pages/         # Route pages
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
│   └── README.md          # Documentación del frontend
│
├── docker-compose.yml      # PostgreSQL
├── README.md               # Este archivo
└── package.json            # Scripts shared (opcional)
```

## 📚 Documentación Detallada

Para más detalles sobre cada parte del proyecto:

- **[Documentación Backend](api/README.md)** — Arquitectura, endpoints, eventos, testing
- **[Documentación Frontend](client/README.md)** — Estructura, componentes, servicios

## Permisos por Rol

| Acción | Customer | Merchant | Admin |
|--------|----------|----------|-------|
| Ver productos | Si | Si | Si |
| Registrarse/Login | Si | Si | Si |
| Crear productos | No | Si | Si |
| Ver pedidos propios | Si | Si | Si |
| Crear pedidos | Si | Si | Si |
| Ver todos los pedidos | No | No | Si |
| Asignar roles | No | No | Si |

## Notas de Desarrollo

- El backend corre migraciones automáticamente al iniciar (Docker)
- Los seeders cargan datos iniciales (roles, categorías, colores, talles, monedas, países)
- El frontend usa JWT para autenticación (token almacenado en localStorage)
- El carrito se maneja con React Context y persiste en **localStorage**

## Contribuir

1. Fork del repositorio
2. Crear branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit (`git commit -m 'feat: agregar funcionalidad'`)
4. Push (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## Mejoras Futuras

### DevOps & Deploy
- [ ] **CI/CD**: Configurar GitHub Actions para deploy automático en cada push a `main`
- [ ] **Preview Deployments**: Despliegues automáticos por PR en Vercel/Render
- [ ] **Monitoreo**: Agregar logging (e.g., Datadog, Sentry)
- [ ] **HTTPS forzado**: Redirigir HTTP → HTTPS

### Backend
- [ ] **Validación de stock**: Verificar disponibilidad antes de crear pedido
- [ ] **Retry en consumers**: Reintentar eventos fallidos
- [ ] **Rate limiting** por usuario (ya hay throttler, mejorar configuración)
- [ ] **Cacheo**: Redis para datos frecuentemente consultados
- [ ] **Upload de imágenes**: Subir fotos de productos a S3/Cloudinary
- [ ] **Email**: Envío real de emails (bienvenida, confirmación de pedido)
- [ ] **Testing E2E**: Agregar tests end-to-end

### Frontend
- [ ] **PWA**: Hacer la app instalable
- [ ] **Búsqueda**: Filtros y búsqueda de productos
- [ ] **Paginación**: Lista de productos con paginación
- [ ] **Persistencia del carrito**: Integrar con API para persistir en backend
- [ ] **Dark mode**: Toggle de tema
- [ ] **Testing**: Agregar tests unitarios con Vitest
- [ ] **Lazy loading**: Carga perezosa de rutas

### Base de Datos
- [ ] **Índices optimizados**: Agregar índices en columnas consultadas frecuentemente
- [ ] **Soft deletes**: Marcar registros como eliminados en lugar de borrarlos
- [ ] **Migrations transaccionales**: Ejecutar migraciones con transacciones

## Licencia

ISC
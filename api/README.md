# Backend — Nest.js E-commerce API

API REST del e-commerce full stack.

## Tecnologías

- **Nest.js** 9.x
- **TypeScript**
- **TypeORM**
- **PostgreSQL**
- **JWT** (Autenticación)
- **Swagger** (Documentación)
- **Jest** (Testing)
- **Docker**

## Arquitectura Basada en Eventos

La API usa un **Event Emitter** para desacoplar módulos. Cuando ocurre una acción importante, se emite un evento y los consumidores reaccionan en consecuencia.

```
Acción → Controlador → Servicio → EventEmitter → Consumidor
```

### Eventos Disponibles

| Evento | Trigger | Payload |
|--------|---------|---------|
| `UserRegistered` | Registro de usuario | `{userId, email}` |
| `ProductCreated` | Creación de producto | `{productId, name, merchantId, categoryId}` |
| `OrderCreated` | Creación de pedido | `{orderId, userId, productVariationId}` |

### Agregar Nuevos Eventos

1. Crear archivo de evento en `src/api/{module}/events/{name}.event.ts`
2. Crear consumidor en `src/api/{module}/consumers/{name}.consumer.ts`
3. Registrar en el módulo
4. Emitir desde el servicio con `eventEmitter.emit()`

## Patrón Repository

Algunos módulos usan **Repository** para encapsular lógica de base de datos:

| Módulo | Por qué |
|--------|---------|
| `user` | Login, búsqueda con roles, múltiples relaciones |
| `product` | Filtrado, productos por merchant |
| `role` | Búsqueda por nombre/id |

Otros módulos usan `EntityManager` directamente (operaciones CRUD simples).

## Estructura del Proyecto

```
src/
├── api/                    # Módulos
│   ├── auth/              # Autenticación (login, register)
│   ├── user/              # Usuarios
│   ├── role/              # Roles
│   ├── product/           # Productos
│   ├── order/             # Pedidos
│   └── notification/     # Notificaciones
├── common/
│   └── helper/            # Utilidades compartidas
├── config/                # Configuración de la app
├── core/                  # EventEmitter, interceptors
├── database/
│   ├── entities/          # Entidades TypeORM
│   ├── migrations/         # Migraciones
│   ├── seeders/           # Seeds
│   └── typeorm/           # Configuración TypeORM
├── errors/                # Errores custom
└── main.ts                # Entry point
```

## Configuración

Crear `.env` en `api/src/common/envs/`:

```bash
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=ecommerce
DATABASE_USER=postgres
DATABASE_PASSWORD=password

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d

# Admin (para seeding)
ADMIN_USER_EMAIL=admin@example.com
ADMIN_USER_PASSWORD=Admin123!

# App
PORT=3000
```

## Cómo Levantar

```bash
# Levantar PostgreSQL
docker-compose up -d

# Instalar dependencias
npm install

# Crear archivo .env
# (ver sección de configuración arriba)

# Ejecutar migraciones
npm run migration:run

# Poblar datos iniciales
npm run seed:run

# Iniciar en desarrollo
npm run start:dev

# Iniciar en producción (Docker)
docker build -t api .
docker run -p 3000:3000 api
```

## Scripts

| Comando | Descripción |
|---------|------------|
| `npm run build` | Compila TypeScript → JavaScript |
| `npm run lint` | ESLint con auto-fix |
| `npm run format` | Prettier |
| `npm run start:dev` | Modo watch |
| `npm run start:prod` | Producción |
| `npm run migration:run` | Ejecutar migraciones |
| `npm run migration:generate -- --name=nombre` | Generar migración |
| `npm run seed:run` | Poblar base de datos |
| `npm run test` | Tests |
| `npm run test:cov` | Coverage |

## Endpoints

### Auth
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/login` | Login |
| POST | `/auth/register` | Registro (con opción `role: "Customer" \| "Merchant"`) |

### User
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/user/profile` | Perfil del usuario (auth) |

### Role
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/role/assign` | Asignar rol (admin) |

### Product
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/product` | Listar productos |
| GET | `/product/:id` | Detalle de producto |
| POST | `/product/create` | Crear producto (merchant) |
| POST | `/product/:id/details` | Agregar detalles |
| POST | `/product/:id/activate` | Activar producto |
| DELETE | `/product/:id` | Eliminar producto |

### Order
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/order` | Listar pedidos (propios o todos si admin) |
| POST | `/order` | Crear pedido |
| PATCH | `/order/:id/cancel` | Cancelar pedido |

### Notification
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/notification` | Notificaciones del usuario |
| PATCH | `/notification/read/:id` | Marcar como leída |
| PATCH | `/notification/read-all` | Marcar todas como leídas |

## Swagger

Documentación disponible en: `http://localhost:3000/api`

## Testing

```bash
npm test              # Tests unitarios
npm run test:watch    # Modo watch
npm run test:cov      # Coverage
npm run test:e2e      # End-to-end
```
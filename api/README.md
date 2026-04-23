# Ecommerce App con Nest.js y Postgres

> Esta API implementa una **Arquitectura Basada en Eventos** para manejar la lógica de negocio y desacoplar los módulos.

## Descripción

Este proyecto es una aplicación de e-commerce construída con Nest.js y Postgres. El enfoque está en escribir código limpio, modular y testeable, siguiendo una estructura de proyecto bien organizada.

## Tecnologías

- Nest.js
- PostgreSQL
- TypeORM
- JWT (Autenticación)
- Jest
- Docker

## Arquitectura Basada en Eventos

Esta API usa una **Arquitectura Basada en Eventos** para desacoplar los módulos. Cuando algo importante sucede en el sistema (como un usuario registrándose o un pedido siendo creado), un **evento** es emitsdo. Los consumidores escuchan estos eventos y reaccionan en consecuencia.

### Cómo Funciona

```
Acción del Usuario → Controlador → Servicio (ejecuta acción) → EventEmitter → Consumidor (reacciona)
```

### Eventos Disponibles

| Evento           | Módulo    | Cuándo              | Payload                                 |
| ---------------- | --------- | ------------------- | --------------------------------------- |
| `UserRegistered` | user      | Usuario se registra | `{userId, email}`                       |
| `ProductCreated` | product   | Producto se crea    | `{productId, name, merchantId}`         |
| `StockLow`       | inventory | Stock ≤ 5           | `{productId, currentStock}`             |
| `OutOfStock`     | inventory | Stock = 0           | `{productId}`                           |
| `OrderCreated`   | order     | Pedido se crea      | `{orderId, userId, productVariationId}` |

### Ejemplos de Flujo de Eventos

#### 1. Registro de Usuario

```
POST /auth/register
    ↓
UserService.createUser()
    ↓
Emitir evento 'UserRegistered'
    ↓
UserRegisteredConsumer registra + envía email de bienvenida (TODO)
```

#### 2. Creación de Pedido

```
POST /order (con JWT)
    ↓
OrderService.createOrder()
    ↓
InventoryService.reserveStock() (disminuye stock)
    ↓
Si stock ≤ 5 → Emitir evento 'StockLow'
Si stock = 0 → Emitir evento 'OutOfStock'
    ↓
Emitir evento 'OrderCreated'
    ↓
OrderCreatedConsumer registra + envía confirmación (TODO)
```

## Configuración

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```bash
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=ecommerce

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d

# App
PORT=3000
```

## Estructura del Proyecto

```
src/
├── api/                    # Módulos de características
│   ├── auth/              # Autenticación
│   ├── inventory/         # Gestión de inventario
│   ├── product/           # Gestión de productos
│   ├── order/            # Gestión de pedidos
│   ├── user/              # Gestión de usuarios
│   └── role/              # Gestión de roles
├── common/
│   └── helper/            # Utilidades compartidas
├── database/
│   ├── entities/          # Entidades TypeORM
│   ├── migrations/        # Migraciones de BD
│   └── seeders/              # Seeders de datos
├── errors/                # Manejo de errores
└── config/                # Configuración de la app
```

## Patrón Repository

Algunos módulos usan una **Capa Repository** para encapsular la lógica de base de datos, mientras otros usan `EntityManager` directamente. Esto es intencional.

### Módulos CON Repository

| Módulo    | Por qué?                                                            |
| --------- | ------------------------------------------------------------------- |
| `user`    | Consultas complejas: login, búsqueda de roles, búsqueda de usuarios |
| `product` | Consultas complejas: filtrado, paginación, productos de merchant    |
| `role`    | Mapeos rol-permisiones, múltiples joins                             |

### Módulos SIN Repository

| Módulo      | Por qué?                                                         |
| ----------- | ---------------------------------------------------------------- |
| `order`     | Operaciones simples: solo crear + actualizar status (cancelar)   |
| `inventory` | Operaciones simples: solo actualizar cantidad (reservar/liberar) |

**Rationale:** Si un módulo solo tiene operaciones CRUD simples (crear + actualizar), agregar una capa repository añade complejidad innecesaria. El uso directo de `EntityManager` en el servicio es suficiente.

Cuándo agregar un Repository:

- Consultas complejas con filtros, joins o paginación
- Múltiples entidades involucradas
- Lógica de query reutilizable entre endpoints
- Transformaciones complejas de datos

## Cómo Empezar

Para empezar con este proyecto, seguí estos pasos:

- Clonar el repositorio en tu máquina local.
- Navegar al directorio del proyecto.

```bash
cd ./nestjs-ecommerce
```

- Iniciar la base de datos postgres.

```bash
docker-compose up -d
```

- Instalar las dependencias de la app.

```bash
npm install
```

- Ejecutar las migraciones de base de datos.

```bash
npm run migration:run
```

Si querés generar una migración futura

```bash
npm run migration:generate --name=<migrationName>
```

- Ejecutar los seeders de base de datos.

```bash
npm run seed:run
```

- Iniciar la aplicación.

```bash
npm run start:dev
```

## Scripts

| Comando                                       | Descripción                          |
| --------------------------------------------- | ------------------------------------ |
| `npm run build`                               | Compila TypeScript a JavaScript      |
| `npm run lint`                                | Ejecuta ESLint con auto-fix          |
| `npm run format`                              | Formatea código con Prettier         |
| `npm run start:dev`                           | Inicia la app en modo watch          |
| `npm run start:prod`                          | Ejecuta la app compilada             |
| `npm run migration:run`                       | Ejecuta las migraciones pendientes   |
| `npm run migration:generate -- --name=<name>` | Genera una nueva migración           |
| `npm run seed:run`                            | Ejecuta los seeders de base de datos |

## Endpoints de la API

### Auth

| Método | Endpoint         | Descripción       | Auth Requerida |
| ------ | ---------------- | ----------------- | -------------- |
| POST   | `/auth/login`    | Login de usuario  | No             |
| POST   | `/auth/register` | Registrar usuario | No             |

### User

| Método | Endpoint        | Descripción                | Auth Requerida |
| ------ | --------------- | -------------------------- | -------------- |
| GET    | `/user/profile` | Obtener perfil del usuario | Sí             |

### Role

| Método | Endpoint       | Descripción           | Auth Requerida |
| ------ | -------------- | --------------------- | -------------- |
| POST   | `/role/assign` | Asignar rol a usuario | Sí (Admin)     |

### Product

| Método | Endpoint                | Descripción                  | Auth Requerida      |
| ------ | ----------------------- | ---------------------------- | ------------------- |
| GET    | `/product/:id`          | Obtener producto por ID      | No                  |
| POST   | `/product/create`       | Crear nuevo producto         | Sí (Admin/Merchant) |
| POST   | `/product/:id/details`  | Agregar detalles al producto | Sí (Admin/Merchant) |
| POST   | `/product/:id/activate` | Activar producto             | Sí (Admin/Merchant) |
| DELETE | `/product/:id`          | Eliminar producto            | Sí (Admin/Merchant) |

### Order

| Método | Endpoint            | Descripción        | Auth Requerida |
| ------ | ------------------- | ------------------ | -------------- |
| POST   | `/order`            | Crear nuevo pedido | Sí             |
| PATCH  | `/order/:id/cancel` | Cancelar pedido    | Sí             |

## Testing

| Comando              | Descripción                 |
| -------------------- | --------------------------- |
| `npm test`           | Ejecuta todos los tests     |
| `npm run test:watch` | Ejecuta tests en modo watch |
| `npm run test:cov`   | Ejecuta tests con coverage  |
| `npm run test:e2e`   | Ejecuta tests end-to-end    |

Para ejecutar los tests, seguí estos pasos:

1. Instalar dependencias: `npm install`
2. Ejecutar los tests: `npm run test`

## Documentación Swagger

La documentación de la API está disponible en **http://localhost:3000/api**

### Características de Swagger

- Explorador interactivo de la API
- Autenticación con Bearer token
- Esquemas de request/response
- Definiciones de modelos

### Tags

| Tag         | Módulo                |
| ----------- | --------------------- |
| `auth`      | Autenticación         |
| `users`     | Gestión de usuarios   |
| `products`  | Gestión de productos  |
| `orders`    | Gestión de pedidos    |
| `inventory` | Gestión de inventario |
| `roles`     | Gestión de roles      |

### Usando con JWT

1. Login para obtener el token
2. Hacer click en el botón **Authorize**
3. Ingresar: `Bearer <tu-token>`

### Ejemplo: Crear un Pedido

```
POST /order
Authorization: Bearer eyJhbGciOiJIUzI1...

Body:
{
  "productVariationId": 1,
  "countryCode": "AR",
  "quantity": 2
}
```

## Agregar Nuevos Eventos

Para agregar un nuevo evento al sistema:

1. **Crear definición del evento** en `src/api/{module}/events/{event-name}.event.ts`

2. **Crear consumidor** en `src/api/{module}/consumers/{event-name}.consumer.ts`

3. **Registrar en el módulo** - Agregar EventEmitter y Consumidor a los providers del módulo

4. **Emitir desde el servicio** - Llamar a `eventEmitter.emit()` después de que la acción se complete

Ver `docs/EVENTOS.md` para instrucciones detalladas.

## Contribuir

Si estás interesado en contribuir a este proyecto, por favor seguí estas guías:

1. Fork del repositorio
2. Hacer tus cambios
3. Enviar un pull request

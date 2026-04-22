# Documentación del Sistema

> Última actualización: Abril 2026

---

## 1. Arquitectura Event-Driven

### 1.1 ¿Por qué eventos?

La arquitectura basada en eventos permite **desacoplar** los módulos del sistema. En lugar de que un módulo llame directamente a otro, emite un mensaje (evento) y el consumidor decide qué hacer con él.

### 1.2 Flujo General

```
┌─────────────────────────────────────────────────────────────┐
│                     ACCIÓN DEL USUARIO                   │
│  Ejemplo: POST /order                                      │
└─────────────────────┬─────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   CONTROLLER                               │
│  Recibe el request HTTP                                     │
└─────────────────────┬─────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVICE                                 │
│  Lógica de negocio                                        │
│  1. Ejecuta la acción principal (crear, actualizar...)    │
│  2. Emite el evento                                       │
└─────────────────────┬─────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                 EVENT EMITTER                               │
│  Registra el evento y Notifica a los consumidores         │
└─────────────────────┬─────────────────────────────────────┘
                      │
          ┌───────────┴────────────┐
          │                      │
          ▼                      ▼
┌──────────────────┐    ┌──────────────────┐
│ CONSUMIDOR A      │    │ CONSUMIDOR B      │
│ (Logging, Cache)  │    │ (Email, Notif)    │
└──────────────────┘    └──────────────────┘
```

---

## 2. Eventos Disponibles

### 2.1 UserRegistered

| Campo               | Descripción                                |
| ------------------- | ------------------------------------------ |
| **Evento**          | `UserRegistered`                           |
| **Módulo**          | `user`                                     |
| **Cuándo se emite** | Cuando un usuario se registra exitosamente |
| **Servicio**        | `UserService.createUser()`                 |

**Payload:**

```typescript
{
  userId: number,
  email: string
}
```

**Consumidores:**

- `UserRegisteredConsumer`: Logger + (pendiente: email de bienvenida)

---

### 2.2 ProductCreated

| Campo               | Descripción                      |
| ------------------- | -------------------------------- |
| **Evento**          | `ProductCreated`                 |
| **Módulo**          | `product`                        |
| **Cuándo se emite** | Cuando un producto es creado     |
| **Servicio**        | `ProductService.createProduct()` |

**Payload:**

```typescript
{
  productId: number,
  name: string,
  merchantId: number,
  categoryId?: number
}
```

**Consumidores:**

- `ProductCreatedConsumer`: Logger + (pendiente: actualizar índices de búsqueda)

---

### 2.3 StockLow

| Campo               | Descripción                                     |
| ------------------- | ----------------------------------------------- |
| **Evento**          | `StockLow`                                      |
| **Módulo**          | `inventory`                                     |
| **Cuándo se emite** | Cuando el stock de un producto baja a 5 o menos |
| **Threshold**       | 5 (hardcodeado)                                 |
| **Servicio**        | `InventoryService.reserveStock()`               |

**Payload:**

```typescript
{
  productId: number,
  productVariationId: number,
  currentStock: number,
  threshold: number  // 5
}
```

**Consumidores:**

- `StockLowConsumer`: Logger + alerta de stock bajo

---

### 2.4 OutOfStock

| Campo               | Descripción                       |
| ------------------- | --------------------------------- |
| **Evento**          | `OutOfStock`                      |
| **Módulo**          | `inventory`                       |
| **Cuándo se emite** | Cuando el stock llega a 0         |
| **Servicio**        | `InventoryService.reserveStock()` |

**Payload:**

```typescript
{
  productId: number,
  productVariationId: number
}
```

**Consumidores:**

- `OutOfStockConsumer`: Logger + (pendiente: deshabilitar producto)

---

### 2.5 OrderCreated

| Campo               | Descripción                             |
| ------------------- | --------------------------------------- |
| **Evento**          | `OrderCreated`                          |
| **Módulo**          | `order`                                 |
| **Cuándo se emite** | Cuando un pedido es creado exitosamente |
| **Servicio**        | `OrderService.createOrder()`            |
| **副作用**          | Reserva stock en inventory              |

**Payload:**

```typescript
{
  orderId: number,
  userId: number,
  productVariationId: number,
  quantity: number
}
```

**Consumidores:**

- `OrderCreatedConsumer`: Logger + (pendiente: email de confirmación)

---

## 3. Cómo Agregar un Nuevo Evento

### Paso 1: Crear la definición del evento

```typescript
// src/api/{module}/events/{event-name}.event.ts

import { DomainEvent } from '../../../core/event-emitter.service';

export interface MyEventPayload {
  userId: number;
  email: string;
}

export type MyEvent = DomainEvent<MyEventPayload>;

export const MY_EVENT = 'MyEvent' as const;
```

### Paso 2: Crear el consumidor

```typescript
// src/api/{module}/consumers/{event-name}.consumer.ts

import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter } from '../../../core/event-emitter.service';
import { MyEvent, MY_EVENT } from '../events/{event-name}.event';

@Injectable()
export class MyEventConsumer {
  private readonly logger = new Logger(MyEventConsumer.name);

  constructor(private readonly eventEmitter: EventEmitter) {
    this.register();
  }

  private register(): void {
    this.eventEmitter.on(MY_EVENT, this.handle.bind(this));
  }

  private async handle(event: MyEvent): Promise<void> {
    const { userId, email } = event.payload;
    this.logger.log(`Event received: ${userId} - ${email}`);
    // Tu lógica aquí
  }
}
```

### Paso 3: Registrar en el módulo

```typescript
// src/api/{module}/{module}.module.ts

import { Module } from '@nestjs/common';
import { EventEmitter } from '../../core/event-emitter.service';
import { MyEventConsumer } from './consumers/{event-name}.consumer';

@Module({
  providers: [
    EventEmitter,
    MyEventConsumer,
    // ... otros providers
  ],
})
export class MyModule {}
```

### Paso 4: Emitir desde el servicio

```typescript
// src/api/{module}/services/{module}.service.ts

constructor(
  private readonly eventEmitter: EventEmitter,
) {}

async someMethod(data: any): Promise<void> {
  // Tu lógica de negocio
  const result = await this.repository.save(data);

  // Emitir evento
  const event = this.eventEmitter.createEvent(MY_EVENT, {
    userId: result.id,
    email: result.email,
  });
  await this.eventEmitter.emit(event);
}
```

---

## 4. API Reference

### 4.1 Endpoints de Order

| Método  | Endpoint            | Auth   | Descripción                  |
| ------- | ------------------- | ------ | ---------------------------- |
| `POST`  | `/order`            | ✅ JWT | Crear un nuevo pedido        |
| `PATCH` | `/order/:id/cancel` | ✅ JWT | Cancelar un pedido existente |

#### POST /order

**Request:**

```json
{
  "productVariationId": 1,
  "countryCode": "AR",
  "quantity": 2
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "productVariationId": 1,
    "countryCode": "AR",
    "quantity": 2,
    "status": "PENDING",
    "createdAt": "2026-04-22T12:00:00Z"
  }
}
```

#### PATCH /order/:id/cancel

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "CANCELLED"
  }
}
```

---

### 4.2 Endpoints de Product

| Método | Endpoint       | Auth | Descripción             |
| ------ | -------------- | ---- | ----------------------- |
| `GET`  | `/product/:id` | ❌   | Obtener producto por ID |
| `POST` | `/product`     | ✅   | Crear nuevo producto    |

---

### 4.3 Endpoints de User

| Método | Endpoint         | Auth | Descripción        |
| ------ | ---------------- | ---- | ------------------ |
| `POST` | `/auth/register` | ❌   | Registrar usuario  |
| `POST` | `/auth/login`    | ❌   | Login (recibe JWT) |

---

## 5. Estructura del Proyecto

```
src/
├── core/
│   └── event-emitter.service.ts        # Emisor central de eventos
│
├── api/
│   ├── user/
│   │   ├── events/
│   │   │   └── user-registered.event.ts
│   │   ├── consumers/
│   │   │   └── user-registered.consumer.ts
│   │   └── services/
│   │       └── user.service.ts        # Emite UserRegistered
│   │
│   ├── product/
│   │   ├── events/
│   │   │   └── product-created.event.ts
│   │   ├── consumers/
│   │   │   └── product-created.consumer.ts
│   │   └── services/
│   │       └── product.service.ts     # Emite ProductCreated
│   │
│   ├── inventory/
│   │   ├── events/
│   │   │   ├── stock-low.event.ts
│   │   │   └── out-of-stock.event.ts
│   │   ├── consumers/
│   │   │   ├── stock-low.consumer.ts
│   │   │   └── out-of-stock.consumer.ts
│   │   └── services/
│   │       └── inventory.service.ts   # Emite StockLow + OutOfStock
│   │
│   └── order/
│       ├── events/
│       │   └── order-created.event.ts
│       ├── consumers/
│       │   └── order-created.consumer.ts
│       ├── services/
│       │   └── order.service.ts        # Emite OrderCreated
│       └── controllers/
│           └── order.controller.ts
│
└── database/
    └── entities/
        └── order.entity.ts            # Entity de pedido
```

---

## 6. Notas

- El umbral de stock bajo (5) está hardcodeado en `InventoryService`
- Los consumidores actualmente solo hacen logging - falta integración con emails
- Los eventos se ejecutan de forma asíncrona - si un consumidor falla, no afecta a los demás

# Diagnóstico Inicial — Sistema Actual

> Fecha: 21/04/2026  
> Objetivo: Identificar problemas estructurales para evolucionar hacia event-driven

---

## 1. Estado Operativo

### 1.1 Build & Lint

| Área  | Status      | Detalles                      |
| ----- | ----------- | ----------------------------- |
| Build | ✅ OK       | Compila a `dist/` sin errores |
| Lint  | ⚠️ Warnings | 2 warnings menores            |

**Warnings de Lint:**

- `DeleteResult` unused en `src/api/product/services/product.service.ts:6`
- `UseGuards` unused en `src/api/role/controllers/role.controller.ts:1`

### 1.2 Tests

| Tipo        | Status     | Notas                                                               |
| ----------- | ---------- | ------------------------------------------------------------------- |
| Services    | ✅ OK      | ProductService, AuthService, RoleService, UserService — todos pasan |
| Controllers | ❌ FAIL    | RoleController spec falla por timeout (5000ms) — sin DB simulada    |
| Deprecation | ⚠️ Warning | `url.parse()` deprecated en Node.js                                 |

### 1.3 Base de Datos

| Área       | Status          | Notas                                               |
| ---------- | --------------- | --------------------------------------------------- |
| Connection | ❌ Sin conexión | No hay PostgreSQL corriendo en entorno local        |
| Config     | ⚠️ Ad-hoc       | Usa `process.env.DATABASE_ENTITIES` (path dinámico) |
| Migrations | ⚠️ Pendiente    | No hay migrations aplicadas                         |

---

## 2. Arquitectura y Diseño

### 2.1 Estructura Modular Actual

El proyecto sigue una **arquitectura modular básica** de NestJS:

```
src/
├── api/                          # Módulos de negocio
│   ├── auth/                   # Autenticación
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── guards/
│   │   ├── dto/
│   │   └── auth.module.ts
│   ├── user/                   # Usuarios
│   ├── role/                   # Roles
│   ├── product/                # Productos
│   └── api.module.ts           # Agregador
├── database/
│   ├── entities/              # TypeORM entities
│   ├── migrations/
│   ├── seed/
│   └── typeorm/
├── common/
│   └── helper/
├── errors/
└── config/
```

**Cada módulo tiene:**

- Controller (endpoints HTTP)
- Service (lógica de negocio)
- DTOs (Data Transfer Objects)
- Module (registro de providers)

---

### 2.2 Comunicación entre Módulos (ACOPLAMIENTO)

Esta es la **imagen реаль del acoplamiento actual**:

```
┌─────────────────────────────────────────────────────────────┐
│                     AuthModule                            │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐  │
│  │AuthService │──▶│ RoleService │   │ UserService│  │
│  └─────────────┘   └─────────────┘   └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                     UserModule                            │
│  ┌─────────────┐   ┌─────────────┐                    │
│  │UserService │   │User        │ (Entity)                   │
│  └─────────────┘   └─────────────┘                    │
└─────────────────────────────────────────────────────────────┘
         ▲
         │
┌────────┴───────────────────────────────────────────────┐
│                     RoleModule                        │
│  ┌─────────────┐   ┌─────────────┐                    │
│  │RoleService│──▶│ UserService│  ◄─── ACOPLAMIENTO │
│  └─────────────┘   └─────────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

**Problema central:** Cada módulo conoce directamente la implementación del otro.

- AuthService necesita saber que existe RoleService
- AuthGuard necesita UserService
- RolesGuard necesita UserService
- RoleService necesita UserService

**Esto viola el Principio de Responsabilidad Única (SOLID)** y hace que:

- Cambios en un módulo pueden romper otros
- Difícil testing individual
- Imposible reemplazar implementaciones

---

### 2.3 Service Layer Pattern (Implementado)

Los services usan EntityManager directamente (no hay Repository abstraction):

```typescript
// ProductService - ejemplo típico
@Injectable()
export class ProductService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async getProduct(productId: number) {
    const product = await this.entityManager.findOne(Product, {
      where: { id: productId },
    });
    if (!product) throw new NotFoundException(errorMessages.product.notFound);
    return product;
  }
}
```

**Características:**

- ✅ EntityManager injection (NestJS way)
- ⚠️ Sin abstracción de repository
- ⚠️ Queriesinline en cada método
- ⚠️ Sin unit of work explícito

---

### 2.4 DTO Pattern (Implementado Parcialmente)

```typescript
// dto/product.dto.ts
export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  categoryId: number;
}
```

**Problema:** Los DTOs no se aplican consistentemente:

- ✅ Product controller los usa con ValidationPipe
- ❌ Auth controller NO los usa (login/register)

---

### 2.5 GUARD Pattern (Implementado)

```typescript
// auth.guard.ts
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService, // ← Inyección directa
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const bearerToken = request.headers.authorization.split(' ')[1];
    const payload = await this.jwtService.verifyAsync(bearerToken, {
      secret: process.env.JWT_SECRET,
    });
    request.user = await this.userService.findById(payload.id, { roles: true });
    return true;
  }
}
```

**Problemas:**

- Inyecta UserService directamente (tight coupling)
- No hay caching de token
- JWT_SECRET desde env sin fallback

---

### 2.6 Interceptor & Filter (Implementados)

```typescript
// Global response interceptor
@Injectable()
export class SucessResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => ({ success: true, data })));
  }
}

// Global error filter
@Catch()
export class ErrorsFilter implements ExceptionFilter {
  catch(exception: Host, response: Response) {
    // Manejo centralizado
  }
}
```

✅ Bien implementados - patrón correcto

---

### 2.7 Resumen de Patrones

| Patrón                       | Status       | Notas                           |
| ---------------------------- | ------------ | ------------------------------- |
| **Arquitectura Modular**     | ✅           | NestJS nativo                   |
| **Service Layer**            | ✅           | EntityManager directo           |
| **DTO Pattern**              | ⚠️ Parcial   | Authcontroller no lo usa        |
| **Guard/Interceptor/Filter** | ✅           | Bien implementados              |
| **Repository**               | ❌ No existe | EntityManager directo           |
| **Unit of Work**             | ❌ No existe | Sin transacciones explícitas    |
| **Event-driven**             | ❌ No existe | No hay EventEmitter             |
| **CQRS**                     | ❌ No existe | Sin Commands/Queries separación |
| **Domain Events**            | ❌ No existe | Sin eventos de dominio          |
| **Saga**                     | ❌ No existe | Sin orquestación                |
| **Adapter**                  | ❌ No existe | Sin abstracción                 |
| **Factory/Builder**          | ❌ No existe | Sin patrones GoF                |

### 2.10 Compatibilidad de Patrones

> **Pregunta:** ¿Se pueden usar Repository y Event-Driven juntos?
>
> **Respuesta:** SÍ,-perfectamente. Son complementarios, no substitutes.
>
> | Patrón           | Responsabilidad                         |
> | ---------------- | --------------------------------------- |
> | **Repository**   | Abstraer acceso a datos                 |
> | **Event-Driven** | Abstraer comunicación entre componentes |
>
> **Recomendación:** Aplicar **ambos** patrones para máxima flexibilidad.

---

### 2.8 Por qué NO existe Event-Driven

El proyecto usa **comunicación sincrónica directa**:

```
Controller ──▶ Service ──▶ EntityManager ──▶ Database
    │            │              │
    │            │              │
    └────────────┴──────────────┘
         Todo en el mismo request
```

**Con event-driven sería:**

```
Controller ──▶ Service ──▶ emit(Event) ──▶ Message Queue
    │            │              │
    │            ▼              ▼
    │       Database    EventConsumer ──▶ proceso asíncrono
    │
    └────────────────▶ Response inmediata
```

**Beneficios perdidos:**

- Desacoplamiento
- Escalabilidad
- Resiliencia (retry logic)
- Auditoría automática
- Consistency eventual

---

### 2.9 Repository + Event-Driven: Son Complementarios

Una pregunta común: **¿Son compatibles?**

**Respuesta: SÍ,-perfectamente.** Son patrones que se complementan:

| Responsabilidad                         | Patrón           |
| --------------------------------------- | ---------------- |
| Abstraer acceso a datos                 | **Repository**   |
| Abstraer comunicación entre componentes | **Event-Driven** |

**Cómo trabajan juntos:**

```
┌─────────────────────────────────────────────────────────────────┐
│                     ARQUITECTURA FINAL                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Controller                                                   │
│     │                                                          │
│     ▼                                                          │
│  Service                                                       │
│     │                                                          │
│     ├──▶ Repository (IUserRepository) ──▶ Database          │
│     │                                                          │
│     └──▶ EventEmitter.emit('user.registered', payload)         │
│                           │                                    │
│                           ▼                                    │
│                    EventConsumer                                │
│                    - AuditLogger                               │
│                    - NotificationService                      │
│                    - AnalyticsService                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Ejemplo práctico:**

```typescript
// Service con AMBOS patrones
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository, // ← Repository
    private readonly eventEmitter: EventEmitter2, // ← Event-Driven
  ) {}

  async register(dto: CreateUserDto) {
    // 1. Guardar usando Repository (abstraído)
    const user = await this.userRepository.create(dto);

    // 2. Emitir evento (sin importar QUIÉN escucha)
    this.eventEmitter.emit('user.registered', {
      userId: user.id,
      email: user.email,
      timestamp: new Date(),
    });

    return user;
  }
}
```

**¿Por qué Repository FACILITA Event-Driven?**

| Sin Repository                       | Con Repository                 |
| ------------------------------------ | ------------------------------ |
| Events pueden romper si cambia la DB | Repository aísla cambios de DB |
| Dificultad para testing              | Mocks fáciles                  |
| Acoplamiento residual                | Totalmente desacoplado         |

**Conclusión:** Aplica **ambos** — Repository primero (prepara la base), luego Event-Driven (comunicación).

---

## 3. Problemas Estructurales

### 3.1 Acoplamiento Alto (CRÍTICO)

**AuthService** depende directamente de:

```typescript
import { RoleService } from 'src/api/role/services/role.service';
import { UserService } from 'src/api/user/services/user.service';
```

**AuthGuard** inyecta:

```typescript
import { UserService } from 'src/api/user/services/user.service';
```

**RolesGuard** inyecta:

```typescript
import { UserService } from 'src/api/user/services/user.service';
```

**RoleService** inyecta:

```typescript
import { UserService } from 'src/api/user/services/user.service';
```

**Problema:** Comunicación directa entre módulos. No hay abstracciones.

### 3.2 Entities No Utilizadas

Las siguientes entidades existen pero **no tienen Service ni Controller**:

| Entity                  | Uso                        |
| ----------------------- | -------------------------- |
| `Inventory`             | Solo en migrations/seeders |
| `ProductVariation`      | Solo en relaciones         |
| `ProductVariationPrice` | Solo en relaciones         |
| `Color`                 | Solo en seeders            |
| `Size`                  | Solo en seeders            |
| `Country`               | Solo en seeders            |
| `Currency`              | Solo en seeders            |

### 3.3 Validation en Entities (ANTI-PATTERN)

`src/database/entities/product.entity.ts` usa class-validator:

```typescript
@Column({ type: 'varchar', nullable: true })
@IsDefined()
@IsString()
@Index()
public code: string;
```

**Problema:** Los validators deben estar en DTOs, no en entities. Las entities son para la DB.

### 3.4 Validation en Auth Controller (FALTANTE)

`src/api/auth/controllers/auth.controller.ts`:

```typescript
@Post('login')
login(@Body() user: CreateUserDto) {  // Sin ValidationPipe
  return this.authService.login(user);
}
```

**Problema:** No usa `@UsePipes(new ValidationPipe())` — DTOs no se validan.

### 3.5 Typo en Error Messages

`src/api/auth/guards/auth.guard.ts:33`:

```typescript
throw new UnauthorizedException(errorMessages.auth.invlidToken);
//                                                 ^^^^^^^ typo
```

Debería ser: `invalidToken`

---

## 4. Alcance Event-Driven

### 4.1 Estado Actual

| Componente            | Status             |
| --------------------- | ------------------ |
| @nestjs/event-emitter | ❌ No instalado    |
| EventEmitter          | ❌ No existe       |
| Domain Events         | ❌ No implementado |
| Message Queue         | ❌ No existe       |

### 4.2 Puntos Naturales para Eventos

Basado en el dominio actual, los eventos podrían emitirse en:

1. **Product created** — Al crear un producto
2. **Product activated** — Al activar un producto
3. **Product deleted** — Al eliminar un producto
4. **User registered** — Al registrar usuario
5. **Role assigned** — Al asignar rol

---

## 5. Resumen de Issues

### Prioridad ALTA (Bloquean evolución)

| #   | Issue                              | Archivo            | Tipo         |
| --- | ---------------------------------- | ------------------ | ------------ |
| 1   | No hay sistema de eventos          | —                  | Arquitectura |
| 2   | Acoplamiento directo entre módulos | Auth/Role/User     | Arquitectura |
| 3   | Validation en entities             | product.entity.ts  | Anti-pattern |
| 4   | Auth sin ValidationPipe            | auth.controller.ts | Bug          |
| 5   | Sin base de datos configurada      | —                  | Infra        |

### Prioridad MEDIA (Técnico)

| #   | Issue                                      | Archivo                                | Tipo   |
| --- | ------------------------------------------ | -------------------------------------- | ------ |
| 6   | Entities huérfanas (Inventory, Variations) | database/entities/\*                   | Diseño |
| 7   | Lint warnings (unused imports)             | product.service.ts, role.controller.ts | Código |
| 8   | Controller tests timeout                   | role.controller.spec.ts                | Test   |
| 9   | Typo en error message                      | auth.guard.ts                          | Bug    |

### Prioridad BAJA (Mejora)

| #   | Issue                           | Archivo           | Tipo    |
| --- | ------------------------------- | ----------------- | ------- |
| 10  | Deprecation warning url.parse() | Node.js           | Warning |
| 11  | Logging excesivo en producción  | typeOrm.config.ts | Config  |

---

## 6. Arquitectura Recomendada Antes de Event-Driven

### 6.1 Patrón Previo: Repository + Abstractions

Antes de implementar event-driven, el patrón **más recomendado** es:

```
┌─────────────────────────────────────────────────────────────┐
│                 ABSTRACTION LAYER                         │
│  ┌─────────────────────────────────────────────────┐     │
│  │  Interface: IUserRepository                    │     │
│  │  - findById(id: number): Promise<User>         │     │
│  │  - findByEmail(email: string): Promise<User>   │     │
│  │  - save(user: Partial<User>): Promise<User>    │     │
│  └─────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ UserRepository  │ │ MockRepository │ │ InMemoryRepository│
│ (TypeORM)      │ │ (Testing)     │ │ (Dev)          │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

**Beneficios del Repository Pattern:**

| Problema Actual               | Con Repository                |
| ----------------------------- | ----------------------------- |
| Acoplamiento directo          | Módulos solo conocen interfaz |
| EntityManager en cada service | Un solo punto de acceso       |
| Testing difícil               | Easy mocking                  |
| Cambios rompen otros módulos  | Implementación swappeable     |

**Cómo se aplica:**

```typescript
// 1. Definir interfaz (contrato)
export interface IUserRepository {
  findById(id: number, opts?: { roles?: boolean }): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserDto): Promise<User>;
}

// 2. Implementar repository (lógica TypeORM)
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectEntityManager()
    private readonly em: EntityManager,
  ) {}

  async findById(id: number, opts?: { roles?: boolean }) {
    return this.em.findOne(User, {
      where: { id },
      relations: opts?.roles ? ['roles'] : [],
    });
  }
}

// 3. Usar interfaz en servicios (no implementación)
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository, // ← Interfaz, no implementación
    private readonly roleService: IRoleRepository,
  ) {}
}
```

---

### 6.2 Por qué NO saltar directamente a Event-Driven

| Etapa                        | Necesitas                   |
| ---------------------------- | --------------------------- |
| 1. Repository + Abstractions | ✅ Base estable y testeable |
| 2. Desacoplamiento           | ✅ Módulos independientes   |
| 3.then Event-Driven          | ✅ Eventos desacoplados     |

**Si implementás event-driven hoy:**

- Services siguen acoplados directamente
- difícil testing de flujos
- cambios rompen dependencias existentes
- No hay abstracción para swapear consumers

---

### 6.3 Roadmap Recomendado

```
┌──────────────────────────────────────────────────────────────────┐
│                        EVOLUCIÓN SUGERIDA                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  FASE 1: Repository Abstraction (Ahora)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ • Crear interfaces: IUserRepository, IRoleRepository    │  │
│  │ • Implementar concrete repositories                     │  │
│  │ • Refactor services para usar interfaz, no EntityManager  │  │
│  │ • Testing con mocks de interfaces                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  FASE 2: Desacoplamiento (Next)                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ • Extraer EventEmitter service                          │  │
│  │ • Services emitting events, no direct calls          │  │
│  │ • Consumers escuchando eventos                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  FASE 3: Event-Driven Final (Goal)                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ • @nestjs/event-emitter                               │  │
│  │ • Domain Events: ProductCreated, UserRegistered       │  │
│  │ • Consumers: AuditLogger, NotificationService        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

### 6.4 Esfuerzo Estimado

| Fase                   | Complejidad | Tiempo    |
| ---------------------- | ----------- | --------- |
| Repository Abstraction | 🟡 Media    | 2-4 horas |
| Desacoplamiento        | 🟡 Media    | 2-3 horas |
| Event-Driven           | 🟢 Baja     | 3-4 horas |

**Total estimado: 7-11 horas**

---

## 7. Recomendación Inicial

### Cambios Mínimos para Ejecutar

1. **Configurar .env** con credenciales PostgreSQL
2. **Correr migrations** — `npm run migration:run`
3. **Correr seeds** — `npm run seed:run`
4. **Instalar event-emitter** — `@nestjs/event-emitter`
5. **Corregir validation** — mover decorators a DTOs
6. **Decoupled modules** — usar EventEmitter en lugar de imports directos

### No se requiere refactor total

El objetivo es **identificar problemas estructurales mínimos** y crear una base para evolucionar hacia event-driven.

---

_Este diagnóstico es el punto de partida. Los cambios deben ser aprobados antes de implementarse._

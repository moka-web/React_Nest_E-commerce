# AGENTS.md — Agentic Coding Guidelines

This file provides conventions for agentic coding agents operating in this Nest.js e-commerce codebase.

---

## 1. Build, Lint, and Test Commands

### Build

```bash
npm run build
```

Compiles TypeScript to JavaScript in the `dist/` folder.

### Lint

```bash
npm run lint
```

Runs ESLint with auto-fix on `src/` and `test/` directories.

### Format

```bash
npm run format
```

Formats code using Prettier.

### Test (all)

```bash
npm test
```

Runs all unit tests with Jest.

### Test (single file)

```bash
npm test -- --testPathPattern=filename.spec
```

Runs a specific test file. Example: `npm test -- --testPathPattern=product.service.spec`

### Test (single test)

```bash
npm test -- --testNamePattern="test name"
```

Runs tests matching a specific name pattern.

### Test (watch mode)

```bash
npm run test:watch
```

Runs tests in watch mode.

### Test (coverage)

```bash
npm run test:cov
```

Runs tests with coverage report.

### E2E Tests

```bash
npm run test:e2e
```

Runs end-to-end tests from `test/` directory.

### Start (dev)

```bash
npm run start:dev
```

Starts the app in watch mode.

### Start (production)

```bash
npm run start:prod
```

Runs the compiled app from `dist/`.

### Database Migrations

```bash
npm run migration:run
npm run migration:revert
```

### Database Seeding

```bash
npm run seed:run
```

---

## 2. Code Style Guidelines

### Formatting (Prettier)

- **Single quotes**: Use single quotes for strings (`'string'`)
- **Trailing commas**: Always use trailing commas (all)
- **Indentation**: 2 spaces

Run `npm run format` before committing.

### Linting (ESLint)

- TypeScript ESLint with `@typescript-eslint/recommended`
- Prettier integration for conflict-free formatting

ESLint rules (from `.eslintrc.js`):

- `interface-name-prefix`: OFF (no prefix required)
- `explicit-function-return-type`: OFF (return type optional)
- `explicit-module-boundary-types`: OFF (export types optional)
- `explicit-module-boundary-types`: OFF
- `no-explicit-any`: OFF (any allowed)

### TypeScript Conventions

- Use TypeScript 4.7
- Enable `strict: false` (not strict mode)
- Use `any` when appropriate (allowed, not enforced)
- Use interfaces for DTOs and entities
- Use enums for fixed values (e.g., RoleEnum)

---

## 3. Import Ordering

Imports should follow this order:

1. **External NestJS** — `@nestjs/*`
2. **External TypeORM** — `typeorm`, `@nestjs/typeorm`
3. **External Project** — class-validator, class-transformer
4. **Internal Entities** — `src/database/entities/*`
5. **Internal Modules** — `src/*` (local imports)
6. **Internal Helpers** — `src/common/helper/*`, `src/errors/*`

### Example

```typescript
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CreateProductDto, ProductDetailsDto } from '../dto/product.dto';
import { Category } from '../../../database/entities/category.entity';
import { Product } from 'src/database/entities/product.entity';
import { errorMessages } from 'src/errors/custom';
import { validate } from 'class-validator';
import { successObject } from 'src/common/helper/sucess-response.interceptor';
```

---

## 4. Naming Conventions

### Files

| Type        | Convention            | Example                   |
| ----------- | --------------------- | ------------------------- |
| Entity      | `{name}.entity.ts     | `product.entity.ts`       |
| Service     | `{name}.service.ts    | `product.service.ts`      |
| Controller  | `{name}.controller.ts | `product.controller.ts`   |
| DTO         | `{name}.dto.ts        | `create-product.dto.ts`   |
| Module      | `{name}.module.ts     | `product.module.ts`       |
| Spec (test) | `{name}.spec.ts       | `product.service.spec.ts` |

### Classes

| Type             | Suffix       | Example                |
| ---------------- | ------------ | ---------------------- |
| Service class    | `Service`    | `ProductService`       |
| Controller class | `Controller` | `ProductController`    |
| Entity class     | Entity name  | `Product`              |
| DTO class        | `Dto`        | `CreateProductDto`     |
| Guard class      | `Guard`      | `AuthGuard`            |
| Decorator        | `Decorator`  | `CurrentUserDecorator` |

### Variables and Methods

- **CamelCase**: `createProduct`, `merchantId`, `isActive`
- **Boolean**: `isActive`, `isValid`, `hasPermission`
- **Private**: prefix with `_` (optional, not enforced)

### Database Tables

- **Singular**: `product`, `user`, `category` (not plural)

---

## 5. Module Structure

Each module in `src/api/{module}/` follows this structure:

```
src/api/{module}/
├── {module}.module.ts       # Module registration
├── controllers/
│   └── {module}.controller.ts
├── services/
│   └── {module}.service.ts
├── dto/
│   └── {module}.dto.ts
└── guards/
    └── {module}.guard.ts
```

### Example Module (Product)

```
src/api/product/
├── product.module.ts
├── controllers/
│   └── product.controller.ts
├── services/
│   ├── product.service.ts
│   └── product.service.spec.ts
└── dto/
    └── product.dto.ts
```

---

## 6. DTO Pattern

Use `class-validator` and `class-transformer` for DTOs:

```typescript
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  categoryId: number;

  @IsString()
  @IsOptional()
  description?: string;
}
```

Apply DTOs in controllers using `ParseBodyPipe`:

```typescript
@Post()
@UsePipes(new ValidationPipe({ transform: true }))
async create(@Body() createProductDto: CreateProductDto) {
  // ...
}
```

---

## 7. Entity Pattern

TypeORM entities follow this structure:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from './category.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ default: false })
  isActive: boolean;
}
```

Column naming: snake_case (`created_at`, `category_id`)

---

## 8. Error Handling

### Custom Exception Filter

Use `src/errors/errors.filter.ts` for global exception handling.

### Custom Error Messages

Store error messages in `src/errors/custom/index.ts`:

```typescript
export const errorMessages = {
  product: {
    notFound: 'Product not found',
    notFulfilled: 'Product requirements not met',
  },
  category: {
    notFound: 'Category not found',
  },
  auth: {
    unauthorized: 'Unauthorized',
    invalidCredentials: 'Invalid credentials',
  },
};
```

### Throwing Exceptions

```typescript
throw new NotFoundException(errorMessages.product.notFound);
throw new UnauthorizedException(errorMessages.auth.unauthorized);
throw new ConflictException('Cannot delete product with orders');
```

---

## 9. Service Layer Pattern

Services use `EntityManager` for database operations:

```typescript
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

### QueryBuilder Usage

```typescript
const result = await this.entityManager
  .createQueryBuilder()
  .update(Product)
  .set({ isActive: true })
  .where('id = :id', { id: productId })
  .andWhere('merchantId = :merchantId', { merchantId })
  .returning(['id', 'isActive'])
  .execute();
```

---

## 10. Controller Layer Pattern

```typescript
@Controller('product')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return this.productService.getProduct(+id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }
}
```

### Decorators

- `@Param()` — URL parameters
- `@Body()` — Request body
- `@Query()` — Query string
- `@Headers()` — HTTP headers
- `@CurrentUser()` — Authenticated user (custom decorator)

---

## 11. Guard and Auth Pattern

### Auth Guard

```typescript
@UseGuards(AuthGuard)
```

### Roles Guard

```typescript
@UseGuards(RolesGuard)
@Roles(RoleEnum.ADMIN)
```

### Custom Current User Decorator

```typescript
@CurrentUser() user: User
```

---

## 12. Response Pattern

### Success Response

Use `successObject` from helper:

```typescript
import { successObject } from 'src/common/helper/sucess-response.interceptor';

return successObject; // { success: true }
```

### With Data

```typescript
return { success: true, data: product };
```

---

## 13. Testing Conventions

### Unit Test Pattern

```typescript
describe('ProductService', () => {
  let service: ProductService;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getEntityManagerToken(),
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    entityManager = module.get<EntityManager>(getEntityManagerToken());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

### Mock EntityManager

Mock methods on `entityManager`:

- `findOne()`, `find()`, `create()`, `save()`, `delete()`
- `createQueryBuilder()`, `update()`, `execute()`

---

## 14. Migration Pattern

```bash
npm run migration:generate -- --name=migration_name
npm run migration:run
npm run migration:revert
```

---

## 15. Database Seeding

Seeders in `src/database/seed/seeders/`:

```typescript
@Injectable()
export class CategorySeeder implements Seeder {
  async run(dataSource: DataSource) {
    // Seed logic
  }
}
```

---

## 16. Configuration

Environment variables in `.env`:

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=ecommerce

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
```

Use `@nestjs/config` for loading.

---

## 17. Architecture Overview

```
src/
├── api/                    # Feature modules
│   ├── auth/
│   ├── product/
│   ├── user/
│   └── role/
├── common/
│   └── helper/            # Shared helpers
├── database/
│   ├── entities/         # TypeORM entities
│   ├── migrations/       # DB migrations
│   ├── seed/             # Seeders
│   └── typeorm/          # TypeORM config
├── errors/               # Error handling
└── config/              # App config
```

---

## 18. Best Practices

1. **Validate input** — Use DTOs with `class-validator`
2. **Handle errors** — Throw appropriate exceptions
3. **Use transactions** — For multi-step operations
4. **Log errors** — Use NestJS logger
5. **Test coverage** — Aim for >80% on services
6. **Format before commit** — Run `npm run format`
7. **Lint before commit** — Run `npm run lint`

---

## 19. Quick Reference

| Task       | Command                                  |
| ---------- | ---------------------------------------- |
| Build      | `npm run build`                          |
| Lint       | `npm run lint`                           |
| Format     | `npm run format`                         |
| Test       | `npm test`                               |
| Test file  | `npm test -- --testPathPattern=filename` |
| E2E        | `npm run test:e2e`                       |
| Migrate    | `npm run migration:run`                  |
| Seed       | `npm run seed:run`                       |
| Start dev  | `npm run start:dev`                      |
| Start prod | `npm run start:prod`                     |

---

End of AGENTS.md

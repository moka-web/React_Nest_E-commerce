# AGENTS.md — Agentic Coding Guidelines

Conventions for agentic coding agents operating in this Nest.js e-commerce codebase.

---

## 1. Build, Lint, and Test Commands

### Build, Lint, Format

```bash
npm run build     # Compile TS to dist/
npm run lint      # ESLint with auto-fix
npm run format   # Prettier
```

### Test (single file)

```bash
npm test -- --testPathPattern=product.service.spec
```

### Test (single test)

```bash
npm test -- --testNamePattern="should create"
```

### Other Commands

```bash
npm run test:cov     # Coverage report
npm run test:e2e    # End-to-end tests
npm run start:dev   # Watch mode
npm run migration:run
npm run seed:run
```

---

## 2. Code Style

### Formatting (Prettier)

- Single quotes (`'string'`)
- Trailing commas (always)
- Indentation: 2 spaces

### Linting (ESLint)

- `@typescript-eslint/recommended`
- Rules: `no-explicit-any`: OFF, `explicit-module-boundary-types`: OFF

### TypeScript

- `strict: false` (not strict mode)
- Use interfaces for DTOs/entities
- Use enums for fixed values (e.g., RoleEnum)

---

## 3. Import Ordering

1. **External NestJS** — `@nestjs/*`
2. **External TypeORM** — `typeorm`, `@nestjs/typeorm`
3. **External Third-Party** — class-validator, class-transformer
4. **Internal Entities** — `src/database/entities/*`
5. **Internal Modules** — `src/*` (local imports)
6. **Internal Helpers** — `src/common/helper/*`, `src/errors/*`

```typescript
import { NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CreateProductDto } from '../dto/product.dto';
import { Product } from 'src/database/entities/product.entity';
import { errorMessages } from 'src/errors/custom';
```

---

## 4. Naming Conventions

### Files

| Type       | Convention             | Example                   |
| ---------- | ---------------------- | ------------------------- |
| Entity     | `{name}.entity.ts`     | `product.entity.ts`       |
| Service    | `{name}.service.ts`    | `product.service.ts`      |
| Controller | `{name}.controller.ts` | `product.controller.ts`   |
| DTO        | `{name}.dto.ts`        | `create-product.dto.ts`   |
| Module     | `{name}.module.ts`     | `product.module.ts`       |
| Spec       | `{name}.spec.ts`       | `product.service.spec.ts` |

### Database Tables

- **Singular**: `product`, `user`, `category` (not plural)
- **Columns**: snake_case (`created_at`, `category_id`)

---

## 5. Error Handling

### Custom Error Messages

Store in `src/errors/custom/index.ts`:

```typescript
export const errorMessages = {
  product: { notFound: 'Product not found' },
  auth: { unauthorized: 'Unauthorized' },
};
```

### Throwing Exceptions

```typescript
throw new NotFoundException(errorMessages.product.notFound);
throw new UnauthorizedException(errorMessages.auth.unauthorized);
throw new ConflictException('Cannot delete product with orders');
```

---

## 6. Service Layer Pattern

Use `EntityManager` for DB operations:

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

---

## 7. Response Pattern

```typescript
return { success: true, data: product };
```

Or use `successObject` from helper:

```typescript
import { successObject } from 'src/common/helper/sucess-response.interceptor';
return successObject; // { success: true }
```

---

## 8. Testing Pattern

```typescript
describe('ProductService', () => {
  let service: ProductService;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: getEntityManagerToken(), useValue: mockEntityManager },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

Mock methods: `findOne()`, `find()`, `save()`, `createQueryBuilder()`

---

## 9. Quick Reference

| Task      | Command                                  |
| --------- | ---------------------------------------- |
| Build     | `npm run build`                          |
| Lint      | `npm run lint`                           |
| Format    | `npm run format`                         |
| Test      | `npm test`                               |
| Test file | `npm test -- --testPathPattern=filename` |
| Test name | `npm test -- --testNamePattern="name"`   |
| Coverage  | `npm run test:cov`                       |
| E2E       | `npm run test:e2e`                       |
| Migrate   | `npm run migration:run`                  |
| Seed      | `npm run seed:run`                       |
| Start dev | `npm run start:dev`                      |

---

End of AGENTS.md

# Ecommerce App with Nest.js and Postgres

## Description

This project is an ecommerce application built using Nest.js and Postgres. The focus is on writing clean, modular, and testable code, and following a well-organized project structure.

## Technology Stack

- Nest.js
- PostgreSQL
- TypeORM
- JWT (Authentication)
- Jest
- Docker

## Configuration

Create a `.env` file in the root directory with the following variables:

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

# App
PORT=3000
```

## Project Structure

```
src/
├── api/                    # Feature modules
│   ├── auth/              # Authentication
│   ├── product/           # Product management
│   ├── user/              # User management
│   └── role/              # Role management
├── common/
│   └── helper/            # Shared helpers
├── database/
│   ├── entities/          # TypeORM entities
│   ├── migrations/        # DB migrations
│   └── seed/              # Seeders
├── errors/                # Error handling
└── config/                # App configuration
```

## Getting Started

To get started with this project, follow these steps:

- Clone this repository to your local machine.
- navigate to the nestjs-ecommerce directory.

```bash
cd ./nestjs-ecommerce
```

- start postgres database.

```bash
docker-compose up -d
```

- install app dependencies.

```bash
npm install
```

- run database migrations.

```bash
npm run migration:run
```

if you want to generate any future migration

```bash
npm run migration:generate --name=<migrationName>
```

- run database seeders.

```bash
npm run seed:run
```

- start the application.

```bash
npm run start:dev
```

## Scripts

| Command                                       | Description                       |
| --------------------------------------------- | --------------------------------- |
| `npm run build`                               | Compiles TypeScript to JavaScript |
| `npm run lint`                                | Runs ESLint with auto-fix         |
| `npm run format`                              | Formats code with Prettier        |
| `npm run start:dev`                           | Starts app in watch mode          |
| `npm run start:prod`                          | Runs compiled app                 |
| `npm run migration:run`                       | Runs pending migrations           |
| `npm run migration:generate -- --name=<name>` | Generates a new migration         |
| `npm run seed:run`                            | Runs database seeders             |

## API Endpoints

### Auth

| Method | Endpoint         | Description       | Auth Required |
| ------ | ---------------- | ----------------- | ------------- |
| POST   | `/auth/login`    | Login usuario     | No            |
| POST   | `/auth/register` | Registrar usuario | No            |

### User

| Method | Endpoint        | Description                | Auth Required |
| ------ | --------------- | -------------------------- | ------------- |
| GET    | `/user/profile` | Obtener perfil del usuario | Yes           |

### Role

| Method | Endpoint       | Description           | Auth Required |
| ------ | -------------- | --------------------- | ------------- |
| POST   | `/role/assign` | Asignar rol a usuario | Yes (Admin)   |

### Product

| Method | Endpoint                | Description                  | Auth Required        |
| ------ | ----------------------- | ---------------------------- | -------------------- |
| GET    | `/product/:id`          | Obtener producto por ID      | No                   |
| POST   | `/product/create`       | Crear nuevo producto         | Yes (Admin/Merchant) |
| POST   | `/product/:id/details`  | Agregar detalles al producto | Yes (Admin/Merchant) |
| POST   | `/product/:id/activate` | Activar producto             | Yes (Admin/Merchant) |
| DELETE | `/product/:id`          | Eliminar producto            | Yes (Admin/Merchant) |

## Testing

| Command              | Description              |
| -------------------- | ------------------------ |
| `npm test`           | Runs all unit tests      |
| `npm run test:watch` | Runs tests in watch mode |
| `npm run test:cov`   | Runs tests with coverage |
| `npm run test:e2e`   | Runs end-to-end tests    |

To run the tests, follow these steps:

1. Install dependencies: `npm install`
2. Run the tests: `npm run test`

## Contributing

If you're interested in contributing to this project, please follow these guidelines:

1. Fork the repository
2. Make your changes
3. Submit a pull request

# Fieldstock — Full-Stack E-Commerce (Next.js + NestJS + PostgreSQL)

A complete e-commerce system:

- **Backend**: NestJS + TypeORM + PostgreSQL, JWT auth with role-based access (admin / customer)
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Features**: storefront (home, product listing, product detail, cart, checkout, order history) and a full admin panel (dashboard, products CRUD, categories CRUD, order management, user management)

---

## 1. Project structure

```
ecommerce-project/
  backend/     → NestJS API (port 4000)
  frontend/    → Next.js app (port 3000)
```

## 2. Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or Docker)

## 3. Backend setup

```bash
cd backend
cp .env.example .env      # edit DB credentials if needed
npm install
```

Start PostgreSQL. Easiest way, with Docker:

```bash
docker compose up -d
```

Or point `.env` at your own existing Postgres instance.

Run the API in dev mode (TypeORM `synchronize: true` will auto-create tables):

```bash
npm run start:dev
```

Seed the database with an admin user, a customer user, categories and sample products:

```bash
npm run seed
```

Seeded accounts:
| Role     | Email              | Password     |
|----------|---------------------|--------------|
| Admin    | admin@shop.com      | Admin123!    |
| Customer | customer@shop.com   | Customer123! |

API runs at `http://localhost:4000/api`.

### Key endpoints

| Resource   | Endpoints |
|------------|-----------|
| Auth       | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Categories | `GET /categories`, `POST /categories` (admin), `PATCH /categories/:id` (admin), `DELETE /categories/:id` (admin) |
| Products   | `GET /products` (paginated/filterable), `GET /products/admin/all` (admin), `GET /products/slug/:slug`, `GET /products/:id`, `POST /products` (admin), `PATCH /products/:id` (admin), `DELETE /products/:id` (admin) |
| Cart       | `GET /cart`, `POST /cart/items`, `PATCH /cart/items/:id`, `DELETE /cart/items/:id`, `DELETE /cart` |
| Orders     | `POST /orders` (checkout from cart), `GET /orders/mine`, `GET /orders/mine/:id`, `GET /orders` (admin), `PATCH /orders/:id/status` (admin) |
| Users      | `GET /users`, `POST /users`, `PATCH /users/:id`, `DELETE /users/:id` (all admin-only) |

## 4. Frontend setup

```bash
cd frontend
cp .env.local.example .env.local   # points to http://localhost:4000/api by default
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## 5. Pages

**Storefront**
- `/` — Home page (hero, categories, newest arrivals)
- `/products` — Product listing with search, category filter, sort, pagination
- `/products/[id]` — Product detail with quantity picker and add-to-cart
- `/cart` — Cart with quantity edit, remove, and checkout (creates an order)
- `/orders` — Customer's order history
- `/login`, `/register` — Auth

**Admin** (requires an account with role `admin`)
- `/admin` — Dashboard: revenue, order count, low-stock alerts, recent orders
- `/admin/products` — Product list with edit/delete, `/admin/products/new` and `/admin/products/[id]/edit` for create/edit
- `/admin/categories` — Category list with inline create/edit/delete
- `/admin/orders` — Order list with expandable line items and status updates
- `/admin/users` — User list with role toggle and enable/disable

## 6. Data model

- `User` (id, name, email, password, role, isActive)
- `Category` (id, name, slug, description, imageUrl)
- `Product` (id, name, slug, description, price, stock, imageUrl, isActive, categoryId)
- `Cart` (id, userId) → has many `CartItem` (productId, quantity)
- `Order` (id, userId, total, status, shippingAddress) → has many `OrderItem` (productId, productName, unitPrice, quantity — snapshotted at checkout time)

## 7. Notes for production

- Set `synchronize: false` in `app.module.ts` and use TypeORM migrations once your schema stabilizes.
- Change `JWT_SECRET` to a strong, unique value.
- Add HTTPS / a reverse proxy in front of the API.
- Consider adding refresh tokens, rate limiting, and file uploads (currently product/category images are simple URLs).

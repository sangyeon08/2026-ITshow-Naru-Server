# 🍱 Naru Server — 2026 IT Show Backend

NestJS + TypeScript + PostgreSQL backend for the **Naru** delivery app.

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20 |
| Framework | NestJS 11 |
| Language | TypeScript 5 |
| Database | PostgreSQL 16 |
| ORM | TypeORM 0.3 |
| Auth | JWT + Passport |
| Validation | class-validator |
| Docs | Swagger / OpenAPI |
| HTTP Client | @nestjs/axios |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16 (or Docker)

### 1. Clone & Install

```bash
git clone https://github.com/sangyeon08/2026-ITshow-Naru-Server.git
cd 2026-ITshow-Naru-Server
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your database credentials and JWT secret
```

### 3. Start with Docker (Recommended)

```bash
# Start PostgreSQL only
docker-compose up postgres -d

# Start everything (API + DB)
docker-compose up -d
```

### 4. Start without Docker

```bash
# Make sure PostgreSQL is running and .env is configured
npm run start:dev
```

The server starts at **http://localhost:3000**
Swagger API docs: **http://localhost:3000/api/docs**

---

## 📁 Project Structure

```
src/
├── auth/              # JWT authentication (login)
├── users/             # User management (My Page)
├── stores/            # Store listings & search
├── menus/             # Menu items & allergy check
├── orders/            # Order creation & status progression
├── categories/        # Food categories
├── reviews/           # Store reviews (nationality-sorted)
├── coupons/           # User coupons
├── exchange/          # Currency exchange (live rates)
├── navigation/        # Place search & transit routes (dummy)
├── common/
│   ├── filters/       # Global exception filter
│   ├── guards/        # JwtAuthGuard
│   └── decorators/    # @CurrentUser()
├── config/            # App configuration
└── main.ts            # Application entry point
```

---

## 📡 API Endpoints

All endpoints are prefixed with `/api/v1`.

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/login` | Login with email + password -> JWT |

### Users
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/users` | No | Create user (admin use) |
| GET | `/users/me` | Yes | Get my profile (My Page) |
| PATCH | `/users/me` | Yes | Update my profile |

### Stores
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/stores` | No | List stores (filter by categoryId, search) |
| GET | `/stores/featured` | No | Featured / banner stores |
| GET | `/stores/nearby?lat=&lng=` | Yes | Nearby stores by coordinates |
| GET | `/stores/:id` | Yes | Store detail with menus & reviews |

### Menus
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/menus?storeId=` | No | Get menus for a store |
| GET | `/menus/:id/allergy-check` | Yes | Check allergens vs user profile |

### Orders
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/orders` | Yes | Create order (triggers 15s auto-progression) |
| GET | `/orders` | Yes | List my orders |
| GET | `/orders/:id` | Yes | Order detail |
| GET | `/orders/:id/status` | Yes | Current status (for polling) |

### Categories
| Method | Path | Description |
|--------|------|-------------|
| GET | `/categories` | All categories (Korean/Chinese/Japanese/Western/Snacks) |

### Reviews
| Method | Path | Description |
|--------|------|-------------|
| GET | `/reviews/store/:storeId?nationality=KO` | Store reviews (same nationality first) |

### Coupons
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/coupons` | Yes | All my coupons |
| GET | `/coupons/active` | Yes | Active (unused & not expired) |

### Exchange
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/exchange/rates` | No | All exchange rates (KRW base, fallback on API failure) |
| GET | `/exchange/rate?currency=USD` | No | Rate for specific currency |
| POST | `/exchange/convert` | Yes | Perform exchange (TO_KRW or FROM_KRW) |
| GET | `/exchange/history` | Yes | My exchange history |

### Navigation
| Method | Path | Description |
|--------|------|-------------|
| GET | `/navigation/search?q=` | Search places (dummy data) |
| GET | `/navigation/nearby?lat=&lng=` | Nearby recommendations |
| GET | `/navigation/routes/:destinationId` | Transit routes (dummy data) |

---

## Order Status Flow

When an order is placed, the status automatically progresses every **15 seconds**:

```
PENDING --(15s)--> COOKING --(15s)--> DELIVERING --(15s)--> COMPLETED
```

The frontend polls `GET /orders/:id/status` to show the current state and update the UI.

---

## Exchange Rate

- Uses **ExchangeRate-API** (free tier: https://www.exchangerate-api.com/)
- Falls back to hardcoded rates if the API call fails
- Supported currencies: USD, EUR, JPY, CNY, GBP, AUD, CAD, SGD, and more

---

## Development

```bash
# Start in watch mode
npm run start:dev

# Build
npm run build

# Run tests
npm run test

# Lint
npm run lint
```

---

## Notes

- **Account creation** is done by admin directly (no public sign-up in production use)
- **TypeORM synchronize: true** is enabled in development — DB schema auto-creates/updates
- No real payment gateway — order payment is simulated
- No real map API — navigation uses dummy data
- Allergy check compares user's allergies[] against menu's allergens[]

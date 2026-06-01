BEGIN;

-- Drop tables if exist (order matters for FKs)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS exchange_transactions CASCADE;
DROP TABLE IF EXISTS exchange_rates CASCADE;
DROP TABLE IF EXISTS user_coupons CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS menu_allergies CASCADE;
DROP TABLE IF EXISTS menus CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS stores CASCADE;
DROP TABLE IF EXISTS user_allergies CASCADE;
DROP TABLE IF EXISTS allergies CASCADE;
DROP TABLE IF EXISTS balances CASCADE;
DROP TABLE IF EXISTS exchanges CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS countries CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Countries
CREATE TABLE countries (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    currency_code VARCHAR(10),
    currency_symbol VARCHAR(10)
);

-- Users
CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(200) UNIQUE,
    password_hash VARCHAR(255),
    phone VARCHAR(50),
    profile_image_url TEXT,
    country_id BIGINT REFERENCES countries(id),
    balance_krw DECIMAL DEFAULT 0,
    total_exchange_amount DECIMAL DEFAULT 0,
    order_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Allergies and user_allergies
CREATE TABLE allergies (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE user_allergies (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    allergy_id BIGINT REFERENCES allergies(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, allergy_id)
);

-- Categories (for stores)
CREATE TABLE categories (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100),
    image_url TEXT
);

-- Stores
CREATE TABLE stores (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_id BIGINT REFERENCES categories(id),
    name VARCHAR(200),
    description TEXT,
    address TEXT,
    latitude DECIMAL,
    longitude DECIMAL,
    image_url TEXT,
    rating DECIMAL DEFAULT 0,
    review_count INTEGER DEFAULT 0
);

-- Menus and menu_allergies
CREATE TABLE menus (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    store_id BIGINT REFERENCES stores(id) ON DELETE CASCADE,
    name VARCHAR(200),
    description TEXT,
    price DECIMAL NOT NULL,
    image_url TEXT,
    allergy_notice TEXT
);

CREATE TABLE menu_allergies (
    menu_id BIGINT REFERENCES menus(id) ON DELETE CASCADE,
    allergy_id BIGINT REFERENCES allergies(id) ON DELETE CASCADE,
    PRIMARY KEY (menu_id, allergy_id)
);

-- Carts and cart_items
CREATE TABLE carts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cart_id BIGINT REFERENCES carts(id) ON DELETE CASCADE,
    menu_id BIGINT REFERENCES menus(id),
    quantity INTEGER DEFAULT 1
);

-- Orders and order_items
CREATE TABLE orders (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    store_id BIGINT REFERENCES stores(id),
    delivery_address TEXT,
    total_amount DECIMAL DEFAULT 0,
    status VARCHAR(50),
    ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE TABLE order_items (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
    menu_id BIGINT REFERENCES menus(id),
    quantity INTEGER DEFAULT 1,
    price DECIMAL
);

-- Payments
CREATE TABLE payments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
    amount DECIMAL,
    card_company VARCHAR(100),
    paid_at TIMESTAMP,
    status VARCHAR(50)
);

-- Reviews
CREATE TABLE reviews (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    store_id BIGINT REFERENCES stores(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coupons and user_coupons
CREATE TABLE coupons (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(200),
    discount_amount DECIMAL,
    expires_at TIMESTAMP
);

CREATE TABLE user_coupons (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    coupon_id BIGINT REFERENCES coupons(id) ON DELETE CASCADE,
    is_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP
);

-- Exchange rates and transactions
CREATE TABLE exchange_rates (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    from_currency VARCHAR(10),
    to_currency VARCHAR(10),
    rate DECIMAL,
    fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exchange_transactions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    from_currency VARCHAR(10),
    to_currency VARCHAR(10),
    amount_from DECIMAL,
    amount_to DECIMAL,
    exchange_rate DECIMAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Balances (kept for compatibility)
CREATE TABLE balances (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    balance_krw DECIMAL DEFAULT 0,
    balance_usd DECIMAL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exchanges (legacy)
CREATE TABLE exchanges (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50),
    amount DECIMAL,
    currency VARCHAR(10),
    balance_after DECIMAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    order_id BIGINT REFERENCES orders(id),
    title VARCHAR(300),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

COMMIT;

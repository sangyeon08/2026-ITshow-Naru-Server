BEGIN;

INSERT INTO users (name, email, password, phone, allergy_info)
VALUES
    ('John Tourist', 'john@example.com', 'test-password', '010-1111-2222', 'peanut'),
    ('Anna Traveler', 'anna@example.com', 'test-password', '010-3333-4444', 'shellfish');

INSERT INTO stores (name, description, address, country)
VALUES
    ('Naru Gukbap', 'Warm Korean soup restaurant near the station.', 'Seoul Jung-gu 1', 'KR'),
    ('Seoul Tteokbokki', 'Spicy street food and snacks.', 'Seoul Mapo-gu 22', 'KR');

INSERT INTO menus (store_id, name, category, price, allergy_tags, description)
VALUES
    (1, 'Pork Gukbap', 'Korean', 9500, 'pork', 'Rice soup with pork broth.'),
    (1, 'Vegetable Bibimbap', 'Korean', 11000, 'soy,sesame', 'Rice bowl with vegetables.'),
    (2, 'Tteokbokki', 'Korean Snack', 6000, 'wheat,soy', 'Spicy rice cakes.'),
    (2, 'Fish Cake Soup', 'Korean Snack', 5000, 'fish,wheat', 'Warm fish cake soup.');

INSERT INTO carts (user_id)
VALUES
    (1),
    (2);

INSERT INTO cart_items (cart_id, menu_id, quantity)
VALUES
    (1, 1, 1),
    (1, 2, 1),
    (2, 3, 2);

INSERT INTO orders (user_id, store_id, cart_id, address, status)
VALUES
    (1, 1, 1, 'Seoul Jung-gu Hotel Naru', 'PAID');

INSERT INTO order_items (order_id, menu_id, quantity)
VALUES
    (1, 1, 1),
    (1, 2, 1);

INSERT INTO reviews (store_id, user_id, rating, content, country)
VALUES
    (1, 1, 5, 'Good soup and easy to order.', 'US'),
    (2, 2, 4, 'Spicy but delicious.', 'CA');

INSERT INTO exchanges (user_id, type, amount, currency, balance_after)
VALUES
    (1, 'TO_KRW', 50, 'USD', 67500),
    (2, 'TO_KRW', 30, 'USD', 40500);

INSERT INTO balances (user_id, balance_krw, balance_usd)
VALUES
    (1, 67500, 50),
    (2, 40500, 30);

COMMIT;

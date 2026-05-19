# Naru API Project Structure

This repository is organized as an API-only backend.
Server infrastructure and database implementation are expected to be owned separately.

## Current layout

```text
src/
├── app.ts            # API app setup entry
├── server.ts         # server bootstrap entry
├── routes/           # route registration
├── middlewares/      # shared middleware
├── config/           # environment and app config
├── common/           # shared helpers, error handling, response shape
├── auth/             # authentication
├── users/            # user profile and preferences
├── stores/           # store data
├── menus/            # menu data
├── carts/            # cart flow
├── orders/           # order flow
├── payments/         # payment flow
├── notifications/    # order and system notifications
├── exchanges/        # exchange-rate features
├── maps/             # location and route features
├── types/            # shared types
└── utils/            # utility helpers
```

## API source of truth

The concrete API list for this repository currently lives in [src/routes/index.ts](src/routes/index.ts).

It includes the requested endpoints for:

- auth and users
- stores, cart, and orders
- maps and exchange

If the implementation later moves into controller/service files, keep this route registry or replace it with a generated equivalent so the contract stays visible in one place.

## Suggested feature split

- `controller`: request/response handling
- `service`: business logic
- `repository`: persistence boundary
- `dto`: request and response shapes
- `schema` or `validator`: input validation

## Notes

- Keep domain logic inside each feature folder.
- Put cross-cutting concerns in `common`, `middlewares`, or `config`.
- Add database adapters later without changing the API module boundaries.

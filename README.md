## Requirements

- [psqldef](https://github.com/sqldef/sqldef/releases/latest): to migrate Database
- Docker: to run PostgreSQL Database locally

## Setup

```sh
cp .env.example .env # And edit .env
```

```sh
npm i
npm run dev
```

## Manage Database Schema

1. Update `schema.prisma` manually.
1. Run `db/migrate`

# ato de yomu

Save web pages to read later, track your reading history, and share your lists—or keep them private.

"ato de yomu" (äto de jomɯ) is Japanese for "Read later."

- app: https://atodeyomu.morishin.me
- blog post: https://blog.morishin.me/posts/2024/09/24/atodeyomu

## Requirements

- [psqldef](https://github.com/sqldef/sqldef/releases/latest): to migrate Database
- Docker: to run PostgreSQL Database locally

## Setup

```sh
cp .env.example .env # And edit .env
```

```sh
docker compose up
```

```sh
npm i --legacy-peer-deps
npm run dev
```

## Manage Database Schema

1. Update `schema.prisma` manually.
1. Run `db/migrate`

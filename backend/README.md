# GharDaari Backend

This folder is the backend starting point for GharDaari.

## What Each Tool Does

- Express creates API routes such as login, signup, posts, comments, and chats.
- PostgreSQL stores the real database tables.
- Prisma connects JavaScript code to PostgreSQL using models.
- JWT keeps users logged in and protects private API routes.
- bcryptjs hashes passwords before saving them.

## First Setup Commands

Run these inside the `backend` folder:

```bash
npm install
copy .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

The API will run at:

```text
http://localhost:5000
```

## Important

Do not save real passwords directly. Passwords are hashed with `bcryptjs`. Set a strong `JWT_SECRET` in `.env` before using the app outside local development.

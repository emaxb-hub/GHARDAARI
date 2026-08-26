# GharDaari Project Guide - Easy English

This file explains the current GharDaari app in simple English.

## Current Project Type

This is not a Next.js app.
This is not a TypeScript app.

Current setup:

- Frontend: simple HTML, CSS, and JavaScript
- Backend: Node.js with Express
- Database: PostgreSQL
- Database tool: Prisma ORM
- Login security: JWT tokens
- Password security: bcryptjs password hashing

## Important Local Links

Use these links when the app is running:

- Frontend login page: http://127.0.0.1:5500/login.html
- Frontend home page: http://127.0.0.1:5500/home.html
- Frontend categories page: http://127.0.0.1:5500/categories.html
- Frontend community page: http://127.0.0.1:5500/community.html
- Frontend resources page: http://127.0.0.1:5500/resources.html
- Frontend profile page: http://127.0.0.1:5500/profile.html
- Admin moderation page: http://127.0.0.1:5500/dashboard.html
- Forgot password page: http://127.0.0.1:5500/forgot-password.html
- Reset password page: http://127.0.0.1:5500/reset-password.html
- Verify email page: http://127.0.0.1:5500/verify-email.html
- Backend health check: http://127.0.0.1:5000/api/health
- Backend API base URL: http://127.0.0.1:5000/api
- Prisma Studio database viewer: http://127.0.0.1:5555

## Production Frontend API URL

For local development, the frontend automatically talks to:

```text
http://127.0.0.1:5000/api
```

For deployment, update this file:

```text
config.js
```

Put your deployed backend API URL there:

```js
window.GHARDAARI_CONFIG = {
  apiBaseUrl: "https://your-backend-url.onrender.com/api"
};
```

The `frontend-share/config.js` copy should match if you deploy from `frontend-share`.

## Demo Test Accounts

I created two real database users for testing:

- Test One: `test.one@ghardaari.local`
- Test Two: `test.two@ghardaari.local`
- Password for both: `Test1234`

Use Test One if you want to see admin features.
Use Test Two if you want to see the normal user side.

What demo data exists:

- Test One has a post on the Home page.
- Test Two has a post on the Home page.
- Both users have comments on posts.
- Both users have liked posts.
- Test Two saved Test One's post.
- There is one demo group chat.
- There is one demo direct message conversation.
- There is one pending demo report for the admin dashboard.

Prisma Studio only opens after you run:

```bash
cd backend
npm run prisma:studio
```

## How To Run The Frontend

Run this from the main project folder:

```bash
python -m http.server 5500 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:5500/login.html
```

## How To Run The Backend

Run this from the backend folder:

```bash
cd backend
npm run start
```

Then check:

```text
http://127.0.0.1:5000/api/health
```

There is also a dev command:

```bash
npm run dev
```

But on this Windows setup, `npm run dev` can fail because `node --watch` may hit a spawn permission error. If that happens, use `npm run start`.

## How To Run Backend Tests

Run this from the backend folder:

```bash
cd backend
npm test
```

The backend tests check:

- Health API
- Categories API
- Signup and login
- Current user profile
- Profile update
- Posts
- Likes and saves
- Comments
- Resources
- Group chat
- Direct messages
- Reports
- Blocking users
- Admin report review
- Admin warning actions
- Admin content removal
- Forgot password and reset password
- Change password
- Email verification

## Database Setup

The backend uses PostgreSQL.

The example database connection is in:

```text
backend/.env.example
```

Example format:

```text
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/ghardaari?schema=public"
```

You need to create or update:

```text
backend/.env
```

Required values:

```text
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/ghardaari?schema=public"
JWT_SECRET="replace_this_with_a_long_random_secret"
ADMIN_EMAILS="admin@example.com"
ALLOWED_ORIGINS="http://127.0.0.1:5500,http://localhost:5500"
RATE_LIMIT_STORE="memory"
FRONTEND_URL="http://127.0.0.1:5500"
PUBLIC_BACKEND_URL="http://127.0.0.1:5000"
EMAIL_PROVIDER="console"
EMAIL_FROM="GharDaari <onboarding@resend.dev>"
RESEND_API_KEY=""
STORAGE_DRIVER="local"
SUPABASE_URL=""
SUPABASE_SERVICE_ROLE_KEY=""
SUPABASE_STORAGE_BUCKET="ghardaari-uploads"
```

For production, use:

```text
NODE_ENV=production
RATE_LIMIT_STORE="database"
JWT_SECRET="a_long_random_secret_that_is_not_shared"
ALLOWED_ORIGINS="https://your-real-frontend-domain.com"
FRONTEND_URL="https://your-real-frontend-domain.com"
PUBLIC_BACKEND_URL="https://your-real-backend-domain.com"
EMAIL_PROVIDER="resend"
EMAIL_FROM="GharDaari <verify@your-domain.com>"
RESEND_API_KEY="your_resend_api_key"
STORAGE_DRIVER="supabase"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
SUPABASE_STORAGE_BUCKET="ghardaari-uploads"
```

## Real Email Setup

Real email sending is now connected in the backend.

Local testing:

- `EMAIL_PROVIDER="console"` keeps email local.
- The backend still returns reset and verification tokens in development/test mode.
- This is useful while building and testing.

Production:

- `EMAIL_PROVIDER="resend"` sends real emails using the Resend API.
- `RESEND_API_KEY` must be set.
- `EMAIL_FROM` should use a verified sender/domain from the email service.
- `FRONTEND_URL` is used to build password reset and email verification links.

The app sends real emails for:

- Signup email verification
- Request email verification again
- Forgot password reset link

## Cloud Image Storage Setup

Cloud image upload support is now connected in the backend.

Local testing:

- `STORAGE_DRIVER="local"` saves images in `backend/uploads`.

Production:

- `STORAGE_DRIVER="supabase"` uploads post/profile images to Supabase Storage.
- `SUPABASE_URL` must be set.
- `SUPABASE_SERVICE_ROLE_KEY` must be set on the backend only.
- `SUPABASE_STORAGE_BUCKET` should be a real bucket name, for example `ghardaari-uploads`.
- The bucket should be public if you want images to load directly in the frontend.

After PostgreSQL is running, use these commands:

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run start
```

## What Is Already Implemented

### Frontend Pages

- Intro page
- Login page
- Signup page
- Home feed page
- Categories page
- Category detail page
- Helpful posts page
- Community page
- Resources page
- Profile page
- Admin moderation dashboard
- Forgot password page
- Reset password page
- Verify email page

### Backend Features

- User signup
- User login
- Admin/member user roles
- Email verification token flow
- Real email sending for password reset and email verification when `EMAIL_PROVIDER="resend"`
- Forgot password token flow
- Reset password flow
- Change password flow
- JWT-based protected routes
- Current user profile API
- Update own profile
- View other user profiles
- Categories API
- Posts API
- Create posts
- Edit own posts
- Delete own posts
- Like posts
- Save posts
- Comments API
- Add comments
- Edit own comments
- Delete own comments
- Resources API
- Add community resources
- Group chat API
- Create groups
- Send group messages
- Direct message API
- Start direct conversations
- Send direct messages
- Chat polling every 5 seconds on the community page
- Report posts, comments, users, group messages, and direct messages
- Admin report list API
- Admin report review API
- Admin dismiss report action
- Admin warn user action
- Admin remove reported content action
- Admin report search and status filtering
- Admin report summary cards
- Admin report history with created and reviewed timestamps
- Admin confirmation modal before review, dismiss, warn, or remove actions
- Block users
- Upload images for posts and profiles with MIME/signature checks
- Local image storage for development
- Supabase Storage image uploads for production
- Login/signup/password rate limiting
- Database-backed rate limit storage for production
- Production CORS allow-list support
- Production HTTPS redirect support behind a proxy
- Basic security response headers
- JSON request and error logging
- Health check API
- Backend API test command

### Database Tables

Prisma currently defines these main tables:

- User
- Category
- Post
- Comment
- PostLike
- SavedPost
- Resource
- Group
- GroupMember
- GroupMessage
- DirectConversation
- DirectConversationMember
- DirectMessage
- Report
- BlockedUser
- UserWarning
- RateLimitBucket

## What Still Remains For A Fully Working App

### Must Check Before Deployment

- Push the project to GitHub.
- Use Supabase Postgres as the production `DATABASE_URL`.
- Run Prisma migrations on the production database.
- Run seed data once on the production database.
- Deploy the backend.
- Put the deployed backend URL in `config.js`.
- Deploy the frontend.
- Run the backend test suite locally before deploying.
- Open the deployed frontend and test signup, login, post, comment, image upload, forgot password, and admin reports.
- Confirm the real production domain is added to `ALLOWED_ORIGINS`.
- Confirm the production server uses HTTPS.

### Important App Work Still Needed

- Add better validation for links, usernames, and profile fields.
- Add pagination or infinite scroll for posts and resources.
- Upgrade chat to WebSockets later if you want true instant messages.
- Add deployment setup for frontend, backend, and database.

### Security Work Still Needed

- Set a strong real `JWT_SECRET` in production.
- Never commit the real `.env` file.
- Put production `ADMIN_EMAILS` and `ALLOWED_ORIGINS` in the server environment.
- Create and verify the real sender/domain in Resend.
- Create the real Supabase Storage bucket and make it public, or add signed image URLs later.
- Use `RATE_LIMIT_STORE="database"` in production so rate limits survive backend restarts.
- Add stricter moderation audit logs if this will be used publicly.

## Easiest Deployment Plan

Use this simple setup:

- Database and image storage: Supabase
- Email: Resend
- Backend API: Render Web Service
- Frontend: Vercel static site, or Render Static Site

### Deploy Backend On Render

1. Push this project to GitHub.
2. Go to Render.
3. Click `New`.
4. Choose `Web Service`.
5. Connect your GitHub repository.
6. Set root directory:

```text
backend
```

7. Set build command:

```bash
npm install && npm run prisma:generate
```

8. Set start command:

```bash
npm start
```

9. Add production environment variables:

```text
NODE_ENV=production
DATABASE_URL=your_supabase_postgres_connection_string
JWT_SECRET=your_long_random_secret
ADMIN_EMAILS=your_email@example.com
ALLOWED_ORIGINS=https://your-frontend-domain.com
RATE_LIMIT_STORE=database
FRONTEND_URL=https://your-frontend-domain.com
PUBLIC_BACKEND_URL=https://your-backend-domain.onrender.com
EMAIL_PROVIDER=resend
EMAIL_FROM=GharDaari <onboarding@resend.dev>
RESEND_API_KEY=your_resend_key
STORAGE_DRIVER=supabase
SUPABASE_URL=https://lxwtbkobrdsopgmysesc.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_STORAGE_BUCKET=ghardaari
```

10. Deploy.
11. After backend deploys, run production migrations once:

```bash
npm run prisma:deploy
```

12. Run seed data once:

```bash
npm run seed
```

### Deploy Frontend

1. Put the backend URL in `config.js`.
2. Example:

```js
window.GHARDAARI_CONFIG = {
  apiBaseUrl: "https://your-backend-domain.onrender.com/api"
};
```

3. Deploy the static frontend files.
4. If using Vercel, use `frontend-share` as the project/root folder.
5. If using Render Static Site, use `frontend-share` as the root directory and leave build command empty.

After frontend deploys, copy its URL and update backend:

```text
ALLOWED_ORIGINS=https://your-frontend-domain.com
FRONTEND_URL=https://your-frontend-domain.com
```

Then redeploy backend once.

## Main Files And Folders

- `index.html`: intro page
- `login.html`: login page
- `signup.html`: signup page
- `home.html`: home feed page
- `categories.html`: categories list page
- `category.html`: selected category page
- `category-detail.html`: older/simple category detail page
- `helpful-posts.html`: helpful posts page
- `community.html`: groups and direct messages page
- `resources.html`: resources page
- `profile.html`: profile page
- `dashboard.html`: admin moderation page
- `forgot-password.html`: forgot password page
- `reset-password.html`: reset password page
- `verify-email.html`: email verification page
- `style.css`: frontend styling
- `script.js`: frontend behavior and API calls
- `frontend-share/`: duplicate frontend copy for sharing
- `backend/src/app.js`: Express app setup and route registration
- `backend/src/server.js`: starts the backend server
- `backend/src/routes/`: backend API routes
- `backend/src/lib/email.js`: real email sending and local email preview
- `backend/src/lib/storage.js`: local uploads and Supabase Storage uploads
- `backend/tests/api.test.js`: backend API tests
- `backend/prisma/schema.prisma`: database models
- `backend/prisma/seed.js`: starter data
- `backend/prisma/demo-data.js`: demo users, posts, comments, chats, and reports
- `backend/.env.example`: example environment variables

## Tools And Libraries Used

- HTML: page structure
- CSS: page design and responsive styling
- JavaScript: frontend behavior
- Node.js: backend runtime
- Express: backend API server
- Prisma: database ORM
- PostgreSQL: real database
- bcryptjs: password hashing
- jsonwebtoken: login token creation and checking
- cors: allows frontend and backend to talk locally
- dotenv: loads `.env` values
- Resend API: sends real password reset and verification emails when configured
- Supabase Storage REST API: stores uploaded images in the cloud when configured
- Python HTTP server: simple local frontend server
- Native Node.js test runner style: backend API test execution without extra test libraries
- In-memory rate limiter: protects login/signup/password routes locally
- Database rate limiter: protects login/signup/password routes in production
- Admin roles: controls access to moderation APIs

## Simple Testing Checklist

Use this checklist when checking the app:

- Open login page.
- Login as Test One or Test Two.
- Create a new account.
- Confirm it opens the home page.
- Add a post.
- Upload a post image.
- Like and save a post.
- Add a comment.
- Edit your own post.
- Delete your own post.
- Open categories.
- Add a question in a category.
- Add an experience in a category.
- Add an article resource.
- Add a video resource.
- Open resources page and search/filter.
- Open community page.
- Create a group.
- Send a group message.
- Create another user.
- Start a direct message.
- Report another user's post or message.
- Open admin dashboard as an admin.
- Review a report.
- Dismiss a report.
- Warn a reported user.
- Remove reported content.
- Block another user.
- Edit your profile.
- Change your password.
- Request email verification.
- Verify email with the local token.
- Use forgot password and reset password.
- Upload a profile image.

## Current Status In One Line

The app now has a working local frontend, backend API tests, chat auto-refresh polling, seeded demo users, polished admin moderation, mobile/desktop UI fixes, security middleware, database-backed production rate limiting, admin roles, real-email-ready password reset and verification, Supabase-ready image uploads, change password, and email verification token flows; it still needs real production account keys and deployment setup before production.

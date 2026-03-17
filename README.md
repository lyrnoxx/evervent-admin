# User Management System with RBAC (MERN)

Full-stack MERN project implementing user management, JWT authentication (httpOnly cookie), and role-based access control for Admin and User roles.

## Stack

- Backend: Node.js, Express, MongoDB, Mongoose
- Frontend: React (Vite), React Router, Axios
- Auth: JWT stored in secure httpOnly cookie
- RBAC: Admin and User route restrictions

## Project Structure

- server: Express API with auth, RBAC middleware, user CRUD
- client: React app with role-aware UI and protected routes

## Features Implemented

### Backend

- Authentication
  - POST /api/auth/register
  - POST /api/auth/login
  - POST /api/auth/logout
  - GET /api/auth/me
- User Management
  - POST /api/users (Admin)
  - GET /api/users (Admin)
  - GET /api/users/:id (Admin or self)
  - PUT /api/users/:id (Admin or self with limited fields)
  - DELETE /api/users/:id (Admin)
  - GET /api/users/me/profile (Authenticated user)
  - PUT /api/users/me/profile (Authenticated user limited update)
- RBAC
  - Admin: full user CRUD
  - User: own profile only and limited update
- Security
  - Password hashing with bcrypt
  - JWT verification middleware
  - Sensitive fields excluded from API responses

### Frontend

- Register and Login screens
- Session bootstrap from cookie via /auth/me
- Protected dashboard route
- Role-aware UI
  - Admin: create/edit/delete users and list all users
  - User: own profile view and limited self update
- Forbidden page for unauthorized access

## Setup

## 1) Backend

1. Open terminal in server folder.
2. Install packages:
   npm install
3. Create server/.env from server/.env.example and update values.
4. Start API:
   npm run dev
5. Run backend tests:
  npm test

Optional: Seed an admin user
- Set ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD in server/.env
- Run:
  npm run seed:admin

## 2) Frontend

1. Open terminal in client folder.
2. Install packages:
   npm install
3. Create client/.env from client/.env.example.
4. Start frontend:
   npm run dev

## Environment Variables

### server/.env

- PORT=5000
- NODE_ENV=development
- MONGO_URI=mongodb://127.0.0.1:27017/rbac_user_mgmt
- JWT_SECRET=replace_with_strong_secret
- JWT_EXPIRES_IN=1d
- AUTH_COOKIE_NAME=token
- COOKIE_SECURE=false
- CLIENT_ORIGIN=http://localhost:5173
- ADMIN_SEED_EMAIL=admin@example.com
- ADMIN_SEED_PASSWORD=admin123
- ADMIN_SEED_NAME=System Admin

### client/.env

- VITE_API_BASE_URL=http://localhost:5000/api

## RBAC Matrix

- Admin:
  - Can create users
  - Can list all users
  - Can view any user
  - Can update any user
  - Can delete any user
- User:
  - Can view own profile
  - Can update own name/password only
  - Cannot create, list, delete, or manage other users

## Validation Done

- Frontend lint passes: npm run lint
- Frontend production build passes: npm run build
- Backend auth/RBAC automated tests pass: npm test
- Backend startup command validated up to env check; it requires MONGO_URI before full runtime start.

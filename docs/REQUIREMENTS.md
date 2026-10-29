# UserHub – Requirements and Implemented Features

All features below are implemented. The backend base URL is `http://localhost:8080/api`; protected endpoints need the header `Authorization: Bearer <token>`.

## Core features

| # | Feature | Description | Expected behavior | Endpoint | Status |
|---|---|---|---|---|---|
| 1 | User registration | A new visitor signs up with full name, email and password. | Validates input (name required, valid email, password ≥ 8 chars). Stores a SHA-256 password hash, default role `USER`. Returns the user without the password. Duplicate email → 409. Invalid input → 400. | `POST /api/auth/register` (201) | Done |
| 2 | User login / authentication | A user proves who they are with email and password. | Correct credentials → 200 with `{token, user}`. Wrong email or password → 401 `Invalid credentials` (same message for both). | `POST /api/auth/login` (200) | Done |
| 3 | Token-based authentication | The server issues a random UUID token after login. | The React app stores it in `localStorage` and sends it as `Bearer <token>` on every request through an Axios interceptor. Missing → 401 `Please log in`; unknown → 401 `Session expired`. | `Authorization` header | Done |
| 4 | Role-based authorization | Roles `USER` and `ADMIN` control access. | Logged-in user with the wrong role → 403 `Access denied`. Checked in the backend (`requireRole`), and mirrored in React for better UX. | `GET /api/dashboard/users` | Done |
| 5 | Protected user dashboard | A personal page that only logged-in users can see. | Shows full name, email, role, member-since date and total users. Without a valid token the page redirects to `/login`. | `GET /api/dashboard` (200) | Done |
| 6 | Protected routes (React) | Pages guarded in the browser. | No token → redirect to `/login`. Wrong role → redirect to `/dashboard`. Unknown path → `/login`. | `ProtectedRoute.jsx` | Done |
| 7 | Exception handling | Errors become clean JSON with proper HTTP codes. | `{ "error": "message" }` with 400, 401, 403 or 409. | `@RestControllerAdvice` | Done |
| 8 | H2 database + JPA | Data is stored through Spring Data JPA. | Tables are generated from entities; browse data in the H2 console. | `/h2-console` | Done |
| 9 | Layered architecture | Entity, Repository, Service, Controller, DTO, Exception packages. | Controllers call the service; the service calls the repository. | – | Done |

## Additional features (lab extension, 50 points)

| # | Feature | Points | Description | Expected behavior | Endpoint | Status |
|---|---|---|---|---|---|---|
| A | Seed an ADMIN user | 10 | A default administrator exists after every start. | A `CommandLineRunner` (`DataSeeder`) creates `admin@userhub.com` / `Admin@12345` with role `ADMIN` if it does not exist. Console prints `Seeded ADMIN user`. | – (startup) | Done |
| B | Admin Users page | 15 | An ADMIN-only page listing all registered users. | Table of id, full name, email and role. Normal users get 403 from the API and are redirected from the page; the nav link is only shown to admins. | `GET /api/dashboard/users` (200 / 401 / 403) | Done |
| C | Server-side logout | 10 | Logging out invalidates the token on the server. | Backend removes the token from the session map; the same token afterwards returns 401. React then clears `localStorage` and goes to `/login`. | `POST /api/auth/logout` (204) | Done |
| D | Edit My Profile | 15 | A logged-in user updates their full name. | Form pre-filled with the current name; blank names are rejected with 400. The new name is saved, shown in the top bar and on the dashboard. A user can only edit their own profile. | `PUT /api/users/me` (200), `GET /api/users/me` | Done |

## API summary

| Method | Endpoint | Auth | Success | Errors |
|---|---|---|---|---|
| POST | `/api/auth/register` | none | 201 | 400, 409 |
| POST | `/api/auth/login` | none | 200 | 400, 401 |
| POST | `/api/auth/logout` | token | 204 | 401 |
| GET | `/api/dashboard` | token | 200 | 401 |
| GET | `/api/dashboard/users` | token + ADMIN | 200 | 401, 403 |
| GET | `/api/users/me` | token | 200 | 401 |
| PUT | `/api/users/me` | token | 200 | 400, 401 |

## React pages

| Route | Page | Access |
|---|---|---|
| `/register` | `Register.jsx` | public |
| `/login` | `Login.jsx` | public |
| `/dashboard` | `Dashboard.jsx` | logged in |
| `/profile` | `Profile.jsx` | logged in |
| `/admin/users` | `AdminUsers.jsx` | ADMIN only |

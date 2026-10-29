# UserHub – My First Full-Stack Web App

UserHub is a simple user management application. Visitors can **register**, **log in** and see a personal **dashboard**. Roles (`USER` and `ADMIN`) control what each person is allowed to do. The React frontend talks to a real Spring Boot REST API, which stores its data in an H2 database.

```
React UI (:5173)  ──HTTP + JSON──▶  Spring Boot API (:8080)  ──JPA/SQL──▶  H2 (in-memory)
```

## Technologies used

| Layer | Technology |
|---|---|
| Backend | Java 21, Spring Boot 4.x, Spring Web, Spring Data JPA, Bean Validation, Maven |
| Database | H2 (in-memory) |
| Frontend | ReactJS (Vite), React Router, Axios, plain CSS |
| Tools | Postman (API testing), Git/GitHub |

## Features

- User registration with input validation (duplicate email → 409)
- Login with SHA-256 password hashing and a random UUID bearer token
- Role-based authorization (`USER`, `ADMIN`) enforced in the backend
- Protected dashboard and protected React routes
- **Extra features:** seeded ADMIN user, Admin Users page, server-side logout, Edit My Profile

Full feature list with endpoints: [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md).

## Project structure

```
Lastname-Firstname-First-Web-App/
├── backend/        Spring Boot source (Entity, Repository, Service, Controller, DTO)
├── frontend/       React + Vite source
├── docs/           REQUIREMENTS.md, Postman collection and screenshots/
└── README.md
```

## System requirements

- **JDK 21** or newer (`java -version`)
- **Maven 3.9+** (`mvn -version`) — or use IntelliJ / VS Code, which can run Maven for you
- **Node.js LTS** and npm (`node -v`, `npm -v`)
- Free ports **8080** (backend) and **5173** (frontend)
- Optional: Postman

## 1. Backend setup and run

```bash
cd backend
mvn spring-boot:run
```

(If you added the Maven wrapper to the project you can use `./mvnw spring-boot:run`, or `mvnw.cmd spring-boot:run` on Windows.)

Wait for `Tomcat started on port 8080` and `Seeded ADMIN user: admin@userhub.com`.

- API base URL: `http://localhost:8080/api`
- H2 console: `http://localhost:8080/h2-console`
  JDBC URL `jdbc:h2:mem:userhubdb`, user `sa`, empty password.

The database lives in memory, so **all data (and all logins) reset every time the backend restarts**.

## 2. Frontend setup and run

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Application URLs and ports

| What | URL |
|---|---|
| React app | http://localhost:5173 |
| Spring Boot API | http://localhost:8080/api |
| H2 console | http://localhost:8080/h2-console |

## Default administrator

| Email | Password |
|---|---|
| `admin@userhub.com` | `Admin@12345` |

Created automatically at startup by a `CommandLineRunner` (`DataSeeder`). You can change it in `backend/src/main/resources/application.properties` (`userhub.admin.*`). This is a demo account for a learning project only.

## How to test the application

**In the browser**

1. Open http://localhost:5173/register and create an account, then log in.
2. Refresh the dashboard — you should stay logged in.
3. Open **My Profile**, change your full name and save — the name in the top bar updates.
4. Try registering the same email again — an "Email already used" error is shown.
5. Log in as the admin (`admin@userhub.com`) and open **Users** — all accounts are listed.
6. As a normal user, type `/admin/users` in the address bar — you are sent back to the dashboard.
7. Click **Logout**, then open `/dashboard` directly — you are sent to the login page.
8. Restart the backend — you are logged out and must log in again.

**With Postman** — import `docs/UserHub.postman_collection.json` and run the requests in order (the login request stores the token automatically).

| Request | Expected |
|---|---|
| POST `/api/auth/register` | 201 Created |
| POST `/api/auth/register` (same email) | 409 Conflict |
| POST `/api/auth/register` (short password) | 400 Bad Request |
| POST `/api/auth/login` | 200 + token |
| POST `/api/auth/login` (wrong password) | 401 |
| GET `/api/dashboard` with token | 200 |
| GET `/api/dashboard` without token | 401 |
| GET `/api/dashboard/users` as USER | 403 |
| GET `/api/dashboard/users` as ADMIN | 200 |
| PUT `/api/users/me` | 200, name updated |
| POST `/api/auth/logout` | 204, token no longer works (401) |

## Additional configuration

- **CORS:** the backend only accepts requests from `http://localhost:5173`. The Vite dev server is set to that port with `strictPort`, so it will fail instead of silently switching ports.
- **Backend URL:** the frontend calls `http://localhost:8080/api` (set in `frontend/src/api/client.js`).
- **Changing the Java package:** the code uses the package `edu.bsit.lastname`. Rename `lastname` to your own surname (lowercase) with your IDE's *Rename package* refactoring.

## Troubleshooting

| Symptom | Fix |
|---|---|
| "blocked by CORS policy" | Frontend must run on http://localhost:5173 |
| 404 on `/h2-console` | `spring-boot-h2console` must be in `pom.xml` (Spring Boot 4.x) |
| 401 after restarting the backend | Tokens are kept in memory — log in again |
| SQL error near "user" | The table is named `users` (`@Table(name = "users")`) |
| Port 8080 already in use | Stop the old server or set `server.port` |
| "Cannot reach the server" in the UI | The backend is not running |

## Production notes (what a real app would change)

SHA-256 → BCrypt with salt · tokens in a Java Map → Spring Security + JWT · H2 → MySQL/PostgreSQL · token in localStorage → HttpOnly cookies · HTTP → HTTPS.

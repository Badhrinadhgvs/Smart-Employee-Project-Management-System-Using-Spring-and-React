# Smart Emp — Frontend

React 18 + Vite frontend for the **Smart Employee & Project Management System**, built to match the
`smart-emp-mgmt` Spring Boot backend (Phases 1–6) exactly — same DTO shapes, same endpoints, same
role restrictions.

## Stack

- React 18, React Router v6
- Material UI v5 (theme in `src/theme.js`)
- Axios (JWT auto-attached via interceptor)
- Recharts (dashboard charts)
- dayjs, jwt-decode

## Prerequisites

- Node.js 18+ and npm
- The backend running locally on `http://localhost:8080` (see the backend's own README /
  Phase 6 seed data for default credentials)

## Setup

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`. Vite's dev server proxies any request to `/api/**`
straight to `http://localhost:8080`, so no CORS setup is needed in development — this also lines
up with the `SecurityConfig` CORS origins (`http://localhost:3000` and `http://localhost:5173`)
from Phase 4.

To point the app at a different backend (e.g. in production), copy `.env.example` to `.env` and
set `VITE_API_BASE_URL` to the full backend URL, e.g.:

```
VITE_API_BASE_URL=https://your-backend-host/api
```

## Default credentials (from the backend's seed data)

| Role     | Username  | Password |
|----------|-----------|----------|
| Admin    | `admin`   | `admin123` |
| Employee | `john_doe`| `john123`  |
| Employee | `priya_r` | `priya123` |

## Role-based access

The UI mirrors the backend's `SecurityConfig` exactly, so no page ever offers an action the API
would reject:

- **Admin**: full CRUD on Employees, Projects, and Tasks; sees the Reports section and the
  aggregate Admin dashboard.
- **Employee**: read-only Employee directory, their own tasks only (via
  `GET /api/tasks/employee/{id}`), and can update a task's status/remarks
  (`PATCH /api/tasks/{id}/status`) — nothing else. Projects and Reports are hidden, since the
  backend restricts `/api/projects/**` to `ROLE_ADMIN`.

## Project structure

```
src/
  api/            axios client + one module per backend resource (auth, employee, project, task)
  context/        AuthContext (JWT/session), NotificationContext (toasts)
  routes/         ProtectedRoute (auth + role guard)
  components/
    layout/       Sidebar, Topbar, AppLayout
    common/       StatusPill, PriorityPill, PageHeader, ConfirmDialog, EmptyState
  pages/
    auth/         Login, Register
    dashboard/    AdminDashboard, EmployeeDashboard, DashboardIndex (role router)
    employees/    EmployeesPage, EmployeeFormDialog
    projects/     ProjectsPage, ProjectFormDialog
    tasks/        TasksPage, TaskFormDialog
    reports/      ReportsPage (employee-wise / project progress / pending tasks, CSV export)
  theme.js        MUI theme + design tokens
  utils/format.js date/currency/role formatting helpers
```

## Notes on the Reports page

The backend doesn't expose dedicated report endpoints, so the three reports (employee-wise task
report, project progress report, pending task report) are computed client-side from the existing
`/api/employees/list`, `/api/projects`, and `/api/tasks` responses. Each report has a **CSV
export** button (no extra dependency — built with a `Blob` download) to satisfy the bonus
export requirement. If you'd rather have server-side aggregation or true PDF/Excel export, that
would need new backend endpoints or an added library (`xlsx`, `jspdf`).

## Build for production

```bash
npm run build
```

Outputs static assets to `dist/`, deployable to any static host (or served by Spring Boot itself
from `src/main/resources/static` if you prefer a single-jar deployment).

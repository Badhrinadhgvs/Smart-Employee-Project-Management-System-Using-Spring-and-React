# Smart Employee & Project Management System

The **Smart Employee & Project Management System** is a full-stack enterprise web application built using **React 18** (frontend) and **Spring Boot 3.3.2** (backend) with **MySQL 8.4** database persistence. It was developed by **Gundlapalli Venkata Sai Badhrinadh** to demonstrate modern enterprise software engineering practices, role-based security, project/task tracking, real-time analytics, reporting, user profile management, database management, and asynchronous email notifications.

---

## 1. Tech Stack Overview

| Layer | Technology / Library | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18, Vite 5 | Single Page Application framework and build tool |
| **Frontend UI & Styling** | Material UI (MUI v5), Emotion | Design system components, dark/light theme support |
| **Data Export & Visualization**| Recharts, jsPDF, jsPDF-AutoTable, Custom CSV | Analytics charts, dual CSV & PDF report exports |
| **HTTP Client & Routing** | Axios, React Router v6 | API request handling with JWT interceptors & route protection |
| **Backend Framework** | Java 17, Spring Boot 3.3.2 | Core backend framework and REST API engine |
| **Security & Auth** | Spring Security, JJWT (0.12.6) | Stateless JWT authentication & Role-Based Access Control |
| **Persistence & ORM** | Spring Data JPA, Hibernate | Database access layer with automated schema management |
| **Database** | MySQL 8.4 / 8.0 | Relational database engine |
| **Mail & Notifications** | Spring Boot Mail, `@EnableAsync` | Asynchronous HTML email alert dispatches |
| **API Documentation** | Springdoc OpenAPI (Swagger UI v2.6.0) | Interactive API documentation |
| **Containerization** | Docker, Docker Compose | Multi-container environment (MySQL, Spring Backend, Nginx Frontend) |
| **Build & Package** | Maven 3.8+, npm | Dependency management and build tools |

---

## 2. Application Screenshots & Feature Walkthrough

This section presents visual highlights and detailed feature walkthroughs of the core operational portals, user roles, security controls, reporting modules, and data exports.

---

### 2.1 Authentication, Registration & Access Security

The application enforces stateless **JWT Authentication**, role-based authorization gates (`ROLE_ADMIN` & `ROLE_EMPLOYEE`), and client-side **Regex Pattern Validation**. Newly registered employees are held in an **Admin Approval Queue** before gaining full system access.

- **Theme Support**: Real-time Light/Dark mode toggling with persistent user preference.
- **Client-Side Regex Validation**: Instant feedback on Username, Email, Name, and Password formats.
- **Security Protocols**: Bcrypt password hashing and stateless JWT header token dispatches (`Bearer <token>`).

![Login Portal](docs/screenshots/login-portal.png)
*Figure 2.1: JWT Authentication & User Login Portal with theme toggling and demo credentials sandbox.*

![Sign Up Portal](docs/screenshots/signup-portal.png)
*Figure 2.2: Employee Registration Interface featuring real-time client-side regex input validation.*

---

### 2.2 System Admin Command Center (`ROLE_ADMIN`)

Administrators possess full operational oversight across the entire application ecosystem, enabling employee lifecycle management, project tracking, task allocation, real-time analytics, and operational reports export.

#### 2.2.1 Admin Dashboard & Live Analytics
The central hub presents real-time KPI counter cards, interactive data visualizations (Task Breakdown Pie Charts, Project Status Bar Charts, Team Workload Bar Charts, 7-Day Deadline Trends), and a manual **Test Email Alert** action modal.

![Admin Dashboard](docs/screenshots/admin-dashboard.png)
*Figure 2.3: System Admin Dashboard featuring live KPI counters, analytics charts, and test email dispatch action.*

#### 2.2.2 Employee Management & Approval Queue
Full CRUD management for team members. Supports server-side pagination, multi-field sorting (`firstName`, `lastName`, `department`, `salary`, `hireDate`), search filtering, and one-click account approvals.

![Admin Employees View](docs/screenshots/adminview-employees.png)
*Figure 2.4: Employee Management table showing search filters, server pagination, role chips, and approval actions.*

#### 2.2.3 Project Lifecycle Management
Track high-level corporate initiatives. Includes Many-to-Many employee team assignments, status/priority indicators, start/end dates, and a **Dynamic Task Progress Bar** computed automatically from linked tasks.

![Admin Projects View](docs/screenshots/adminview-projects.png)
*Figure 2.5: Project Management interface displaying card grids, assigned employee avatars, and dynamic task completion progress.*

#### 2.2.4 Task Tracking & Assignment
Manage individual work items across projects. Supports assignment to specific team members, priority badges, deadline dates, notes/remarks, and quick status modifications (`PENDING` → `IN_PROGRESS` → `COMPLETED`).

![Admin Tasks View](docs/screenshots/adminview-tasks.png)
*Figure 2.6: Comprehensive Task Management view with instant search, priority filtering, and status selectors.*

#### 2.2.5 Reports & Dual Format Export (CSV / PDF)
Aggregated operational reporting across three specialized tabs (*Employee-wise Tasks*, *Project Progress*, and *Pending Tasks*). Every tab includes a dual format **Export Menu** to generate downloadable **CSV** data sheets or formatted **PDF** documents with visual summary bars.

![Admin Reports View](docs/screenshots/adminview-reports.png)
*Figure 2.7: Aggregated Operational Reports module featuring tabs and one-click CSV and PDF export options.*

#### 2.2.6 User Profile Management & Work Stats
Personal user profile interface displaying account credentials, department, designation, hire date, personal task completion stats, and an interactive **Edit Profile** modal with password update and regex input validation.

![Admin Profile View](docs/screenshots/adminview-profile.png)
*Figure 2.8: Personal Account Profile interface with work snapshot stats and profile edit dialog.*

---

### 2.3 Employee Workspace (`ROLE_EMPLOYEE`)

A focused workspace tailored for individual team members. Employees can view their assigned workload, track upcoming deadlines, update task statuses, add progress remarks, and export personal work summaries.

- **Completion Rate Ring**: Dynamic SVG progress ring showing overall task completion percentage.
- **Deadline Countdowns**: Color-coded deadline indicators highlighting upcoming and overdue tasks.
- **Task Status Toggles**: Quick inline status dropdowns to move tasks from `PENDING` to `IN_PROGRESS` or `COMPLETED`.
- **"Download My Work" Menu**: One-click **CSV** and **PDF** export options for personal task records.

![Employee Workload Dashboard](docs/screenshots/employee-overallview.png)
*Figure 2.9: Employee Workload Dashboard showing completion percentage ring, deadline countdowns, and CSV/PDF export button.*

---

### 2.4 Data Export & Automated Email Notifications

The application features enterprise-grade report generation and asynchronous notification delivery to ensure team alignment.

#### 2.4.1 Formatted PDF & CSV Report Output
Generated PDF reports feature a clean corporate navy header banner, metadata, visual summary bars, auto-table formatting, and page numbering. CSV exports provide raw formatted data ready for Excel/spreadsheet processing.

![Sample PDF Report](docs/screenshots/pdf-report-sample.png)
*Figure 2.10: Auto-generated PDF report featuring branded headers, visual summary charts, and auto-tables.*

#### 2.4.2 Asynchronous HTML Email Notifications
Built on Spring Mail and `@EnableAsync`, the system dispatches styled HTML emails upon key system events (Task Assignment, Status Update, Account Approval, and Manual Alerts) without blocking UI execution.

![Email Notification Sample](docs/screenshots/email-notification.png)
*Figure 2.11: Sample HTML email alert dispatched asynchronously upon task assignment or status update.*

---

## 3. System Flowcharts & Diagrams

### 3.1 High-Level Architecture Flowchart
![Architecture Flowchart](docs/screenshots/architecture_flowchart.png)
*Figure 3.1: High-level System Architecture & Execution Flowchart.*

<details>
<summary>Click to view Mermaid Source Code</summary>

```mermaid
graph TD
    User([User]) -->|Authenticate| Auth[JWT Login]
    Auth --> Portal{Role Router}

    Portal -->|ROLE_ADMIN| Admin[Admin Portal]
    Admin --> AdminOps["Manage Employees<br/>Projects<br/>Tasks<br/>Reports"]

    Portal -->|ROLE_EMPLOYEE| Emp[Employee Portal]
    Emp --> EmpOps["View Assigned Tasks<br/>Update Status"]

    AdminOps --> DB[(MySQL Database)]
    EmpOps --> DB

    AdminOps -.-> Mail[Async Email Notifications]
```
</details>

---

### 3.2 Database Entity-Relationship (ER) Diagram
![Database ER Diagram](docs/screenshots/database_er_diagram.png)
*Figure 3.2: Relational Database Schema & Entity Relationships.*

<details>
<summary>Click to view Mermaid Source Code</summary>

```mermaid
erDiagram
    USERS ||--o{ USER_ROLES : "has roles"
    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS }|--|{ PROJECTS : "assigned to (project_employees)"
    PROJECTS ||--o{ TASKS : "contains"
    USERS ||--o{ TASKS : "assigned to task"

    USERS {
        bigint id PK
        string username UK
        string email UK
        string department
        string designation
        boolean approved
    }

    PROJECTS {
        bigint id PK
        string name
        string status
        string priority
        date start_date
        date end_date
    }

    TASKS {
        bigint id PK
        string title
        string status
        string priority
        date deadline
        bigint assigned_employee_id FK
        bigint project_id FK
    }

    NOTIFICATIONS {
        bigint id PK
        bigint user_id FK
        string title
        string message
        boolean is_read
        datetime created_at
    }
```
</details>

---

### 3.3 Authentication & Authorization Flowchart
*Figure 3.3: Authentication, Admin Approval Gate, JWT Issuance, Token Validation, & Role Routing Flow.*

<details>
<summary>Click to view Mermaid Source Code</summary>

```mermaid
graph TD
    Reg([New User]) -->|1. Submit Registration| RegForm["POST /api/auth/register"]
    RegForm -->|Save as approved=false| DB[(MySQL Database)]
    DB -.->|Notify Admin| AdminGate{Admin Approval Gate}

    AdminGate -->|PATCH /api/admin/employees/id/approve| ApproveUser[Account Approved]
    ApproveUser -->|2. Login Attempt| LoginForm["POST /api/auth/login"]

    LoginForm -->|Validate Credentials| AuthFilter{Spring Security}
    AuthFilter -->|Credentials Valid| JwtGen[Generate JWT Token]
    AuthFilter -->|Invalid or Unapproved| Deny["401 / 403 Error"]

    JwtGen -->|3. Return Token| ClientApp[React Frontend Storage]
    ClientApp -->|4. Request Protected Route| JwtCheck[JwtAuthFilter Validation]
    JwtCheck -->|Bearer Token Valid| RoleCheck{Extract User Roles}

    RoleCheck -->|ROLE_ADMIN| AdminPortal[Admin Portal /dashboard]
    RoleCheck -->|ROLE_EMPLOYEE| EmpPortal[Employee Portal /]

    ClientApp -->|5. Click Logout| Logout[Clear Local Token & Redirect to /login]
```
</details>

---

### 3.4 Employee Management Flowchart
*Figure 3.4: Administrative Employee CRUD Lifecycle, Search, Server Pagination, & Approval Sub-Flow.*

<details>
<summary>Click to view Mermaid Source Code</summary>

```mermaid
graph TD
    Admin([System Admin]) -->|Access /employees| EmpPage[Employee Management Page]

    EmpPage -->|Search, Filter, & Sort| ServerReq["GET /api/employees"]
    ServerReq -->|Pageable & Sort Query| DB[(MySQL Database)]
    DB -->|Paginated Employee List| EmpPage

    EmpPage -->|1. Create Employee| AddEmp["POST /api/admin/employees"]
    EmpPage -->|2. Edit Profile| EditEmp["PUT /api/admin/employees/{id}"]
    EmpPage -->|3. Delete Employee| DelEmp["DELETE /api/admin/employees/{id}"]
    EmpPage -->|4. Approve Registration| ApprEmp["PATCH /api/admin/employees/{id}/approve"]

    AddEmp --> DB
    EditEmp --> DB
    DelEmp --> DB
    ApprEmp --> DB

    ApprEmp -.->|Trigger Async Event| Mail[EmailService: Account Approved Alert]
```
</details>

---

### 3.5 Project Management Flowchart
*Figure 3.5: Project Lifecycle, Many-to-Many Employee Assignment, & Task Progress Calculation Flow.*

<details>
<summary>Click to view Mermaid Source Code</summary>

```mermaid
graph TD
    Admin([System Admin]) -->|Access /projects| ProjPage[Project Management Page]

    ProjPage -->|1. Create Project| NewProj["POST /api/projects"]
    ProjPage -->|2. Update Project| UpdateProj["PUT /api/projects/{id}"]
    ProjPage -->|3. Delete Project| DeleteProj["DELETE /api/projects/{id}"]

    NewProj -->|Assign Employees M:N| MapEmployees[project_employees Join Table]
    NewProj -->|Set Metadata| SetDetails["Status, Priority, Start & End Dates"]

    SetDetails --> DB[(MySQL Database)]
    MapEmployees --> DB

    DB -->|Fetch Linked Tasks| CalcProgress["Calculate Completed / Total Tasks"]
    CalcProgress -->|Compute Percentage| ProgressVal["Progress % (e.g. 75%)"]
    ProgressVal -->|Render Card Progress Bar| UI[Project UI Cards]
```
</details>

---

### 3.6 Task Management & Progress Feedback Flowchart
*Figure 3.6: Task Creation, Employee Assignment, Status Transitions, & Feedback Loop into Project Progress.*

<details>
<summary>Click to view Mermaid Source Code</summary>

```mermaid
graph TD
    Admin([System Admin]) -->|Create Task| TaskForm["POST /api/tasks"]
    TaskForm -->|Link to Project & Employee| TaskDB[(MySQL Database)]

    TaskDB -.->|Trigger Async Event| NotifyEmp[EmailService: New Task Assigned]

    Emp([Assigned Employee]) -->|Access /tasks| MyTasks[My Tasks Workspace]
    MyTasks -->|Update Status & Remarks| StatusChange["PATCH /api/tasks/{id}/status"]

    StatusChange --> StateMachine{Task Status Transition}
    StateMachine -->|PENDING| InProgress[IN_PROGRESS]
    StateMachine -->|IN_PROGRESS| Completed[COMPLETED]

    Completed -->|Persist Status & Remarks| DBUpdate[Save Task State]
    DBUpdate -.->|Notify Admin| AdminMail[EmailService: Task Completed Alert]

    DBUpdate -->|Trigger Recalculation| ProjRecalc[Project Progress Recalculation]
    ProjRecalc -->|Completed / Total Ratio| ProjBar[Updated Project Progress %]
```
</details>

---

### 3.7 End-to-End API Request Lifecycle & Error Handling Flowchart
*Figure 3.7: Generic REST API Request Execution Lifecycle, Exception Interception, & Async Email Dispatch.*

<details>
<summary>Click to view Mermaid Source Code</summary>

```mermaid
graph TD
    Client([React Frontend Client]) -->|HTTP Request with Bearer Token| JwtFilter[JwtAuthFilter Interceptor]

    JwtFilter -->|Token Valid| SecContext[Set Authentication in SecurityContext]
    JwtFilter -->|Token Missing or Invalid| AuthError["401 Unauthorized Error"]

    SecContext --> Controller[Spring Boot REST Controller]
    Controller --> Validation{Input Validation & Regex Check}

    Validation -->|Pass| Service[Service Layer Business Logic]
    Validation -->|Fail| ExHandler

    Service --> Repo[Spring Data JPA Repository]
    Repo --> DB[(MySQL Database)]

    Service -.->|Async Event @EnableAsync| EmailService[EmailService: HTML Email Dispatch]

    Service -->|Exception Thrown| ExHandler["GlobalExceptionHandler (@ControllerAdvice)"]
    ExHandler -->|Format Standard Error| ErrJson["JSON Error Response (status, message, timestamp)"]

    DB -->|Return Entity / Data| Service
    Service -->|Return DTO| Controller
    Controller -->|200 OK Response| Client
```
</details>

---

## 4. Features Checklist

### Authentication & Authorization
- [x] **User Registration**: New employees can register with personal, department, and credential details.
- [x] **Login & Logout**: JWT-based login with persistent token handling and clean session logout.
- [x] **JWT Authentication**: Stateless authentication header (`Bearer <token>`) validated via custom filter.
- [x] **Role-Based Access Control (RBAC)**: Fine-grained permissions for `ROLE_ADMIN` and `ROLE_EMPLOYEE`.
- [x] **Admin Account Approval**: Newly registered users require explicit Admin approval before gaining full access.

### Client-Side Form Validation & Regex Patterns
- [x] **Pattern-Based Regex Validation**: Input fields across Registration, Login, Employee Creation/Edit, Project Creation/Edit, Task Assignment, and Profile Edit forms strictly enforce regular expressions (`USERNAME`, `EMAIL`, `NAME`, `PHONE`, `PASSWORD`, `SALARY`, `TITLE`, `DATE`).
- [x] **Real-Time User Feedback**: Instant, clear notification toasts and inline errors for pattern mismatches.

### User Profile Management
- [x] **Personal Profile Dashboard**: View account details, department, designation, and hire date.
- [x] **Profile Editing**: Edit personal details (First Name, Last Name, Phone, Department) and update password directly from the user profile modal with regex pattern checks.
- [x] **Personal Work Stats**: Real-time snapshot of assigned tasks, completed tasks, completion percentage, and active projects.

### Employee Management
- [x] **Add / Update / Delete / View Employees**: Full CRUD operations managed by Admin.
- [x] **Employee Search**: Full-text search across employee names, email addresses, and designations.
- [x] **Pagination & Sorting**: Server-side pagination and field sorting (`firstName`, `lastName`, `department`, `salary`, `hireDate`).

### Project Management
- [x] **Create / Update / Delete Projects**: Comprehensive project lifecycle management.
- [x] **Employee Assignment**: Many-to-Many assignment connecting multiple employees to projects.
- [x] **Dynamic Task Completion Progress Bar**: Interactive linear progress bar on project cards calculated in real-time based on completed tasks.
- [x] **Status, Priority & Deadlines**: Manage project status (`NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`, `SUSPENDED`) and priority (`LOW`, `MEDIUM`, `HIGH`).
- [x] **Project Export**: Export project summaries and progress breakdowns in CSV or PDF.

### Task Management
- [x] **Create & Assign Tasks**: Assign specific tasks to employees under active projects.
- [x] **Task Status & Progress Tracking**: Statuses include `PENDING`, `IN_PROGRESS`, `COMPLETED`.
- [x] **Task Status Updates**: Employees can update task statuses (`PATCH /api/tasks/{id}/status`).
- [x] **Remarks & Notes**: Add optional notes/remarks to tasks.
- [x] **Task Export**: Export task lists with project associations in CSV or PDF.

### Dashboards & Analytics
- [x] **Admin Dashboard**: Live KPI cards, task breakdown pie charts, project status bar charts, team workload charts, 7-day deadline trends, and a manual Test Email alert modal.
- [x] **Employee Dashboard**: Workload statistics, personal assigned task list, status toggles, upcoming deadline countdowns, and direct **CSV / PDF download options** for employee task data.

### Search & Filtering
- [x] **Search**: Instant search filtering across employees, projects, and task titles.
- [x] **Filter by Department**: Filter employee listings by department name.
- [x] **Filter by Status & Priority**: Filter projects and tasks by status or priority levels.

### Reports & Data Export (CSV / PDF Options)
- [x] **Employee Project & Task Downloads**: Employees can export their assigned tasks and project details from their Dashboard and Tasks views.
- [x] **Dual Format Download Options**: One-click dropdown supporting both **CSV** and **PDF** downloads across Dashboards, Projects, Tasks, and Reports.
- [x] **Employee-wise Task Report**: Detailed task distribution table per employee.
- [x] **Project Progress Report**: Progress percentage and task breakdown per project.
- [x] **Pending Task Report**: Summary of open and overdue tasks across teams.

### Advanced Capabilities & Documentation
- [x] **Swagger / OpenAPI Documentation**: Live interactive REST docs at `/swagger-ui.html`.
- [x] **Postman Collections**: Ready-to-use API collection with automatic JWT token capture scripts.
- [x] **Database Scripts**: Included production DDL schema and DML seed scripts.
- [x] **Mermaid System Flowchart**: Built-in clean, minimalistic architecture flow diagram.
- [x] **Docker & Docker Compose**: Full multi-container orchestration (`docker-compose.yml`).
- [x] **Email Notifications**: Asynchronous HTML email notifications for task assignment, status updates, and account approval.
- [x] **Audit Logs**: Administrative CSV audit log export (`/api/admin/audit-logs`).

---

## 5. Database Scripts & Schema

The system includes pre-configured SQL scripts for creating the database schema and inserting initial seed data.

- **File Location**: [database/schema_and_data.sql](database/schema_and_data.sql)

### 5.1 Initial Seed Data DML
```sql
INSERT INTO `users` (`id`, `username`, `email`, `password`, `first_name`, `last_name`, `department`, `designation`, `salary`, `phone`, `hire_date`, `approved`) VALUES
(1, 'admin', 'admin@evernorth.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVym54n0ySg6Y.6.1J0O.YKG', 'System', 'Admin', 'Executive', 'System Admin', 1800000.0, '+1000000000', '2024-01-01', b'1'),
(2, 'john_doe', 'john.doe@evernorth.com', '$2a$10$e8w.p4eDkXg8j/2r9f3LceY8rS8zJ5O0e/5qX9y7Z.1K4.YKG', 'John', 'Doe', 'Engineering', 'Senior Developer', 950000.0, '+1000000001', '2024-02-15', b'1'),
(3, 'priya_r', 'priya.r@evernorth.com', '$2a$10$e8w.p4eDkXg8j/2r9f3LceY8rS8zJ5O0e/5qX9y7Z.1K4.YKG', 'Priya', 'R', 'Engineering', 'QA Engineer', 820000.0, '+1000000002', '2024-03-01', b'1');

INSERT INTO `user_roles` (`user_id`, `role`) VALUES
(1, 'ADMIN'), (1, 'EMPLOYEE'),
(2, 'EMPLOYEE'),
(3, 'EMPLOYEE');

INSERT INTO `projects` (`id`, `name`, `description`, `status`, `priority`, `start_date`, `end_date`) VALUES
(1, 'Smart Portal Revamp', 'Comprehensive redesign and feature expansion of corporate employee portal.', 'IN_PROGRESS', 'HIGH', '2024-06-01', '2024-12-31');

INSERT INTO `project_employees` (`project_id`, `employee_id`) VALUES
(1, 2), (1, 3);

INSERT INTO `tasks` (`id`, `title`, `description`, `status`, `priority`, `deadline`, `remarks`, `assigned_employee_id`, `project_id`) VALUES
(1, 'Implement portal features', 'Build core REST APIs and React UI components.', 'IN_PROGRESS', 'HIGH', '2024-08-15', 'Backend APIs completed, UI in progress', 2, 1),
(2, 'Test portal features', 'Execute end-to-end unit and integration test suite.', 'PENDING', 'MEDIUM', '2024-08-30', 'Awaiting feature completion', 3, 1);

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `is_read`, `type`, `created_at`) VALUES
(1, 1, 'Welcome Admin', 'Welcome to Smart Employee Management System!', b'0', 'SYSTEM', NOW()),
(2, 1, 'System Alert', 'New employee registration requests are pending review.', b'0', 'SYSTEM', NOW()),
(3, 2, 'Welcome John', 'Welcome to the platform. Check out your assigned tasks.', b'0', 'SYSTEM', NOW()),
(4, 2, 'Task Assigned', 'You have been assigned to task: Implement portal features', b'0', 'TASK', NOW()),
(5, 3, 'Welcome Priya', 'Welcome to the team! You have 1 new task assigned.', b'0', 'SYSTEM', NOW());
```

---

## 6. Postman Collections

A comprehensive Postman Collection is included for importing and testing all REST API endpoints.

- **Collection File**: [postman/Smart_Employee_Management_System.postman_collection.json](postman/Smart_Employee_Management_System.postman_collection.json)

### 6.1 Quick Import & Execution Guide
1. Open **Postman** $\rightarrow$ Click **Import**.
2. Drag and drop `Smart_Employee_Management_System.postman_collection.json`.
3. Expand **Authentication** folder $\rightarrow$ Run **1. Admin Login**.
4. The test script in the collection automatically extracts the `token` from response JSON and sets the `{{jwtToken}}` collection variable.
5. All subsequent requests in **Employee Management**, **Projects**, **Tasks**, **Notifications**, and **Audit Logs** will automatically attach `Authorization: Bearer {{jwtToken}}`.

---

## 7. Project Structure

```
Smart-Employee-Project-Management-System/
├── backend/
│   ├── src/main/java/com/evernorth/smartemp/
│   │   ├── config/
│   │   │   ├── DataInitializer.java
│   │   │   └── SecurityConfig.java
│   │   ├── controller/
│   │   │   ├── AdminEmployeeController.java
│   │   │   ├── AuditLogController.java
│   │   │   ├── AuthController.java
│   │   │   ├── EmployeeController.java
│   │   │   ├── NotificationController.java
│   │   │   ├── ProjectController.java
│   │   │   ├── TaskController.java
│   │   │   └── TestEmailController.java
│   │   ├── dto/
│   │   │   ├── AuthDtos.java
│   │   │   ├── EmployeeDto.java
│   │   │   ├── NotificationDto.java
│   │   │   ├── ProjectDto.java
│   │   │   └── TaskDto.java
│   │   ├── entity/
│   │   │   ├── AuditLog.java
│   │   │   ├── Notification.java
│   │   │   ├── Project.java
│   │   │   ├── Task.java
│   │   │   └── User.java
│   │   ├── enums/
│   │   │   ├── Priority.java
│   │   │   ├── ProjectStatus.java
│   │   │   ├── Role.java
│   │   │   └── TaskStatus.java
│   │   ├── exception/
│   │   │   ├── BadRequestException.java
│   │   │   ├── GlobalExceptionHandler.java
│   │   │   └── ResourceNotFoundException.java
│   │   ├── repository/
│   │   │   ├── AuditLogRepository.java
│   │   │   ├── NotificationRepository.java
│   │   │   ├── ProjectRepository.java
│   │   │   ├── TaskRepository.java
│   │   │   └── UserRepository.java
│   │   ├── security/
│   │   │   ├── CustomUserDetailsService.java
│   │   │   ├── JwtAuthFilter.java
│   │   │   └── JwtUtil.java
│   │   ├── service/
│   │   │   ├── AuthService.java
│   │   │   ├── EmailService.java
│   │   │   ├── EmployeeService.java
│   │   │   ├── NotificationService.java
│   │   │   ├── ProjectService.java
│   │   │   └── TaskService.java
│   │   └── SmartEmpMgmtApplication.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── logback-spring.xml
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── theme.js
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── database/
│   └── schema_and_data.sql
├── docs/
│   └── screenshots/
├── postman/
│   └── Smart_Employee_Management_System.postman_collection.json
├── docker-compose.yml
└── README.md
```

---

## 8. Prerequisites & Setup Instructions

### Option A: Docker Compose (Quickest Method)

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Badhrinadhgvs/Smart-Employee-Project-Management-System-Using-Spring-and-React.git
   cd Smart-Employee-Project-Management-System-Using-Spring-and-React
   ```

2. **Launch Containers**:
   ```bash
   docker-compose up --build
   ```

3. **Access Services**:
   - **Frontend Portal**: `http://localhost:5173`
   - **Backend REST API**: `http://localhost:8080`
   - **Swagger Documentation**: `http://localhost:8080/swagger-ui.html`

---

### Option B: Local Manual Setup

#### Step 1: Database Setup
Ensure MySQL 8.0/8.4 is running locally. You can execute [database/schema_and_data.sql](database/schema_and_data.sql) or let Spring Boot Hibernate auto-create tables:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/Employee_Management?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:root}
spring.jpa.hibernate.ddl-auto=update
```

#### Step 2: Configure Email Notifications (`application.properties`)
```properties
spring.mail.host=${SPRING_MAIL_HOST:smtp.gmail.com}
spring.mail.port=${SPRING_MAIL_PORT:587}
spring.mail.username=${SPRING_MAIL_USERNAME:your_email@gmail.com}
spring.mail.password=${SPRING_MAIL_PASSWORD:your_app_password}

spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.connectiontimeout=5000
spring.mail.properties.mail.smtp.timeout=5000
spring.mail.properties.mail.smtp.writetimeout=5000

app.mail.enabled=${APP_MAIL_ENABLED:true}
app.mail.from=${APP_MAIL_FROM:your_email@gmail.com}
```

#### Step 3: Start Spring Boot Backend
```bash
cd backend
mvn clean install
.\mvnw.cmd spring-boot:run
```

#### Step 4: Start React Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 9. Demo / Sandbox Credentials

Default users automatically created on startup via `DataInitializer`:

| Role | Username | Password | Email | Description |
| :--- | :--- | :--- | :--- | :--- |
| **System Admin** | `admin` | `admin123` | `admin@evernorth.com` | Full Administrative Access (Dashboard, User Approvals, Projects, Tasks, PDF Reports, Audit Logs) |
| **Senior Developer** | `john_doe` | `john123` | `john.doe@evernorth.com` | Employee Access (Dashboard, My Tasks, Task Status Update) |
| **QA Engineer** | `priya_r` | `priya123` | `priya.r@evernorth.com` | Employee Access (Dashboard, My Tasks, Task Status Update) |

---

## 10. Interactive API Documentation (Swagger UI)

Interactive Swagger UI documentation is available when running the backend:
- **Swagger Interface**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON Spec**: `http://localhost:8080/v3/api-docs`

---

## 11. Submission & Author Info

- **Project Repository**: [GitHub Repository](https://github.com/Badhrinadhgvs/Smart-Employee-Project-Management-System-Using-Spring-and-React)
- **Submission Context**: Developed for **EverNorth Technical Assessment (Round 2)**.
- **Author**: **Gundlapalli Venkata Sai Badhrinadh**
- **Date**: July 2026
- **License**: MIT License

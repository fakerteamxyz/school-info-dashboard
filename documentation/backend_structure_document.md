# Backend Structure Document for school-info-dashboard

## 1. Backend Architecture

### Overview
This backend is built on Next.js API Routes, keeping frontend and backend code in one place. We use containerization to ensure a consistent environment across development, testing, and production.

### Key Patterns and Frameworks
- **Next.js App Router & API Routes:** File-based routing for pages and APIs, server components for fast initial loads, and client components for interactivity.
- **Docker Containers:** Each environment (dev, test, prod) runs in a Docker container, so "it works on my machine" issues disappear.
- **Modular Directory Structure:** Business logic (chat, school data) lives alongside API definitions, keeping related code easy to find.

### Scalability, Maintainability, Performance
- **Scalability:** Containers can spin up multiple instances behind a load balancer to handle more traffic. Database is separated and can scale independently.
- **Maintainability:** Clear separation of concerns—routing, business logic, and data access. Adding new routes or services is straightforward.
- **Performance:** Server components render static bits on the server. We also introduce caching (see Infrastructure) to reduce database load.

## 2. Database Management

### Technology Stack
- **Type:** Relational (SQL)
- **System:** PostgreSQL
- **ORM:** Prisma (for type-safe database access)

### Data Handling Practices
- **Migrations:** Prisma Migrate manages schema changes over time.
- **Connection Pooling:** Pooled database connections to reduce overhead.
- **Environment Variables:** Database credentials and URLs stored securely in `.env` files or secret managers.
- **Backups:** Automated nightly backups of the production database.

## 3. Database Schema

Below is a human-readable summary of our main tables, followed by SQL definitions.

### Tables and Relationships
- **User**: Holds login and profile details.
- **School**: Master list of schools with names, addresses, and logos.
- **Event**: School events tied to a specific school.
- **Announcement**: News items for a school.
- **ChatMessage**: Messages exchanged in the chat, linked to a user and a school.

### SQL Schema (PostgreSQL)
```sql
-- User accounts
drop table if exists "User";
create table "User" (
  id          serial primary key,
  email       varchar(255) unique not null,
  name        varchar(100) not null,
  role        varchar(50) default 'student',
  created_at  timestamp default now()
);

-- School details
drop table if exists "School";
create table "School" (
  id          serial primary key,
  name        varchar(200) not null,
  address     text,
  logo_url    varchar(500),
  created_at  timestamp default now()
);

-- Events for a school
drop table if exists "Event";
create table "Event" (
  id          serial primary key,
  school_id   int references "School"(id) on delete cascade,
  title       varchar(200) not null,
  date        date not null,
  description text,
  created_at  timestamp default now()
);

-- Announcements for a school
drop table if exists "Announcement";
create table "Announcement" (
  id          serial primary key,
  school_id   int references "School"(id) on delete cascade,
  message     text not null,
  published_at timestamp default now()
);

-- Chat messages
 drop table if exists "ChatMessage";
 create table "ChatMessage" (
   id          serial primary key,
   user_id     int references "User"(id) on delete set null,
   school_id   int references "School"(id) on delete cascade,
   content     text not null,
   sent_at     timestamp default now()
 );
```  

## 4. API Design and Endpoints

### RESTful Approach
We use REST endpoints under `/src/app/api` to keep things simple. Each file maps directly to a URL and HTTP method.

### Key Endpoints
- **GET /api/schools**  
  Lists all schools.
- **GET /api/schools/{id}**  
  Retrieves details (events, announcements) for one school.
- **GET /api/events?schoolId=X**  
  Fetches upcoming events for a given school.
- **GET /api/announcements?schoolId=X**  
  Fetches announcements for a given school.
- **POST /api/chat**  
  Sends a new chat message; expects `{ userId, schoolId, content }` in the body.
- **GET /api/chat?schoolId=X**  
  Retrieves chat history for a school.

Each route:
- Validates input
- Calls a service layer (e.g., `chatService.sendMessage`)
- Returns JSON with appropriate status codes

## 5. Hosting Solutions

### Next.js on Vercel
- **Automatic Deploys:** Push to `main` branch → Vercel builds and deploys.
- **Global CDN:** Pages and static assets are served from edge nodes close to users.
- **Serverless Functions:** API routes run in isolated serverless environments.

### PostgreSQL on AWS RDS
- **Managed Service:** Automated backups, patching, and scaling.
- **Multi-AZ Deployment:** High availability in production.
- **Monitoring & Alerts:** Built-in CloudWatch metrics.

## 6. Infrastructure Components

- **Load Balancer (Vercel Edge):** Distributes traffic among serverless function instances.
- **CDN (Vercel Edge Network):** Caches static assets (CSS, JS, images) globally.
- **Caching (Redis via AWS ElastiCache):** Optional layer for chat history or session data.
- **Docker Compose (Local Dev):** Brings up the Next.js app, PostgreSQL, and Redis locally.

These pieces work together to ensure fast responses, handle traffic spikes, and keep data close to users.

## 7. Security Measures

- **HTTPS Everywhere:** All API calls and pages use HTTPS.
- **Authentication & Authorization:** JWT tokens issued on login and checked on protected routes.
- **Input Validation & Sanitization:** Prevents SQL injection and XSS attacks.
- **Environment Secrets:** DB credentials and JWT secret stored in environment variables or secret manager.
- **Data Encryption:** TLS for in-transit data. RDS encrypts data at rest.
- **Rate Limiting:** Basic throttling on chat endpoints to prevent abuse.

## 8. Monitoring and Maintenance

- **Logging:** Application logs sent to Vercel’s logs and to a central logging service (e.g., Datadog).
- **Error Tracking:** Sentry captures exceptions in API routes.
- **Metrics & Alerts:** CloudWatch dashboards for DB CPU, memory. Alerts for high latency or error rates.
- **CI/CD Pipeline:** GitHub Actions runs tests, linting, and schema migrations before merging.
- **Dependency Updates:** Dependabot checks for vulnerable packages weekly.

## 9. Conclusion and Overall Backend Summary

This backend uses Next.js API Routes, PostgreSQL, and Docker to deliver a fast, scalable, and maintainable service for the school-info-dashboard. With a clear folder structure, managed hosting on Vercel and AWS RDS, plus essential security and monitoring in place, the system meets current needs and can grow to support real-time chat, more data streams, and higher traffic with minimal changes. The modular design and industry-standard tools differentiate this project, ensuring future developers can quickly understand and extend the backend.
# Backend Structure Document for school-info-dashboard

This document outlines the backend setup for the school-info-dashboard project. It covers the architecture, database, APIs, hosting, infrastructure, security, monitoring, and maintenance—all explained in everyday language.

## 1. Backend Architecture

**Overall Design**  
- We use Next.js API Routes as our backend framework. This means our server-side logic lives right alongside our frontend code.  
- Clerk handles user authentication and sessions.  
- Supabase provides our PostgreSQL database and real-time features.  
- Docker (.devcontainer) ensures everyone on the team runs the same environment.

**Design Patterns & Frameworks**  
- **API Routes (Next.js):** Organize each resource (announcements, classes, students, teachers, chat) into its own folder under `/src/app/api`.  
- **Service Layer:** All database calls go through `src/lib/db.ts`.  
- **Validation:** Input is checked with Zod schemas before reaching the database.

**Scalability, Maintainability, Performance**  
- **Scalability:**  
  - Next.js API Routes scale horizontally—more instances can spin up under load.  
  - Supabase handles database scaling automatically.  
- **Maintainability:**  
  - Clear separation: Routes handle requests, `db.ts` handles data, Zod handles validation.  
  - Reusable components and well-organized folders make it easy to find and change code.  
- **Performance:**  
  - Server Components for data fetching reduce bundle size.  
  - Real-time subscriptions via Supabase keep dashboards up to date without extra fetches.

## 2. Database Management

**Database Technology**  
- Type: SQL  
- System: PostgreSQL hosted by Supabase

**Data Structure & Practices**  
- Data is organized into tables for each entity: announcements, classes, students, teachers, and user roles.  
- Migrations stored in the `supabase/` folder ensure schema changes are tracked and repeatable.  
- Row Level Security (RLS) policies enforce who can read or write each row, based on user roles.  
- Real-time subscriptions allow the frontend to listen for updates.

## 3. Database Schema

**Human-Readable Overview**  
- **announcements**: id, title, content, published_at, created_by  
- **classes**: id, name, schedule, teacher_id  
- **students**: id, first_name, last_name, email, class_id, enrolled_at  
- **teachers**: id, first_name, last_name, email, hire_date  
- **users**: id, email, role (admin, teacher, student)  

**SQL Schema (PostgreSQL)**
```sql
-- Announcements table
eCREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Classes table
eCREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  schedule TEXT NOT NULL,
  teacher_id UUID REFERENCES teachers(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table
eCREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  class_id UUID REFERENCES classes(id),
  enrolled_at DATE NOT NULL
);

-- Teachers table
eCREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  hire_date DATE NOT NULL
);

-- Users table (for authentication and roles)
eCREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin', 'teacher', 'student'))
);
```

## 4. API Design and Endpoints

**Approach**  
- We use RESTful principles in Next.js API Routes.  
- Each resource folder (`announcements`, `classes`, `students`, `teachers`, `chat`) contains a `route.ts` that handles GET, POST, PUT, DELETE as needed.

**Key Endpoints**  
- **GET /api/announcements**: List all announcements.  
- **POST /api/announcements**: Create a new announcement.  
- **PUT /api/announcements/:id**: Update an existing announcement.  
- **DELETE /api/announcements/:id**: Remove an announcement.  
- Similar CRUD routes exist under `/api/classes`, `/api/students`, `/api/teachers`.
- **POST /api/chat**: Send a message to the AI chat service and get a response.

**Frontend-Backend Communication**  
- Client components make fetch calls to these endpoints.  
- Server components can call Supabase directly inside the same route.  
- Zod schemas in `/src/lib/validations` ensure only valid data is accepted.

## 5. Hosting Solutions

**Backend Hosting**  
- **Next.js App:** Deployed on Vercel for auto-scaling, zero-configuration deployments, and built-in CDN.  
- **Database:** Supabase’s managed PostgreSQL instance with automated backups and scaling.

**Benefits**  
- **Reliability:** Vercel and Supabase guarantee high uptime.  
- **Scalability:** Both services auto-scale with traffic.  
- **Cost-effective:** Pay for what you use; free tiers for small loads.

## 6. Infrastructure Components

- **Load Balancer:** Managed by Vercel to distribute traffic across instances.  
- **CDN:** Vercel’s global CDN caches static assets and API responses at edge locations.  
- **Caching:** HTTP caching headers on GET routes improve performance for repeat requests.  
- **Dev Container:** Docker-based development setup ensures everyone runs the same environment.

## 7. Security Measures

- **Authentication:** Clerk handles sign-in, sign-up, and session management.  
- **Authorization:** Middleware (`src/middleware.ts`) checks Clerk sessions before allowing access to protected routes.  
- **Database Security:**  
  - Row Level Security (RLS) in Supabase restricts data by user role.  
  - All connections use SSL/TLS.  
- **Data Encryption:** Environment variables for keys; HTTPS in transit; encryption at rest via Supabase.
- **Input Validation:** Zod schemas reject invalid or malicious data at the API boundary.
- **Environment Variables:** Stored securely, never checked into git. Use a `.env.example` to document required values.

## 8. Monitoring and Maintenance

- **Logging & Alerts:**  
  - Supabase provides query logs and error logs.  
  - Vercel’s dashboard shows deployment and runtime metrics.  
- **Performance Monitoring:**  
  - Vercel Analytics for response times and bandwidth.  
  - Browser-based monitoring tools (e.g., Web Vitals) can be added later.  
- **Health Checks:** Automated pings to critical endpoints to ensure uptime.  
- **Maintenance Strategy:**  
  - Regular dependency updates via Dependabot.  
  - Scheduled reviews of database migrations and security policies.  
  - Backups handled by Supabase—regular restore tests.

## 9. Conclusion and Overall Backend Summary

The backend for school-info-dashboard is built with modern, scalable tools that require minimal configuration and deliver high performance:

- Next.js API Routes for a unified codebase  
- Supabase for database and real-time features  
- Clerk for secure authentication  
- Vercel for hassle-free hosting and CDN

This setup ensures administrators can reliably manage announcements, classes, students, and teachers. Real-time updates, strong security measures, and a clear development environment make it easy for teams to grow and maintain the project over time. Unique to this project is the potential AI chat integration, paving the way for intelligent assistant features in the future.
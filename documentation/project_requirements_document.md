# Project Requirements Document (PRD)

## 1. Project Overview

School-Info-Dashboard is a web-based application that offers school administrators a single, intuitive platform to manage all core school data—announcements, classes, students, and teachers—in one place. Instead of juggling spreadsheets, e-mails, and separate systems, admins can log in to a unified dashboard, perform create-read-update-delete (CRUD) actions, and instantly see key metrics about enrollment, class counts, and announcements at a glance.

This project is being built to eliminate data silos and streamline administrative workflows. Key objectives include:

•  Providing secure, role-based access so only authorized staff can view or modify data.
•  Ensuring data integrity through input validation and database policies.
•  Delivering a responsive, accessible UI so admins can work on desktop and tablet.
•  Establishing a clear foundation for future extensions, like AI-powered chat support or advanced analytics.

_Success is measured by:_ 99% uptime, API response times under 200 ms, completed CRUD flows with zero data corruption incidents, and positive feedback from administrators on usability.

## 2. In-Scope vs. Out-of-Scope

**In-Scope (Version 1.0):**

•  User authentication & authorization using Clerk
•  Admin dashboard overview with aggregated school metrics
•  CRUD interfaces (UI & API) for:
   - Announcements
   - Classes
   - Students
   - Teachers
•  Input validation with Zod schemas
•  Persistent storage in Supabase (PostgreSQL)
•  Next.js API routes handling business logic
•  Responsive UI built with Next.js (App Router), TypeScript, Tailwind CSS, and shadcn/ui components
•  Middleware enforcing protected routes
•  Docker/devcontainer setup for consistent development environments

**Out-of-Scope (Planned for Later Phases):**

•  AI-powered chat assistant (the `/api/chat` endpoint exists but is a placeholder)
•  Role-based access control beyond a single ‘admin’ role (no teacher/student login flows)
•  Mobile-specific app (native or PWA beyond basic responsiveness)
•  Advanced reporting or analytics dashboards
•  Multi-language support (i18n)
•  Comprehensive automated test suite (unit, integration, E2E)
•  Third-party integrations (payment gateways, calendar sync)

## 3. User Flow

When an administrator arrives at the application, they first see a sign-in page powered by Clerk. After entering credentials, they land on the Dashboard Overview, which displays key metrics: total students, total teachers, upcoming classes, and the latest announcements. A sidebar on the left lists navigation links for Announcements, Classes, Students, and Teachers.

Clicking “Announcements” shows a searchable, paginated table of existing announcements with “Create,” “Edit,” and “Delete” controls. If they choose “Create,” a form appears in a modal or on a new page, where they fill in a title, content, and publish date. Upon submission, they return to the updated table. Similar flows exist under “Classes,” “Students,” and “Teachers.” At any time, the admin can click the logo or “Dashboard” in the sidebar to return to the main overview. A global “Sign Out” button in the top bar ends the session and redirects back to the sign-in page.

## 4. Core Features

- **Authentication & Authorization**: Clerk handles login/signup and session management; middleware protects API routes and pages.
- **Dashboard Overview**: Summarizes total counts and recent activity (e.g., newest announcements).
- **Announcements Management**: Full CRUD UI and API endpoints (`GET /api/announcements`, `POST`, `PUT`, `DELETE`).
- **Class Management**: CRUD operations for class entities (name, schedule, assigned teacher).
- **Student Records**: CRUD operations for student profiles (name, contact info, enrolled classes).
- **Teacher Profiles**: CRUD operations for teacher records (name, email, assigned classes).
- **API Layer**: Next.js API routes that invoke Supabase client methods for database interactions.
- **Database Schema & Migrations**: Supabase migration files define tables, columns, and Row-Level Security (RLS) policies.
- **Form Validation**: Zod schemas ensure incoming data meets type and format requirements.
- **Reusable UI Components**: Buttons, tables, cards, forms—all built with shadcn/ui and Tailwind CSS.
- **Dev Environment**: `.devcontainer` config and Docker setup for standardized local development.

## 5. Tech Stack & Tools

**Frontend:**
- Next.js (App Router) for routing and server-side rendering
- React + TypeScript for typed UI development
- Tailwind CSS + shadcn/ui for consistent, accessible components

**Backend & Database:**
- Next.js API routes for server logic
- Supabase (PostgreSQL) for data storage, real-time, and authentication
- Clerk for user management (login, sessions)
- Zod for schema validation

**Development Environment:**
- Docker & VS Code Dev Container for consistent setups
- GitHub for source control

**Potential AI Integration (Future):**
- `/api/chat` endpoint ready to plug in OpenAI GPT-4 or equivalent

## 6. Non-Functional Requirements

- Performance: 
  • Page load under 2 seconds on 4G mobile network
  • API response times under 200 ms for simple queries

- Security & Compliance:
  • All traffic over HTTPS
  • Supabase RLS policies enforce row-level permissions
  • Sensitive keys in environment variables only
  • Data privacy compliant with GDPR principles (data export/deletion workflows)

- Usability & Accessibility:
  • WCAG 2.1 AA standards for color contrast and keyboard navigation
  • Responsive design for tablet and desktop screens
  • Consistent UI patterns across sections

## 7. Constraints & Assumptions

- Must target Node.js 18+ and Next.js 14+
- Supabase and Clerk services must be provisioned and credentialed via environment variables
- No offline capability required in v1.0
- Assumes administrators have modern browsers (Chrome, Firefox, Edge)
- AI chat endpoint is stubbed; requires future API key for external AI service

## 8. Known Issues & Potential Pitfalls

- **API Rate Limits:** Supabase free tier limits may throttle heavy traffic. Mitigation: add server-side caching or upgrade plan.
- **RLS Complexity:** Misconfigured policies can block legitimate requests or expose data. Mitigation: maintain a test suite for policy verification.
- **Server vs. Client Components:** Improper use of `use client` can inflate bundle size. Mitigation: audit components and move data-only logic to server.
- **Devcontainer Drift:** Dependencies added outside the container can cause “works on my machine” bugs. Mitigation: enforce container use and update `Dockerfile` for all new packages.
- **Validation Gaps:** Adding new fields without updating Zod schemas leads to runtime errors. Mitigation: treat schema updates as part of any data model change.

---

This PRD serves as the single source of truth. All subsequent technical documents—tech stack details, frontend guidelines, backend structure, file organization—should reference and align with these requirements to avoid ambiguity and ensure consistency.
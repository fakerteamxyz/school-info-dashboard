# Project Requirements Document: school-info-dashboard

## 1. Project Overview

The school-info-dashboard is a modern web application built to present key information about a school—such as attendance rates, upcoming events, announcements, and academic performance metrics—through a clean, visually driven dashboard. It also includes an interactive chat feature that allows users (students, teachers, or staff) to ask questions, get support, and view conversation history in a single unified interface. The application is built on Next.js using the App Router paradigm for optimized server and client rendering.

This project is being built to centralize school data in one place and streamline communication within the school community. Key objectives include delivering an intuitive user interface that displays up-to-date school metrics, enabling basic real-time chat without adding external messaging services, and ensuring every developer works in an identical environment using Docker. Success will be measured by user satisfaction with the dashboard, reliability of the chat feature, and ease of onboarding new developers.

## 2. In-Scope vs. Out-of-Scope

**In-Scope (Version 1):**
- Dashboard pages showing static or placeholder data for:
  - Attendance rates
  - Upcoming events
  - School announcements
  - Basic academic performance metrics
- Interactive chat feature via a Next.js API Route (`/api/chat/route.ts`):
  - Send messages
  - Retrieve chat history
  - Simple input validation and error handling
- Static asset management using the `public/` directory (images, icons)
- Containerized development environment using Docker and VS Code Dev Containers
- Next.js App Router setup with server and client components

**Out-of-Scope (Planned for Future Phases):**
- User authentication and role-based access control
- Persistent database for storing school data or chat logs
- Real-time WebSocket or push notification integration
- Mobile-native application or responsive PWA optimization beyond basic layout
- Advanced analytics (graphs, charts, trend forecasting)
- Third-party integrations (calendar sync, payment gateways)

## 3. User Flow

A new user arrives at the application URL and lands directly on the dashboard page (no login required in v1). At the top they see the school name and logo, and below a grid of cards for Attendance, Events, Announcements, and Performance Metrics fed by placeholder data or a static JSON file. A left sidebar provides navigation links: “Dashboard,” “Chat,” and “Help.” The user can scroll or click each card to view more details or summaries in a modal or expanded section.

From the sidebar, the user clicks “Chat” to open a chat panel. They type a question into an input box at the bottom and hit “Send.” The frontend calls the Next.js API Route (`/api/chat/route.ts`), which processes the message and returns a simulated or static response. The chat history scrolls upward as new messages appear. If an error occurs (e.g., network issue), the app displays a friendly error message and a “Retry” button.

## 4. Core Features

- **Dashboard Display:** Panel of data cards for Attendance, Events, Announcements, Metrics
- **Next.js App Router:** File-based routing under `src/app/` using server and client components
- **Chat API Route:** `/src/app/api/chat/route.ts` handles POST (send message) and GET (fetch history)
- **Static Asset Serving:** All images/icons in `public/`, accessible by path
- **Containerized Dev Environment:** Dockerfile + `devcontainer.json` for VS Code Dev Containers
- **Error Handling:** Return proper HTTP status codes; show user-friendly messages on frontend
- **Input Validation:** Basic checks on chat input for length and forbidden characters

## 5. Tech Stack & Tools

- **Frontend/Backend Framework:** Next.js (TypeScript) with App Router
- **Runtime:** Node.js (v16+)
- **Styling:** CSS Modules or plain CSS (existing architecture)
- **Containerization:** Docker, Dev Container (`.devcontainer/Dockerfile`, `devcontainer.json`)
- **API Layer:** Next.js API Routes
- **Potential Future Database:** PostgreSQL, MongoDB, or Supabase
- **IDE Integrations:** VS Code with Dev Container support; optional Cursor plugin
- **AI/ML (future):** GPT-4o or Claude for automated chat responses or insights

## 6. Non-Functional Requirements

- **Performance:** Initial page load under 2 seconds on a 3G connection; chat response under 500ms
- **Security:** Sanitize chat inputs to prevent XSS; enable CORS only for known origins; use HTTPS
- **Reliability:** 99.9% uptime goal; graceful handling of API failures with retries
- **Usability:** Responsive layout for desktop and tablet; accessible UI with alt text on images
- **Maintainability:** Well-structured file system; clear folder conventions; inline comments for complex logic

## 7. Constraints & Assumptions

- No user authentication layer exists; all content is publicly accessible in v1
- Chat messages are not persisted permanently—stored in memory or returned from a mock function
- Docker must be installed on developer machines for the Dev Container to work
- External data sources (e.g., school database) are not yet connected; placeholder data is used
- Target browsers: latest Chrome, Firefox, and Edge

## 8. Known Issues & Potential Pitfalls

- **Chat Scalability:** Current HTTP-based chat may lag without real-time sockets; plan WebSocket upgrade later
- **Data Persistence:** In-memory or mock data means all chat resets on server restart; database integration needed
- **Docker Overhead:** Container may be slow on certain host OS; provide a lightweight local Node.js setup fallback
- **Asset Cache Invalidation:** Updates to images in `public/` may require manual cache busting headers
- **API Rate Limits:** Next.js API Routes share server resources; heavy usage could degrade performance

---
This document provides a clear, unambiguous blueprint for the school-info-dashboard AI model to generate detailed technical specifications, code structures, and developer guidelines without requiring further clarification.
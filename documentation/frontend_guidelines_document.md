# Frontend Guideline Document for school-info-dashboard

This document outlines the frontend architecture, design principles, and technologies used in the school-info-dashboard project. It’s written in everyday language so that anyone—technical or not—can understand how the frontend is set up, how it works, and why certain choices were made.

---

## 1. Frontend Architecture

### 1.1 Overview
- **Framework**: Next.js (App Router) – lets us mix server-side rendering (SSR), static site generation (SSG), and API routes in one codebase.  
- **Language**: TypeScript – adds type safety, catches errors early, and makes code easier to maintain.  
- **UI Library**: shadcn/ui – a set of accessible, prebuilt components styled with Tailwind CSS.  
- **Styling**: Tailwind CSS – a utility-first approach for rapid, consistent styling.  
- **Authentication**: Clerk – handles sign-in, sign-up, sessions, and protects routes.  
- **Database & Realtime**: Supabase – PostgreSQL under the hood, real-time subscriptions, and row-level security (RLS).  
- **Dev Environment**: Docker and a `.devcontainer` – ensures everyone on the team has the same setup.

### 1.2 Scalability, Maintainability, Performance
- **Scalable**: File-based routing and component folders mean new pages or features slot in easily. Modular API routes let us add more endpoints without clutter.  
- **Maintainable**: TypeScript + clear folder structure (`src/app`, `src/components`, `src/lib`) keep code organized and self-documented.  
- **High Performance**:  
  • Server Components render on the server by default, resulting in smaller client bundles.  
  • Next.js does code-splitting and lazy-loading out of the box.  
  • Tailwind encourages small CSS bundles and fewer overrides.

---

## 2. Design Principles

1. **Usability**: Interfaces are simple, intuitive, and consistent across pages—forms look and behave the same, tables have predictable controls.  
2. **Accessibility**: We rely on shadcn/ui’s built-in ARIA support and semantic HTML (buttons, labels, headings) so screen readers and keyboard navigation work out of the box.  
3. **Responsiveness**: Mobile-first design with Tailwind’s responsive utilities (e.g., `sm:`, `md:`, `lg:` classes) to adjust layouts across devices.  
4. **Clarity & Consistency**: Reusable components share the same color palette, spacing, and typography. No surprises when moving between dashboards, forms, or tables.  

How it’s applied:  
• Buttons, inputs, and alerts come from a single UI library.  
• All forms validate inputs with Zod schemas before submission.  
• Navigation menus collapse into a drawer on small screens.

---

## 3. Styling and Theming

### 3.1 Styling Approach
- **Utility-First CSS** with Tailwind: write styling directly in class names (e.g., `px-4 py-2 bg-blue-500`).  
- **No BEM or SMACSS needed**—Tailwind’s conventions handle scoping.  
- **shadcn/ui** provides base components (`<Button>`, `<Card>`, `<Table>`) that can be customized via Tailwind classes.

### 3.2 Theming
- **Dark/Light Mode**: Implemented via a React Context or Next.js server component state. Tailwind’s `dark:` variants toggle colors.  
- **Consistent Look**: All pages import the same root layout (`src/app/layout.tsx`) which wraps content in theme providers.

### 3.3 Visual Style
- **Overall Style**: Modern flat design with subtle shadows and rounded corners. Clean, minimal, letting data tables and forms stand out.  
- **Glassmorphism** (optional): Light blur on modals and overlays for a polished feel.

### 3.4 Color Palette
- Primary: #3B82F6 (blue)  
- Secondary: #F59E0B (amber)  
- Success: #10B981 (green)  
- Danger: #EF4444 (red)  
- Neutral Light: #F3F4F6 (gray-100)  
- Neutral Dark: #1F2937 (gray-800)  
- Text: #111827 (gray-900)  

### 3.5 Typography
- **Font**: ‘Inter’, sans-serif – modern, highly legible, works well at small sizes.  
- **Sizes**: Base `16px`, with scale (h1 = 2.25rem, h2 = 1.875rem, body = 1rem, caption = 0.875rem).

---

## 4. Component Structure

### 4.1 Organization
- `src/components/ui`: Building-block components from shadcn/ui (Button, Card, Table, Input).  
- `src/components/admin`: Dashboard-specific components (AnnouncementForm, StudentTable, ClassSchedule).  
- Each component folder:  
  • `ComponentName.tsx` – the main file.  
  • `ComponentName.test.tsx` – unit tests.  
  • `styles.ts` or inline Tailwind classes for styling.

### 4.2 Reusability & Composition
- **Presentational vs Container**:  
  • Presentational components just display UI based on props.  
  • Container components fetch data (server component or `use client`) and pass it down.  
- **Props-Driven**: All variations (size, color, label) are passed via props, avoiding duplicate code.  
- **Atomic Design**: Buttons/Inputs (atoms) combine into forms and tables (molecules), which combine into pages (organisms).

Benefits: easier testing, easier updates, less chance of visual drift, faster onboarding for new developers.

---

## 5. State Management

### 5.1 Data Fetching & Caching
- **Server-Side Data**: Next.js Server Components fetch from API routes or directly from Supabase (`src/lib/db.ts`) before sending HTML.  
- **Client-Side Data**: Minimal local state (`useState`, `useEffect`) for form inputs, modal visibility.

### 5.2 Global State
- **Authentication State**: Managed by Clerk’s React hooks (e.g., `useUser()`).  
- **Theming**: Stored in React Context or a small store (e.g., Zustand) if more complex switching logic is needed.

### 5.3 Future Enhancements
- For richer client-side interactions, consider **React Query (TanStack Query)** or **SWR** to handle caching, revalidation, and optimistic updates.

---

## 6. Routing and Navigation

### 6.1 File-Based Routing (Next.js App Router)
- **Pages & API** live under `src/app`:  
  • `/dashboard/students/page.tsx`  
  • `/api/teachers/route.ts`  
- **Layout Segments**:  
  • `(auth)/layout.tsx` wraps sign-in/up pages.  
  • `(root)/layout.tsx` wraps main dashboard and public pages.

### 6.2 Navigation Structure
- **Sidebar Menu** for the dashboard: links to Announcements, Classes, Students, Teachers, and Overview.  
- **Breadcrumbs** inside pages to show current location (e.g., Dashboard > Students).  
- **Next.js `<Link>`** for client-side transitions—fast and prefetching-enabled.

---

## 7. Performance Optimization

1. **Server Components**: Reduce JavaScript sent to the browser by rendering static parts on the server.  
2. **Code Splitting & Lazy Loading**:  
   • Dynamic imports for heavy components (e.g., charts).  
   • Next.js automatically splits by route.  
3. **Image Optimization**: Use `next/image` for responsive and lazy-loaded images.  
4. **Asset Minification**: Tailwind CSS purges unused styles, and Next.js minifies JS/CSS.  
5. **API Caching**: Set HTTP headers or use Supabase’s caching layer for read-heavy routes like `/api/announcements`.  

These tactics keep page load times fast, improve Core Web Vitals, and give a smooth experience.

---

## 8. Testing and Quality Assurance

### 8.1 Automated Testing
- **Unit Tests** (Jest or Vitest):  
  • Small functions in `src/lib/utils.ts` and Zod schemas.  
  • Individual components (`Button`, `Input`, custom hooks).  
- **Integration Tests** (React Testing Library):  
  • Component + API interaction mocks (e.g., AnnouncementForm submits and updates UI).  
- **End-to-End Tests** (Cypress or Playwright):  
  • Core user flows: sign-in, view announcements, create a student record, delete a class.

### 8.2 Linters & Formatters
- **ESLint**: Enforce code quality rules and catch mistakes early.  
- **Prettier**: Automatic code formatting for consistency.  
- **Tailwind Linter**: (optional) Ensure utility classes follow project conventions.

### 8.3 Continuous Integration
- **GitHub Actions** (or similar): Run lint, type-check, and tests on every pull request.

### 8.4 Accessibility Audits
- Periodically run **Lighthouse** or **axe** checks and manually test with keyboard-only navigation and a screen reader.

---

## 9. Conclusion and Overall Frontend Summary

This frontend setup for school-info-dashboard balances modern best practices with clarity and performance. By leveraging Next.js, TypeScript, and Tailwind CSS alongside shadcn/ui components, we achieve:

- A **scalable** and **maintainable** codebase with clear folder structure.  
- A **responsive**, **accessible**, and **consistent** UI guided by solid design principles.  
- Strong **security** with Clerk and Supabase RLS.  
- **Performance** through server components, code splitting, and optimized assets.  
- A foundation for future growth—AI chat integration, richer client-side caching, advanced testing, and role-based access control.

With these guidelines in place, anyone joining the project or maintaining it can quickly understand how the frontend is built, why decisions were made, and how to add new features without confusion.

Happy coding!

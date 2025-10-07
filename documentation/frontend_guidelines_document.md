# Frontend Guidelines for school-info-dashboard

## 1. Frontend Architecture

### Overview
The frontend of **school-info-dashboard** is built with Next.js (using the App Router) and React. We keep both UI and backend logic in the same repo:

- **Next.js App Router**: File-based routing in `/src/app/`, with support for server components, client components, and API routes under `/src/app/api/`.
- **React**: Component-based UI library for building reusable interface pieces.
- **Docker & Dev Container**: A `.devcontainer/` directory with a Dockerfile and `devcontainer.json` ensures every developer works in the same environment, eliminating "it works on my machine" issues.
- **Static Assets**: All images, icons, and fonts live in `public/`, served directly by Next.js for caching and fast load times.

### Scalability, Maintainability & Performance

- **Scalability**: Component-based structure (atoms → molecules → organisms) makes it easy to add new UI pieces or pages without touching existing code.
- **Maintainability**: Clear separation between server logic (API routes) and client UI, plus consistent coding standards, keeps the codebase readable and testable.
- **Performance**: Next.js provides automatic code splitting, image optimization, and server-side rendering. We also use lazy loading for heavy components and take advantage of React’s streaming for server components.

---

## 2. Design Principles

### Usability
- **Intuitive Layout**: Key information (dashboard stats, chat widget) is front and center. Common actions are accessible within one or two clicks.
- **Feedback & Loading States**: Clear spinners, toasts, and inline error messages guide users during network requests or form submissions.

### Accessibility
- **WCAG 2.1 Compliance**: Use semantic HTML (`<button>`, `<nav>`, headings) and ARIA attributes where needed. Ensure color contrast meets AA standards.
- **Keyboard Navigation**: All interactive elements (links, buttons, form fields) are reachable and operable by keyboard only.
- **Screen Reader Support**: Labels and alt text for images, descriptive aria-labels for complex widgets (chat input, modal dialogues).

### Responsiveness
- **Mobile-First**: Layouts built with flexible grids and relative units, tested at breakpoints: 360px, 768px, 1024px, 1440px.
- **Touch & Pointer**: Sufficient hit areas for buttons and links on touch devices.

---

## 3. Styling and Theming

### Styling Approach
- **Tailwind CSS**: Utility-first framework for rapid UI development. Custom design tokens in `tailwind.config.js`.
- **Global Styles**: Minimal global CSS (reset, base typography) in `src/styles/globals.css`.
- **Component-Scoped Styles**: When utility classes aren’t enough, we create small CSS modules (`.module.css`) alongside components.

### CSS Methodology
- **Atomic Design**: We organize Tailwind classes by function, avoiding custom class names where possible. For custom styles, we follow BEM naming in CSS modules.

### Theming
- **Light & Dark Mode**: Configured in Tailwind with `dark:` variants. A React Context (`ThemeContext`) toggles between modes.
- **Design Style**: Modern, flat design with subtle glassmorphism on dashboard cards:
  - Semi-transparent backgrounds (rgba whites/blacks) with a light blur
  - Crisp shadows and rounded corners (8px radius)

### Color Palette
Primary and secondary colors ensure a consistent look:

- Primary Blue: `#3B82F6` (500)
- Dark Blue: `#1E3A8A` (900)
- Secondary Orange: `#FB8C00` (600)
- Accent Green: `#10B981` (500)
- Neutral Gray: `#F3F4F6` (100), `#374151` (700)
- Overlay (Glass): `rgba(255, 255, 255, 0.6)` / `backdrop-filter: blur(10px)`

### Typography
- **Font Family**: ‘Inter’, sans-serif (loaded via Google Fonts).
- **Base Sizes**: 16px base, with scale:
  - h1: 2.25rem (36px)
  - h2: 1.875rem (30px)
  - body: 1rem (16px)

---

## 4. Component Structure

### Folder Organization
```
src/
 └─ app/             # Next.js App Router entry
 └─ components/
     ├─ atoms/       # Buttons, inputs, icons
     ├─ molecules/   # Card groups, form rows
     ├─ organisms/   # Dashboard panels, chat widget
     └─ layouts/     # MainLayout, AuthLayout
```

### Reuse & Encapsulation
- **Single Responsibility**: Each component does one job, keeping props minimal.
- **Props & Events**: Data flows down via props; events bubble up through callbacks.
- **Storybook (optional)**: Document and test components in isolation for visual regression.

---

## 5. State Management

### Local & Global State
- **Local (Component) State**: React `useState` and `useReducer` for UI-specific toggles, form inputs.
- **Global State**: React Context for theme, authenticated user info.

### Data Fetching & Caching
- **SWR** (stale-while-revalidate) for HTTP requests:
  - Automatic caching & revalidation
  - Built-in retry and error handling
- **Next.js Server Components**: For data needed at page load, fetched directly on the server.

---

## 6. Routing and Navigation

### Next.js App Router
- **File-based Routing**: Pages and layouts under `src/app/`. Nested folders define nested routes.
- **Dynamic Routes**: `[id]` for details pages (e.g., `/students/[studentId]`).
- **Link Component**: Use `next/link` for client-side transitions and prefetching.

### Navigation Structure
- **Main Nav**: Sidebar or top horizontal menu with links to Dashboard, Chat, Events, Settings.
- **Breadcrumbs**: Optional, for deep pages.
- **Protected Routes**: A HOC or middleware checks user authentication before rendering sensitive pages.

---

## 7. Performance Optimization

- **Automatic Code Splitting**: Next.js loads only the code needed per page.
- **Dynamic Imports**: `next/dynamic` for heavy components (charts, rich text editor).
- **Image Optimization**: `next/image` for responsive, lazy-loaded images.
- **HTTP Caching**: Leverage SWR and ISR (`revalidate` property) for pages that can be stale under a minute.
- **Bundle Analysis**: Use `next-bundle-analyzer` to detect and trim large dependencies.
- **Critical CSS**: Inline minimal CSS for above-the-fold content.

---

## 8. Testing and Quality Assurance

### Unit & Integration Tests
- **Jest**: Testing framework for logic and utility functions.
- **React Testing Library**: For rendering components, simulating user events, and asserting UI behavior.

### End-to-End Tests
- **Cypress** or **Playwright**: Automate flows like login → view dashboard → send chat message.
- **CI Integration**: Run tests on every pull request via GitHub Actions or similar.

### Linting & Formatting
- **ESLint**: With Next.js and React plugin rules.
- **Prettier**: Automatic code formatting.
- **TypeScript**: (If in use) for catching type errors before runtime.

---

## 9. Conclusion and Overall Frontend Summary

These guidelines outline how to build and maintain a scalable, user-friendly, and high-performance frontend for the **school-info-dashboard**. By leveraging Next.js’s App Router, Tailwind CSS, and a clear component hierarchy, we ensure rapid development and easy onboarding. Our focus on accessibility, responsive design, and thorough testing aligns with the project’s goal: delivering a reliable, engaging dashboard and chat experience for the school community.

---

*End of Document*
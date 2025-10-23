# Security Guidelines for `school-info-dashboard`

## 1. Introduction
This document defines security best practices and implementation guidance tailored to the **school-info-dashboard** codebase. By following these guidelines, developers will embed robust security controls throughout the application’s architecture, minimizing risk and ensuring confidentiality, integrity, and availability of school data.

---

## 2. Security by Design & Core Principles
- **Embed security from day one:** Include threat modeling, code reviews, and security tests during each sprint.
- **Least Privilege:** Grant the minimum permissions required for each service, API route, and database role.
- **Defense in Depth:** Layer controls (e.g., Clerk authentication + Supabase RLS + server-side checks) so a single failure cannot compromise the system.
- **Fail Securely:** Default to denial on error, avoid leaking stack traces or sensitive info in responses.
- **Secure Defaults:** Harden all configurations out-of-the-box (e.g., enforce HTTPS, secure cookies, strict CORS).

---

## 3. Authentication & Access Control

### 3.1 Clerk Integration
- Enforce **strong password policies** via Clerk’s configuration (min length, complexity).
- Enable **Multi-Factor Authentication (MFA)** for administrative accounts.
- Validate session tokens on every request using Next.js `middleware.ts` and Clerk SDK.

### 3.2 Role-Based Access Control (RBAC)
- Define explicit roles (e.g., `admin`, `teacher`, `student`) in user metadata.
- In each API route and page: perform server-side checks against user roles before CRUD operations.
- Complement application-level RBAC with **Supabase Row Level Security (RLS)** policies targeting user roles.

### 3.3 Secure Session Management
- Set cookies with `HttpOnly`, `Secure`, and `SameSite=Strict`.
- Configure short **idle** and **absolute** session timeouts.
- Invalidate sessions on logout and on sensitive account changes.
- Protect against session fixation by regenerating session identifiers post-login.

---

## 4. Input Validation & Output Encoding

### 4.1 Server-Side Validation
- Leverage existing **Zod** schemas in `src/lib/validations` to validate all API inputs.
- Reject extra or unexpected fields by setting Zod to `.strict()` where appropriate.

### 4.2 Preventing Injection Attacks
- Use Supabase client’s parameterized queries; avoid string concatenation in SQL.
- Sanitize and strictly validate any dynamic parameters (e.g., IDs, text fields).
- For AI chat endpoint (`/api/chat`): sanitize prompts to prevent prompt injection; enforce length limits.

### 4.3 Output Encoding & XSS Mitigation
- Escape or encode all user-supplied data before rendering in React components.
- For any HTML-rich fields, use a secure sanitizer (e.g., DOMPurify) or restrict to plain text.
- Implement a **Content Security Policy (CSP)** header to limit allowable sources.

---

## 5. Data Protection & Privacy

### 5.1 Encryption
- **In transit:** Enforce TLS 1.2+ for all API and database connections.
- **At rest:** Utilize Supabase’s built-in encryption for database storage.

### 5.2 Secrets Management
- Store API keys, Supabase credentials, Clerk keys, and any OpenAI tokens in environment variables. Do **not** commit them.
- Consider a secrets manager (e.g., AWS Secrets Manager or HashiCorp Vault) for production.

### 5.3 Sensitive Data Handling
- Never log sensitive PII or credentials. Mask or redact if logging is unavoidable.
- Adhere to data retention policies; implement deletion or anonymization routines for stale records.

---

## 6. API & Service Security

### 6.1 Secure Communication
- Redirect all HTTP traffic to HTTPS via Next.js or proxy configuration.
- Enable HSTS (`Strict-Transport-Security`) with a minimum 6-month max-age.

### 6.2 Rate Limiting & Throttling
- Apply per-IP or per-user rate limits on sensitive endpoints (e.g., `/api/chat`, login, CRUD routes).
- Throttle high-cost operations (bulk data exports, AI chat queries).

### 6.3 CORS Configuration
- Restrict allowed origins to known front-end domains in `next.config.js` or API middleware.
- Disable wildcard (`*`) CORS in production.

### 6.4 API Versioning & Least Exposure
- Prefix API routes with version (e.g., `/api/v1/announcements`).
- Limit each endpoint’s response to only the necessary fields.
- Enforce correct HTTP verbs: GET for reads, POST for creates, PUT/PATCH for updates, DELETE for removals.

---

## 7. Web Application Security Hygiene

### 7.1 CSRF Protection
- Use anti-CSRF tokens for state-changing POST/PUT/DELETE requests in client components.
- For Next.js API routes, validate the `Origin` or `Referer` header when a token isn’t present.

### 7.2 Security Headers
- `Content-Security-Policy`: Restrict scripts, styles, fonts, and frame sources.
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` or CSP `frame-ancestors 'none'`
- `Referrer-Policy: same-origin`

### 7.3 Cookie Hardening
- Set all app cookies to `HttpOnly` & `Secure`.
- Use `SameSite=Strict` for admin session cookies.

### 7.4 Subresource Integrity (SRI)
- When loading third-party scripts/styles (e.g., CDN for icons), include integrity hashes.

---

## 8. Infrastructure & Configuration Management

- **Harden Servers:** Disable unused ports/services; remove default credentials.
- **TLS Configuration:** Disable legacy protocols (SSLv3, TLS1.0/1.1); prefer modern cipher suites.
- **File Permissions:** Limit read/write access to code and data directories.
- **Disable Debug in Prod:** Ensure `NODE_ENV=production` and remove all debug endpoints.
- **Automated Patching:** Keep OS, Docker images, and dependencies up to date using a scheduled maintenance pipeline.

---

## 9. Dependency Management

- Use lockfiles (`package-lock.json`) for consistent builds.
- Vet all dependencies (including transitive) via SCA tools (e.g., `npm audit`, Snyk).
- Remove unused or obsolete packages to reduce attack surface.
- Pin critical libraries (Next.js, Supabase SDK, Clerk SDK) to known secure versions.

---

## 10. Project-Specific Recommendations

1. **Centralize Error Handling:** Create an API error-handler utility to standardize logging and response formats without leaking stack traces.
2. **Testing & CI Integration:** Automate security scans:
   - SAST for code analysis (ESLint security plugins).
   - DAST for running pentests against staging.
3. **AI Chat Hardening:** Rate-limit and log chat requests. Sanitize both user inputs and AI outputs to prevent injection or leak of internal data.
4. **RBAC Enhancements:** Expand Supabase RLS policies to enforce row-level permissions by user role and tenant (if multi-school support is added).
5. **Audit Logging:** Capture and store security-relevant events (login attempts, CRUD operations) in a tamper-resistant log.

---

## 11. Conclusion
By following these guidelines, the **school-info-dashboard** will be fortified with defense-in-depth controls, maintain secure defaults, and uphold the confidentiality, integrity, and availability of sensitive school data. Regularly review and update these practices to adapt to emerging threats and evolving compliance requirements.
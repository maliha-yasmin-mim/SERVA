# SERVA — Architecture Documentation

## 1. System Overview

**SERVA** is a modern MERN-stack platform designed specifically for local micro-work, skilled trade services, second-hand marketplace, and community free giveaways in Bangladesh. Its defining differentiator is the **SERVA ProofBox™** audit and trust workflow.

```mermaid
flowchart TD
    Client["React 18 + Vite Frontend\n(Tailwind CSS, TanStack Query, Framer Motion)"]
    API["Express.js REST API Server\n(JWT Auth, Multer, PDFKit)"]
    DB[("MongoDB Database\n(Real Atlas / In-Memory Fallback)")]
    Proof["SERVA ProofBox Engine\n(Checklists, Before/After Media, PDF Cert)"]
    Match["Explainable Smart Matcher\n(Category, Availability, Proximity, Rating)"]

    Client -->|REST API Requests / JSON| API
    API -->|Mongoose ODM| DB
    API -->|Audit & Workflow Execution| Proof
    API -->|Candidate Compatibility Scoring| Match
```

---

## 2. Layered Architecture

### A. Frontend Layer (`client/`)
- **Single Page Application (SPA):** Built with React 18 and Vite for instant HMR and rapid rendering.
- **Routing Engine:** Centralized in `client/src/App.jsx` using React Router DOM v6 with route protection and nested layouts.
- **State Management & Caching:** TanStack React Query v5 for server state caching; React Context API for authentication and session persistence.
- **Design System:** Custom Tailwind CSS configuration built around SERVA's brand palette (Deep Teal `#0F766E`, Dark Teal `#134E4A`, Lime Accent `#C7F36B`, Neutral `#F7F9F8`).

### B. Backend Layer (`server/`)
- **API Runtime:** Node.js v20+ with ECMAScript Modules (`"type": "module"`).
- **HTTP Routing & Controllers:** Express.js REST architecture separated into modular controllers, routes, models, and middleware.
- **Security & Authorization:**
  - JWT sessions in HttpOnly, SameSite cookies; credentialed requests are restricted to configured client origins.
  - Passwords salted and hashed with `bcryptjs` (cost factor 10).
  - Role-based access control (`user` vs `admin`).
  - Ownership validation on all resource updates and deletes (preventing IDOR vulnerabilities).

### C. Database Layer
- **Mongoose ODM:** Strongly typed schemas with indexes for high-frequency queries (category, location, status).
- **Development Database Fallback:** `mongodb-memory-server` may be used locally when no external MongoDB URI is configured. Production requires a reachable persistent MongoDB URI and never falls back to ephemeral storage.

---

## 3. Signature Feature Architecture: SERVA ProofBox™

```mermaid
sequenceDiagram
    autonumber
    actor Poster as Job Poster (Client)
    actor Worker as Assigned Worker
    participant API as SERVA Backend
    participant DB as MongoDB
    participant PDF as PDFKit Generator

    Poster->>API: Accepts job application
    API->>DB: Updates Job (Assigned) & Inits ProofRecord
    Worker->>API: Uploads Pre-work (Before) Photos
    Worker->>API: Ticks task checklist checkpoints
    Worker->>API: Uploads Completion (After) Photos
    Worker->>API: Submits Proof for Client Review
    API->>Poster: Notifies Client of completed submission
    Poster->>API: Reviews & Confirms Sign-off (Approved)
    API->>PDF: Generates Official Completion Audit PDF
    API->>Worker: Notifies worker with approved certificate
```

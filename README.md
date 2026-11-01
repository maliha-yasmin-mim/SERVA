# SERVA — Local Help. Trusted Connections.

> **Service • Exchange • Reliability • Verification • Assistance**  
> A complete, modern, production-minded MERN-stack platform built for verified local micro-work, service marketplace, community buy & sell, and free giveaway exchange in Bangladesh.

---

## 1. The Problem SERVA Solves

In Bangladesh, informal Facebook groups, scattered WhatsApp messages, and unmoderated classifieds are the primary ways people find short-term jobs, cleaners, technicians, plumbers, and second-hand items. These channels suffer from:
- Lack of verified identities and rampant fraud.
- Zero accountability during work execution leading to disputes over quality.
- Unstructured terms and lost payment expectations.
- No historical records or verifiable customer reviews.

**SERVA** brings all these opportunities into one structured, verified platform powered by our signature innovation: **SERVA ProofBox™**.

---

## 2. Core Pillars & Features

### 💳 Online Payment & Escrow Guarantee (New)
- **Supported Gateways:** bKash, Nagad, Rocket, SSLCommerz (Visa / Mastercard), and Cash upon Completion.
- **SERVA Escrow System:** When booking a service or hiring for a job, funds are deposited into secure escrow.
- **Evidence-Based Release:** Escrow funds are only released to the service provider after the client inspects and approves the job checklist and photographic evidence in SERVA ProofBox™.
- **Digital Receipts:** Instant transaction tracking with unique reference IDs (e.g. `SRV-BKA-982143`), downloadable receipts, and comprehensive dashboard history.

### 🌟 SERVA ProofBox™ (Signature Feature)
The central differentiator eliminating disputes in local micro-work:
1. **Pre-Work Photographic Baseline:** Provider captures timestamped "before" photos.
2. **Audited Task Checklist:** Dynamic, itemized milestone checkpoints checked off with sign-off timestamps.
3. **Completion Evidence:** "After" photos side-by-side on desktop & stacked on mobile.
4. **Client Review & Sign-Off:** Client inspects evidence and either issues official approval or requests structured corrections.
5. **PDF Certificate Export:** Instant generation of formal completion reports via PDFKit.

### 💼 Micro-Work Job Discovery & Applications
- Discover local tasks (Cleaning, Electrical, Moving, Plumbing, Tutoring, Event Staffing, Repairs).
- Filter by category, area (Dhaka, Chattogram, Sylhet, etc.), budget range, and urgency.
- Transparent application process with custom proposal rates, pitches, and status tracking.
- Automated ProofBox activation upon application acceptance.

### 🛠️ Skilled Service Marketplace
- Certified technician and provider directory.
- Defined service package tiers (Basic, Standard, Premium).
- Direct quotation request and proposal response loop.

### 📦 Buy & Sell + 0 BDT Free Stuff
- **Marketplace:** Second-hand electronics, tools, furniture, and bicycles with condition ratings.
- **Free Stuff Community:** 100% free giveaway exchange section with pickup instructions and recipient coordination.

### 🛡️ Trust, Verification & Smart Matching
- **Explainable Smart Matching:** 5-factor weighted candidate compatibility (Category & Skill 35%, Availability 25%, Location 20%, Experience 10%, Rating 10%).
- **National ID Verification:** Front-of-card verification workflow with administrative review queue.
- **Private Document Vault:** Sensitive NID credentials stored securely and never made public.
- **Qualified Reviews Only:** Reviews only unlocked upon qualifying completed transactions.

---

## 3. Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router DOM v6, Framer Motion, TanStack React Query, Lucide React, Axios, Canvas Confetti.
- **Backend:** Node.js, Express.js (ES Modules), RESTful API, Multer, PDFKit.
- **Database:** MongoDB & Mongoose (with automated development in-memory fallback for zero-config startup).
- **Security:** HttpOnly SameSite JWT cookies, bcryptjs password hashing, role-based authorization (`user` & `admin`), origin-restricted credentialed requests, centralized error handling.

---

## 4. Project Structure

```
serva/
├── client/                     # React 18 + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Button, Input, Modal, Badge, Avatar, Loader, EmptyState
│   │   │   ├── layout/         # Navbar, Footer, MainLayout, DashboardLayout, ProtectedRoute
│   │   │   ├── home/           # HeroSection, CategoryGrid, FeaturedJobs, ProofBoxTeaser, etc.
│   │   │   ├── jobs/           # JobCard, filters
│   │   │   ├── services/       # ServiceCard, packages
│   │   │   ├── marketplace/    # ProductCard
│   │   │   ├── free-items/     # FreeItemCard
│   │   │   └── proofbox/       # BeforeAfterGallery, ChecklistManager, ProofStudio
│   │   ├── context/            # AuthContext (login, register, session)
│   │   ├── pages/
│   │   │   ├── public/         # HomePage, FindWork, JobDetails, Marketplace, FreeStuff, etc.
│   │   │   ├── auth/           # LoginPage, RegisterPage
│   │   │   ├── dashboard/      # Overview, MyPosts, CreateJob, CreateService, ProofBoxPage, etc.
│   │   │   └── admin/          # AdminOverview, AdminVerifications, AdminUsers
│   │   ├── services/           # Axios service modules (apiClient, jobService, proofboxService, etc.)
│   │   ├── App.jsx             # Central routing configuration
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Tailwind directives & styles
│   ├── package.json
│   └── vite.config.js
├── server/                     # Node.js + Express REST API
│   ├── src/
│   │   ├── config/             # Database connection & platform constants
│   │   ├── controllers/        # Express request controllers
│   │   ├── middleware/         # Auth, upload, and error handling middlewares
│   │   ├── models/             # Mongoose schemas (User, Job, ProofRecord, Service, etc.)
│   │   ├── routes/             # REST route endpoints
│   │   ├── seed/               # Realistic Bangladesh seed data
│   │   ├── utils/              # PDF generator (PDFKit), Smart matching algorithm
│   │   ├── app.js              # Express app setup
│   │   └── server.js           # Server bootstrap
│   ├── uploads/                # Local uploads storage
│   ├── package.json
│   └── .env.example
├── docs/                       # Technical documentation
│   ├── architecture.md
│   ├── database-schema.md
│   ├── api-documentation.md
│   ├── setup-guide.md
│   └── feature-roadmap.md
├── package.json                # Root monorepo workspace scripts
└── README.md
```

---

## 5. Quick Start Instructions

### 1. Install Dependencies
```bash
npm install
npm --prefix server install
npm --prefix client install
```

### 2. Configure Environment Variables
Copy `server/.env.example` to `server/.env`:
```bash
cp server/.env.example server/.env
```
Set `JWT_SECRET` to a unique random value of at least 32 characters before starting the backend. Leave `MONGODB_URI` blank only for local development; production requires a reachable MongoDB instance.

### 3. Start Development Servers
Run both backend and frontend concurrently:
```bash
npm run dev
```
- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000/api`

---

## 6. Pre-Seeded Development Demo Accounts

The database automatically seeds realistic Bangladesh opportunities upon first boot. All demo accounts use the password: `password123`.

| Account | Email | Password | Role |
|---|---|---|---|
| **Platform Admin** | `admin@serva.com.bd` | `password123` | Compliance Console, Verifications |
| **Cleaning Provider** | `nasreen@serva.com.bd` | `password123` | Active ProofBox cleaning engagement |
| **Master Electrician**| `tariq@serva.com.bd` | `password123` | Dhanmondi, Dhaka. 4.9 ★ Rating |
| **Client Homeowner**  | `rahim@serva.com.bd` | `password123` | Job poster with active ProofBox |

*(On the `/login` page, convenient 1-click buttons are provided to instantly sign into any of these accounts).*

---

## 7. License & Compliance
Built for the community of Bangladesh. All rights reserved © 2026 SERVA.

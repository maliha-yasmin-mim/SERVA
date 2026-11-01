# SERVA — REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Authentication & User Profile (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user (name, email, password, location) |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| `GET` | `/api/auth/me` | Protected | Fetch current authenticated user profile |
| `PUT` | `/api/auth/profile` | Protected | Update profile (skills, bio, rate, location, avatar) |
| `PUT` | `/api/auth/availability` | Protected | Toggle "Available Now" and weekly schedule |
| `POST` | `/api/auth/verify-submit` | Protected | Submit National ID number and document photo |

---

## 2. Jobs Marketplace (`/api/jobs`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/jobs` | Public | Search & filter jobs (keyword, category, location, min/max budget, urgency, sort) |
| `GET` | `/api/jobs/:id` | Public | Get single job with poster details |
| `POST` | `/api/jobs` | Protected | Create new job post |
| `PUT` | `/api/jobs/:id` | Poster/Admin | Update job post details |
| `PATCH` | `/api/jobs/:id/status` | Poster/Admin | Update lifecycle status (Open, Assigned, In Progress, Completed, Cancelled) |
| `DELETE` | `/api/jobs/:id` | Poster/Admin | Remove job post |
| `GET` | `/api/jobs/my/posted` | Protected | Retrieve all jobs created by authenticated user |
| `GET` | `/api/jobs/my/assigned` | Protected | Retrieve all jobs where user is the assigned worker |

---

## 3. Job Applications (`/api/applications`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/applications/:jobId` | Protected | Submit application for an open job |
| `GET` | `/api/applications/job/:jobId` | Poster/Admin | Get all applicants for a job with smart match score |
| `GET` | `/api/applications/my` | Protected | Get applications submitted by current user |
| `PATCH` | `/api/applications/:id/status`| Poster/Admin | Accept or reject application (Accepting auto-assigns job & inits ProofBox) |

---

## 4. SERVA ProofBox™ (`/api/proofbox`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/proofbox/job/:jobId` | Participants/Admin | Get or initialize proof record for assigned job |
| `PATCH` | `/api/proofbox/:id/checklist` | Participants | Toggle completion on a task checklist item |
| `POST` | `/api/proofbox/:id/checklist` | Participants | Add new custom checklist task item |
| `POST` | `/api/proofbox/:id/media` | Participants | Upload Before or After photographic evidence |
| `POST` | `/api/proofbox/:id/progress` | Participants | Post text/photo milestone progress update |
| `POST` | `/api/proofbox/:id/submit` | Provider | Submit completed work proof to client for approval |
| `POST` | `/api/proofbox/:id/approval` | Client | Approve work or request corrections with feedback |
| `GET` | `/api/proofbox/:id/report.pdf`| Public/Client | Download or stream PDF completion certificate |

---

## 5. Services & Quotes (`/api/services` & `/api/quotes`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/services` | Public | Browse services with category, pricing & area filters |
| `GET` | `/api/services/:id` | Public | Service details with package tier breakdown |
| `POST` | `/api/services` | Protected | Create service offering with custom packages |
| `POST` | `/api/quotes` | Protected | Request custom quote from a provider |
| `GET` | `/api/quotes/incoming` | Provider | Incoming quote requests from clients |
| `PATCH` | `/api/quotes/:id/respond` | Provider | Respond to quote with price proposal and notes |

---

## 6. Products & Free Stuff (`/api/products` & `/api/free-items`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | Buy & sell marketplace browse and condition filters |
| `POST` | `/api/products` | Protected | List item for sale |
| `PATCH` | `/api/products/:id/status` | Seller/Admin | Mark product Available, Reserved, or Sold |
| `GET` | `/api/free-items` | Public | 0 BDT Free Stuff giveaway listings |
| `POST` | `/api/free-items` | Protected | List free giveaway item |
| `POST` | `/api/free-items/:id/request` | Protected | Request free item pickup from giver |
| `PATCH` | `/api/free-items/:id/status` | Giver/Admin | Mark free item Available, Reserved, or Collected |

---

## 7. Admin Console (`/api/admin`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/overview` | Admin Only | Platform statistics, active queues, and recent audits |
| `GET` | `/api/admin/users` | Admin Only | Search & filter user directory |
| `GET` | `/api/admin/verifications` | Admin Only | Queue of pending National ID verification applications |
| `PATCH` | `/api/admin/verifications/:id` | Admin Only | Approve, reject, or request resubmission on NID |
| `GET` | `/api/admin/audit-logs` | Admin Only | Read platform immutable audit trail |

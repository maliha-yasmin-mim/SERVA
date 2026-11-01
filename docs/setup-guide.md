# SERVA — Setup & Development Guide

## 1. Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **MongoDB**: Required for production (MongoDB Atlas or a local server). Development can use the in-memory MongoDB fallback when `MONGODB_URI` is empty.

---

## 2. Installation & Quick Start

### Step 1: Install Dependencies
From the project root:
```bash
# Install root, backend and frontend dependencies
npm install
npm --prefix server install
npm --prefix client install
```

### Step 2: Configure Environment Variables
Copy the `.env.example` file in `server/`:
```bash
cp server/.env.example server/.env
```
Set `JWT_SECRET` to a unique, random value before starting the API. For example, generate one with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` and place it in `server/.env`. Never use a published example or placeholder as a production secret.

Default configuration values:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=
JWT_SECRET=<your unique random secret>
CLIENT_URL=http://localhost:5173
```
*(Leave `MONGODB_URI` empty only for local development, or input your MongoDB Atlas connection string.)*

### Step 3: Run the Application
You can run both backend and frontend concurrently with a single command from root:
```bash
npm run dev
```

Or run them individually in separate terminals:
- **Backend Terminal:**
  ```bash
  npm run server
  # Server starts at http://localhost:5000
  ```
- **Frontend Terminal:**
  ```bash
  npm run client
  # Client starts at http://localhost:5173
  ```

---

## 3. Pre-Seeded Development Demonstration Accounts

When the application boots for the first time or with an empty database, it automatically seeds realistic Bangladesh demonstration data (Dhaka, Chattogram, Sylhet, etc.) with pre-configured active jobs, services, and an active **SERVA ProofBox™** record.

All demo accounts share the password: `password123`. Browser sessions use an HttpOnly, SameSite cookie; the access token is not exposed to JavaScript storage.

| Role | Account Email | Password | Details |
|---|---|---|---|
| **Platform Admin** | `admin@serva.com.bd` | `password123` | Compliance Console, Verifications Review, User Directory |
| **Verified Electrician** | `tariq@serva.com.bd` | `password123` | Master Electrician, Dhanmondi, Dhaka. 4.9 ★ Rating |
| **Verified Cleaning Lead** | `nasreen@serva.com.bd` | `password123` | Deep Cleaning Provider with active ProofBox job |
| **Verified Homeowner** | `rahim@serva.com.bd` | `password123` | Client with active ProofBox cleaning engagement |

*Note: On the Sign In page (`/login`), 1-click fill buttons are provided for instant testing of any role without typing.*

Demo accounts and the in-memory database are development-only. Production startup fails when `JWT_SECRET` or a reachable `MONGODB_URI` is missing. Verification documents are stored separately from public listing media and are available only to authorized administrators.

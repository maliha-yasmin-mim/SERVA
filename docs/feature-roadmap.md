# SERVA — Feature Roadmap & Current Scope

## Completed Core Features (v1.0.0)

- [x] **Monorepo Architecture:** Vite React 18 frontend + Express.js backend + MongoDB.
- [x] **Brand Design System:** Exact color tokens (Teal `#0F766E`, Dark `#134E4A`, Lime `#C7F36B`, Neutral `#F7F9F8`).
- [x] **Centralized React Routing:** Central route definitions in `App.jsx` with route guards, layouts, and 404 fallback.
- [x] **Multi-Sector Marketplaces:**
  - Micro-Work Job Discovery & Application Flow.
  - Skilled Service Provider Directory with Package Builders.
  - Second-Hand Buy & Sell Marketplace.
  - 0 BDT Free Stuff Community Exchange.
- [x] **SERVA ProofBox™ Studio (Signature Feature):**
  - Pre-work baseline photo evidence.
  - Milestone task checklists with live timestamp tracking.
  - Post-work completion photo evidence.
  - Client review & sign-off loop (Approve vs Request Corrections).
  - Downloadable PDF completion audit report powered by PDFKit.
- [x] **Explainable Smart Matching:**
  - Configurable weighted algorithm (Category 35%, Availability 25%, Proximity 20%, Experience 10%, Rating 10%).
- [x] **Trust & Verification System:**
  - National ID (NID) submission and administrative review queue.
  - Private document vault security handling.
- [x] **Admin Suite:**
  - Platform analytics overview, user directory, verification queue, and immutable audit logs.
- [x] **Realistic Bangladesh Seed Data:**
  - Pre-populated jobs, services, products, free items, and users across Dhaka, Chattogram, and Sylhet.

---

## Future Enhancements & Upgrades

1. **Digital Escrow & Local MFS Integration:**
   - Integrate bKash, Nagad, and Rocket merchant APIs for optional milestone escrow on high-value jobs.
2. **Real-Time WebSockets:**
   - Socket.IO gateway for instant live chat typing indicators and push notifications.
3. **Geo-Location Radius Search:**
   - Native map view with OpenStreetMap / Google Maps integration for exact kilometer proximity matching.
4. **Mobile Native Apps:**
   - React Native client leveraging existing REST API controllers and ProofBox camera workflows.

# MASTER PROJECT PROMPT — SERVA
## Build a Complete, Modern, Professional MERN-Stack Platform

Act as a senior full-stack engineer, software architect, UI/UX designer, database designer, and product developer. Build a professional, production-minded web application named **SERVA**.

Do not create just a landing page, static prototype, or collection of disconnected UI screens. Build a complete, well-structured, responsive MERN-stack application with a consistent design system, reusable components, functional navigation, working forms, database-backed features, secure APIs, realistic workflows, and clear documentation.

Work directly in the current project workspace. First inspect the existing files and environment. Preserve useful existing code, and do not overwrite working features unnecessarily. If the workspace is empty, initialize the project using the structure below.

Implement the application in organized phases. Keep the application runnable after each phase, test important features, and fix errors before moving forward. Do not stop after generating a plan or homepage.

---

# 1. PROJECT IDENTITY

**Project name:** SERVA

**Meaning:** Service, Exchange, Reliability, Verification, Assistance.

**Suggested tagline:** “Local Help. Trusted Connections.”

Alternative supporting tagline: “Find Work. Offer Services. Exchange More. Build Trust.”

**Project type:** A verified local micro-work, service marketplace, and community exchange platform.

**Primary target market:** Bangladesh.

**Primary objective:** Help people discover local work, hire service providers, offer their own services, sell second-hand products, and give away useful items through one organized platform.

SERVA must not look like a simple clone of Bazaraki, Facebook Marketplace, or a conventional job portal. Its key differentiators are structured local job workflows, trust-oriented user profiles, verification, availability matching, transaction records, and the SERVA ProofBox system.

## The problem SERVA solves

People frequently find short-term work and local services through Facebook groups, informal messaging, personal contacts, and scattered advertisements. These channels can make it difficult to compare offers, verify users, communicate requirements, track completed work, and resolve disagreements.

Formal job platforms often focus on regular employment, while freelance platforms mainly focus on online work.

SERVA brings local opportunities into a single, structured platform.

Examples:
- Someone needs a cleaner for an apartment.
- A homeowner needs a gardener.
- A person needs help moving furniture.
- Someone needs a plumber, electrician, mechanic, tutor, photographer, or repair worker.
- A worker wants to find a short-term job.
- A skilled person wants to advertise a service.
- Someone wants to sell a used phone.
- Someone wants to give away furniture for free.

The interface should make all these use cases easy to understand.

---

# 2. TECHNOLOGY STACK

Use the following stack unless an existing project constraint requires a justified alternative.

## Frontend
- React.js
- JavaScript with JSX, not TypeScript for the initial implementation
- Vite
- Tailwind CSS
- React Router DOM
- Framer Motion for UI animations
- Lucide React for consistent icons
- React Hook Form for complex forms
- Zod for form validation where appropriate
- TanStack Query for server-state fetching and caching
- Axios or a centralized Fetch API client
- Three.js with React Three Fiber only for selected 3D elements where genuinely useful

## Backend
- Node.js
- Express.js
- JavaScript with ES modules
- RESTful API architecture
- MongoDB
- Mongoose
- JWT-based authentication using secure practices
- bcrypt for password hashing
- Zod or express-validator for server-side validation
- Centralized error-handling middleware

## Media and external services
- Cloudinary for public listing images and approved media
- Private storage for sensitive identity verification documents
- Nodemailer or a suitable email service for email notifications, when configured
- Socket.IO for real-time messaging if implemented in the relevant phase
- PDFKit or an equivalent library for ProofBox reports and completion certificates

## Development and deployment
- Git and GitHub
- MongoDB Atlas for hosted MongoDB
- Vercel for the frontend
- Render or a similar service for the backend
- Environment variables for all secrets and service credentials

Use stable, mutually compatible package versions. Do not install unnecessary dependencies.

Do not use Appwrite as the primary backend. The application must use the MERN stack.

---

# 3. DESIGN DIRECTION — IMPORTANT

The website must look like a premium, modern, real-world startup product designed by an experienced product design team.

The visual style should combine:
- Premium SaaS dashboard design
- Modern community marketplace design
- Clean editorial typography
- Soft depth and sophisticated surfaces
- Rich photography
- Subtle glass effects where appropriate
- Smooth, carefully timed motion
- Clear information hierarchy
- Generous spacing
- Excellent mobile usability

Avoid generic AI-generated website aesthetics, excessive gradients, oversized empty sections, random decorative elements, inconsistent card styles, and repetitive layouts.

## Brand colors

Build a consistent design system around:

- Primary deep teal: `#0F766E`
- Primary dark: `#134E4A`
- Accent lime: `#C7F36B`
- Main background: `#F7F9F8`
- White surfaces: `#FFFFFF`
- Main text: `#17211F`
- Secondary text: `#64716D`
- Borders: `#E3EAE7`
- Success: `#15803D`
- Warning: `#D97706`
- Error: `#DC2626`

Use these colors consistently across buttons, links, badges, charts, form states, and interactive elements.

The accent lime should be used sparingly for highlights, active indicators, or distinctive CTAs. Do not turn the whole interface bright green.

Use dark backgrounds selectively for the hero, selected promotional sections, and footer. Keep data-heavy dashboards light and readable.

## Typography

Use a modern font combination such as:
- Inter for general UI
- Manrope for selected headings

Use consistent typography scales:
- Large hero heading
- Clear page headings
- Compact section headings
- Readable body text
- Small but legible labels and metadata

Use strong typography hierarchy rather than making every heading oversized.

## Layout and spacing

- Use a consistent responsive container system.
- Keep card padding, section spacing, border radii, and alignment consistent.
- Use a 12-column grid where appropriate on desktop.
- Use single-column layouts on narrow mobile screens.
- Prefer rounded corners around 12–20px rather than making every element excessively rounded.
- Use subtle shadows, thin borders, and restrained elevation.
- Maintain excellent contrast and keyboard focus states.
- Never allow content to overflow horizontally on mobile.

## Photography and imagery

Use attractive, realistic photography related to local services, workers, homes, tools, second-hand products, and everyday community life.

Use Cloudinary or legitimate image sources where configured. Use realistic local placeholder data for development.

Avoid broken images, repeated identical photos across every card, random unrelated illustrations, and misleading profile photos.

Every image should have an appropriate aspect ratio, meaningful alt text, a consistent crop, and a fallback if it fails to load.

Do not rely on external image URLs that are likely to disappear. Prefer configured media storage or stable local placeholder assets.

---

# 4. ANIMATIONS AND 3D DESIGN

The website should feel alive, smooth, and premium without sacrificing performance or usability.

## Hero section

Create a visually impressive homepage hero with:
- A strong headline about finding trusted local work and services.
- Supporting text explaining SERVA.
- Primary CTA: “Explore Opportunities”.
- Secondary CTA: “Post a Job”.
- A prominent search component.
- Attractive service and marketplace imagery.
- Floating category chips or small opportunity cards.
- A subtle animated background.

Use a restrained combination of motion, depth, and photography.

## Background animation

Consider:
- Slow-moving gradient light.
- Soft floating decorative shapes.
- Subtle animated dots or lines.
- Gentle parallax effects.
- Small animated highlights around the hero illustration.

Animations should be smooth, unobtrusive, and never interfere with reading or clicking.

Do not use heavy continuous animations on every page.

## Image animations

Use Framer Motion for:
- Fade and slide entrance animations.
- Staggered card appearances.
- Smooth image reveal.
- Hover zoom on listing images.
- Subtle image parallax in selected sections.
- Smooth tab and modal transitions.
- Animated progress bars.
- Notification and status transitions.

If horizontal image carousels are used, provide clear controls, support touch gestures, and pause automatic movement when appropriate. Do not force continuously moving content that users cannot control.

## 3D elements

Use 3D only where it improves the experience.

Potential locations:
- A small floating 3D SERVA brand object or abstract interconnected shapes in the homepage hero.
- A subtle 3D visual representing connection, trust, or community.
- Small decorative 3D elements in a promotional section.

Use React Three Fiber only for a limited, isolated visual component. Prefer CSS transforms and Framer Motion for ordinary card depth and hover effects.

Do not create a heavy 3D scene on every page.

3D must:
- Load lazily.
- Have a static fallback.
- Work on mobile.
- Respect reduced-motion preferences.
- Avoid blocking the main content.
- Maintain acceptable performance.

If 3D introduces excessive complexity or performance problems, prioritize a polished 2D design instead.

## Motion accessibility

Respect `prefers-reduced-motion`. Ensure all animations can be reduced or disabled. Never hide important information behind animations.

---

# 5. MAIN WEBSITE NAVIGATION

Create a professional, responsive navigation system.

## Desktop navigation

Left:
- SERVA logo and brand name

Center:
- Find Work
- Find Services
- Marketplace
- Free Stuff
- How It Works

Right:
- Search icon or search field
- Notifications
- Sign In
- A prominent “Post Something” button

For authenticated users, show their profile avatar and dropdown menu instead of Sign In.

## Mobile navigation

Use a clean mobile header with:
- SERVA logo
- Search icon
- Notification or account icon

Use a responsive menu or bottom navigation where appropriate.

Never force desktop navigation into a narrow mobile screen.

## Post Something menu

When clicked, show four clear choices:
1. Post a Job
2. Offer a Service
3. Sell an Item
4. Give Away an Item

Each option should lead to the correct creation form.

---

# 6. COMPLETE PAGE STRUCTURE

Create separate page components for each route.

At minimum, implement the following pages.

## Public pages
1. Home
2. Find Work
3. Job Details
4. Find Services
5. Service Details
6. Marketplace / Buy & Sell
7. Product Details
8. Free Stuff
9. Free Item Details
10. Public User Profile
11. How SERVA Works
12. Trust and Verification Information
13. Contact Us
14. Terms and Conditions
15. Privacy Policy
16. Not Found (404)

## Authentication pages
17. Register
18. Login
19. Forgot Password
20. Reset Password

## User dashboard pages
21. Dashboard Overview
22. My Profile
23. Edit Profile
24. My Posts
25. Create Job Post
26. Create Service Post
27. Create Sale Listing
28. Create Free Listing
29. My Applications
30. Received Applications
31. Saved Posts
32. Messages
33. Notifications
34. Availability Settings
35. Verification Center
36. Reviews and Ratings
37. My Transactions
38. ProofBox
39. Job Checklist and Evidence
40. Completion Reports

## Admin pages
41. Admin Overview
42. User Management
43. Listing Moderation
44. Verification Review
45. Reported Content
46. Transaction Monitoring
47. Dispute Management
48. Category Management
49. Platform Analytics
50. Admin Audit Log

These are page requirements, not instructions to cram everything into one giant dashboard component. Reuse shared components, but give each page a clear purpose and appropriate layout.

Where a feature is not yet connected to a backend, label it as a development/demo feature. Do not imply that a real transaction, identity verification, or payment has occurred when it has not.

---

# 7. HOMEPAGE DESIGN

The homepage must be the most visually impressive public page.

Build it in the following order.

## Section 1: Hero

Use a premium dark-teal or carefully composed light/dark hero design.

Include:
- Main headline: “Find Local Work. Build Trusted Connections.”
- Supporting description explaining local jobs, services, second-hand items, and free exchanges.
- A search input with category and location options.
- Primary CTA: “Explore Opportunities”.
- Secondary CTA: “Post Something”.
- Floating cards showing example local opportunities.
- Subtle background motion.
- Optional lightweight 3D decorative visual.

The search field must work and navigate to relevant results.

## Section 2: Quick category navigation

Create attractive category cards for:
- Cleaning
- Gardening
- Moving
- Plumbing
- Electrical Work
- Repairs
- Car Wash
- Tutoring
- Photography
- Other Services

Use distinct, relevant icons or images. Category cards should have clear hover and focus states.

## Section 3: Find local work

Show selected job cards with:
- Job title
- Budget or payment
- Location
- Date or urgency
- Poster information
- Verification badge where applicable
- Number of applicants, when available
- View Details CTA

Include “View All Jobs”.

## Section 4: Discover trusted services

Show attractive service cards with:
- Service image
- Provider name and avatar
- Service title
- Starting price
- Location/service area
- Rating and review count
- Verification status
- Availability indicator

Do not fabricate verification badges or ratings in live user-generated data.

## Section 5: How SERVA works

Create a simple four-step visual:
1. Discover an opportunity.
2. Connect with the right person.
3. Agree on the work or transaction.
4. Track completion and build trust.

Use icons, subtle connector lines, and light animations.

## Section 6: SERVA ProofBox

Create a distinctive section introducing the platform's evidence and trust workflow.

Explain that users can:
- Record work progress.
- Upload before-and-after photos.
- Complete job checklists.
- Request client approval.
- Keep a completion history.
- Generate a completion report.

Use an attractive visual timeline or product mockup.

## Section 7: Marketplace

Display second-hand items with:
- Image
- Title
- Price
- Condition
- Location
- Seller
- Save button

Provide a clear link to the full marketplace.

## Section 8: Free Stuff

Show items available for free. Make the section visually distinct from paid marketplace listings.

Each card should clearly show “Free”, pickup location, and item availability.

## Section 9: Trust and verification

Explain the platform's trust mechanisms:
- User verification
- Profile history
- Reviews
- Reporting
- ProofBox
- Structured transaction status

Do not claim that verification guarantees a user is completely safe. Explain what has actually been checked.

## Section 10: Final CTA

Headline: “Your Next Opportunity Starts Here.”

Buttons:
- Find Work
- Offer a Service
- Post Something

## Section 11: Footer

Include:
- Brand identity
- Main navigation
- Help and support
- Safety information
- Terms and privacy
- Social links, only if configured
- Copyright notice

---

# 8. JOB MARKETPLACE

Build a complete local job discovery and application system.

## Job categories

Include:
- Cleaning
- Gardening
- Moving and Shifting
- Plumbing
- Electrical Work
- Repairs and Maintenance
- Car Wash
- Construction and Labour
- Tutoring
- Photography and Events
- Delivery and Errands
- Hospitality
- Other Local Jobs

Categories must be configurable rather than hardcoded throughout the application.

## Job listing fields

Each job should support:
- Title
- Description
- Category
- Location
- Budget or payment amount
- Payment type
- Work date
- Start time
- Expected duration
- Number of workers needed
- Required skills
- Requirements
- Images, if applicable
- Application deadline
- Urgency level
- Contact/application preference
- Created by
- Creation date
- Status

Use server-side validation and sensible limits.

## Find Work page

Provide:
- Search by keyword
- Category filters
- Location filters
- Budget range
- Date and urgency filters
- Sort by newest
- Sort by budget
- Relevant pagination or load-more functionality
- Empty states
- Loading skeletons
- Error states
- Mobile filter drawer

Filters must actually affect displayed results.

## Job details page

Include:
- Full job information
- Budget and location
- Job poster profile
- Verification status
- Application deadline
- Required skills
- Number of workers
- Application button
- Save job
- Report listing
- Similar jobs

## Job applications

Users should be able to apply with:
- A short introduction
- Relevant skills
- Experience
- Availability
- Expected payment, if applicable
- Optional CV or supporting document, subject to safe file handling

Applicants must be able to track application status.

Job posters should be able to:
- View applications
- Review applicant profiles
- Accept an applicant
- Reject an application
- Mark a job as assigned
- Start the job
- Complete the job workflow

Prevent duplicate applications for the same user and job.

Implement clear application states, such as:
Applied → Under Review → Accepted or Rejected.

Job lifecycle:
Open → Assigned → In Progress → Completed or Cancelled.

Do not let unauthorized users change these states.

---

# 9. SERVICE MARKETPLACE

Allow users to advertise services they provide.

## Service categories

Support cleaning, gardening, repairs, plumbing, electrical work, moving, tutoring, photography, car washing, computer support, and other local services.

## Service listing fields
- Title
- Description
- Category
- Starting price
- Pricing model
- Service location or area
- Availability
- Skills and experience
- Portfolio images
- Created by
- Verification status
- Creation date
- Listing status

## Service features

Implement:
- Search and filters
- Provider profile
- Ratings and reviews
- Availability calendar
- Save/favourite
- Contact or messaging
- Request a quote
- Quote response
- Booking or job request status
- Repeat hire
- Report listing

Allow service providers to create clearly defined service packages where appropriate.

For example:
- Basic Cleaning
- Standard Cleaning
- Premium Cleaning

Do not force fixed packages on services where custom quotations make more sense.

---

# 10. BUY & SELL MARKETPLACE

Users can sell second-hand and other permitted products.

## Listing fields
- Product title
- Description
- Category
- Price
- Condition
- Images
- Location
- Seller
- Creation date
- Listing status

## Features
- Search
- Category filters
- Price range
- Condition filters
- Sorting
- Product details
- Seller profile
- Save item
- Contact seller
- Mark as reserved
- Mark as sold
- Report listing

Transaction states:
Available → Reserved → Sold.

The backend must verify that only the seller or an authorized administrator can change listing status.

Do not implement real payments for marketplace purchases unless specifically configured and requested.

---

# 11. FREE STUFF

Create a separate free-item section.

Users can offer useful items without charging money.

Examples:
- Furniture
- Books
- Clothing
- Kitchen items
- Electronics
- Study materials
- Household items

Fields:
- Title
- Description
- Category
- Images
- Condition
- Location
- Pickup instructions
- Available until
- Created by
- Status

States:
Available → Reserved → Collected.

Provide a “Request Item” or “Contact Giver” action.

The owner should be able to accept a recipient and mark the item as collected.

---

# 12. SERVA PROOFBOX — SIGNATURE FEATURE

ProofBox must be a central differentiator of SERVA, not merely a decorative page.

Create a complete, visually polished workflow for documenting work and transactions.

## A. Job proof workflow

1. Job is assigned.
2. Provider starts the job.
3. Provider records start time.
4. Before-work photos are uploaded.
5. Checklist items are completed.
6. Provider uploads progress evidence where appropriate.
7. After-work photos are uploaded.
8. Provider submits the job as completed.
9. Client reviews the evidence.
10. Client approves or requests corrections.
11. Completion report is generated.
12. Job history and review become available.

## B. Checklist builder

Allow job posters or authorized users to create task checklists.

Example for cleaning:
- Kitchen cleaned
- Bathroom cleaned
- Floors cleaned
- Windows cleaned
- Waste removed

Each checklist item can contain:
- Title
- Description
- Required/optional status
- Completion state
- Evidence image, if needed
- Timestamp
- User who marked it complete

## C. Before-and-after gallery

Display before and after images side by side on desktop and in a mobile-friendly comparison layout.

Provide:
- Image preview
- Full-size modal
- Upload progress
- Upload validation
- Image deletion only where authorized
- Timestamp
- Optional notes

Do not allow users to attach evidence to jobs they do not own or participate in.

## D. Client approval

The client should be able to:
- Review checklist
- View before-and-after images
- Approve completion
- Request corrections
- Provide a reason when requesting corrections

Keep a record of approval and correction requests.

## E. ProofBox completion report

Generate a professional report containing:
- SERVA branding
- Unique report ID
- Job title
- Provider and client
- Start and completion dates
- Checklist
- Before-and-after evidence references
- Approval status
- Completion notes
- Report generation date

Generate a downloadable PDF when the backend PDF service is implemented.

## F. Transaction evidence

For product or free-item exchanges, allow relevant participants to record:
- Item condition
- Handover status
- Transaction date
- Optional handover photos
- Confirmation from the relevant parties

Do not treat a user-generated confirmation as independent proof that a transaction occurred. Clearly distinguish user-submitted evidence from verified platform records.

## G. Auditability

Important ProofBox actions should be timestamped and recorded.

Prevent unauthorized editing of another user's proof records. Preserve correction history for completed jobs and important approvals.

Use clear status labels and timelines throughout the UI.

---

# 13. TRUST, VERIFICATION, AND USER PROFILES

## User profiles

Each user profile should support:
- Profile photo
- Name
- Short bio
- Location
- Skills
- Services offered
- Work history
- Completed jobs
- Reviews
- Average rating
- Response information, when enough data exists
- Verification status
- Joined date
- Public listings

## Verification workflow

Implement a verification status system:
- Not Started
- Submitted
- Under Review
- Verified
- Rejected
- Resubmission Required

For the demo, provide a simulated verification workflow managed by authorized admins.

Do not claim real identity verification unless a legitimate verification process has actually been integrated.

## Sensitive document handling

- Never expose NID images or other sensitive identity documents on public profiles.
- Never store identity documents in public media folders.
- Keep verification documents private and restrict access to authorized reviewers.
- Validate uploads on the server.
- Use file size limits and permitted file types.
- Store verification status separately from the sensitive document itself.
- Do not request unnecessary sensitive information.

## Reviews and ratings

Allow eligible participants to review each other after a qualifying completed job or transaction.

Implement:
- Rating
- Written feedback
- Review date
- Relevant job or transaction reference
- Report review option
- Moderation status

Prevent duplicate reviews for the same qualifying transaction.

Do not allow users to rate random users without a qualifying interaction.

## Reliability indicators

Build a transparent reliability system using measurable data such as:
- Completed jobs
- Confirmed cancellations
- No-shows where reliably recorded
- Response data
- Verified reviews

Do not create arbitrary trust scores without a documented calculation.

Show how indicators are calculated and do not present a platform-generated score as a guarantee of safety.

---

# 14. ADDITIONAL FEATURES

Implement these features in a prioritized and maintainable way.

1. Availability Calendar — users specify when they can work.
2. Available Now Status — providers can indicate immediate availability.
3. Smart Job Matching — rank opportunities by category, availability, location, experience, and rating.
4. Multiple Provider Offers — customers compare quotations.
5. Quick Quote Requests — customers submit service requirements.
6. Repeat Hire — hire a previously used provider again.
7. Recurring Jobs — schedule repeat cleaning or gardening requests.
8. Saved Posts — bookmark jobs, services, and products.
9. Notifications — applications, messages, quotes, status changes, and approvals.
10. Messaging — private conversation between relevant participants.
11. Job Expiry — close old listings after their deadline.
12. Cancellation Reasons — record structured cancellation reasons.
13. Dispute Center — submit and review disagreements.
14. Report Listing — flag suspicious content.
15. Admin Moderation — review reported listings and users.
16. PDF Reports — export ProofBox completion reports.
17. Search History or Saved Searches — allow users to revisit useful queries.
18. Responsive Dashboard Analytics — show meaningful user activity.
19. Service Package Builder — create service tiers where useful.
20. Transaction History — display relevant jobs, services, item exchanges, and proof reports.

Do not build all advanced features before the core application works. Implement the foundational flows first, then extend them.

---

# 15. AUTHENTICATION AND AUTHORIZATION

Implement a secure authentication system.

Required features:
- Registration
- Login
- Logout
- Password hashing
- Input validation
- Protected frontend routes
- Server-side authentication middleware
- Role-based authorization
- Profile editing
- Account status checks

Roles may include:
- User
- Administrator

A user can act as a job poster, applicant, service provider, buyer, or seller without needing an unrelated separate account for every activity.

Use secure cookie-based authentication where the deployment architecture supports it. Configure HttpOnly, Secure, and appropriate SameSite settings. If a different authentication design is chosen, document the security trade-offs.

Do not store passwords, private identity documents, or sensitive tokens in public frontend code.

Do not hardcode secret keys.

Protect against:
- Unauthorized resource access
- IDOR-style ownership bypasses
- Duplicate applications
- Duplicate reviews
- Invalid status transitions
- Malicious uploads
- Unvalidated user input
- Excessive API requests
- Unauthorized admin actions

---

# 16. BACKEND API DESIGN

Organize the REST API into route modules.

Example API groups:

- `/api/auth`
- `/api/users`
- `/api/jobs`
- `/api/applications`
- `/api/services`
- `/api/quotes`
- `/api/products`
- `/api/free-items`
- `/api/messages`
- `/api/notifications`
- `/api/reviews`
- `/api/verification`
- `/api/proofbox`
- `/api/transactions`
- `/api/reports`
- `/api/admin`

Use:
- Controllers for request handling
- Services for business logic
- Models for database structures
- Middleware for authentication, authorization, validation, and errors
- Reusable utilities for common operations

Do not put every endpoint and all business logic in a single Express file.

All API responses should have consistent structures and meaningful HTTP status codes.

Add pagination and query validation to listing endpoints.

Never trust a user ID, role, price, ownership claim, or transaction state merely because it was submitted by the frontend. Validate it against the authenticated user and database.

---

# 17. PROFESSIONAL PROJECT FOLDER STRUCTURE

Use a clean monorepo structure with separate frontend and backend directories.

Recommended structure:

serva/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   │   └── models/
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Avatar.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   └── ErrorState.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── MainLayout.jsx
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   └── MobileNavigation.jsx
│   │   │   ├── home/
│   │   │   ├── jobs/
│   │   │   ├── services/
│   │   │   ├── marketplace/
│   │   │   ├── proofbox/
│   │   │   ├── profile/
│   │   │   └── dashboard/
│   │   │
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   ├── auth/
│   │   │   ├── jobs/
│   │   │   ├── services/
│   │   │   ├── marketplace/
│   │   │   ├── free-items/
│   │   │   ├── dashboard/
│   │   │   ├── proofbox/
│   │   │   └── admin/
│   │   │
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── services/
│   │   │   ├── apiClient.js
│   │   │   ├── authService.js
│   │   │   ├── jobService.js
│   │   │   ├── serviceService.js
│   │   │   ├── productService.js
│   │   │   └── proofboxService.js
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── validations/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── .env.example
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── jobs/
│   │   ├── seed/
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── docs/
│   ├── architecture.md
│   ├── database-schema.md
│   ├── api-documentation.md
│   ├── setup-guide.md
│   └── feature-roadmap.md
│
├── .gitignore
├── package.json
└── README.md

This is a guide, not a rigid requirement. Create additional files when needed, and do not create empty files just to match the tree.

## React routing requirement

Use React Router DOM and define the main application routes centrally in `client/src/App.jsx`, as requested.

`App.jsx` should remain readable. Import page components and layout components rather than writing complete pages inside it.

Use layouts, nested routes where appropriate, route guards, and a 404 fallback. Keep route configuration centralized in `App.jsx` even as the application grows.

Do not place all page components, API logic, and business logic inside `App.jsx`.

## Component organization

Every reusable UI component must have an appropriate component file.

Examples:
- JobCard.jsx
- ServiceCard.jsx
- ProductCard.jsx
- FreeItemCard.jsx
- SearchBar.jsx
- FilterSidebar.jsx
- Pagination.jsx
- RatingStars.jsx
- VerificationBadge.jsx
- AvailabilityBadge.jsx
- ProofTimeline.jsx
- BeforeAfterGallery.jsx
- ChecklistEditor.jsx
- CompletionReport.jsx
- NotificationDropdown.jsx
- ProtectedRoute.jsx

Use clear, consistent naming conventions.

---

# 18. DATABASE MODELS

Create appropriate Mongoose schemas and relationships.

Initial models should include:

1. User
2. Job
3. Application
4. Service
5. Quote
6. Product
7. FreeItem
8. Conversation
9. Message
10. Notification
11. Review
12. Verification
13. Transaction
14. ProofRecord
15. Checklist
16. Report
17. AuditLog

You may simplify or combine models when the data relationships justify it, but document the decisions.

Common fields should include appropriate timestamps and status values.

Add indexes for frequently searched fields and common lookup patterns.

Use references for relationships that require independent updates and access control.

Use schema validation, database constraints where practical, and backend validation together.

For ProofBox, preserve important history and approvals rather than allowing completed proof records to be silently overwritten.

---

# 19. SMART MATCHING ALGORITHM

Implement a simple, explainable matching algorithm instead of unnecessary AI or machine learning.

Example scoring model:

- Category and skill match: 35%
- Availability match: 25%
- Location compatibility: 20%
- Experience relevance: 10%
- Review rating: 10%

Normalize inputs before calculating the score. Handle missing data safely and explain the score in the interface.

Do not claim that the score guarantees the best applicant. Label it as a relevance or compatibility estimate.

If accurate location coordinates are not available, use selected area or locality matching rather than inventing distance calculations.

Make the weights configurable in a single utility or configuration file.

---

# 20. DASHBOARDS

## User dashboard

Design a polished dashboard with:
- Welcome message
- Profile completion
- Verification status
- Active job posts
- Applications
- Services listed
- Saved items
- Unread messages
- Recent activity
- ProofBox records
- Quick actions

Use meaningful statistics, not random decorative numbers.

## Job poster dashboard

Include:
- Posted jobs
- Received applications
- Accepted applicants
- Jobs in progress
- Pending completion approvals
- Completed jobs
- Disputes, if any

## Service provider dashboard

Include:
- Active services
- Quote requests
- Incoming work requests
- Availability
- Completed jobs
- Reviews
- ProofBox activity

## Admin dashboard

Include:
- Total registered users
- Active listings
- Pending verification reviews
- Reported listings
- Open disputes
- Completed jobs
- Recent administrative activity

Every dashboard metric must be connected to real backend data or clearly marked as sample/demo data.

Admin actions must be protected by backend authorization.

---

# 21. FUNCTIONALITY REQUIREMENTS

Every visible interactive element must work.

Do not leave:
- Dead buttons
- Fake search bars
- Nonfunctional filters
- Decorative dropdowns that do nothing
- Forms that never submit
- Links pointing to `#`
- Save buttons without persistence
- Cards that appear clickable but are not
- Fake successful authentication
- Fake upload success
- Fake verification approval

For features not yet implemented, either build the feature or clearly label it as coming soon. Never pretend an unimplemented action succeeded.

Required behavior:
- Navigation opens the correct route.
- Search returns relevant results.
- Filters affect the displayed data.
- Forms validate input.
- Errors appear clearly.
- Loading states are visible.
- Empty states provide useful next steps.
- Users can edit their own permitted content.
- Users cannot modify other users' records.
- Admin routes enforce authorization.
- Listing states persist after refresh.
- Images load with fallbacks.
- Mobile menus work.
- Modals close correctly and support keyboard interaction.
- Notifications reflect actual application events.

Use real API calls through organized service modules.

Do not scatter raw fetch calls throughout every component.

---

# 22. RESPONSIVENESS AND ACCESSIBILITY

Design for:
- Small mobile screens
- Larger smartphones
- Tablets
- Laptops
- Large desktop monitors

Test at common viewport widths, including approximately 375px, 768px, 1024px, and 1440px.

Requirements:
- No horizontal overflow.
- Accessible form labels.
- Visible keyboard focus.
- Correct semantic HTML.
- Accessible modal behavior.
- Appropriate contrast.
- Alt text for meaningful images.
- Reduced-motion support.
- Buttons with clear labels.
- Responsive tables or mobile-friendly alternatives.
- Touch-friendly controls.

Desktop dashboards may use sidebars and multi-column layouts; mobile dashboards should collapse into simple, usable navigation.

---

# 23. TESTING AND QUALITY CONTROL

After implementing each major module:

1. Run the frontend development/build command.
2. Run the backend.
3. Check for compilation and runtime errors.
4. Test the relevant API endpoints.
5. Test protected routes.
6. Verify database persistence.
7. Test form validation.
8. Check responsive layouts.
9. Fix console errors and warnings.
10. Confirm the main user workflow works end to end.

Test at least:
- Registration and login
- Job creation and application
- Service listing and quote request
- Product listing and reservation
- Free-item listing and collection status
- Verification submission and review
- ProofBox evidence upload and completion approval
- Review eligibility
- Report submission
- Unauthorized access attempts

Add appropriate tests for important business rules.

Do not mark a feature complete just because the page renders.

---

# 24. SEED DATA AND DEMONSTRATION

Create realistic development seed data for Bangladesh.

Use example locations such as:
- Dhaka
- Chattogram
- Sylhet
- Rajshahi
- Khulna
- Cumilla
- Gazipur

Create realistic sample jobs, service listings, products, free items, users, applications, and ProofBox records.

Clearly distinguish seed data from real user content.

Provide a safe development-only way to seed the database.

If demo accounts are created, document their credentials in the development setup instructions only. Never hardcode demo credentials as production authentication bypasses.

Do not create fake real-world verification claims or present sample data as actual user transactions.

---

# 25. IMPLEMENTATION ROADMAP

Work in the following order.

## Phase 1 — Foundation
- Inspect the workspace.
- Set up the frontend and backend.
- Install compatible dependencies.
- Configure Tailwind CSS.
- Create the design system.
- Build the navbar, footer, layouts, buttons, cards, inputs, and reusable UI.
- Create centralized routing in `App.jsx`.
- Build the homepage and public browsing pages.

## Phase 2 — Authentication
- User model.
- Registration and login APIs.
- Password hashing.
- Authentication middleware.
- Role-based route protection.
- Profile editing.

## Phase 3 — Core marketplace
- Jobs and applications.
- Service listings and quotes.
- Buy/sell listings.
- Free-item listings.
- Search and filtering.
- Saved posts.

## Phase 4 — Trust features
- Verification workflow.
- Reviews.
- Availability.
- Basic reliability indicators.
- Reporting and moderation.

## Phase 5 — ProofBox
- Proof records.
- Before-and-after media.
- Checklist editor.
- Job progress timeline.
- Client approval and correction requests.
- Completion report.
- PDF export.

## Phase 6 — Advanced workflows
- Messaging.
- Notifications.
- Repeat hire.
- Recurring jobs.
- Smart matching.
- Dispute management.
- Admin analytics.

## Phase 7 — Final quality
- Security review.
- Testing.
- Accessibility.
- Responsive polish.
- Deployment configuration.
- Documentation.

If time or context limits prevent completing every phase immediately, finish the current phase cleanly, document what remains, and continue from the next phase. Never replace missing functionality with fake buttons or mock success messages.

---

# 26. ENVIRONMENT VARIABLES AND CONFIGURATION

Create `.env.example` files for both frontend and backend.

Possible backend variables:

- `PORT`
- `NODE_ENV`
- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- Email service credentials where configured

Frontend variables should use the Vite environment variable prefix and must never contain private secrets.

Do not commit real `.env` files or credentials.

Validate required environment variables during startup and show clear configuration errors.

---

# 27. DOCUMENTATION

Create a professional README containing:
- Project overview
- Problem statement
- Main features
- Technology stack
- Folder structure
- Installation steps
- Environment setup
- Database setup
- Seed data instructions
- Development commands
- Build instructions
- API overview
- Deployment guide
- Security notes
- Current limitations
- Future enhancements

Create separate documentation for architecture, database relationships, API routes, and feature implementation where useful.

---

# 28. FINAL ACCEPTANCE CRITERIA

The project is not complete until the following are true:

- The frontend and backend start successfully.
- The application uses React, Tailwind CSS, Node.js, Express, and MongoDB.
- `App.jsx` centrally defines the main React routes.
- Pages and reusable components are organized into separate folders.
- The homepage has a polished, modern, responsive design.
- Motion and 3D effects are tasteful and performance-conscious.
- Core marketplace features are connected to backend APIs.
- Authentication and authorization work.
- Listings can be created, viewed, updated, and managed.
- Search and filters function.
- ProofBox supports the actual evidence workflow.
- Verification and moderation are represented honestly.
- Important user actions persist in the database.
- Unauthorized actions are rejected by the backend.
- Forms, loading states, errors, and empty states are implemented.
- The project includes realistic seed data.
- No critical console errors remain.
- Setup and usage instructions are documented.
- Features that are incomplete are explicitly identified.

## FINAL INSTRUCTION

Begin by inspecting the current workspace and reporting the existing project structure briefly.

Then establish the project architecture and design system before implementing the pages.

Build SERVA as a cohesive product rather than isolated screens. Prioritize visual consistency, clean code, reusable components, real functionality, secure workflows, and a premium user experience.

Make thoughtful design decisions without asking unnecessary questions. If a feature requires credentials or external service approval, implement a secure integration boundary and a clearly labeled development/demo mode rather than pretending the external service is connected.

Start now and proceed phase by phase, keeping the project runnable throughout development.

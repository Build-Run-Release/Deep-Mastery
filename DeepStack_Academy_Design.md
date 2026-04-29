# DeepStack Academy - Software Engineering Design Document

## 1. System Architecture & Structure

Following Software Engineering principles (Separation of Concerns, Modularity, Scalability), the system will be divided into clear tiers.

### Frontend (Client-Side)
*   **Architecture:** Single Page Application (SPA) or Server-Side Rendered (SSR) for better SEO (crucial for an educational platform).
*   **Tech Stack Options:** Next.js (React) or Nuxt.js (Vue) are excellent for SEO, performance, and structure.
*   **Key Modules:**
    *   **Landing Page/Marketing:** Course catalog, testimonials, pricing.
    *   **Student Dashboard:** Progress tracking, active courses, certificates.
    *   **Learning Management System (LMS) Player:** Video player, interactive code editor (e.g., using Monaco Editor for browser-based coding), text-based tutorials, quizzes.
    *   **Admin Dashboard:** Content management, user management, analytics.

### Backend (Server-Side)
*   **Architecture:** Monolithic or modular monolith initially to keep things simple and cost-effective, with the ability to transition to microservices later if needed.
*   **Tech Stack Options:** Node.js (Express or NestJS), Python (Django or FastAPI), or Go. Node.js is often preferred if teaching full-stack JavaScript.
*   **Key Modules:**
    *   **Authentication & Authorization:** JWT-based or Session-based (e.g., OAuth, Email/Password).
    *   **Course Management API:** CRUD operations for courses, modules, lessons.
    *   **User Progress API:** Tracking completions, quiz scores.
    *   **Payment Gateway Integration:** Handling subscriptions/one-time purchases.
    *   **Code Execution Engine (Optional):** If offering interactive backend coding, a secure sandboxed environment (e.g., Docker containers or isolated serverless functions) is required.

---

## 2. Monetization Strategy (Nigerian Market First)

To succeed in the Nigerian market before expanding internationally, the pricing and payment models must be tailored to local economic realities and payment habits.

### Payment Gateways
*   **Primary:** Paystack or Flutterwave. These are the most reliable gateways in Nigeria, supporting local cards (Verve, Naira Mastercards/Visas), USSD, and Bank Transfers.
*   **Fallback:** Monnify (great for virtual accounts/direct bank transfers).

### Pricing Models
1.  **Tiered Subscription (Naira based):**
    *   *Basic:* Access to text-based content and basic videos (e.g., ₦2,000 - ₦5,000/month).
    *   *Pro:* Access to interactive labs, mentor Q&A, code reviews, and certificates (e.g., ₦10,000 - ₦20,000/month).
2.  **One-Time Course Purchases:** Pay per course (e.g., "Fullstack React Course" for ₦15,000). Many Nigerian users prefer one-time payments over recurring subscriptions due to irregular income streams.
3.  **Income Share Agreements (ISA) / Deferred Payment:** Partner with financial institutions or use internal contracts where students learn for free (or a minimal commitment fee) and pay a percentage of their salary once they land a tech job.
4.  **Freemium Model:** Offer the foundational courses (HTML, basic CSS) completely free to build trust and a user base, then upsell the advanced courses (React, Node.js, System Design).

---

## 3. Database Arrangement (Bootstrapping / Zero-Capital Phase)

When starting with zero or minimal capital, you need to rely on generous free tiers and local development strategies before scaling to paid managed services.

### Development & Initial Launch Phase (Zero Cost)

1.  **Relational Database (PostgreSQL/MySQL):**
    *   **Why:** Best for structured data like users, courses, transactions, and progress.
    *   **Zero-Cost Hosting:**
        *   **Supabase:** Offers a very generous free tier for PostgreSQL, plus free authentication and file storage.
        *   **Neon:** Free serverless Postgres.
        *   **PlanetScale:** (If using MySQL) Offers a free tier suitable for early-stage apps.
        *   **Render / Railway:** Both offer free tiers or trial credits that can host a small database instance.

2.  **Document/NoSQL Database (MongoDB):**
    *   **Why:** Useful if course content is highly unstructured or heavily document-based.
    *   **Zero-Cost Hosting:**
        *   **MongoDB Atlas:** The shared "M0" cluster is free forever (512MB storage), which is plenty for early users, course text, and metadata.

3.  **File/Video Storage:**
    *   **Videos:** Do *not* host videos on your database or a standard server. Use YouTube (Unlisted videos) for a completely free option embedded in your site.
    *   **Images/Assets:** Cloudinary (generous free tier) or Supabase Storage.

### Data Schema Design (Keep it Lean)
To maximize free-tier limits, keep the schema normalized:
*   `Users` (id, name, email, role, created_at)
*   `Courses` (id, title, description, price, is_published)
*   `Lessons` (id, course_id, title, content_url, sequence_order)
*   `Enrollments` (id, user_id, course_id, status, payment_reference)
*   `Progress` (id, user_id, lesson_id, is_completed)

### Transition Strategy (Once Capital is Secured)
As the user base grows and revenue comes in (from early subscriptions):
1.  **Migrate from Free Tiers:** Move from Supabase Free/MongoDB Atlas M0 to paid, dedicated instances on AWS (RDS) or DigitalOcean Managed Databases for better performance and backups.
2.  **Migrate Videos:** Move videos from Unlisted YouTube to AWS S3 + CloudFront, or specialized video hosting like Mux or Vimeo for better security (preventing downloads) and custom player branding.

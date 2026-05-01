# DeepStack Academy

An exquisite, gamified web development learning platform, deeply integrated from frontend to backend. It features authentic course content, interactive IDE execution, user progression (XP/Leveling), and a mock Paystack integration for a secure paywall.

## Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (or an equivalent database supported by Prisma)

## Setup Instructions

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root of your project and configure the following variables:
   ```env
   # Database connection string (PostgreSQL example)
   DATABASE_URL="postgresql://user:password@localhost:5432/deepstack_db?schema=public"

   # Secret for signing JWTs
   JWT_SECRET="super-secret-key-for-deepstack-dev"

   # Paystack secret key (for monetization)
   PAYSTACK_SECRET_KEY="sk_test_your_paystack_secret_key"
   ```

3. **Database Migration:**
   Push the schema to your database to create the `User`, `Subscription`, and `Progress` tables.
   ```bash
   npx prisma db push
   # or npx prisma migrate dev --name init
   ```

4. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```

6. **Access the Application:**
   Open [http://localhost:3000](http://localhost:3000) with your browser.

## Features & Highlights
- **Interactive MDX Modules:** Courses are rendered natively via `next-mdx-remote` with embedded `<CodeEditor />` instances utilizing `@monaco-editor/react`.
- **Backend Authentication:** Fully custom JWT authentication via `HttpOnly` cookies.
- **Gamification:** Users earn XP and level up for completing modules. This state is synchronized securely with a PostgreSQL database via Prisma ORM.
- **Monetization:** Paywall integration for premium modules with `paystack` API integration verification.
- **Exquisite UI:** Built using `framer-motion` for fluid split-screen transitions, glassmorphism aesthetics, and `Tailwind CSS`.

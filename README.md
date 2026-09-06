# LumenStore - Next.js 15 E-Commerce Storefront

A modern, high-performance consumer-facing e-commerce storefront built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **shadcn/ui**, and **Zustand**, engineered to interface directly with a Bun.js + Prisma backend.

## Key Features

- ⚡ **Sub-Second Page Delivery**: Server-rendered product catalog leveraging Next.js Incremental Static Regeneration (`revalidate: 300`).
- 🛒 **Persistent Zustand Cart**: Zero-hydration-mismatch shopping bag stored in `localStorage` with real-time stock cap enforcement.
- 🔒 **Security & HttpOnly Sessions**: Cookie-based authentication (`customer_session_token`) via Server Actions with automatic `Bearer` header token propagation.
- 🛡️ **Edge Middleware Protection**: Guards routes like `/checkout` and `/account`, redirecting unauthenticated users to `/login?callbackUrl=...`.
- 💳 **Atomic Checkout Integration**: Complete checkout UI with shipping and payment forms proxying atomic orders to `POST /api/v1/orders/checkout`.
- 🎨 **Modern Aesthetics**: Built with shadcn/ui primitives, responsive layout, glassmorphic header, drawer cart sheet, and accessible components.

## Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Runtime**: React 19
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Validation**: [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/OmarIhsan/e_commerce_frontend_next.git
cd e_commerce_frontend_next
npm install
```

### 2. Environment Variables

Create `.env.local` based on `.env.example`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
API_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```

# FinTrack — Frontend Client

Modern, responsive personal finance tracking frontend built with **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS v4**.

---

## 🚀 Features

- **App Router Architecture**: Next.js 16 directory layout with server and client components.
- **Glassmorphic UI**: Dark theme aesthetic with neon violet & emerald accents.
- **Unified Auth Toggle**: Sleek sliding toggle between Login and Sign Up with violet gradient animations.
- **Dynamic Dashboard**: Summary stat cards (Balance, Income, Expenses, Savings Rate), Chart.js visual breakdowns, and recent transactions.
- **Transactions Management**: Filter by category, type (Income / Expense), search queries, date selection, and paginated records.
- **Budgeting**: Monthly category budget goals with real-time percentage progress bars and over-budget warnings.
- **Financial Reports**: Monthly trend charts, category distributions, and instant CSV export.
- **Responsive Navigation**: Desktop sidebar and mobile hamburger navigation drawer.
- **Multi-Currency Ready**: Dynamic formatting for USD ($), EUR (€), GBP (£), INR (₹), JPY (¥), CAD ($), AUD ($).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://react-chartjs-2.js.org/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **Date Formatting**: [date-fns](https://date-fns.org/)

---

## 📁 Directory Structure

```
client/
├── app/
│   ├── globals.css              # Global styles & Tailwind CSS theme
│   ├── layout.jsx               # Root HTML layout with AuthProvider & Toaster
│   ├── page.jsx                 # Public landing page (Hero, Features, Previews)
│   ├── login/
│   │   └── page.jsx             # Auth portal with Login / Signup toggle
│   ├── blog/
│   │   └── page.jsx             # Insights, articles & newsletter placeholders
│   └── dashboard/
│       ├── layout.jsx           # Protected dashboard layout with Sidebar & Header
│       ├── page.jsx             # Main dashboard (Stats, Charts, Quick Actions)
│       ├── transactions/
│       │   └── page.jsx         # Transactions list, search, filters & modals
│       ├── budgets/
│       │   └── page.jsx         # Monthly category budgets & progress tracking
│       ├── reports/
│       │   └── page.jsx         # Analytics charts, summaries & CSV export
│       └── settings/
│           └── page.jsx         # Currency preferences & profile management
├── context/
│   └── AuthContext.jsx          # User authentication state & token handling
├── services/
│   ├── api.js                   # Axios client with bearer token interceptor
│   ├── authService.js           # Login, Register, Profile API helpers
│   └── dataService.js           # Transactions, Categories, Budgets, Reports APIs
└── utils/
    └── formatCurrency.js        # Dynamic multi-currency formatting
```

---

## ⚙️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env.local` if you need custom API URLs:
```bash
cp .env.example .env.local
```
*(By default, Next.js rewrites `/api/*` requests to `http://localhost:5000/api/*` configured in `next.config.mjs`)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build
```bash
npm run build
npm run start
```

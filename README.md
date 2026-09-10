# 💰 FinTrack — Smart Personal Finance & Expense Tracker

A modern, full-stack personal finance and expense tracking web application engineered with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **Node.js (ES6 Express)**, and **PostgreSQL with Prisma ORM**.

FinTrack empowers users to effortlessly monitor daily income and expenses, set monthly category budgets, explore visual financial breakdowns with interactive charts, and export data for offline analysis.

---

## ✨ Features

- 🎨 **Dark Glassmorphic UI**: Sleek dark aesthetic with glowing violet and emerald accents, responsive across mobile, tablet, and desktop screens.
- 🔐 **Dual Auth Portal**: Beautiful sliding white & violet toggle between Login and Sign Up with smooth interactive transitions.
- 📊 **Dynamic Dashboard**: Real-time overview of Total Balance, Monthly Income, Total Expenses, and Savings Rate.
- 💸 **Full Transaction Management**:
  - Filter transactions by category, transaction type (*Income* vs. *Expense*), and date ranges.
  - Search transactions instantly by description or keyword.
  - Pagination controls for handling high transaction volumes.
  - Quick modal for logging income and expenses.
- 🎯 **Monthly Category Budgeting**:
  - Define custom monthly spending thresholds per category.
  - Visual progress indicators with contextual alerts (normal, >80% warning, >100% exceeded).
- 📈 **Visual Reports & Analytics**:
  - Monthly cash flow trends (Income vs. Expenses over time).
  - Category-based expense distribution donut charts.
  - Summary cards displaying monthly net cash flow and high-spending categories.
- 📥 **CSV Data Export**: One-click transaction history export to `.csv` for spreadsheets, tax records, or accounting software.
- 🏷️ **Custom Category Support**: Easily add custom categories with personalized emoji icons and hex color codes.
- 💱 **Multi-Currency Support**: Switch between USD ($), EUR (€), GBP (£), INR (₹), JPY (¥), CAD ($), and AUD ($) with instant formatted values.
- 🌐 **Public Landing & Blog Previews**: Clean landing page highlighting core capabilities, with feature preview sections and newsletter subscription placeholders.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Data Visualization** | [Chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://react-chartjs-2.js.org/) |
| **Backend Runtime** | [Node.js](https://nodejs.org/) (ES6 Modules) |
| **API Framework** | [Express.js](https://expressjs.com/) |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/) & [Prisma ORM 5](https://www.prisma.io/) |
| **Authentication** | JSON Web Tokens ([jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)) & [bcryptjs](https://github.com/dcodeIO/bcrypt.js) |
| **HTTP Client** | [Axios](https://axios-http.com/) |
| **Notifications** | [React Hot Toast](https://react-hot-toast.com/) |

---

## 📁 Repository Structure

```
FinTrack/
├── client/                      # Next.js Frontend Client
│   ├── app/                     # App Router pages & layouts
│   │   ├── globals.css          # Tailwind CSS global styling
│   │   ├── layout.jsx           # Root layout with AuthProvider & Toaster
│   │   ├── page.jsx             # Public landing page
│   │   ├── login/page.jsx       # Auth page (Login / Signup slider toggle)
│   │   ├── blog/page.jsx        # Blog & insights previews
│   │   └── dashboard/
│   │       ├── layout.jsx       # Dashboard shell with responsive sidebar & navbar
│   │       ├── page.jsx         # Overview dashboard with stats and charts
│   │       ├── transactions/    # Transactions list, search, filters & modals
│   │       ├── budgets/         # Monthly category budget goals & tracking
│   │       ├── reports/         # Analytics graphs & CSV export
│   │       └── settings/        # Currency picker & account preferences
│   ├── context/
│   │   └── AuthContext.jsx      # Global authentication state
│   ├── services/
│   │   ├── api.js               # Axios instance with auth interceptor
│   │   ├── authService.js       # Auth API methods
│   │   └── dataService.js       # Transactions, Budgets, Reports API methods
│   ├── utils/
│   │   └── formatCurrency.js    # Multi-currency formatter
│   ├── next.config.mjs          # Next.js config with API proxy rewrites
│   └── package.json
│
├── server/                      # Express REST API Backend
│   ├── controllers/             # Business logic & request handlers
│   │   ├── authController.js    # Register, login, profile, currency update
│   │   ├── transactionController.js # CRUD for transactions + pagination
│   │   ├── categoryController.js    # Categories CRUD + user defaults
│   │   ├── budgetController.js      # Monthly category budget limits
│   │   └── reportController.js      # Aggregations, summaries & trends
│   ├── middleware/
│   │   ├── auth.js              # JWT verification middleware
│   │   └── errorHandler.js      # Centralized error handler
│   ├── prisma/
│   │   ├── schema.prisma        # Prisma database schema definition
│   │   └── migrations/          # PostgreSQL schema migration history
│   ├── routes/                  # Express route definitions
│   ├── server.js                # Server entry point (ES6 Module)
│   └── package.json
│
├── .gitignore                   # Root gitignore protecting secrets & build files
└── README.md                    # Project documentation
```

---

## 🚀 Getting Started

Follow these steps to set up and run FinTrack locally on your machine.

### Prerequisites
- **Node.js**: v18.x or higher installed
- **npm**: v9.x or higher
- **PostgreSQL**: Local PostgreSQL service OR Docker installed

---

### Step 1: Database Setup

#### Option A: Run PostgreSQL via Docker (Recommended)
You can launch a PostgreSQL container with a single command:

```bash
docker run --name fintrack-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=expense_tracker \
  -p 5432:5432 \
  -d postgres:15-alpine
```

#### Option B: Local PostgreSQL Service
Create a database named `expense_tracker` in your local PostgreSQL instance:
```sql
CREATE DATABASE expense_tracker;
```

---

### Step 2: Backend Setup (`server`)

1. **Navigate to the server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and verify your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/expense_tracker?schema=public"
   JWT_SECRET=your_jwt_secret_key_here
   CLIENT_URL=http://localhost:3000
   ```

4. **Run Prisma Migrations & Generate Client**:
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start the API Server**:
   ```bash
   npm run dev
   ```
   The backend API will start at: `http://localhost:5000`  
   Health check endpoint: `http://localhost:5000/api/health`

---

### Step 3: Frontend Setup (`client`)

1. **Open a new terminal and navigate to the client directory**:
   ```bash
   cd client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**:
   ```bash
   cp .env.example .env.local
   ```
   *(By default, Next.js rewrites all `/api/*` requests directly to `http://localhost:5000/api/*` via `next.config.mjs`)*

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and visit: [http://localhost:3000](http://localhost:3000)

---

## 📡 API Reference

All protected endpoints require an `Authorization: Bearer <token>` header.

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Protected |
|---|---|---|:---:|
| `POST` | `/api/auth/register` | Register new user account & seed default categories | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | No |
| `GET` | `/api/auth/me` | Retrieve authenticated user profile | Yes |
| `PUT` | `/api/auth/currency` | Update user preferred currency code | Yes |

### Transactions (`/api/transactions`)
| Method | Endpoint | Description | Protected |
|---|---|---|:---:|
| `GET` | `/api/transactions` | List transactions (supports `page`, `limit`, `type`, `categoryId`, `search`, `startDate`, `endDate`) | Yes |
| `POST` | `/api/transactions` | Create a new transaction | Yes |
| `DELETE` | `/api/transactions/:id` | Delete an existing transaction | Yes |

### Categories (`/api/categories`)
| Method | Endpoint | Description | Protected |
|---|---|---|:---:|
| `GET` | `/api/categories` | Retrieve all categories for the authenticated user | Yes |
| `POST` | `/api/categories` | Create a new custom category | Yes |
| `DELETE` | `/api/categories/:id` | Delete a category | Yes |

### Monthly Budgets (`/api/budgets`)
| Method | Endpoint | Description | Protected |
|---|---|---|:---:|
| `GET` | `/api/budgets?month=X&year=Y` | Get budgets with actual spending & alert status | Yes |
| `POST` | `/api/budgets` | Set or update (upsert) monthly category budget limit | Yes |
| `DELETE` | `/api/budgets/:id` | Remove a budget goal | Yes |

### Analytics & Reports (`/api/reports`)
| Method | Endpoint | Description | Protected |
|---|---|---|:---:|
| `GET` | `/api/reports/summary` | Overall financial totals, savings rate, and recent activity | Yes |
| `GET` | `/api/reports/category-breakdown`| Aggregated spending distribution by category | Yes |
| `GET` | `/api/reports/monthly-trends` | 6-month historical income vs. expense comparison | Yes |

### System Health
| Method | Endpoint | Description | Protected |
|---|---|---|:---:|
| `GET` | `/api/health` | Service liveness and API status check | No |

---

## 📦 Building for Production

### Build Frontend
```bash
cd client
npm run build
npm run start
```

### Run Backend in Production Mode
```bash
cd server
npm run start
```

---

## 🛡️ Security Best Practices

- Real credentials, database passwords, and JWT secret tokens are stored exclusively in `.env` files and strictly excluded from version control via `.gitignore`.
- Password hashes are stored using salted `bcryptjs` encryption.
- All database queries are parameterized and sanitized through Prisma ORM to guard against SQL injection.
- Strict CORS protection restricts unauthorized cross-origin requests.

---

## 📄 License

This project is open-source under the [ISC License](LICENSE).

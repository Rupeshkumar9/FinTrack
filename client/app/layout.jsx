import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: {
    default: 'FinTrack — Smart Personal Finance & Expense Tracker',
    template: '%s | FinTrack',
  },
  description: 'Take full control of your money with FinTrack. Beautiful dark glassmorphic expense tracking, visual budget planning, multi-currency support, and financial analytics.',
  keywords: [
    'expense tracker',
    'budget planner',
    'personal finance',
    'money management',
    'financial freedom',
    'savings rate',
    'income expense tracker',
  ],
  authors: [{ name: 'FinTrack Team' }],
  creator: 'FinTrack',
  openGraph: {
    title: 'FinTrack — Smart Personal Finance & Expense Tracker',
    description: 'Track expenses, create monthly budgets, and analyze spending habits with elegance.',
    siteName: 'FinTrack',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinTrack — Smart Personal Finance & Expense Tracker',
    description: 'Track expenses, create monthly budgets, and analyze spending habits with elegance.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0f0f1a',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased selection:bg-indigo-500 selection:text-white">
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a1a2e',
                color: '#e8e8f0',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(12px)',
                borderRadius: '12px',
                fontSize: '14px',
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}


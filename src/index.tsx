import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import ErrorBoundary from '@/shared/components/error-boundary/ErrorBoundary';
import { shouldRetry } from '@/shared/api/api';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: shouldRetry } } });

// Replaces the whole tree, router included, so it uses a plain <a>: a full reload is the recovery.
const crashFallback = (
  <div
    role="alert"
    className="flex flex-col items-center gap-8 px-4 py-16 text-center font-clash leading-[1.2] lg:py-24"
  >
    <div className="flex max-w-md flex-col gap-3">
      <h1 className="text-2xl font-semibold text-ink-800 lg:text-[28px]">Something went wrong</h1>
      <p className="text-base text-ink-500 lg:text-lg">An unexpected error stopped this page from loading.</p>
    </div>
    <a href="/" className="btn-primary px-8 text-lg">
      Back to homepage
    </a>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary fallback={crashFallback}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);

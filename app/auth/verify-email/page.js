'use client';

import dynamic from 'next/dynamic';

// Use dynamic import to avoid server-side rendering entirely
// This will prevent Next.js from trying to use useSearchParams during build time
const VerifyEmailClient = dynamic(
  () => import('./verify-email-client'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading verification page...</div>
      </div>
    )
  }
);

export default function VerifyEmailPage() {
  return <VerifyEmailClient />;
}

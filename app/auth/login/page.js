'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Use dynamic import with no SSR to completely avoid Next.js warnings about useSearchParams
// This ensures the component is only loaded client-side
const LoginContent = dynamic(
  () => import('./login-client'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading login page...</div>
      </div>
    )
  }
);

export default function LoginPage() {
  return <LoginContent />;
}

'use client';

import dynamic from 'next/dynamic';

// Use dynamic import with no SSR to completely avoid Next.js warnings about useSearchParams
// This ensures the component is only loaded client-side
const RegisterContent = dynamic(
  () => import('./register-client'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading registration page...</div>
      </div>
    )
  }
);

export default function RegisterPage() {
  return <RegisterContent />;
}

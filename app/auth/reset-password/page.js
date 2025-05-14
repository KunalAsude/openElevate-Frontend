'use client';

import dynamic from 'next/dynamic';

// Use dynamic import with no SSR to completely avoid Next.js warnings about useSearchParams
// This ensures the component is only loaded client-side
const ResetPasswordContent = dynamic(
  () => import('./reset-password-client'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading password reset page...</div>
      </div>
    )
  }
);

export default function ResetPasswordPage() {
  return <ResetPasswordContent />;
}

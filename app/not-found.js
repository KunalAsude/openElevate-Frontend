'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Use dynamic import to ensure client-side rendering
const NotFoundClient = dynamic(() => import('./NotFoundClient'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Loading...</div>
});

export default function NotFoundWrapper() {
  return <NotFoundClient />;
}
import { Suspense } from 'react';
import NotFoundPage from './NotFoundPage';

export default function NotFoundWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundPage />
    </Suspense>
  );
}
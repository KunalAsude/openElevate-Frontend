import { Suspense } from 'react';
import NotFoundClient from './NotFoundPage';

export default function NotFoundWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundClient />
    </Suspense>
  );
}
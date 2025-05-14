import { Suspense } from 'react';
import NotFoundClient from './NotFoundClient';


export default function NotFoundWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundClient/>
    </Suspense>
  );
}
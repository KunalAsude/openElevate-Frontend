import { Suspense } from "react";
import NotFoundClient from "./NotFoundClient";

export default function NotFoundPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <NotFoundClient />
    </Suspense>
  );
}

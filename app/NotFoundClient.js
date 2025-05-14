'use client'

import { Suspense } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

function NotFoundContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto animate-fadeIn">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="mt-6 text-2xl font-semibold">Page Not Found</h2>
        <p className="mt-4 text-muted-foreground">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/">Return Home</Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>

        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

export default function NotFoundClient() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}

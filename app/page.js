'use client';

import { Suspense } from 'react';
import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { ProjectsSection } from "@/components/home/projects-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { StatsSection } from "@/components/home/stats-section";
import { CtaSection } from "@/components/home/cta-section";
import { PartnersSection } from "@/components/home/partners-section";

function HomeContent() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <ProjectsSection />
      <TestimonialsSection />
      <PartnersSection />
      <CtaSection />
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading homepage...</div>}>
      <HomeContent />
    </Suspense>
  );
}

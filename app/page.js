import { HeroSection } from "@/components/home/hero-section"
import { FeaturesSection } from "@/components/home/features-section"
import { ProjectsSection } from "@/components/home/projects-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { StatsSection } from "@/components/home/stats-section"
import { CtaSection } from "@/components/home/cta-section"
import { PartnersSection } from "@/components/home/partners-section"


export default function Home() {
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
  )
}

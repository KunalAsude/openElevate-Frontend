import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-[800px] text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Ready to Elevate Your Open Source Journey?
          </h2>
          <p className="mb-8 text-xl text-primary-foreground/80">
            Join thousands of developers who are contributing to open source projects and growing their skills.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/register">
                Join Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/20 text-primary-foreground"
              asChild
            >
              <Link href="/projects">Explore Projects</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

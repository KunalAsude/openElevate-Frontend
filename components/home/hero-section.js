import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code, GitPullRequest, Users } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-16 md:py-20 lg:py-24">
      {/* Light, subtle grid background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Main content container with proper max-width */}
      <div className="relative z-10 mx-auto max-w-8xl px-4">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm">
                <span className="mr-2 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                  New
                </span>
                <span className="text-muted-foreground">AI-powered project recommendations</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Elevate Your Open Source Journey
              </h1>
              <p className="max-w-[600px] text-xl text-muted-foreground">
                Connect with projects that match your skills, contribute meaningfully, and grow your developer profile
                in a supportive community.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/projects">
                  Explore Projects <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/register">Join Community</Link>
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4 border-t pt-8">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">2,500+</span>
                </div>
                <p className="text-sm text-muted-foreground">Open Source Projects</p>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <GitPullRequest className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">15,000+</span>
                </div>
                <p className="text-sm text-muted-foreground">Contributions Made</p>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">8,000+</span>
                </div>
                <p className="text-sm text-muted-foreground">Active Developers</p>
              </div>
            </div>
          </div>
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative h-[400px] w-full max-w-[500px] overflow-hidden rounded-lg border bg-gradient-to-br from-background to-muted shadow-xl">
              <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid w-full max-w-[400px] gap-4 p-6">
                  <div className="h-12 rounded-md bg-primary/10 shadow-sm"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-32 rounded-md bg-secondary/20 shadow-sm"></div>
                    <div className="h-32 rounded-md bg-secondary/20 shadow-sm"></div>
                  </div>
                  <div className="h-12 rounded-md bg-primary/10 shadow-sm"></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 rounded-md bg-secondary/20 shadow-sm"></div>
                    <div className="h-24 rounded-md bg-secondary/20 shadow-sm"></div>
                    <div className="h-24 rounded-md bg-secondary/20 shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-lg bg-primary/20 backdrop-blur-xl"></div>
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-lg bg-secondary/20 backdrop-blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code, GitPullRequest, Users } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-12 sm:py-16 md:py-20 lg:py-24">
      {/* Light, subtle grid background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      {/* Main content container with proper max-width */}
      <div className="relative z-10 mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:gap-10 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left content column - text and buttons */}
          <div className="flex flex-col justify-center space-y-4 sm:space-y-6">
            <div className="space-y-4 sm:space-y-6">
              {/* "New" badge - Made responsive */}
              <div className="inline-flex items-center rounded-full border bg-background px-2 sm:px-3 py-1 text-xs sm:text-sm">
                <span className="mr-1 sm:mr-2 rounded-full bg-primary px-1.5 sm:px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                  New
                </span>
                <span className="text-muted-foreground text-xs sm:text-sm">AI-powered recommendations</span>
              </div>

              {/* Heading - Responsive typography */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Elevate Your Open Source Journey
              </h1>

              {/* Description - Responsive width and sizing */}
              <p className="text-lg sm:text-xl text-muted-foreground">
                Connect with projects that match your skills, contribute meaningfully, and grow your developer profile
                in a supportive community.
              </p>
            </div>

            {/* CTA Buttons - Stack on mobile, side by side on larger screens */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/projects">
                  Explore Projects <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="/auth/register">Join Community</Link>
              </Button>
            </div>

            {/* Stats section - Adjust layout for different screen sizes */}
            <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 border-t pt-6 sm:pt-8">
              {/* Made each stat card more responsive */}
              {/* <div className="flex flex-row xs:flex-col items-center xs:items-start justify-between">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span className="text-xl sm:text-2xl font-bold">2,500+</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Open Source Projects</p>
              </div> */}

              {/* <div className="flex flex-row xs:flex-col items-center xs:items-start justify-between">
                <div className="flex items-center gap-2">
                  <GitPullRequest className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span className="text-xl sm:text-2xl font-bold">15,000+</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Contributions Made</p>
              </div> */}

              {/* <div className="flex flex-row xs:flex-col items-center xs:items-start justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span className="text-xl sm:text-2xl font-bold">8,000+</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Active Developers</p>
              </div> */}
            </div>
          </div>


          {/* Right column - Illustration/UI mockup with responsive sizing */}
          <div className="relative flex items-center justify-center mt-8 lg:mt-0 lg:justify-center">
            <div className="absolute -top-5 -right-0 z-20 h-20 w-20 sm:h-24 sm:w-24 rounded-lg bg-green-100/70 backdrop-blur-sm"></div>            <div className="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] w-full max-w-[500px] overflow-hidden rounded-lg border bg-gradient-to-br from-background to-muted/10 shadow-xl">
              <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>


              {/* Responsive grid layout for the illustration - aligned like in the image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid w-full max-w-[450px] gap-4 p-4 sm:p-6">
                  {/* Top green bar */}
                  <div className="h-10 sm:h-14 rounded-md bg-green-100/60 shadow-sm"></div>

                  {/* Two blue boxes in a row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-28 sm:h-36 rounded-md bg-blue-50 shadow-sm"></div>
                    <div className="h-28 sm:h-36 rounded-md bg-blue-50 shadow-sm"></div>
                  </div>

                  {/* Middle green bar */}
                  <div className="h-10 sm:h-14 rounded-md bg-green-100/60 shadow-sm"></div>

                  {/* Three blue boxes in a row */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-20 sm:h-28 rounded-md bg-blue-50 shadow-sm"></div>
                    <div className="h-20 sm:h-28 rounded-md bg-blue-50 shadow-sm"></div>
                    <div className="h-20 sm:h-28 rounded-md bg-blue-50 shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Green square in bottom left corner */}
            <div className="absolute -bottom-6 -left-0 z-20 h-20 w-20 sm:h-24 sm:w-24 rounded-lg bg-green-100/70 backdrop-blur-sm"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
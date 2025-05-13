import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Connect with Open Source Projects
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                OpenElevate helps developers find and contribute to open source projects that match their skills and
                interests.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/projects">Explore Projects</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/signup">Join Community</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[300px] w-full md:h-[400px] lg:h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 rounded-lg flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 p-8">
                  <div className="h-24 rounded-md bg-white dark:bg-slate-700 shadow-sm"></div>
                  <div className="h-24 rounded-md bg-white dark:bg-slate-700 shadow-sm"></div>
                  <div className="h-24 rounded-md bg-white dark:bg-slate-700 shadow-sm"></div>
                  <div className="h-24 rounded-md bg-white dark:bg-slate-700 shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

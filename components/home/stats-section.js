import { Code, GitPullRequest, Star, Users } from "lucide-react"

export function StatsSection() {
  return (
    <section className="border-t border-border">
      <div className="container py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center">
            <div className="flex items-center mb-1 sm:mb-0">
              <Code className="h-5 w-5 text-primary mr-2" />
              <span className="text-xl md:text-2xl font-bold">2,500+</span>
            </div>
            <p className="sm:ml-2 text-sm text-muted-foreground">Open Source Projects</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center">
            <div className="flex items-center mb-1 sm:mb-0">
              <GitPullRequest className="h-5 w-5 text-primary mr-2" />
              <span className="text-xl md:text-2xl font-bold">15,000+</span>
            </div>
            <p className="sm:ml-2 text-sm text-muted-foreground">Contributions Made</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center">
            <div className="flex items-center mb-1 sm:mb-0">
              <Users className="h-5 w-5 text-primary mr-2" />
              <span className="text-xl md:text-2xl font-bold">8,000+</span>
            </div>
            <p className="sm:ml-2 text-sm text-muted-foreground">Active Developers</p>
          </div>
        </div>
      </div>
    </section>
  )
}
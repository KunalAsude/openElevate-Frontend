import { Code, GitPullRequest, Star, Users } from "lucide-react"

export function StatsSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-3 gap-x-8 gap-y-4">
            <div className="flex items-center">
            <div className="flex items-center">
              <Code className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">2,500+</span>
            </div>
            <p className="ml-2 text-sm text-muted-foreground">Open Source Projects</p>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center">
              <GitPullRequest className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">15,000+</span>
            </div>
            <p className="ml-2 text-sm text-muted-foreground">Contributions Made</p>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">8,000+</span>
            </div>
            <p className="ml-2 text-sm text-muted-foreground">Active Developers</p>
          </div>
        </div>
      </div>
    </section>
  )
}

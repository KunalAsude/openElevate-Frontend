import { Code, GitPullRequest, Star, Users } from "lucide-react"

export function StatsSection() {
  return (
    <section className="bg-muted/30 py-16">
      <div className="container">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <div className="text-3xl font-bold">2,500+</div>
            <p className="text-sm text-muted-foreground">Open Source Projects</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <GitPullRequest className="h-6 w-6 text-primary" />
            </div>
            <div className="text-3xl font-bold">15,000+</div>
            <p className="text-sm text-muted-foreground">Contributions Made</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="text-3xl font-bold">8,000+</div>
            <p className="text-sm text-muted-foreground">Active Developers</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <div className="text-3xl font-bold">95%</div>
            <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
          </div>
        </div>
      </div>
    </section>
  )
}

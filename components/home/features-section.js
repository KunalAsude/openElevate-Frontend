import { Badge } from "@/components/ui/badge"
import { Brain, Code, GitPullRequest, Star, Trophy, Users } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="container">
        <div className="mx-auto max-w-[800px] text-center">
          <Badge className="mb-4" variant="outline">
            Features
          </Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Everything you need to elevate your open source journey
          </h2>
          <p className="mb-12 text-xl text-muted-foreground">
            OpenElevate provides a comprehensive platform for discovering, contributing to, and managing open source
            projects.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="group rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
              <Code className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Project Discovery</h3>
            <p className="text-muted-foreground">
              Find projects that match your skills, interests, and experience level with our intelligent matching
              system.
            </p>
          </div>

          <div className="group rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
              <GitPullRequest className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Contribution System</h3>
            <p className="text-muted-foreground">
              Streamlined workflow for submitting and tracking your contributions with GitHub integration.
            </p>
          </div>

          <div className="group rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold">AI Features</h3>
            <p className="text-muted-foreground">
              Get personalized project recommendations, code analysis, and learning paths tailored to your skills.
            </p>
          </div>

          <div className="group rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
              <Trophy className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Gamification</h3>
            <p className="text-muted-foreground">
              Earn badges, track achievements, and climb the leaderboard as you contribute to projects.
            </p>
          </div>

          <div className="group rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Mentorship</h3>
            <p className="text-muted-foreground">
              Connect with experienced mentors who can guide you through your open source journey.
            </p>
          </div>

          <div className="group rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
              <Star className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Community</h3>
            <p className="text-muted-foreground">
              Join a vibrant community of developers and maintainers passionate about open source.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

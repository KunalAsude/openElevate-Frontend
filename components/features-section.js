import { Code, GitPullRequest, Star, Users } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Everything you need to elevate your open source journey
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              OpenElevate provides a comprehensive platform for discovering, contributing to, and managing open source
              projects.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
            <div className="rounded-full bg-muted p-2">
              <Code className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Project Discovery</h3>
            <p className="text-center text-muted-foreground">
              Find projects that match your skills, interests, and experience level.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
            <div className="rounded-full bg-muted p-2">
              <GitPullRequest className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Contribution System</h3>
            <p className="text-center text-muted-foreground">
              Streamlined workflow for submitting and tracking your contributions.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
            <div className="rounded-full bg-muted p-2">
              <Star className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Gamification</h3>
            <p className="text-center text-muted-foreground">
              Earn badges, track achievements, and climb the leaderboard.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
            <div className="rounded-full bg-muted p-2">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Community</h3>
            <p className="text-center text-muted-foreground">
              Connect with like-minded developers and project maintainers.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

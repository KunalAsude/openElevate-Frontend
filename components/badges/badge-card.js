import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function BadgeCard({ badge, earned }) {
  const rarityColors = {
    common: "bg-secondary text-secondary-foreground",
    uncommon: "bg-accent text-accent-foreground",
    rare: "bg-primary text-primary-foreground",
    epic: "bg-purple-500 text-white",
    legendary: "bg-amber-500 text-white",
  }

  return (
    <Card className={earned ? "" : "opacity-75"}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge className={rarityColors[badge.rarity]}>
            {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
          </Badge>
          {earned && <Badge variant="outline">Earned</Badge>}
        </div>
      </CardHeader>
      <CardContent className="text-center pb-2">
        <div className="text-4xl mb-2">{badge.icon}</div>
        <h3 className="font-semibold">{badge.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{badge.description}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        {earned ? (
          <p className="text-xs text-muted-foreground">Earned on {badge.earned}</p>
        ) : (
          <div className="w-full space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span>Progress</span>
              <span>{badge.progress}%</span>
            </div>
            <Progress value={badge.progress} />
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

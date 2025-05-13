import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

export function MentorCard({ mentor }) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={mentor.image || "/placeholder.svg"} alt={mentor.name} />
            <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{mentor.name}</h3>
            <p className="text-sm text-muted-foreground">
              {mentor.role} at {mentor.company}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Skills</h4>
            <div className="mt-1 flex flex-wrap gap-2">
              {mentor.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium">Availability</h4>
            <p className="mt-1 flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4" />
              {mentor.availability}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Request Session</Button>
      </CardFooter>
    </Card>
  )
}

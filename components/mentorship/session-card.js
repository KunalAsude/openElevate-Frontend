import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User } from "lucide-react"


export function SessionCard({ session }) {
  const statusColors = {
    upcoming: "bg-accent text-accent-foreground",
    completed: "bg-primary text-primary-foreground",
    cancelled: "bg-destructive text-destructive-foreground",
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{session.topic}</h3>
            <div className="mt-2 space-y-1">
              <p className="flex items-center text-sm text-muted-foreground">
                <User className="mr-2 h-4 w-4" />
                {session.mentor}
              </p>
              <p className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                {session.date}
              </p>
              <p className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                {session.time}
              </p>
            </div>
          </div>
          <Badge className={statusColors[session.status]}>
            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {session.status === "upcoming" ? (
          <>
            <Button variant="outline">Reschedule</Button>
            <Button>Join Session</Button>
          </>
        ) : (
          <>
            <Button variant="outline">View Notes</Button>
            <Button>Leave Feedback</Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}

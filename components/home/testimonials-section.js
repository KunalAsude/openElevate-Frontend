import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Quote } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Frontend Developer",
      avatar: "AJ",
      content:
        "OpenElevate helped me find projects that match my skill level and interests. I've made 12 contributions in just two months and learned so much in the process!",
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "Full Stack Developer",
      avatar: "SC",
      content:
        "The gamification aspect keeps me motivated. I love seeing my progress and earning badges for my open source work. The community is incredibly supportive.",
    },
    {
      id: 3,
      name: "Miguel Rodriguez",
      role: "Project Maintainer",
      avatar: "MR",
      content:
        "As a maintainer, OpenElevate has connected me with quality contributors who are genuinely interested in my project. The platform makes it easy to manage contributions.",
    },
  ]

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="container">
        <div className="mx-auto max-w-[800px] text-center">
          <Badge className="mb-4" variant="outline">
            Testimonials
          </Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">What Our Community Says</h2>
          <p className="mb-12 text-xl text-muted-foreground">
            Hear from developers and maintainers who are part of the OpenElevate community.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="relative overflow-hidden">
              <div className="absolute right-4 top-4 text-primary/10">
                <Quote className="h-12 w-12" />
              </div>
              <CardHeader className="pb-0">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

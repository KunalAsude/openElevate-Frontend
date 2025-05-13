import { Badge } from "@/components/ui/badge"

export function PartnersSection() {
  const partners = [
    { id: 1, name: "TechCorp" },
    { id: 2, name: "DevHub" },
    { id: 3, name: "CodeLabs" },
    { id: 4, name: "InnovateTech" },
    { id: 5, name: "ByteWorks" },
    { id: 6, name: "DigitalSphere" },
  ]

  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="mx-auto max-w-[800px] text-center">
          <Badge className="mb-4" variant="outline">
            Partners
          </Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight">Trusted by Leading Companies</h2>
          <p className="mb-12 text-muted-foreground">
            We partner with industry leaders to provide the best opportunities for our community.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {partners.map((partner) => (
            <div key={partner.id} className="flex h-24 items-center justify-center rounded-lg border bg-background p-6">
              <div className="text-xl font-bold text-muted-foreground">{partner.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

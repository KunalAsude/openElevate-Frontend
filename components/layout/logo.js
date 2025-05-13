import { Code } from "lucide-react"

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-md bg-primary p-1">
        <Code className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="font-bold text-xl">OpenElevate</span>
    </div>
  )
}

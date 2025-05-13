"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, X } from "lucide-react"

export function ProjectFilters() {
  const [open, setOpen] = React.useState(true)
  const [selectedFilters, setSelectedFilters] = useState([])

  const addFilter = (filter) => {
    if (!selectedFilters.includes(filter)) {
      setSelectedFilters([...selectedFilters, filter])
    }
  }

  const removeFilter = (filter) => {
    setSelectedFilters(selectedFilters.filter((f) => f !== filter))
  }

  const clearFilters = () => {
    setSelectedFilters([])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters} disabled={selectedFilters.length === 0}>
          Clear
        </Button>
      </div>
      {selectedFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="flex items-center gap-1">
              {filter}
              <Button variant="ghost" size="icon" className="h-3 w-3 p-0" onClick={() => removeFilter(filter)}>
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {filter} filter</span>
              </Button>
            </Badge>
          ))}
        </div>
      )}
      <div className="space-y-4">
        <Collapsible open={open} onOpenChange={setOpen}>
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Technologies</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-2 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="react" onCheckedChange={() => addFilter("React")} />
              <label
                htmlFor="react"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                React
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="typescript" onCheckedChange={() => addFilter("TypeScript")} />
              <label
                htmlFor="typescript"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                TypeScript
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="nodejs" onCheckedChange={() => addFilter("Node.js")} />
              <label
                htmlFor="nodejs"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Node.js
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="python" onCheckedChange={() => addFilter("Python")} />
              <label
                htmlFor="python"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Python
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="css" onCheckedChange={() => addFilter("CSS")} />
              <label
                htmlFor="css"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                CSS
              </label>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Collapsible>
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Difficulty</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-2 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="beginner" onCheckedChange={() => addFilter("Beginner")} />
              <label
                htmlFor="beginner"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Beginner
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="intermediate" onCheckedChange={() => addFilter("Intermediate")} />
              <label
                htmlFor="intermediate"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Intermediate
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="advanced" onCheckedChange={() => addFilter("Advanced")} />
              <label
                htmlFor="advanced"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Advanced
              </label>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Collapsible>
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Project Type</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-2 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="library" onCheckedChange={() => addFilter("Library")} />
              <label
                htmlFor="library"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Library
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="framework" onCheckedChange={() => addFilter("Framework")} />
              <label
                htmlFor="framework"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Framework
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="application" onCheckedChange={() => addFilter("Application")} />
              <label
                htmlFor="application"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Application
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="tool" onCheckedChange={() => addFilter("Tool")} />
              <label
                htmlFor="tool"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Tool
              </label>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}

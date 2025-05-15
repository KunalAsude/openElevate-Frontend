"use client"

import * as React from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Search, X, Filter } from "lucide-react"

const POPULAR_LANGUAGES = ["JavaSc...", "TypeSc...", "Python", "Java", "Go", "Rust", "C++", "C#", "PHP", "Ruby"]

const TOPICS = [
  "Web Development",
  "Machine Learning",
  "Data Science",
  "Mobile",
  "DevOps",
  "UI/UX",
  "Backend",
  "Frontend",
  "Blockchain",
  "IoT",
]

const ISSUE_LABELS = ["good first issue", "help wanted", "bug", "enhancement", "documentation"]

export function ProjectFilters({ onFilterChange, onMobileClose, isMobile = false, collapsed = false }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get all current params
  const query = searchParams.get("q") || ""
  const language = searchParams.get("language") || ""
  const minStars = Number(searchParams.get("minStars") || 0)
  const maxIssues = Number(searchParams.get("maxIssues") || 0)
  const selectedTopics = searchParams.get("topics")?.split(",") || []
  const issueLabels = searchParams.get("issueLabels")?.split(",") || []

  // Local state for form values
  const [localQuery, setLocalQuery] = React.useState(query)
  const [localLanguage, setLocalLanguage] = React.useState(language)
  const [localMinStars, setLocalMinStars] = React.useState(minStars)
  const [localMaxIssues, setLocalMaxIssues] = React.useState(maxIssues)
  const [localTopics, setLocalTopics] = React.useState(selectedTopics)
  const [localIssueLabels, setLocalIssueLabels] = React.useState(issueLabels)

  // Function to update URL and trigger filter change
  const applyFilters = () => {
    // Create new URLSearchParams
    const params = new URLSearchParams()

    // Add non-empty values only
    if (localQuery) params.set("q", localQuery)
    if (localLanguage) params.set("language", localLanguage)
    if (localMinStars > 0) params.set("minStars", localMinStars.toString())
    if (localMaxIssues > 0) params.set("maxIssues", localMaxIssues.toString())
    if (localTopics.length > 0) params.set("topics", localTopics.join(","))
    if (localIssueLabels.length > 0) params.set("issueLabels", localIssueLabels.join(","))

    // Update URL
    router.push(`${pathname}?${params.toString()}`)

    // Notify parent component
    if (onFilterChange) {
      onFilterChange({
        query: localQuery,
        language: localLanguage,
        minStars: localMinStars,
        maxIssues: localMaxIssues,
        topics: localTopics,
        issueLabels: localIssueLabels,
      })
    }

    // Close mobile filter if needed
    if (isMobile && onMobileClose) {
      onMobileClose()
    }
  }

  // Function to reset all filters
  const resetFilters = () => {
    setLocalQuery("")
    setLocalLanguage("")
    setLocalMinStars(0)
    setLocalMaxIssues(0)
    setLocalTopics([])
    setLocalIssueLabels([])

    router.push(pathname)

    if (onFilterChange) {
      onFilterChange({
        query: "",
        language: "",
        minStars: 0,
        maxIssues: 0,
        topics: [],
        issueLabels: [],
      })
    }
  }

  // Toggle a value in an array
  const toggleArrayValue = (array, value) => {
    return array.includes(value) ? array.filter((item) => item !== value) : [...array, value]
  }

  return (
    <div
      className={`w-full transition-all duration-300 ease-in-out ${collapsed ? "px-1" : "px-2 space-y-6"} ${isMobile ? "h-[calc(100vh-4rem)] overflow-y-auto pb-20" : ""}`}
    >
      {isMobile && (
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-background pt-2 pb-3 border-b">
          <h3 className="text-lg font-semibold">Filters</h3>
          <Button variant="ghost" size="icon" onClick={onMobileClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Search input only shown when not collapsed */}
      {!collapsed && (
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-8"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
          />
        </div>
      )}

      <div className={`${collapsed ? "" : "border-t pt-4"}`}>
        {collapsed ? (
          // Language icons only view for collapsed mode
          <div className="grid grid-cols-5 gap-2 py-2 justify-items-center sm:flex sm:flex-col sm:items-center sm:space-y-3">
            {POPULAR_LANGUAGES.map((lang) => {
              const isSelected = localLanguage === lang
              let icon

              // Get appropriate icon for each language
              switch (lang.toLowerCase()) {
                case "javasc...":
                  icon = "🟨"
                  break
                case "typesc...":
                  icon = "🔷"
                  break
                case "python":
                  icon = "🐍"
                  break
                case "java":
                  icon = "☕"
                  break
                case "go":
                  icon = "🔵"
                  break
                case "rust":
                  icon = "🦀"
                  break
                case "c++":
                  icon = "⚙️"
                  break
                case "c#":
                  icon = "🟢"
                  break
                case "php":
                  icon = "🐘"
                  break
                case "ruby":
                  icon = "💎"
                  break
                default:
                  icon = "📄"
              }

              return (
                <div key={lang} className="flex flex-col items-center mb-1 group relative">
                  <div className="relative mb-1">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-md transition-all duration-200 ${isSelected ? "bg-primary/15 text-primary ring-1 ring-primary shadow-sm" : "hover:bg-muted/60 group-hover:bg-muted/70"}`}
                    >
                      <div
                        className={`text-2xl transform transition-transform duration-200 ${isSelected ? "scale-125" : "scale-110"}`}
                      >
                        {icon}
                      </div>
                    </div>
                    {isSelected && (
                       <div className="absolute -top-1 -right-1 bg-primary rounded-full w-2.5 h-2.5 border border-background"></div>
                     )}
                     <span className="absolute bottom-0 right-0 w-full h-full" onClick={() => {
                       const newLang = !isSelected ? lang : ""
                       setLocalLanguage(newLang)
                       if (onFilterChange) {
                         onFilterChange({ language: newLang })
                       }
                     }}></span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-medium opacity-80 text-center transition-all duration-200 max-w-[40px] truncate">
                    {lang}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <Accordion type="multiple" defaultValue={["languages", "topics", "issues"]}>
            <AccordionItem value="languages">
              <AccordionTrigger className="text-base py-3 hover:bg-muted/50 px-2 rounded font-medium w-full">Programming Languages</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {POPULAR_LANGUAGES.map((lang) => {
                    const isSelected = localLanguage === lang
                    return (
                      <div key={lang} className="px-3 py-2 rounded-md flex items-center text-sm hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id={`language-${lang}`}
                          className="mr-2.5 h-1 w-6 rounded-[3px]"
                          checked={isSelected}
                          onCheckedChange={(checked) => setLocalLanguage(checked ? lang : "")}
                        />
                        <Label htmlFor={`language-${lang}`} className="flex-1 cursor-pointer">
                          {lang}
                        </Label>
                      </div>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="topics">
              <AccordionTrigger className="text-base py-3 hover:bg-muted/50 px-2 rounded font-medium w-full">Topics</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2">
                  {TOPICS.map((topic) => {
                    const isSelected = localTopics.includes(topic)
                    return (
                      <Badge
                        key={topic}
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer ${isSelected ? "bg-primary" : "hover:bg-muted"}`}
                        onClick={() => setLocalTopics(toggleArrayValue(localTopics, topic))}
                      >
                        {topic}
                      </Badge>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="stars">
              <AccordionTrigger className="text-base py-3 hover:bg-muted/50 px-2 rounded font-medium w-full">Repository Stars</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Minimum Stars</Label>
                      <span className="text-sm">{localMinStars}</span>
                    </div>
                    <Slider
                      value={[localMinStars]}
                      min={0}
                      max={10000}
                      step={100}
                      onValueChange={(value) => setLocalMinStars(value[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0</span>
                      <span>5k</span>
                      <span>10k+</span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="issues">
              <AccordionTrigger className="text-base py-3 hover:bg-muted/50 px-2 rounded font-medium w-full">Issue Labels</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-2">
                  {ISSUE_LABELS.map((label) => (
                    <div key={label} className="px-3 py-1.5 rounded-md flex items-center text-sm hover:bg-muted/50 transition-colors" title={label}>
                      <Checkbox
                        id={`label-${label}`}
                        checked={localIssueLabels.includes(label)}
                        onCheckedChange={() => setLocalIssueLabels(toggleArrayValue(localIssueLabels, label))}
                        className="mr-2 h-0 w-6 rounded-[3px]"
                      />
                      <Label htmlFor={`label-${label}`} className="text-sm cursor-pointer flex-1">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="issues-count">
              <AccordionTrigger className="text-base py-3 hover:bg-muted/50 px-2 rounded font-medium w-full">Maximum Open Issues</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Max Issues</Label>
                      <span className="text-sm">{localMaxIssues === 0 ? "Any" : localMaxIssues}</span>
                    </div>
                    <Slider
                      value={[localMaxIssues]}
                      min={0}
                      max={1000}
                      step={10}
                      onValueChange={(value) => setLocalMaxIssues(value[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Any</span>
                      <span>500</span>
                      <span>1000+</span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>

      <div className={`${collapsed ? "flex justify-center mt-4" : `flex flex-col gap-2 mt-6 ${isMobile ? "sticky bottom-0 bg-background pt-3 pb-4 border-t" : ""}`}`}>
        {collapsed ? (
          // Only show X button for reset when collapsed
          <Button variant="outline" size="icon" onClick={resetFilters} className="rounded-full h-8 w-8" title="Reset Filters">
            <X className="h-4 w-4" />
          </Button>
        ) : (
          // Show both buttons when expanded
          <>
            <Button onClick={applyFilters} className="w-full">
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
            <Button variant="outline" onClick={resetFilters} className="w-full">
              Reset Filters
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

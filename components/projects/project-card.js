import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GitPullRequest, Star, GitFork, AlertCircle, ExternalLink } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ProjectCard({ 
  name, 
  fullName, 
  description, 
  url, 
  stars, 
  forks, 
  issues, 
  language,
  tags = [], 
  owner = {}, 
  createdAt,
  updatedAt,
  matchScore,
  isRecommended = false 
}) {
  return (
    <Card className="flex flex-col overflow-hidden border-border hover:shadow-md transition-all duration-200">
      {isRecommended && (
        <div className="bg-primary/10 border-b border-primary/20 py-1 px-3">
          <p className="text-xs text-primary font-medium">Recommended for your skills</p>
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {owner.avatarUrl && (
              <Image 
                src={owner.avatarUrl} 
                alt={owner.login || 'Owner'} 
                width={24} 
                height={24} 
                className="rounded-full" 
              />  
            )}
            <div>
              <CardTitle className="line-clamp-1 text-base">
                {fullName || name}
              </CardTitle>
              {owner.login && (
                <Link href={owner.url || '#'} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  @{owner.login}
                </Link>
              )}
            </div>
          </div>
          {matchScore && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                    {matchScore}% Match
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Match score based on your skills</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-2">
        <p className="line-clamp-2 text-sm text-muted-foreground mb-3">
          {description || 'No description provided'}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {language && (
            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
              {language}
            </Badge>
          )}
          {tags.filter(tag => tag !== language).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center">
            <Star className="mr-1 h-3.5 w-3.5" />
            <span>{stars?.toLocaleString() || 0}</span>
          </div>
          <div className="flex items-center">
            <GitFork className="mr-1 h-3.5 w-3.5" />
            <span>{forks?.toLocaleString() || 0}</span>
          </div>
          <div className="flex items-center">
            <AlertCircle className="mr-1 h-3.5 w-3.5" />
            <span>{issues?.toLocaleString() || 0} issues</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link href={`/projects/${encodeURIComponent(fullName || name)}`}>
            Details
          </Link>
        </Button>
        <Button asChild size="sm" className="flex-1">
          <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center">
            GitHub <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

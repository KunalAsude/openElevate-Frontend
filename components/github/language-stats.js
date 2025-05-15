import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Color mapping for common languages
const languageColors = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Go: '#00ADD8',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Swift: '#ffac45',
  Kotlin: '#A97BFF',
  Rust: '#dea584',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Vue: '#41b883',
  React: '#61dafb',
  Angular: '#dd0031',
  // Add more languages as needed
};

export function LanguageStats({ languages, loading }) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!languages || Object.keys(languages).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Languages</CardTitle>
          <CardDescription>No language data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No language statistics available for this account.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Sort languages by percentage (descending)
  const sortedLanguages = Object.entries(languages)
    .sort(([, percentA], [, percentB]) => percentB - percentA);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Languages</CardTitle>
        <CardDescription>Programming languages used in your repositories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {sortedLanguages.map(([lang, percentage]) => (
            <div key={lang} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{lang}</span>
                <span>{percentage.toFixed(1)}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full rounded-full" 
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: languageColors[lang] || '#8b949e'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

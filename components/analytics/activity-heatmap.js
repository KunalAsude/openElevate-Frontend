"use client"

import { useState, useEffect } from 'react'
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ActivityHeatmap({ data, title = "Contribution Activity", description = "Your contribution heatmap over time" }) {
  const [heatmapData, setHeatmapData] = useState([])
  const [maxCount, setMaxCount] = useState(0)
  const [weeks, setWeeks] = useState([])
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  useEffect(() => {
    if (data && data.length > 0) {
      // Transform the data to match the expected format
      const formattedData = data.map(item => ({
        date: item.date,
        count: item.count || 0,
        level: getActivityLevel(item.count || 0)
      }))
      
      setHeatmapData(formattedData)
      const max = Math.max(...formattedData.map(item => item.count || 0))
      setMaxCount(max)
      
      // Generate weeks data for rendering the grid
      generateWeeksData(formattedData)
    }
  }, [data])

  const getActivityLevel = (count) => {
    if (count === 0) return 0
    if (count <= 2) return 1
    if (count <= 5) return 2
    if (count <= 9) return 3
    return 4
  }

  const generateWeeksData = (contributions) => {
    // Group contributions by week
    const weeksData = []
    let currentWeek = []
    let currentDate = new Date()
    
    // Start from today and go back 365 days
    for (let i = 0; i < 365; i++) {
      const date = new Date(currentDate)
      date.setDate(date.getDate() - (364 - i))
      
      const dateStr = date.toISOString().split('T')[0]
      const contribution = contributions.find(c => c.date === dateStr) || { count: 0 }
      
      currentWeek.push({
        date: dateStr,
        count: contribution.count,
        level: getActivityLevel(contribution.count)
      })
      
      if (date.getDay() === 6 || i === 364) {
        // Start a new week
        weeksData.push([...currentWeek])
        currentWeek = []
      }
    }
    
    setWeeks(weeksData.reverse())
  }

  // Get color intensity based on activity level
  const getColorIntensity = (level) => {
    const colors = [
      'bg-gray-100 dark:bg-gray-800',
      'bg-emerald-100 dark:bg-emerald-900',
      'bg-emerald-300 dark:bg-emerald-700',
      'bg-emerald-500 dark:bg-emerald-500',
      'bg-emerald-700 dark:bg-emerald-300'
    ]
    return colors[level] || colors[0]
  }

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Get month labels for the heatmap
  const getMonthLabels = () => {
    if (weeks.length === 0) return null
    
    const months = []
    let lastMonth = -1
    
    weeks.forEach((week, weekIndex) => {
      const firstDay = new Date(week[0].date)
      const month = firstDay.getMonth()
      
      if (month !== lastMonth) {
        months.push({
          month,
          weekIndex
        })
        lastMonth = month
      }
    })
    
    return months
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {maxCount > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div 
                    key={level} 
                    className={`w-3 h-3 rounded-sm ${getColorIntensity(level)}`}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-auto">
          <div className="flex flex-col gap-1">
            {/* Month labels */}
            <div className="flex pl-8">
              {getMonthLabels()?.map(({ month, weekIndex }) => (
                <div 
                  key={`${month}-${weekIndex}`} 
                  className="text-xs text-muted-foreground"
                  style={{ 
                    width: 'calc(14px * 8)', // 7 days + 1px gap
                    flexShrink: 0,
                    marginLeft: weekIndex === 0 ? 0 : '4px'
                  }}
                >
                  {months[month]}
                </div>
              ))}
            </div>
            
            <div className="flex gap-1">
              {/* Day labels */}
              <div className="flex flex-col gap-1 mr-2">
                {days.map((day, i) => (
                  <div 
                    key={day} 
                    className="text-xs text-muted-foreground text-right pr-1 h-4"
                    style={{ lineHeight: '16px' }}
                  >
                    {i % 2 === 0 ? day : ''}
                  </div>
                ))}
              </div>
              
              {/* Heatmap grid */}
              <TooltipProvider>
                <div className="flex gap-1">
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                      {week.map((day, dayIndex) => (
                        <Tooltip key={`${weekIndex}-${dayIndex}`}>
                          <TooltipTrigger asChild>
                            <div 
                              className={`w-3 h-3 rounded-sm ${getColorIntensity(day.level)}`}
                              style={{
                                backgroundColor: day.count > 0 ? 
                                  `rgba(16, 185, 129, ${0.1 + (0.9 * (day.count / Math.max(1, maxCount)))})` : 
                                  'var(--muted)'
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            <div className="text-center">
                              <div className="font-medium">{day.count} contributions</div>
                              <div className="text-muted-foreground">{formatDate(day.date)}</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  ))}
                </div>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

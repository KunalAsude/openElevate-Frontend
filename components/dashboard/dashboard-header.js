import  React from "react"



export function DashboardHeader({ heading, text, children }) {
  return (
    <div className="flex items-center justify-between mt-0">
      <div className="grid gap-0.5">
        <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
        {text && <p className="text-muted-foreground text-sm">{text}</p>}
      </div>
      {children}
    </div>
  )
}

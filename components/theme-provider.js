"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useEffect, useState } from "react"

// This component handles client-side theme detection and application
// It prevents the flash of incorrect theme during page transitions
export function ThemeProvider({ children, attribute, defaultTheme, enableSystem }) {
  const [mounted, setMounted] = useState(false)

  // When mounted on client, now we can render the provider
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Avoid rendering anything until mounted to prevent theme flicker
  if (!mounted) {
    // Add a div with the same structure that will be styled properly when the theme loads
    return (
      <div style={{ visibility: "hidden" }}>
        {children}
      </div>
    )
  }

  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      storageKey="openElevate-theme" // Use consistent storage key
      forcedTheme={mounted ? undefined : defaultTheme} // Force theme until mounted
      disableTransitionOnChange // Disable transitions during theme changes
    >
      {children}
    </NextThemesProvider>
  )
}
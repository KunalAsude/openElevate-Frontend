import React from "react"
import { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/layout/navbar"
import { ConditionalFooter } from "@/components/layout/conditional-footer"
import { RouteChangeSpinner } from "@/components/ui/loading-spinner"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
})

export const metadata = {
  title: "OpenElevate - Connect with Open Source Projects",
  description: "Platform connecting developers with open-source projects",
}



export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable}`}>
      <head>
        {/* Add a script to help prevent theme flashing */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              const storedTheme = localStorage.getItem('openElevate-theme');
              if (storedTheme === 'dark' || (storedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (e) {}
          })()
        `}} />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <RouteChangeSpinner />
          <div className="flex min-h-screen flex-col bg-background text-foreground dark:bg-background dark:text-foreground transition-colors duration-300">
            <Navbar />
            <main className="flex-1 w-full px-4">
              <div className="w-full">
                {children}
              </div>
            </main>
            <ConditionalFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
import React from "react"
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} scroll-smooth`}>
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
        
        {/* Viewport meta tag with proper settings for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        
        {/* Add script to fix vh issues on mobile */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            function setVH() {
              let vh = window.innerHeight * 0.01;
              document.documentElement.style.setProperty('--vh', \`\${vh}px\`);
            }
            window.addEventListener('resize', setVH);
            window.addEventListener('orientationchange', setVH);
            setVH();
          })()
        `}} />
      </head>
      <body className="antialiased min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <RouteChangeSpinner />
          <div className="flex min-h-screen flex-col bg-background text-foreground dark:bg-background dark:text-foreground transition-colors duration-300">
            <Navbar />
            <main className="flex-1 w-full">
              {/* Responsive container with proper padding for different screen sizes */}
              <div className="container-fluid mx-auto py-4 sm:py-6 md:py-8 safe-area-inset-x">
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
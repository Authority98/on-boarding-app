import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { ThemeProvider } from '@/components/theme-provider'
import { LoadingProvider } from '@/components/loading-provider'

export const metadata: Metadata = {
  title: 'PlankPort - Client Onboarding Platform',
  description: 'Streamline your agency\'s client onboarding with automated workflows, real-time tracking, and professional templates.',
  generator: 'PlankPort',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <LoadingProvider enableRouteLoading={true}>
              {children}
            </LoadingProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import '@/styles/globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import { branding } from '@/config/branding'

export const metadata: Metadata = {
  title: `${branding.appName} - ${branding.tagline}`,
  description: branding.description,
  keywords: ['learning', 'AI', 'knowledge', 'gaps', 'education', 'concept'],
  authors: [{ name: 'ConceptGap' }],
  openGraph: {
    title: branding.appName,
    description: branding.description,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: branding.appName,
    description: branding.description,
  },
  icons: {
    icon: branding.favicon.path,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={branding.favicon.path} type="image/x-icon" />
      </head>
      <body className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 text-gray-900 dark:text-white">
        <Navbar />
        <main className="min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </body>
    </html>
  )
}
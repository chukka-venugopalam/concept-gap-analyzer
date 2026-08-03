import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CIP — Concept Intelligence Platform',
  description: 'Find out exactly what you don\'t understand.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

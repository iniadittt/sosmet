import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SOSMET',
  description: 'Aditya',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#FCF5EB] font-google-sans">{children}</body>
    </html>
  )
}

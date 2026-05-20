import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import './globals.css'

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'What It Really Cost',
  description: 'Real build costs from real New Zealanders. No spin, no sales pitch.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={rubik.className} style={{ margin: 0, background: '#e8eaed' }}>
        {children}
      </body>
    </html>
  )
}

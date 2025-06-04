import './globals.css'
import type { Metadata } from 'next'
import Providers from '@/lib/Providers';
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'Dashboard App',
  description: 'Responsive dashboard with sidebar',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex bg-gray-50">
        <Sidebar />

        <main className="flex-1 p-4 pt-[72px] md:pt-4">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Database, Menu, Info } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Data', href: '/data', icon: Database },
  { name: 'About Us', href: '/about-us', icon: Info },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile top bar with hamburger */}
      <div className="md:hidden fixed top-0 left-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded border-gray-200 bg-white shadow hover:bg-gray-100"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-blue-600 ml-28">
          <Link href="/">
            Dashboard
          </Link>
        </h1>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-gray-200 shadow-lg transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:inset-auto`}
      >
        <div className="p-6 border-b border-gray-200 hidden md:block">
          <h1 className="text-xl font-semibold text-blue-600 tracking-tight">
            <Link href="/">
              Dashboard
            </Link>
          </h1>
        </div>

        <nav className="flex flex-col gap-1 p-4 mt-14 md:mt-0">
          {navItems.map(({ name, href, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={name}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition
                  ${
                    isActive
                      ? 'bg-blue-100 text-blue-600 border-blue-500'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
              >
                <Icon className="w-5 h-5" />
                {name}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto p-4 border-t border-gray-200 text-xs text-gray-400">
          &copy; 2025 Dashboard App.
        </div>
      </aside>
    </>
  )
}

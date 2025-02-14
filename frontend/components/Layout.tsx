'use client'

import { useState, ReactNode, useEffect } from "react"
import Sidebar from "@/components/Sidebar"
import { usePathname } from 'next/navigation'

export default function Layout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const pathname = usePathname()

  // Pages where sidebar should be hidden
  const fullScreenPaths = ['/auth/login', '/questionnaire']
  const isFullScreenPage = fullScreenPaths.includes(pathname)

  // Handle click outside to close sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar')
      const toggleButton = document.getElementById('sidebar-toggle')
      
      if (sidebar && 
          toggleButton && 
          !sidebar.contains(event.target as Node) && 
          !toggleButton.contains(event.target as Node)) {
        setIsSidebarOpen(false)
      }
    }

    if (!isFullScreenPage) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isFullScreenPage])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  if (isFullScreenPage) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-700">
        {children}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-700">
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar}
      />
      
      <main
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'lg:ml-72' : ''
        }`}
      >
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
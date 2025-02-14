'use client'

import React, { useState } from "react"
import { ChevronRight, Home, Box, BarChart2, FileText, Settings, HelpCircle, LogIn, User, Layers, Phone, Info, DollarSign, Sun, Moon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isSidebarOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const productItems = [
    { icon: Box, label: "Features", path: "/features" },
    { icon: Layers, label: "Solutions", path: "/solutions" },
    { icon: BarChart2, label: "Integrations", path: "/integrations" },
  ]

  const mainNavItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: DollarSign, label: "Pricing", path: "/pricing" },
    { icon: Info, label: "About", path: "/about" },
    { icon: Phone, label: "Contact", path: "/contact", dividerAfter: true },
  ]

  return (
    <div className="flex flex-col h-screen shadown-lg">
      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 z-40 h-screen w-[242px] border-r bg-[#FFFEFE] dark:bg-[#1e2533] dark:border-gray-800 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-5 pt-6 space-y-5">
            <div className="flex items-center justify-between h-8">
              <span className="text-gray-900 dark:text-white text-2xl font-normal font-['Inter']">FinancePro</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="rounded-lg"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0 text-[#3cc7e5]" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100 text-[#3cc7e5]" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>

            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button className="h-10 px-[12px] py-[8px] bg-white dark:bg-[#242b3d] rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] border border-zinc-300 dark:border-gray-800 w-full flex items-center justify-between">
                  <span className="text-gray-900 dark:text-white text-base font-normal truncate">User Name</span>
                  <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-90" : ""}`} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[210px] p-1 dark:bg-[#242b3d] dark:border-gray-800" align="start">
                <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-red-600">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Navigation */}
          <nav className="mt-2 px-4 flex-1">
            {/* Products Section */}
            <div className="mb-4">
              <div className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 font-medium">
                <Box className="h-5 w-5" />
                <span>Products</span>
              </div>
              <div className="space-y-1">
                {productItems.map((item) => (
                  <Link key={item.label} href={item.path}>
                    <button className="flex w-[210px] items-center gap-3 rounded-lg px-[14px] py-[10px] text-sm text-[#404751] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <item.icon className="h-6 w-6" />
                      <span className="font-semibold">{item.label}</span>
                    </button>
                  </Link>
                ))}
              </div>
            </div>

            {/* Main Navigation */}
            <div className="space-y-1">
              {mainNavItems.map((item) => (
                <React.Fragment key={item.label}>
                  <Link href={item.path}>
                    <button className={`flex w-[210px] items-center gap-3 rounded-lg px-[14px] py-[10px] transition-colors ${
                      pathname === item.path
                        ? 'bg-[#3cc7e5] text-white font-medium'
                        : 'text-[#404751] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}>
                      <item.icon className="h-6 w-6" />
                      <span className="font-semibold">{item.label}</span>
                    </button>
                  </Link>
                  {item.dividerAfter && <hr className="my-4 border-gray-200 dark:border-gray-800" />}
                </React.Fragment>
              ))}
            </div>
          </nav>
        </div>
      </aside>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        aria-label="Toggle navigation menu"
        className={`fixed top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-white dark:bg-[#242b3d] text-gray-900 dark:text-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] border border-zinc-300 dark:border-gray-800 transition-all duration-300 ${
          isSidebarOpen ? 'left-[232px]' : '-left-2'
        }`}
      >
        <ChevronRight className={`h-6 w-6 transition-transform duration-300 ${
          isSidebarOpen ? 'rotate-180' : ''
        }`} />
      </button>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            FinancePro
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-primary">
                <span>Products</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-lg rounded-lg p-4 w-48">
                <Link href="/features" className="block py-2 px-4 hover:bg-gray-50 rounded-md">
                  Features
                </Link>
                <Link href="/solutions" className="block py-2 px-4 hover:bg-gray-50 rounded-md">
                  Solutions
                </Link>
                <Link href="/integrations" className="block py-2 px-4 hover:bg-gray-50 rounded-md">
                  Integrations
                </Link>
              </div>
            </div>
            <Link href="/pricing" className="text-gray-700 hover:text-primary">
              Pricing
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary">
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="hidden md:inline-flex">
              Sign In
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

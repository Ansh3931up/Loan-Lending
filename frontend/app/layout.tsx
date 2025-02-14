'use client'

import './globals.css'

import Layout from '@/components/Layout'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from 'react-hot-toast';
import { UserProvider } from '@/context/UserContext';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en"  suppressHydrationWarning>
      <head />
      <body  className="overflow-x-hidden bg-[#FBFBFA] dark:bg-gray-900">
        <UserProvider>
          <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Layout>
            {children}
            <Toaster position="top-right" />
          </Layout>
             </ThemeProvider>
        </UserProvider>

      </body>
    </html>
  )
}
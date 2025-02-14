import './globals.css'
import { Toaster } from 'react-hot-toast';
import { UserProvider } from '@/context/UserContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <UserProvider>
          <main>
            {children}
            <Toaster position="top-right" />
          </main>
        </UserProvider>
      </body>
    </html>
  )
}
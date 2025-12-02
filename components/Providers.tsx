'use client'

// No longer using NextAuth SessionProvider
// Authentication is now handled via JWT tokens stored in localStorage
export default function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}



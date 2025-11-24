import '../styles/globals.css'
import Providers from '@/components/Providers'
import type { Metadata } from 'next'
import LayoutWrapper from '@/components/LayoutWrapper'

export const metadata: Metadata = {
  title: 'HearstAI - Dashboard',
  description: 'HearstAI Mining Intelligence Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" data-theme="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <script
          src="/js/chart.umd.min.js"
          async
        ></script>
      </head>
      <body>
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  )
}




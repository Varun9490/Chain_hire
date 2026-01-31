'use client'

import './globals.css'
import { ClusterProvider } from '@/components/cluster/cluster-data-access'
import { SolanaProvider } from '@/components/solana/solana-provider'
import { UiLayout } from '@/components/ui/ui-layout'
import { ReactQueryProvider } from './react-query-provider'

const links: { label: string; path: string }[] = [
  { label: 'Clusters', path: '/clusters' },
  { label: 'Account', path: '/account' },
  { label: 'Clients', path: '/client/clientsList' },
  { label: 'Freelancers', path: '/freelancer/freelancersList' },
  { label: 'My Projects', path: '/myprojects' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="chainhire" className="dark">
      <head>
        <title>ChainHire - Trustless Freelancing on Solana</title>
        <meta name="description" content="A decentralized freelancing platform that connects clients and freelancers on the Solana blockchain with trustless escrow payments." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#0A0A1B] text-[#E4E4E7]">
        <ReactQueryProvider>
          <ClusterProvider>
            <SolanaProvider>
              <UiLayout links={links}>{children}</UiLayout>
            </SolanaProvider>
          </ClusterProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}

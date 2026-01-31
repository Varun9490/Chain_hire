'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'
import { AppHero } from '../ui/ui-layout'
import { FreelancersList } from './freelancer-ui'

export default function FreelancersFeature() {
  const { publicKey } = useWallet()

  return publicKey ? (
    <div className="animate-fadeIn">
      <AppHero
        title="Available Freelancers"
        subtitle={'Discover talented freelancers registered on the ChainHire platform.'}
      >
        <FreelancersList address={publicKey} />
      </AppHero>
    </div>
  ) : (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center animate-fadeIn">
        <div className="glass-card p-12 max-w-md mx-auto">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#14F195] to-[#10B981] flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[var(--ch-text)] mb-4">Connect Your Wallet</h2>
          <p className="text-[var(--ch-text-muted)] mb-6">
            Connect your Solana wallet to view registered freelancers and hire talent.
          </p>
          <WalletButton />
        </div>
      </div>
    </div>
  )
}

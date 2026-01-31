'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'
import { AppHero, ellipsify } from '../ui/ui-layout'
import { ExplorerLink } from '../cluster/cluster-ui'
import { useProgramAccounts } from '../client/client-data-access'
import { RegisterFreelancer } from './freelancer-ui'

export default function FreelancerFeature() {
  const { publicKey } = useWallet()
  const { programId } = useProgramAccounts()

  return publicKey ? (
    <div className="animate-fadeIn">
      <AppHero
        title="ChainHire"
        subtitle={
          'A decentralized freelancing platform on Solana. Find projects and get paid instantly.'
        }>
        <div className="mt-4">
          <ExplorerLink
            path={`account/${programId}`}
            label={ellipsify(programId.toString())}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-[var(--ch-dark-light)] border border-[var(--ch-border)] text-[var(--ch-text-muted)] hover:text-[var(--ch-primary)] transition-colors text-sm font-mono"
          />
        </div>
        <div className="mt-8">
          <RegisterFreelancer address={publicKey} />
        </div>
      </AppHero>
    </div>
  ) : (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center animate-fadeIn">
        <div className="glass-card p-12 max-w-md mx-auto">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#14F195] to-[#10B981] flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[var(--ch-text)] mb-4">Connect Your Wallet</h2>
          <p className="text-[var(--ch-text-muted)] mb-6">
            Connect your Solana wallet to register as a freelancer and start earning.
          </p>
          <WalletButton />
        </div>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link';
import { AppHero } from '../ui/ui-layout'

export default function DashboardFeature() {
  return (
    <div className="min-h-[80vh] relative">
      {/* Hero Section */}
      <AppHero
        title="ChainHire"
        subtitle="A decentralized freelancing platform that connects clients and freelancers on the Solana blockchain with trustless escrow payments."
      />

      {/* Role Selection Cards */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Client Card */}
          <Link href="/client" className="group">
            <div className="glass-card p-8 card-hover relative overflow-hidden">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9945FF] to-[#B06EFF] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 glow">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-[var(--ch-text)] mb-3 group-hover:gradient-text transition-all duration-300">
                  I'm a Client
                </h3>
                <p className="text-[var(--ch-text-muted)] mb-6 leading-relaxed">
                  Post projects, hire talented freelancers, and manage your work with secure milestone-based payments.
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-sm text-[var(--ch-text-muted)]">
                    <span className="w-5 h-5 rounded-full bg-[#14F195]/20 flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-[#14F195]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Publish unlimited projects
                  </li>
                  <li className="flex items-center text-sm text-[var(--ch-text-muted)]">
                    <span className="w-5 h-5 rounded-full bg-[#14F195]/20 flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-[#14F195]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Secure escrow payments
                  </li>
                  <li className="flex items-center text-sm text-[var(--ch-text-muted)]">
                    <span className="w-5 h-5 rounded-full bg-[#14F195]/20 flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-[#14F195]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Performance tracking
                  </li>
                </ul>

                {/* CTA */}
                <div className="flex items-center text-[var(--ch-primary)] font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  <span>Get Started</span>
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Freelancer Card */}
          <Link href="/freelancer" className="group">
            <div className="glass-card p-8 card-hover relative overflow-hidden">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#14F195]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#14F195] to-[#10B981] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 glow-green">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-[var(--ch-text)] mb-3 group-hover:gradient-text-2 transition-all duration-300">
                  I'm a Freelancer
                </h3>
                <p className="text-[var(--ch-text-muted)] mb-6 leading-relaxed">
                  Find exciting projects, showcase your skills, and get paid instantly in SOL upon task approval.
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-sm text-[var(--ch-text-muted)]">
                    <span className="w-5 h-5 rounded-full bg-[#9945FF]/20 flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-[#9945FF]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Free registration
                  </li>
                  <li className="flex items-center text-sm text-[var(--ch-text-muted)]">
                    <span className="w-5 h-5 rounded-full bg-[#9945FF]/20 flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-[#9945FF]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Guaranteed payments
                  </li>
                  <li className="flex items-center text-sm text-[var(--ch-text-muted)]">
                    <span className="w-5 h-5 rounded-full bg-[#9945FF]/20 flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-[#9945FF]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Build your reputation
                  </li>
                </ul>

                {/* CTA */}
                <div className="flex items-center text-[#14F195] font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  <span>Get Started</span>
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-1">100%</div>
            <div className="text-sm text-[var(--ch-text-muted)]">Trustless</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text-2 mb-1">0%</div>
            <div className="text-sm text-[var(--ch-text-muted)]">Platform Fee</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-1">Instant</div>
            <div className="text-sm text-[var(--ch-text-muted)]">Payouts</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text-2 mb-1">Solana</div>
            <div className="text-sm text-[var(--ch-text-muted)]">Powered</div>
          </div>
        </div>
      </div>
    </div>
  )
}

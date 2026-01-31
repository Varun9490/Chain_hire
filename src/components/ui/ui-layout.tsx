'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import * as React from 'react'
import {ReactNode, Suspense, useEffect, useRef} from 'react'
import toast, {Toaster} from 'react-hot-toast'

import {AccountChecker} from '../account/account-ui'
import {ClusterChecker, ClusterUiSelect, ExplorerLink} from '../cluster/cluster-ui'
import {WalletButton} from '../solana/solana-provider'

export function UiLayout({ children, links }: { children: ReactNode; links: { label: string; path: string }[] }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex flex-col bg-[var(--ch-dark)] bg-grid">
      {/* Modern Navbar */}
      <nav className="sticky top-0 z-50 glass-card border-b border-[var(--ch-border)] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <Link 
                href="/" 
                className="flex items-center space-x-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold gradient-text">ChainHire</span>
              </Link>

              {/* Nav Links */}
              <ul className="hidden md:flex items-center space-x-1">
                {links.map(({ label, path }) => (
                  <li key={path}>
                    <Link 
                      href={path}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        pathname.startsWith(path) 
                          ? 'bg-[var(--ch-primary)]/20 text-[var(--ch-primary)]' 
                          : 'text-[var(--ch-text-muted)] hover:text-[var(--ch-text)] hover:bg-[var(--ch-dark-light)]'
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <ClusterUiSelect />
              <WalletButton />
            </div>
          </div>
        </div>
      </nav>

      <ClusterChecker>
        <AccountChecker />
      </ClusterChecker>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-[var(--ch-primary)]/30 border-t-[var(--ch-primary)] animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[var(--ch-primary)]/20"></div>
                  </div>
                </div>
              </div>
            }
          >
            {children}
          </Suspense>
        </div>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--ch-dark-card)',
              color: 'var(--ch-text)',
              border: '1px solid var(--ch-border)',
              borderRadius: '12px',
            },
            success: {
              iconTheme: {
                primary: '#14F195',
                secondary: '#0A0A1B',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#0A0A1B',
              },
            },
          }}
        />
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-[var(--ch-border)] bg-[var(--ch-dark-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-semibold gradient-text">ChainHire</span>
            </div>
            <p className="text-[var(--ch-text-muted)] text-sm">
              Trustless Freelancing on <span className="gradient-text font-medium">Solana</span>
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-[var(--ch-text-muted)] text-sm">© 2025 ChainHire. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode
  title: string
  hide: () => void
  show: boolean
  submit?: () => void
  submitDisabled?: boolean
  submitLabel?: string
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    if (!dialogRef.current) return
    if (show) {
      dialogRef.current.showModal()
    } else {
      dialogRef.current.close()
    }
  }, [show, dialogRef])

  return (
    <dialog className="modal backdrop-blur-sm" ref={dialogRef}>
      <div className="modal-box glass-card border border-[var(--ch-border)] max-w-lg animate-fadeIn">
        <h3 className="font-bold text-xl gradient-text mb-6">{title}</h3>
        <div className="space-y-4">
          {children}
        </div>
        <div className="modal-action mt-8 pt-4 border-t border-[var(--ch-border)]">
          <div className="flex items-center space-x-3">
            {submit ? (
              <button 
                className="btn-chainhire px-6 py-2.5 text-sm"
                onClick={submit} 
                disabled={submitDisabled}
              >
                {submitLabel || 'Save'}
              </button>
            ) : null}
            <button 
              onClick={hide} 
              className="btn-chainhire-outline px-6 py-2.5 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={hide}>close</button>
      </form>
    </dialog>
  )
}

export function AppHero({
  children,
  title,
  subtitle,
}: {
  children?: ReactNode
  title: ReactNode
  subtitle: ReactNode
}) {
  return (
    <div className="relative py-16 md:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#9945FF]/10 blur-[120px]"></div>
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#14F195]/10 blur-[100px]"></div>
      </div>

      <div className="relative text-center max-w-4xl mx-auto px-4 animate-fadeIn">
        {typeof title === 'string' ? (
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">{title}</span>
          </h1>
        ) : title}
        
        {typeof subtitle === 'string' ? (
          <p className="text-lg md:text-xl text-[var(--ch-text-muted)] max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        ) : subtitle}
        
        {children && (
          <div className="mt-8">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

export function ellipsify(str = '', len = 4) {
  if (str.length > 30) {
    return str.substring(0, len) + '..' + str.substring(str.length - len, str.length)
  }
  return str
}

export function useTransactionToast() {
  return (signature: string) => {
    toast.success(
      <div className={'text-center'}>
        <div className="text-lg font-medium text-[var(--ch-text)]">Transaction sent</div>
        <ExplorerLink 
          path={`tx/${signature}`} 
          label={'View Transaction'} 
          className="inline-block mt-2 text-sm text-[var(--ch-primary)] hover:text-[var(--ch-primary-light)] transition-colors" 
        />
      </div>,
    )
  }
}

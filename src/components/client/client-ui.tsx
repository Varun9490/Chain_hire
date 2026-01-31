'use client'

import { PublicKey } from '@solana/web3.js'
import { useState } from 'react'
import { useClientAccounts } from './client-data-access'
import { ProgramAccount } from '@coral-xyz/anchor'
import { useRouter } from 'next/navigation';

export function RegisterClient({ address }: { address: PublicKey }) {
  const { InitializeClientMutation, queryClientAccount, NewProjectMutation } = useClientAccounts({ account: address })

  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [contact, setContact] = useState('');

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectURL, setProjectURL] = useState('');
  const [projectBudget, setprojectBudget] = useState(0);

  const initializeClientMut = InitializeClientMutation(() => {
    queryClientAccount.refetch();
    setName('');
    setDomain('');
    setRequiredSkills('');
    setContact('');
  });

  const newProjectMut = NewProjectMutation(() => {
    queryClientAccount.refetch();
    setProjectName('');
    setProjectDescription('');
    setProjectURL('');
    setprojectBudget(0);
  });

  const isProjectFormValid = () => {
    if (projectName.length < 1 || projectDescription.length < 1 || projectURL.length < 1 || projectBudget <= 0) {
      return false;
    }
    return true;
  }

  const isClientFormValid = () => {
    if (name.length < 1 || domain.length < 1 || requiredSkills.length < 1 || contact.length < 1) {
      return false;
    }
    return true;
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Registration Form */}
      <div className="glass-card p-8 mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9945FF] to-[#B06EFF] flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--ch-text)]">Client Registration</h3>
            <p className="text-sm text-[var(--ch-text-muted)]">Registration fee: 1 SOL</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--ch-text-muted)] mb-2">Name</label>
            <input
              id='client-name'
              type="text"
              placeholder="Your name or company"
              className="input-chainhire"
              value={name}
              maxLength={50}
              required
              disabled={queryClientAccount.data?.name !== undefined}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--ch-text-muted)] mb-2">Domain</label>
            <input
              id='client-domain'
              type="text"
              placeholder="e.g., Web Development, DeFi"
              className="input-chainhire"
              maxLength={50}
              required
              value={domain}
              disabled={queryClientAccount.data?.name !== undefined}
              onChange={(e) => setDomain(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--ch-text-muted)] mb-2">Required Skills</label>
            <input
              id='client-required-skills'
              type="text"
              placeholder="Skills you typically look for"
              className="input-chainhire"
              maxLength={240}
              required
              value={requiredSkills}
              disabled={queryClientAccount.data?.name !== undefined}
              onChange={(e) => setRequiredSkills(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--ch-text-muted)] mb-2">Contact</label>
            <input
              id='client-contact'
              type="text"
              placeholder="Email or Discord"
              className="input-chainhire"
              maxLength={50}
              required
              value={contact}
              disabled={queryClientAccount.data?.name !== undefined}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>

          <button
            id='client-register-button'
            className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${queryClientAccount.data?.name !== undefined
                ? 'bg-[#14F195]/20 text-[#14F195] cursor-not-allowed'
                : 'btn-chainhire'
              }`}
            onClick={() => initializeClientMut.mutateAsync({ name, domain, requiredSkills, contact })}
            disabled={initializeClientMut.isPending || queryClientAccount.data?.name !== undefined || !isClientFormValid()}>
            {!queryClientAccount.data?.name ? (
              <>
                {initializeClientMut.isPending ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </span>
                ) : 'Register as Client'}
              </>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Already Registered
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Project Publishing Form */}
      {queryClientAccount.data?.name && (
        <div className="glass-card p-8 animate-slideUp">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14F195] to-[#10B981] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--ch-text)]">Publish a Project</h3>
              <p className="text-sm text-[var(--ch-text-muted)]">Start hiring talented freelancers</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--ch-text-muted)] mb-2">Project Name</label>
              <input
                id='client-project-name'
                type="text"
                placeholder="e.g., NFT Marketplace Development"
                className="input-chainhire"
                maxLength={32}
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--ch-text-muted)] mb-2">Description</label>
              <input
                id='client-project-description'
                type="text"
                placeholder="Describe your project requirements"
                maxLength={280}
                required
                className="input-chainhire"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--ch-text-muted)] mb-2">Project URL</label>
              <input
                id='client-project-url'
                type="text"
                placeholder="Reference link or specifications"
                className="input-chainhire"
                value={projectURL}
                maxLength={50}
                required
                onChange={(e) => setProjectURL(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--ch-text-muted)] mb-2">Estimated Budget (SOL)</label>
              <div className="relative">
                <input
                  id='client-project-budget'
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  className="input-chainhire pr-16"
                  value={projectBudget === 0 ? '' : projectBudget}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setprojectBudget(Number(value));
                    }
                  }
                  }
                  onBlur={(e) => {
                    const val = Math.floor(Number(e.target.value));
                    setprojectBudget(val);
                  }}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--ch-text-muted)] font-medium">SOL</span>
              </div>
            </div>

            <button
              id='client-project-publish-button'
              className="w-full btn-success py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:translate-y-[-2px]"
              onClick={() => newProjectMut.mutateAsync({ name: projectName, description: projectDescription, url: projectURL, budget: projectBudget })}
              disabled={newProjectMut.isPending || !isProjectFormValid()}>
              {newProjectMut.isPending ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </span>
              ) : 'Publish Project'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}



export function ClientsList({ address }: { address: PublicKey }) {
  const { queryClientAccounts } = useClientAccounts({ account: address });

  return (
    <div className="mt-12 animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {queryClientAccounts.data?.map((account, i) => (
          <ClientCard key={i} account={account} />
        ))}
      </div>
      {queryClientAccounts.data?.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-[var(--ch-dark-card)] flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[var(--ch-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-[var(--ch-text-muted)]">No clients registered yet</p>
        </div>
      )}
    </div>
  )
}

function ClientCard({ account }: { account: ProgramAccount }) {
  const router = useRouter();
  const clientDetails = account.account;
  const handleClick = () => {
    if (clientDetails?.owner) {
      router.push(`/client/${clientDetails.owner.toString()}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="glass-card p-6 card-hover cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9945FF] to-[#B06EFF] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
          <span className="text-white font-bold text-lg">
            {clientDetails.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-[var(--ch-text)] truncate group-hover:gradient-text transition-all duration-300">
            {clientDetails.name}
          </h3>
          <p className="text-sm text-[var(--ch-text-muted)] truncate">{clientDetails.domain}</p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3">
        <div className="flex items-start">
          <svg className="w-4 h-4 text-[var(--ch-primary)] mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="text-sm text-[var(--ch-text-muted)] truncate">{clientDetails.requiredSkills}</span>
        </div>
        <div className="flex items-start">
          <svg className="w-4 h-4 text-[#14F195] mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-sm text-[var(--ch-text-muted)] truncate">{clientDetails.contact}</span>
        </div>
      </div>

      {/* View Profile Link */}
      <div className="mt-4 pt-4 border-t border-[var(--ch-border)]">
        <span className="flex items-center text-sm text-[var(--ch-primary)] font-medium group-hover:translate-x-2 transition-transform duration-300">
          View Profile
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  )
}

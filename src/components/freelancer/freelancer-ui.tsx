'use client'

import { PublicKey } from "@solana/web3.js";
import { useState } from "react";
import { useFreelancerAccounts } from "./freelancer-data-access";
import { ProgramAccount } from "@coral-xyz/anchor";
import { useRouter } from 'next/navigation';


export function RegisterFreelancer({ address }: { address: PublicKey }) {
  const { InitializeFreelancerMutation: initializeFreelancerMutation, queryFreelancerAccount } = useFreelancerAccounts({ account: address })

  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [skills, setSkills] = useState('');
  const [contact, setContact] = useState('');

  const isFreelanceFormValid = () => {
    if (name.length < 1 || domain.length < 1 || skills.length < 1 || contact.length < 1) {
      return false;
    }
    return true;
  }

  const initializeFreelancerMut = initializeFreelancerMutation(() => {
    queryFreelancerAccount.refetch();
    setName('');
    setDomain('');
    setSkills('');
    setContact('');
  });

  return (
    <div className="max-w-lg mx-auto">
      <div className="glass-card p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14F195] to-[#10B981] flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--ch-text)]">Freelancer Registration</h3>
            <p className="text-sm text-[#14F195]">Free to register!</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--ch-text-muted)] mb-2">Name</label>
            <input
              id='freelancer-name'
              type="text"
              placeholder="Your name"
              className="input-chainhire"
              value={name}
              maxLength={50}
              required
              disabled={queryFreelancerAccount.data?.name !== undefined}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--ch-text-muted)] mb-2">Domain</label>
            <input
              id='freelancer-domain'
              type="text"
              placeholder="e.g., Smart Contract Development"
              className="input-chainhire"
              value={domain}
              maxLength={50}
              required
              disabled={queryFreelancerAccount.data?.name !== undefined}
              onChange={(e) => setDomain(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--ch-text-muted)] mb-2">Skills</label>
            <input
              id='freelancer-skills'
              type="text"
              placeholder="Rust, Solidity, React, TypeScript..."
              className="input-chainhire"
              value={skills}
              maxLength={100}
              required
              disabled={queryFreelancerAccount.data?.name !== undefined}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--ch-text-muted)] mb-2">Contact Details</label>
            <input
              id='freelancer-contact'
              type="text"
              placeholder="Email or Discord"
              className="input-chainhire"
              value={contact}
              maxLength={50}
              required
              disabled={queryFreelancerAccount.data?.name !== undefined}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>

          <button
            className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${queryFreelancerAccount.data?.name !== undefined
                ? 'bg-[#14F195]/20 text-[#14F195] cursor-not-allowed'
                : 'btn-success hover:translate-y-[-2px]'
              }`}
            onClick={() => initializeFreelancerMut.mutateAsync({ name, domain, skills, contact })}
            disabled={initializeFreelancerMut.isPending || queryFreelancerAccount.data?.name !== undefined || !isFreelanceFormValid()}>
            {!queryFreelancerAccount.data?.name ? (
              <>
                {initializeFreelancerMut.isPending ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </span>
                ) : 'Register as Freelancer'}
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
    </div>
  )
}

export function FreelancersList({ address }: { address: PublicKey }) {
  const { queryFreelancerAccounts } = useFreelancerAccounts({ account: address });

  return (
    <div className="mt-12 animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {queryFreelancerAccounts.data?.map((account, i) => (
          <FreelancerCard key={i} account={account} />
        ))}
      </div>
      {queryFreelancerAccounts.data?.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-[var(--ch-dark-card)] flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[var(--ch-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-[var(--ch-text-muted)]">No freelancers registered yet</p>
        </div>
      )}
    </div>
  )
}

function FreelancerCard({ account }: { account: ProgramAccount }) {
  const router = useRouter();
  const freelancerDetails = account.account;
  const handleClick = () => {
    if (freelancerDetails?.owner) {
      router.push(`/freelancer/${freelancerDetails.owner.toString()}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="glass-card p-6 card-hover cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#14F195] to-[#10B981] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
          <span className="text-white font-bold text-lg">
            {freelancerDetails.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-[var(--ch-text)] truncate group-hover:gradient-text-2 transition-all duration-300">
            {freelancerDetails.name}
          </h3>
          <p className="text-sm text-[var(--ch-text-muted)] truncate">{freelancerDetails.domain}</p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3">
        <div className="flex items-start">
          <svg className="w-4 h-4 text-[#14F195] mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="text-sm text-[var(--ch-text-muted)] truncate">{freelancerDetails.skills}</span>
        </div>
        <div className="flex items-start">
          <svg className="w-4 h-4 text-[var(--ch-primary)] mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-sm text-[var(--ch-text-muted)] truncate">{freelancerDetails.contact}</span>
        </div>
      </div>

      {/* View Profile Link */}
      <div className="mt-4 pt-4 border-t border-[var(--ch-border)]">
        <span className="flex items-center text-sm text-[#14F195] font-medium group-hover:translate-x-2 transition-transform duration-300">
          View Profile
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  )
}
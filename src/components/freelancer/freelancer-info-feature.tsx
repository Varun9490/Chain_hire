'use client'

import { useQueries } from '@tanstack/react-query';
import { useFreelancerAccounts } from './freelancer-data-access'
import { PublicKey } from '@solana/web3.js'
import { useMemo } from 'react';

export default function FreelancerInfoFeature({ account }: { account: String }) {
  if (!account) {
    throw new Error('account is undefined');
  }
  const publicKey = useMemo(() => new PublicKey(account), [account]);
  const { queryFreelancerAccount, QueryFreelancerPerformance: queryFreelancerPerformance, fetchFreelancerProjects: queryFreelancerProjects } = useFreelancerAccounts({ account: publicKey });

  const freelancerDetails = queryFreelancerAccount.data;
  const freelancerLoading = queryFreelancerAccount.isLoading;

  const freelancerPerformance = queryFreelancerPerformance.data;
  const performanceLoading = queryFreelancerPerformance.isLoading;

  let projectCounter = freelancerDetails?.projectCounter.toNumber() || 0;

  const projectQueries = useQueries({
    queries: useMemo(() => {
      if (!projectCounter) return [];
      return Array.from({ length: projectCounter }, (_, i) => {
        return {
          queryKey: ['fetch-freelancer-project', i + 1],
          queryFn: () => queryFreelancerProjects(publicKey, i + 1),
        };
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectCounter, publicKey]),
  });

  const projectsLoading = projectQueries.some(q => q.isLoading)
  const freelancerProjects = projectQueries.map(q => q.data).filter(Boolean)

  if (freelancerLoading || performanceLoading || projectsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-[#14F195]/30 border-t-[#14F195] animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-[#14F195]/20"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8 animate-fadeIn">
      {/* Header Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Freelancer Info Card */}
        <div className="glass-card p-8">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#14F195] to-[#10B981] flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {freelancerDetails?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text-2">{freelancerDetails?.name}</h1>
              <p className="text-[var(--ch-text-muted)]">Freelancer Profile</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[var(--ch-dark-light)] border border-[var(--ch-border)]">
              <p className="text-xs text-[var(--ch-text-muted)] mb-1">Wallet Address</p>
              <p className="text-sm font-mono text-[var(--ch-text)] break-all">{publicKey.toBase58()}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[var(--ch-dark-light)] border border-[var(--ch-border)]">
                <p className="text-xs text-[var(--ch-text-muted)] mb-1">Domain</p>
                <p className="text-sm font-medium text-[var(--ch-text)]">{freelancerDetails?.domain}</p>
              </div>
              <div className="p-4 rounded-xl bg-[var(--ch-dark-light)] border border-[var(--ch-border)]">
                <p className="text-xs text-[var(--ch-text-muted)] mb-1">Contact</p>
                <p className="text-sm font-medium text-[var(--ch-text)]">{freelancerDetails?.contact}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--ch-dark-light)] border border-[var(--ch-border)]">
              <p className="text-xs text-[var(--ch-text-muted)] mb-1">Skills & Expertise</p>
              <p className="text-sm text-[var(--ch-text)]">{freelancerDetails?.skills}</p>
            </div>
          </div>
        </div>

        {/* Performance Report Card */}
        <div className="glass-card p-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9945FF] to-[#B06EFF] flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--ch-text)]">Performance Report</h2>
              <p className="text-sm text-[var(--ch-text-muted)]">Work history overview</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-[var(--ch-dark-light)] border border-[var(--ch-border)] text-center">
              <p className="text-2xl font-bold text-[#14F195]">{freelancerPerformance?.totalProjects.toNumber()}</p>
              <p className="text-xs text-[var(--ch-text-muted)] mt-1">Total Projects</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--ch-dark-light)] border border-[var(--ch-border)] text-center">
              <p className="text-2xl font-bold text-[var(--ch-primary)]">{freelancerPerformance?.completed.toNumber()}</p>
              <p className="text-xs text-[var(--ch-text-muted)] mt-1">Completed</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--ch-dark-light)] border border-[var(--ch-border)] text-center">
              <p className="text-2xl font-bold text-amber-400">{freelancerPerformance?.projectsInProgress.toNumber()}</p>
              <p className="text-xs text-[var(--ch-text-muted)] mt-1">In Progress</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--ch-dark-light)] border border-[var(--ch-border)] text-center">
              <p className="text-2xl font-bold text-red-400">{freelancerPerformance?.rejected.toNumber()}</p>
              <p className="text-xs text-[var(--ch-text-muted)] mt-1">Cancelled</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[var(--ch-dark-light)] border border-[var(--ch-border)]">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-[var(--ch-text-muted)]">Success Rate</p>
                <p className="text-lg font-bold text-[#14F195]">
                  {(freelancerPerformance && freelancerPerformance?.successRate) ? freelancerPerformance.successRate / 100 : 0}%
                </p>
              </div>
              <div className="h-2 rounded-full bg-[var(--ch-dark)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#14F195] to-[#10B981]"
                  style={{ width: `${(freelancerPerformance && freelancerPerformance?.successRate) ? freelancerPerformance.successRate / 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--ch-dark-light)] border border-[var(--ch-border)]">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-[var(--ch-text-muted)]">Risk Score</p>
                <p className="text-lg font-bold text-amber-400">
                  {(freelancerPerformance && freelancerPerformance?.riskScore) ? freelancerPerformance?.riskScore / 100 : 0}%
                </p>
              </div>
              <div className="h-2 rounded-full bg-[var(--ch-dark)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                  style={{ width: `${(freelancerPerformance && freelancerPerformance?.riskScore) ? freelancerPerformance?.riskScore / 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Projects Section */}
      <section>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14F195] to-[#10B981] flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--ch-text)]">Assigned Projects</h2>
            <p className="text-sm text-[var(--ch-text-muted)]">{freelancerProjects.length} project{freelancerProjects.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancerProjects.map((result, i) => (
            <FreelancerProjectCard key={i} details={result} />
          ))}
        </div>

        {freelancerProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-[var(--ch-dark-card)] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--ch-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-[var(--ch-text-muted)]">No projects assigned yet</p>
          </div>
        )}
      </section>
    </div>
  );
}

function FreelancerProjectCard({ details }: { details: any }) {
  return (
    <div className="glass-card p-6 card-hover group">
      <h3 className="text-lg font-semibold text-[var(--ch-text)] mb-4 truncate group-hover:gradient-text-2 transition-all duration-300">
        {details?.projectName}
      </h3>

      <div className="space-y-3">
        <div className="flex items-start">
          <svg className="w-4 h-4 text-[var(--ch-text-muted)] mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-sm text-[var(--ch-text-muted)] truncate font-mono">{details?.projectClient.toBase58().slice(0, 16)}...</span>
        </div>

        <div className="flex items-center">
          <svg className="w-4 h-4 text-[#14F195] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-[#14F195]">{details?.approvedTasks.toNumber()} tasks approved</span>
        </div>

        <div className="flex items-center">
          <svg className="w-4 h-4 text-red-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-red-400">{details?.rejectedAttempts.toNumber()} rejected attempts</span>
        </div>
      </div>
    </div>
  )
}
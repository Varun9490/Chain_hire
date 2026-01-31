'use client'

import { PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import { useFreelancerAccounts } from "../freelancer/freelancer-data-access";
import { useClientAccounts } from "../client/client-data-access";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { Modal } from "../modal/modal";
import { BN } from "@coral-xyz/anchor";


export function MyProjects({ address }: { address: PublicKey }) {
  const { queryFreelancerAccount, fetchFreelancerProjects } = useFreelancerAccounts({ account: address });
  const { queryClientAccount, fetchClientProjects } = useClientAccounts({ account: address });

  const clientDetails = queryClientAccount.data;
  const clientProjectCounter = clientDetails?.projectCounter.toNumber() || 0;


  const clientProjectQueries = useQueries({
    queries: useMemo(() => {
      if (!clientProjectCounter) return [];
      return Array.from({ length: clientProjectCounter }, (_, i) => {
        return {
          queryKey: ['fetch-client-project', i + 1],
          queryFn: () => fetchClientProjects(address, i + 1),
        };
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clientProjectCounter, address]),
  });

  const clientProjectsLoading = clientProjectQueries.some(q => q.isLoading)
  const clientProjects = clientProjectQueries.map(q => q.data).filter(Boolean)
  const freelancerDetails = queryFreelancerAccount.data;
  const freelancerProjectCounter = freelancerDetails?.projectCounter.toNumber() || 0;

  const freelancerProjectQueries = useQueries({
    queries: useMemo(() => {
      if (!freelancerProjectCounter) return [];
      return Array.from({ length: freelancerProjectCounter }, (_, i) => {
        return {
          queryKey: ['fetch-freelancer-project', i + 1],
          queryFn: () => fetchFreelancerProjects(address, i + 1),
        };
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [freelancerProjectCounter, address]),
  });

  const freelancerProjectLoading = freelancerProjectQueries.some(q => q.isLoading)
  const freelancerProjects = freelancerProjectQueries.map(q => q.data).filter(Boolean)

  if (clientProjectsLoading && freelancerProjectLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-[var(--ch-primary)]/30 border-t-[var(--ch-primary)] animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-[var(--ch-primary)]/20"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 py-8">
      {/* Client Projects Section */}
      {clientProjects.length > 0 && (
        <section className="animate-fadeIn">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9945FF] to-[#B06EFF] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold gradient-text">Client Projects</h2>
              <p className="text-sm text-[var(--ch-text-muted)]">{clientProjects.length} project{clientProjects.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientProjects.map((result, i) => (
              <ClientProjectCard
                key={i}
                address={address}
                details={result}
              />
            ))}
          </div>
        </section>
      )}

      {/* Freelancer Projects Section */}
      {freelancerProjects.length > 0 && (
        <section className="animate-fadeIn">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14F195] to-[#10B981] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold gradient-text-2">Freelancer Projects</h2>
              <p className="text-sm text-[var(--ch-text-muted)]">{freelancerProjects.length} project{freelancerProjects.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {freelancerProjects.map((result, i) => (
              <FreelancerProjectCard
                key={i}
                address={address}
                details={result}
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {clientProjects.length === 0 && freelancerProjects.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-[var(--ch-dark-card)] flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[var(--ch-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[var(--ch-text)] mb-2">No Projects Yet</h3>
          <p className="text-[var(--ch-text-muted)] max-w-md mx-auto">
            Start by registering as a client to publish projects, or as a freelancer to receive project assignments.
          </p>
        </div>
      )}
    </div>
  )
}

type EscrowAccount = {
  depositor: PublicKey;
  receiver: PublicKey;
  vault: PublicKey;
  budget: BN;
  amountPaid: BN;
  totalTasks: BN;
  tasksCompleted: BN;
  isActive: boolean;
};

// Helper function to validate Solana public key
const isValidPublicKey = (address: string): boolean => {
  if (!address || address.trim() === '') return false;
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};

function ClientProjectCard({ address, details }: { address: PublicKey, details: any; }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSubModal, setIsOpenSubModal] = useState(false);
  const [freelancerAccount, setFreelancerAccount] = useState('');
  const [newFreelancerAccount, setNewFreelancerAccount] = useState('');
  const [budget, setBudget] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [vaultBalance, setVaultBalance] = useState(0);

  const queryClient = useQueryClient();
  const { ProjectEscrowSetupMutation, fetchEscrowAccount, ReviewTaskProcessMutation, fetchVaultAccountBalance, WithdrawProjectMutation, TransferProjectMutation } = useClientAccounts({ account: address });

  const [escrowAccount, setEscrowAccount] = useState<EscrowAccount | null>(null);
  const [reloadCounter, setReloadCounter] = useState(0);

  // Validation for escrow setup form
  const isEscrowFormValid = isValidPublicKey(freelancerAccount) && budget > 0 && totalTasks > 0;

  // Validation for transfer form
  const isTransferFormValid = isValidPublicKey(newFreelancerAccount);


  useEffect(() => {
    const DEFAULT_PROGRAM_ID = new PublicKey("11111111111111111111111111111111");
    const loadEscrowAccount = async () => {
      if (!address || !details?.isActive || details?.assignedFreelancerProjectId.toNumber() === 0) return;
      try {
        const data = await fetchEscrowAccount(address, details?.id.toNumber());
        const vaultBalance = await fetchVaultAccountBalance(address, details?.id.toNumber());
        setVaultBalance(vaultBalance);
        setEscrowAccount(data);
        if (!(details?.assignedFreelancer.toString() === DEFAULT_PROGRAM_ID.toString()) && escrowAccount) {
          setFreelancerAccount(details?.assignedFreelancer.toString());
          setBudget(escrowAccount?.budget.toNumber());
        }
      } catch (err) {
        console.log(`Error fetching escrow account: ${details?.id}`, err);
        setEscrowAccount(null);
        setVaultBalance(0);
      }
    };

    loadEscrowAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, details, reloadCounter]);

  // Status colors
  const getStatusConfig = () => {
    if (!details?.isActive) {
      return { bg: 'from-gray-500/20 to-gray-600/20', border: 'border-gray-500/30', text: 'text-gray-400', label: 'Completed' };
    }
    if (details?.taskInReview) {
      return { bg: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30', text: 'text-amber-400', label: 'Review Pending' };
    }
    if (details?.inProgress) {
      return { bg: 'from-[#9945FF]/20 to-[#B06EFF]/20', border: 'border-[#9945FF]/30', text: 'text-[#9945FF]', label: 'In Progress' };
    }
    return { bg: 'from-[#14F195]/20 to-[#10B981]/20', border: 'border-[#14F195]/30', text: 'text-[#14F195]', label: 'Open' };
  };

  const statusConfig = getStatusConfig();

  const projectSetupMut = ProjectEscrowSetupMutation(() => {
    setIsOpen(false);
    setFreelancerAccount('');
    queryClient.invalidateQueries({ queryKey: ['fetch-client-project'] });
  });

  const reviewProcessTaskMut = ReviewTaskProcessMutation(() => {
    setIsOpen(false);
    queryClient.invalidateQueries({ queryKey: ['fetch-client-project'] });
  });

  const withdrawProjectMut = WithdrawProjectMutation(() => {
    setIsOpen(false);
    queryClient.invalidateQueries({ queryKey: ['fetch-client-project'] });
    setReloadCounter((prev) => prev + 1);
  });

  const transferProjectMut = TransferProjectMutation(() => {
    setIsOpen(false);
    setIsOpenSubModal(false);
    setNewFreelancerAccount('');
    queryClient.invalidateQueries({ queryKey: ['fetch-client-project'] });
  });

  return (
    <div>
      <div
        onClick={() => setIsOpen(true)}
        className={`glass-card p-6 card-hover cursor-pointer group relative overflow-hidden`}
      >
        {/* Status Badge */}
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text}`}>
          {statusConfig.label}
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-[var(--ch-text)] mb-4 pr-24 truncate group-hover:gradient-text transition-all duration-300">
          {details?.name}
        </h3>

        <div className="space-y-3">
          <div className="flex items-start">
            <svg className="w-4 h-4 text-[var(--ch-primary)] mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            <span className="text-sm text-[var(--ch-text-muted)] truncate">{details?.description}</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 text-[#14F195] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-[#14F195]">{details?.budget.toNumber()} SOL</span>
          </div>
          {details?.taskInReview && (
            <div className="flex items-center">
              <svg className="w-4 h-4 text-amber-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm text-amber-400">Task review requested</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-[var(--ch-border)]">
          <span className="flex items-center text-sm text-[var(--ch-primary)] font-medium group-hover:translate-x-2 transition-transform duration-300">
            View Details
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>

      {/* Project Modal */}
      {isOpen && (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9945FF] to-[#B06EFF] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--ch-text)]">{details?.name}</h3>
                <p className="text-sm text-[var(--ch-text-muted)]">Project #{details?.id.toNumber()}</p>
              </div>
            </div>

            {/* Escrow Setup Form (for unassigned projects) */}
            {!escrowAccount && details?.isActive && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[var(--ch-dark-light)] border border-[var(--ch-border)]">
                  <h4 className="text-sm font-semibold text-[var(--ch-text)] mb-3">Assign Freelancer</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-[var(--ch-text-muted)] mb-2">Freelancer Wallet Address</label>
                      <input
                        id="freelancer-account"
                        type="text"
                        placeholder="Enter wallet address"
                        className="input-chainhire"
                        value={freelancerAccount}
                        required
                        onChange={(e) => setFreelancerAccount(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--ch-text-muted)] mb-2">Finalized Budget (SOL)</label>
                      <input
                        id="budget"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Budget"
                        className="input-chainhire"
                        disabled={details?.assignedFreelancerProjectId.toNumber() !== 0}
                        value={budget}
                        required
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            setBudget(Number(value));
                          }
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--ch-text-muted)] mb-2">Total Tasks</label>
                      <input
                        id="new-total-tasks"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Number of tasks"
                        className="input-chainhire"
                        value={totalTasks}
                        required
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            setTotalTasks(Number(value));
                          }
                        }}
                      />
                    </div>
                    {!isEscrowFormValid && freelancerAccount.length > 0 && !isValidPublicKey(freelancerAccount) && (
                      <p className="text-sm text-red-400">Please enter a valid Solana wallet address</p>
                    )}
                    <button
                      className={`w-full btn-chainhire py-3 ${!isEscrowFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => projectSetupMut.mutateAsync({ projectID: details?.id, projectName: details?.name, freelancer: new PublicKey(freelancerAccount), budget: budget, totalTasks: totalTasks })}
                      disabled={projectSetupMut.isPending || !isEscrowFormValid}>
                      {projectSetupMut.isPending ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Assigning...
                        </span>
                      ) : 'Assign Freelancer & Fund Escrow'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Escrow Details (for assigned projects) */}
            {escrowAccount && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[var(--ch-dark-light)] border border-[var(--ch-border)]">
                    <p className="text-xs text-[var(--ch-text-muted)] mb-1">Budget</p>
                    <p className="text-lg font-semibold text-[#14F195]">{escrowAccount?.budget.toNumber()} SOL</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--ch-dark-light)] border border-[var(--ch-border)]">
                    <p className="text-xs text-[var(--ch-text-muted)] mb-1">Vault Balance</p>
                    <p className="text-lg font-semibold text-[var(--ch-primary)]">{(vaultBalance / 1000000000).toFixed(4)} SOL</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--ch-dark-light)] border border-[var(--ch-border)]">
                    <p className="text-xs text-[var(--ch-text-muted)] mb-1">Amount Paid</p>
                    <p className="text-lg font-semibold text-[var(--ch-text)]">{(escrowAccount?.amountPaid.toNumber() / 1000000000).toFixed(4)} SOL</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--ch-dark-light)] border border-[var(--ch-border)]">
                    <p className="text-xs text-[var(--ch-text-muted)] mb-1">Progress</p>
                    <p className="text-lg font-semibold text-[var(--ch-text)]">{escrowAccount?.tasksCompleted.toNumber()} / {escrowAccount?.totalTasks.toNumber()} tasks</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[var(--ch-dark-light)] border border-[var(--ch-border)]">
                  <p className="text-xs text-[var(--ch-text-muted)] mb-1">Assigned Freelancer</p>
                  <p className="text-sm font-mono text-[var(--ch-text)] break-all">{details?.assignedFreelancer.toBase58()}</p>
                </div>

                {/* Task Review Section */}
                {details?.isActive && details?.taskInReview && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <h4 className="text-sm font-semibold text-amber-400 mb-3">Task Review Requested</h4>
                    <a
                      href={details?.taskInReview}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-lg bg-[var(--ch-dark)] text-[var(--ch-primary)] hover:text-[var(--ch-primary-light)] break-all text-sm mb-4"
                    >
                      {details?.taskInReview}
                    </a>
                    <div className="flex space-x-3">
                      <button
                        className="flex-1 py-2.5 px-4 rounded-xl bg-[#14F195]/20 border border-[#14F195]/30 text-[#14F195] font-medium hover:bg-[#14F195]/30 transition-colors"
                        onClick={() => reviewProcessTaskMut.mutateAsync({ projectID: details?.id, approval: true, assignedFreelancer: details?.assignedFreelancer, assignedFreelancerProjectID: details?.assignedFreelancerProjectId.toNumber() })}
                      >
                        ✓ Approve
                      </button>
                      <button
                        className="flex-1 py-2.5 px-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-medium hover:bg-red-500/30 transition-colors"
                        onClick={() => reviewProcessTaskMut.mutateAsync({ projectID: details?.id, approval: false, assignedFreelancer: details?.assignedFreelancer, assignedFreelancerProjectID: details?.assignedFreelancerProjectId.toNumber() })}
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                )}

                {/* Project Actions */}
                {details?.isActive && (
                  <div className="flex space-x-3 pt-4 border-t border-[var(--ch-border)]">
                    <button
                      className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 font-medium hover:bg-amber-500/30 transition-colors"
                      onClick={() => setIsOpenSubModal(true)}>
                      Transfer
                    </button>
                    <button
                      className="flex-1 py-2.5 px-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-medium hover:bg-red-500/30 transition-colors"
                      onClick={() => withdrawProjectMut.mutateAsync({ projectID: details?.id })}
                      disabled={withdrawProjectMut.isPending}>
                      {withdrawProjectMut.isPending ? 'Withdrawing...' : 'Withdraw'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Transfer Modal */}
      {isOpenSubModal && (
        <Modal isOpen={isOpenSubModal} onClose={() => setIsOpenSubModal(false)}>
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--ch-text)]">Transfer Project</h3>
                <p className="text-sm text-[var(--ch-text-muted)]">Assign to a new freelancer</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--ch-text-muted)] mb-2">New Freelancer Wallet Address</label>
                <input
                  id="new-freelancer-account"
                  type="text"
                  placeholder="Enter wallet address"
                  className="input-chainhire"
                  value={newFreelancerAccount}
                  required
                  onChange={(e) => setNewFreelancerAccount(e.target.value)}
                />
              </div>
              {!isTransferFormValid && newFreelancerAccount.length > 0 && (
                <p className="text-sm text-red-400">Please enter a valid Solana wallet address</p>
              )}
              <button
                className={`w-full btn-chainhire py-3 ${!isTransferFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => transferProjectMut.mutateAsync({ projectID: details?.id, newFreelancer: new PublicKey(newFreelancerAccount) })}
                disabled={transferProjectMut.isPending || !isTransferFormValid}>
                {transferProjectMut.isPending ? 'Transferring...' : 'Transfer Project'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function FreelancerProjectCard({ address, details }: { address: PublicKey, details: any; }) {
  const { TaskReviewMutation } = useFreelancerAccounts({ account: address });
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false)
  const [taskURL, setTaskURL] = useState('')

  useEffect(() => {
    if (details && details?.completedTaskUrl !== '') {
      setTaskURL(details?.completedTaskUrl);
    }
  }, [details]);


  const getStatusConfig = () => {
    if (!details?.isActive) {
      return { bg: 'from-gray-500/20 to-gray-600/20', border: 'border-gray-500/30', text: 'text-gray-400', label: 'Completed' };
    }
    if (details?.completedTaskUrl !== '') {
      return { bg: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30', text: 'text-amber-400', label: 'Pending Review' };
    }
    return { bg: 'from-[#14F195]/20 to-[#10B981]/20', border: 'border-[#14F195]/30', text: 'text-[#14F195]', label: 'Active' };
  };

  const statusConfig = getStatusConfig();

  const taskReviewMut = TaskReviewMutation(() => {
    setIsOpen(false);
    setTaskURL('');
    queryClient.invalidateQueries({ queryKey: ['fetch-freelancer-project'] });
  });

  const isRequestFormValid = () => {
    if (taskURL.length === 0) {
      return false;
    }
    return true;
  }

  return (
    <div>
      <div
        onClick={() => setIsOpen(true)}
        className="glass-card p-6 card-hover cursor-pointer group relative overflow-hidden"
      >
        {/* Status Badge */}
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text}`}>
          {statusConfig.label}
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-[var(--ch-text)] mb-4 pr-24 truncate group-hover:gradient-text-2 transition-all duration-300">
          {details?.projectName}
        </h3>

        <div className="space-y-3">
          <div className="flex items-start">
            <svg className="w-4 h-4 text-[var(--ch-text-muted)] mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm text-[var(--ch-text-muted)] truncate font-mono">{details?.projectClient.toBase58().slice(0, 8)}...</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 text-[#14F195] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-[#14F195]">{(details?.amountPaid.toNumber() / 1000000000).toFixed(4)} SOL earned</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 text-[var(--ch-primary)] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-[var(--ch-text-muted)]">{details?.approvedTasks.toNumber()} tasks approved</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[var(--ch-border)]">
          <span className="flex items-center text-sm text-[#14F195] font-medium group-hover:translate-x-2 transition-transform duration-300">
            View Details
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>

      {/* Project Modal */}
      {isOpen && (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#14F195] to-[#10B981] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--ch-text)]">{details?.projectName}</h3>
                <p className="text-sm text-[var(--ch-text-muted)]">Project #{details?.id.toNumber()}</p>
              </div>
            </div>

            {/* Project Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[var(--ch-dark-light)] border border-[var(--ch-border)]">
                <p className="text-xs text-[var(--ch-text-muted)] mb-1">Earnings</p>
                <p className="text-lg font-semibold text-[#14F195]">{(details?.amountPaid.toNumber() / 1000000000).toFixed(4)} SOL</p>
              </div>
              <div className="p-4 rounded-xl bg-[var(--ch-dark-light)] border border-[var(--ch-border)]">
                <p className="text-xs text-[var(--ch-text-muted)] mb-1">Tasks Approved</p>
                <p className="text-lg font-semibold text-[var(--ch-text)]">{details?.approvedTasks.toNumber()}</p>
              </div>
              <div className="p-4 rounded-xl bg-[var(--ch-dark-light)] border border-[var(--ch-border)]">
                <p className="text-xs text-[var(--ch-text-muted)] mb-1">Rejected Attempts</p>
                <p className="text-lg font-semibold text-red-400">{details?.rejectedAttempts.toNumber()}</p>
              </div>
              <div className="p-4 rounded-xl bg-[var(--ch-dark-light)] border border-[var(--ch-border)]">
                <p className="text-xs text-[var(--ch-text-muted)] mb-1">Status</p>
                <p className={`text-lg font-semibold ${details?.isActive ? 'text-[#14F195]' : 'text-gray-400'}`}>
                  {details?.isActive ? 'Active' : 'Completed'}
                </p>
              </div>
            </div>

            {/* Client Info */}
            <div className="p-4 rounded-xl bg-[var(--ch-dark-light)] border border-[var(--ch-border)]">
              <p className="text-xs text-[var(--ch-text-muted)] mb-1">Project Owner</p>
              <p className="text-sm font-mono text-[var(--ch-text)] break-all">{details?.projectClient.toBase58()}</p>
            </div>

            {/* Task Submission */}
            {details?.isActive && (
              <div className="p-4 rounded-xl bg-[var(--ch-dark-light)] border border-[var(--ch-border)]">
                <h4 className="text-sm font-semibold text-[var(--ch-text)] mb-3">Submit Task for Review</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-[var(--ch-text-muted)] mb-2">Task URL</label>
                    <input
                      id="input-task-url"
                      type="text"
                      placeholder="Enter URL to completed work"
                      className="input-chainhire"
                      value={taskURL}
                      minLength={1}
                      required
                      disabled={details?.completedTaskUrl !== ''}
                      onChange={(e) => setTaskURL(e.target.value)}
                    />
                  </div>
                  <button
                    id="request-task-review"
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${details?.completedTaskUrl !== ''
                      ? 'bg-amber-500/20 text-amber-400 cursor-not-allowed'
                      : 'btn-success hover:translate-y-[-2px]'
                      }`}
                    onClick={() => taskReviewMut.mutateAsync({ projectID: details?.id, projectName: details?.projectName, taskURL: taskURL })}
                    disabled={taskReviewMut.isPending || details?.completedTaskUrl !== '' || details?.isActive === false || !isRequestFormValid()}>
                    {details?.completedTaskUrl !== '' ? (
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Pending Review
                      </span>
                    ) : taskReviewMut.isPending ? 'Submitting...' : 'Request Task Review'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}

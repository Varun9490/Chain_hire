'use client'

import { useConnection } from '@solana/wallet-adapter-react'
import { IconTrash } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'
import { AppModal } from '../ui/ui-layout'
import { ClusterNetwork, useCluster } from './cluster-data-access'
import { Connection } from '@solana/web3.js'

export function ExplorerLink({ path, label, className }: { path: string; label: string; className?: string }) {
  const { getExplorerUrl } = useCluster()
  return (
    <a
      href={getExplorerUrl(path)}
      target="_blank"
      rel="noopener noreferrer"
      className={className ? className : `text-[var(--ch-primary)] hover:text-[var(--ch-primary-light)] font-mono transition-colors`}
    >
      {label}
    </a>
  )
}

export function ClusterChecker({ children }: { children: ReactNode }) {
  const { cluster } = useCluster()
  const { connection } = useConnection()

  const query = useQuery({
    queryKey: ['version', { cluster, endpoint: connection.rpcEndpoint }],
    queryFn: () => connection.getVersion(),
    retry: 1,
  })
  if (query.isLoading) {
    return null
  }
  if (query.isError || !query.data) {
    return (
      <div className="bg-amber-500/10 border border-amber-500/30 px-4 py-3 flex items-center justify-center gap-4">
        <span className="text-amber-400 text-sm">
          Error connecting to cluster <strong>{cluster.name}</strong>
        </span>
        <button
          className="px-3 py-1 text-xs font-medium rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
          onClick={() => query.refetch()}
        >
          Refresh
        </button>
      </div>
    )
  }
  return children
}

export function ClusterUiSelect() {
  const { clusters, setCluster, cluster } = useCluster()

  // Get network indicator color
  const getNetworkColor = (name: string) => {
    switch (name) {
      case 'devnet':
        return 'bg-[#14F195]'
      case 'testnet':
        return 'bg-amber-400'
      case 'local':
        return 'bg-[var(--ch-accent)]'
      default:
        return 'bg-[var(--ch-primary)]'
    }
  }

  return (
    <div className="dropdown dropdown-end">
      <label
        tabIndex={0}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--ch-dark-light)] border border-[var(--ch-border)] cursor-pointer hover:border-[var(--ch-primary)]/50 transition-colors"
      >
        <span className={`w-2 h-2 rounded-full ${getNetworkColor(cluster.name)}`}></span>
        <span className="text-sm font-medium text-[var(--ch-text)]">{cluster.name}</span>
        <svg className="w-4 h-4 text-[var(--ch-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </label>
      <ul
        tabIndex={0}
        className="menu dropdown-content z-[100] p-2 mt-2 glass-card border border-[var(--ch-border)] rounded-xl w-44"
      >
        {clusters.map((item) => (
          <li key={item.name}>
            <button
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${item.active
                  ? 'bg-[var(--ch-primary)]/20 text-[var(--ch-primary)]'
                  : 'text-[var(--ch-text-muted)] hover:text-[var(--ch-text)] hover:bg-[var(--ch-dark-light)]'
                }`}
              onClick={() => setCluster(item)}
            >
              <span className={`w-2 h-2 rounded-full ${getNetworkColor(item.name)}`}></span>
              {item.name}
              {item.active && (
                <svg className="w-4 h-4 ml-auto text-[var(--ch-primary)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ClusterUiModal({ hideModal, show }: { hideModal: () => void; show: boolean }) {
  const { addCluster } = useCluster()
  const [name, setName] = useState('')
  const [network, setNetwork] = useState<ClusterNetwork | undefined>()
  const [endpoint, setEndpoint] = useState('')

  return (
    <AppModal
      title={'Add Custom Cluster'}
      hide={hideModal}
      show={show}
      submit={() => {
        try {
          new Connection(endpoint)
          if (name) {
            addCluster({ name, network, endpoint })
            hideModal()
          } else {
            console.log('Invalid cluster name')
          }
        } catch {
          console.log('Invalid cluster endpoint')
        }
      }}
      submitLabel="Save"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--ch-text-muted)] mb-2">Cluster Name</label>
          <input
            id="cluster-name"
            type="text"
            placeholder="my-cluster"
            className="input-chainhire"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--ch-text-muted)] mb-2">RPC Endpoint</label>
          <input
            id="cluster-endpoint"
            type="text"
            placeholder="https://api.example.com"
            className="input-chainhire"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--ch-text-muted)] mb-2">Network Type</label>
          <select
            className="w-full px-4 py-3 rounded-xl bg-[var(--ch-dark-light)] border border-[var(--ch-border)] text-[var(--ch-text)] focus:outline-none focus:border-[var(--ch-primary)] transition-colors"
            value={network}
            onChange={(e) => setNetwork(e.target.value as ClusterNetwork)}
          >
            <option value={undefined}>Select a network</option>
            <option value={ClusterNetwork.Devnet}>Devnet</option>
            <option value={ClusterNetwork.Testnet}>Testnet</option>
            <option value={ClusterNetwork.Mainnet}>Mainnet</option>
            <option value={ClusterNetwork.Custom}>Custom</option>
          </select>
        </div>
      </div>
    </AppModal>
  )
}

export function ClusterUiTable() {
  const { clusters, setCluster, deleteCluster } = useCluster()
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--ch-border)]">
              <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--ch-text)]">Cluster</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-[var(--ch-text)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clusters.map((item) => (
              <tr
                key={item.name}
                className={`border-b border-[var(--ch-border)] last:border-b-0 transition-colors ${item?.active ? 'bg-[var(--ch-primary)]/5' : 'hover:bg-[var(--ch-dark-light)]'
                  }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${item.name === 'devnet' ? 'bg-[#14F195]' :
                        item.name === 'testnet' ? 'bg-amber-400' :
                          item.name === 'local' ? 'bg-[var(--ch-accent)]' :
                            'bg-[var(--ch-primary)]'
                      }`}></span>
                    <div>
                      <div className="flex items-center gap-2">
                        {item?.active ? (
                          <span className="text-lg font-semibold text-[var(--ch-text)]">{item.name}</span>
                        ) : (
                          <button
                            title="Select cluster"
                            className="text-lg font-semibold text-[var(--ch-primary)] hover:text-[var(--ch-primary-light)] transition-colors"
                            onClick={() => setCluster(item)}
                          >
                            {item.name}
                          </button>
                        )}
                        {item?.active && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-[#14F195]/20 text-[#14F195]">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[var(--ch-text-muted)] mt-1">
                        {item.network ?? 'custom'} • <span className="font-mono">{item.endpoint}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    disabled={item?.active}
                    className={`p-2 rounded-lg transition-colors ${item?.active
                        ? 'text-[var(--ch-text-muted)]/30 cursor-not-allowed'
                        : 'text-red-400 hover:bg-red-500/20'
                      }`}
                    onClick={() => {
                      if (!window.confirm('Are you sure you want to delete this cluster?')) return
                      deleteCluster(item)
                    }}
                  >
                    <IconTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

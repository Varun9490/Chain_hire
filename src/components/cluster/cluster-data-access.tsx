'use client'

import { clusterApiUrl, Connection } from '@solana/web3.js'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { createContext, ReactNode, useContext } from 'react'
import toast from 'react-hot-toast'

export interface Cluster {
  name: string
  endpoint: string
  network?: ClusterNetwork
  active?: boolean
}

export enum ClusterNetwork {
  Mainnet = 'mainnet-beta',
  Testnet = 'testnet',
  Devnet = 'devnet',
  Custom = 'custom',
}

// ChainHire Default Clusters
// Devnet is the primary cluster for demo and testing
// Using Helius free RPC to avoid rate limits on public Solana RPC
// You can get your own free API key at https://dev.helius.xyz/
export const defaultClusters: Cluster[] = [
  {
    name: 'devnet',
    endpoint: 'https://devnet.helius-rpc.com/?api-key=6a8002c2-c911-4223-b881-83f4726a8429', // Alternative: use Helius 'https://devnet.helius-rpc.com/?api-key=YOUR_API_KEY'
    network: ClusterNetwork.Devnet,
  },
  {
    name: 'local',
    endpoint: 'http://localhost:8899',
    network: ClusterNetwork.Custom,
  },
  {
    name: 'testnet',
    endpoint: clusterApiUrl('testnet'),
    network: ClusterNetwork.Testnet,
  },
]

// Default to Devnet for demo purposes
const defaultCluster = defaultClusters[0] // Devnet

const clusterAtom = atomWithStorage<Cluster>('chainhire-cluster', defaultCluster)
const clustersAtom = atomWithStorage<Cluster[]>('chainhire-clusters', defaultClusters)

const activeClustersAtom = atom<Cluster[]>((get) => {
  const clusters = get(clustersAtom)
  const cluster = get(clusterAtom)
  return clusters.map((item) => ({
    ...item,
    active: item.name === cluster.name,
  }))
})

const activeClusterAtom = atom<Cluster>((get) => {
  const clusters = get(activeClustersAtom)
  return clusters.find((item) => item.active) || clusters[0]
})

export interface ClusterProviderContext {
  cluster: Cluster
  clusters: Cluster[]
  addCluster: (cluster: Cluster) => void
  deleteCluster: (cluster: Cluster) => void
  setCluster: (cluster: Cluster) => void
  getExplorerUrl(path: string): string
}

const Context = createContext<ClusterProviderContext>({} as ClusterProviderContext)

export function ClusterProvider({ children }: { children: ReactNode }) {
  const cluster = useAtomValue(activeClusterAtom)
  const clusters = useAtomValue(activeClustersAtom)
  const setCluster = useSetAtom(clusterAtom)
  const setClusters = useSetAtom(clustersAtom)

  const value: ClusterProviderContext = {
    cluster,
    clusters: clusters.sort((a, b) => (a.name > b.name ? 1 : -1)),
    addCluster: (cluster: Cluster) => {
      try {
        new Connection(cluster.endpoint)
        setClusters([...clusters, cluster])
        toast.success(`Cluster "${cluster.name}" added`)
      } catch (err) {
        toast.error(`Failed to add cluster: ${err}`)
      }
    },
    deleteCluster: (cluster: Cluster) => {
      setClusters(clusters.filter((item) => item.name !== cluster.name))
      toast.success(`Cluster "${cluster.name}" removed`)
    },
    setCluster: (cluster: Cluster) => {
      setCluster(cluster)
      toast.success(`Switched to ${cluster.name}`)
    },
    getExplorerUrl: (path: string) => `https://explorer.solana.com/${path}${getClusterUrlParam(cluster)}`,
  }
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useCluster() {
  return useContext(Context)
}

function getClusterUrlParam(cluster: Cluster): string {
  let suffix = ''
  switch (cluster.network) {
    case ClusterNetwork.Devnet:
      suffix = 'devnet'
      break
    case ClusterNetwork.Mainnet:
      suffix = ''
      break
    case ClusterNetwork.Testnet:
      suffix = 'testnet'
      break
    default:
      suffix = `custom&customUrl=${encodeURIComponent(cluster.endpoint)}`
      break
  }

  return suffix.length ? `?cluster=${suffix}` : ''
}

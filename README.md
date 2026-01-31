# ChainHire: A Trustless Freelancing Platform on Solana

> 🏗️ A decentralized freelancing marketplace powered by Solana

## Overview

ChainHire is a decentralized freelancing platform built on the Solana blockchain. It introduces a new trustless protocol where clients and freelancers can collaborate on projects securely, without intermediaries. The platform leverages smart contracts to manage registration, project assignment, escrowed payments, and task validation.

It enables Clients and Freelancers to collaborate trustlessly using a milestone-based escrow system. Funds are securely held in program-controlled accounts and released on task approval, ensuring a transparent and secure freelancing experience.

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Architecture](#architecture)
* [Directory Structure](#directory-structure)
* [Smart Contract Overview](#smart-contract-overview)
* [Escrow and Vault Logic](#escrow-and-vault-logic)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Quick Start (Devnet Demo)](#quick-start-devnet-demo)
  * [Local Development Setup](#local-development-setup)
* [Usage](#usage)
* [Workflow](#workflow)
* [Security & Trust](#security--trust)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)

---

## Features

* **Role-based Registration**

  * Clients register by paying 1 SOL.
  * Freelancers register for free.

* **Project Management**

  * Clients publish projects with name, description, budget, and external links.
  * View and assign registered freelancers based on skills and contact.

* **Escrow and Payment Mechanism**

  * Escrow and vault accounts are created on project assignment.
  * Payments are released per task upon approval by the client.
  * Vaults close automatically when all tasks are completed.

* **Task Flow**

  * Freelancers request reviews by submitting URLs.
  * Clients review, reject, or approve tasks.

* **Advanced Project Controls**

  * Transfer projects to other freelancers mid-way.
  * Close projects prematurely with refunds.

* **Performance Metrics**

  * All actions logged.
  * Users have public report cards showing:

    * Success rate
    * Risk score

---

## Architecture

* **Frontend:** Next.js with modern dark UI
* **Smart Contracts:** Solana + Anchor
* **Storage:** Program-derived accounts (PDAs)
* **State:** Managed on-chain via Anchor accounts

---

## Directory Structure

```bash
├── src/                         # Next.js frontend code
├── .next/                       # Next.js build
├── anchor/programs              # Anchor smart contracts
├── anchor/migration_script/     # Custom deploy scripts
├── anchor/.anchor/              # Anchor build outputs
├── Anchor.toml                  # Anchor config
├── tsconfig.json                # TypeScript config
├── README.md                    # Project documentation
```

---

## Smart Contract Overview

### Instructions

* `initializeState`: Sets the program owner so that owner can withdraw amount earned by program via client registration.
* `initializeClient`: Creates client profile, deducts 1 SOL as registration fee.
* `initializeFreelancer`: Creates Freelancer profile. Free registration with skill metadata.
* `initializeProject`: Publishes a project with details.
* `projectEscrowSetup`: Assigns freelancer to a project.
* `requestTaskReview`: Freelancer submits task URL.
* `reviewTaskProcess`: Client either approves, releases per-task payment or rejects task (no payment).
* `transferProject`: Change assigned freelancer.
* `withdrawProject`: Closes project and refunds unspent budget.

### Accounts

* `State`
* `Client`
* `ClientReportCard`
* `Freelancer`
* `FreelancerReportCard`
* `Project`
* `Escrow`
* `Vault`
* `FreelancerProject`

---

## Escrow and Vault Logic

1. **Project Assignment**

   * Vault and escrow PDAs created
   * Full budget held in vault

2. **Task Approval**

   * Budget / total tasks = payout per task
   * Vault → Freelancer upon approval

3. **Project Completion**

   * Vault closed, escrow closed

4. **Early Termination**

   * Refund remaining SOL to Client

---

## Getting Started

### Prerequisites

* [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
* [Anchor Framework](https://www.anchor-lang.com/docs/installation)
* [Node.js](https://nodejs.org/) (v18+)
* [pnpm](https://pnpm.io/installation)
* A Solana wallet with SOL (for devnet testing)

---

## Quick Start (Devnet Demo)

This is the **fastest way** to try ChainHire without setting up a local validator. Use Solana Devnet for testing.

### Step 1: Clone and Install

```bash
git clone <repository-url>
cd chainhire
pnpm install
```

### Step 2: Create/Configure Solana Wallet

If you don't have a wallet yet:

```bash
# Generate a new keypair
solana-keygen new --outfile ~/.config/solana/id.json

# Or use your existing wallet
solana config set --keypair ~/.config/solana/id.json
```

### Step 3: Configure for Devnet

```bash
# Set Solana CLI to use devnet
solana config set --url https://api.devnet.solana.com

# Verify configuration
solana config get
```

### Step 4: Get Devnet SOL (Free Test Tokens)

```bash
# Request airdrop (you can request up to 2 SOL at a time)
solana airdrop 2

# Check your balance
solana balance

# If needed, request more airdrops (there may be rate limits)
solana airdrop 2
solana airdrop 2
```

> **Note:** If airdrop fails due to rate limiting, wait a few minutes or use the [Solana Faucet](https://faucet.solana.com/) website.

### Step 5: Deploy Smart Contract to Devnet

```bash
cd anchor

# Build the program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Note: Save the deployed Program ID if different from existing
```

### Step 6: Initialize Program State (One-time Setup)

```bash
# Make sure you're in the anchor directory
cd anchor

# Run the migration script to set program owner
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com \
ANCHOR_WALLET=~/.config/solana/id.json \
npx ts-node migration_script/migrate.ts
```

### Step 7: Start the Frontend

```bash
# Go back to project root
cd ..

# Start development server
pnpm dev
```

### Step 8: Connect to Devnet in Browser

1. Open http://localhost:3000
2. Click on **"devnet"** in the cluster selector (top-right)
3. Click **"Select Wallet"** and connect your Phantom/Solflare wallet
4. Make sure your wallet is also connected to **Devnet**
5. Start using ChainHire!

### Wallet Configuration for Devnet

#### Phantom Wallet:
1. Open Phantom
2. Click Settings (gear icon)
3. Go to "Developer Settings"
4. Enable "Testnet Mode"
5. Select "Devnet" as the network

#### Solflare Wallet:
1. Open Solflare
2. Click the network selector
3. Choose "Devnet"

---

## Local Development Setup

For local development with a test validator (faster iteration, offline capable):

### Step 1: Clone and Install

```bash
git clone <repository-url>
cd chainhire
pnpm install
```

### Step 2: Start Local Validator

Open a new terminal and run:

```bash
solana-test-validator
```

Keep this terminal running.

### Step 3: Configure for Localhost

```bash
# Configure Solana CLI for localhost
solana config set --url localhost

# Airdrop SOL to your wallet
solana airdrop 100
```

### Step 4: Build and Deploy

```bash
cd anchor

# Build the program
anchor build

# Deploy to local validator
anchor deploy
```

### Step 5: Initialize Program State

```bash
ANCHOR_PROVIDER_URL=http://127.0.0.1:8899 \
ANCHOR_WALLET=~/.config/solana/id.json \
npx ts-node migration_script/migrate.ts
```

### Step 6: Start Frontend

```bash
cd ..
pnpm dev
```

### Step 7: Access the Application

1. Open http://localhost:3000
2. Select **"localhost"** in the cluster selector
3. Connect your wallet

---

## Usage

### Client Flow

1. **Register as Client** (costs 1 SOL)
2. **Publish a project** with name, description, URL, and budget
3. **Assign project** to a registered freelancer
4. **Review task submissions** from freelancers
5. **Approve or reject tasks** (approved tasks release payment)
6. Optionally **transfer or withdraw** project

### Freelancer Flow

1. **Register as Freelancer** (free!)
2. **View available projects** on the platform
3. **Receive assignment** from clients
4. **Submit tasks** via URL for review
5. **Receive payouts** instantly upon task approval

---

## Workflow

### 1. Registration

* **Client** pays 1 SOL → ClientAccount created
* **Freelancer** signs up for free → FreelancerAccount created

### 2. Project Publishing

* Client provides project metadata + estimated budget

### 3. Assignment

* Client selects a freelancer
* Vault and escrow account initialized with project budget
* Full budget locked in escrow

### 4. Task Management

* Freelancer submits URL per task
* Client verifies and approves
* Upon approval: `budget/totalTasks` transferred to freelancer

### 5. Completion

* Final task triggers escrow/vault closure
* Freelancer receives remaining amount

### 6. Transfer/Abort

* Mid-project transfer creates a new assignment
* Abort returns remaining funds to client and closes vault

---

## Environment Variables

Create a `.env.local` file in the project root for custom configuration:

```bash
# Optional: Override the RPC endpoint
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Optional: Program ID (if different from default)
NEXT_PUBLIC_PROGRAM_ID=HQY5kLNtUJkEiArKxDyrkCKHBtK8pDFGUBifrGFjtLDt
```

---

## Troubleshooting

### Common Issues

**1. "Airdrop failed" on Devnet**
- Wait 1-2 minutes and try again (rate limiting)
- Use [Solana Faucet](https://faucet.solana.com/) as an alternative
- Check that you're connected to devnet: `solana config get`

**2. "Account not found" errors**
- Make sure the program is deployed to the correct cluster
- Run the migration script to initialize program state
- Verify your wallet is on the same network (devnet/localhost)

**3. Transaction fails with "insufficient funds"**
- Request more SOL via airdrop
- Client registration requires 1 SOL
- Project funding requires budget amount + small fee

**4. Wallet not connecting**
- Ensure your browser wallet is installed
- Check that wallet is set to the correct network (Devnet)
- Try refreshing the page

**5. Program deployment fails**
- Ensure you have enough SOL for deployment (~3-4 SOL)
- Check Anchor and Solana versions match
- Run `anchor build` before `anchor deploy`

---

## Security & Trust

* Funds are never held by freelancers until tasks are approved
* Full audit trail of user actions
* No intermediary or platform-controlled funds
* All transactions are verifiable on-chain

---

## Roadmap

- [ ] Multi-signature approvals for enterprise clients
- [ ] Dispute resolution via DAO governance
- [ ] Reputation weighting in smart contracts
- [ ] NFT-based skill certifications
- [ ] Mobile wallet support

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

Before submitting a PR:
```bash
# Run tests
cd anchor && anchor test

# Lint frontend
pnpm lint
```

---

## License

MIT © 2025

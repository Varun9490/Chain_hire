# ChainHire Devnet Deployment Guide

> 🚀 Deploy and test ChainHire on Solana Devnet - the fastest way to demo the platform

## Overview

This guide walks you through deploying ChainHire to **Solana Devnet** for testing and demonstration purposes. Devnet uses free test SOL, so you can experiment without any real cost.

---

## Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Installation |
|------|---------|--------------|
| Solana CLI | v1.18+ | [Install Guide](https://docs.solana.com/cli/install-solana-cli-tools) |
| Anchor | v0.30.1 | [Install Guide](https://www.anchor-lang.com/docs/installation) |
| Node.js | v18+ | [Download](https://nodejs.org/) |
| pnpm | v8+ | `npm install -g pnpm` |
| Git | Latest | [Download](https://git-scm.com/) |

Verify installations:
```bash
solana --version
anchor --version
node --version
pnpm --version
```

---

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd chainhire
```

---

## Step 2: Install Dependencies

```bash
pnpm install
```

---

## Step 3: Configure Solana Wallet

### Option A: Create a New Wallet
```bash
# Generate a new keypair (save the seed phrase!)
solana-keygen new --outfile ~/.config/solana/id.json
```

### Option B: Use Existing Wallet
```bash
# Set your existing keypair
solana config set --keypair ~/.config/solana/id.json
```

### View Your Wallet Address
```bash
solana address
```

---

## Step 4: Configure for Devnet

```bash
# Set Solana CLI to use Devnet
solana config set --url https://api.devnet.solana.com

# Verify configuration
solana config get
```

Expected output:
```
Config File: ~/.config/solana/cli/config.yml
RPC URL: https://api.devnet.solana.com
WebSocket URL: wss://api.devnet.solana.com/
Keypair Path: ~/.config/solana/id.json
Commitment: confirmed
```

---

## Step 5: Get Free Devnet SOL

Request test SOL from the devnet faucet:

```bash
# Request 2 SOL (maximum per request)
solana airdrop 2

# Check your balance
solana balance

# Request more if needed (wait 1 min between requests)
solana airdrop 2
solana airdrop 2
```

> **💡 Tip:** You'll need approximately **5-10 SOL** for:
> - Program deployment (~3-4 SOL)
> - Client registration (1 SOL)
> - Project funding (varies)
> - Transaction fees

### Alternative: Web Faucet

If CLI airdrop fails due to rate limiting, use the web faucet:
1. Go to [https://faucet.solana.com/](https://faucet.solana.com/)
2. Select "Devnet"
3. Paste your wallet address
4. Request SOL

---

## Step 6: Build the Smart Contract

```bash
cd anchor

# Build the Anchor program
anchor build
```

This creates the compiled program in `target/deploy/`.

---

## Step 7: Deploy to Devnet

```bash
# Deploy to Devnet
anchor deploy --provider.cluster devnet
```

**Save the Program ID** from the output. It should look like:
```
Program Id: HQY5kLNtUJkEiArKxDyrkCKHBtK8pDFGUBifrGFjtLDt
```

> **Note:** If your Program ID differs from the one in `Anchor.toml`, update it in:
> - `anchor/Anchor.toml` under `[programs.devnet]`
> - `src/components/client/client-data-access.tsx` (if hardcoded)

---

## Step 8: Initialize Program State

This one-time setup sets the program owner:

```bash
# Make sure you're in the anchor directory
cd anchor

# Run migration script with devnet configuration
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com \
ANCHOR_WALLET=~/.config/solana/id.json \
npx ts-node migration_script/migrate.ts
```

---

## Step 9: Start the Frontend

```bash
# Go back to project root
cd ..

# Start development server
pnpm dev
```

The app will be available at: **http://localhost:3000**

---

## Step 10: Connect Your Browser Wallet

### Configure Phantom Wallet for Devnet

1. Open **Phantom** browser extension
2. Click the **hamburger menu** (≡) → **Settings**
3. Scroll down to **Developer Settings**
4. Enable **Testnet Mode**
5. A network selector appears at the top - select **Devnet**

### Configure Solflare Wallet for Devnet

1. Open **Solflare** browser extension
2. Click the **network name** at the top
3. Select **Devnet**

### Fund Your Browser Wallet

Your browser wallet address may be different from your CLI wallet. Either:

**Option A:** Import CLI wallet to browser
- In Phantom: Settings → Add/Connect Wallet → Import Private Key
- Use the keypair from `~/.config/solana/id.json`

**Option B:** Airdrop to browser wallet
```bash
# Get your browser wallet address from Phantom/Solflare
# Then airdrop to it
solana airdrop 2 <YOUR_BROWSER_WALLET_ADDRESS>
```

---

## Step 11: Use ChainHire

1. Open **http://localhost:3000**
2. Verify **"devnet"** is selected in the cluster dropdown (top-right)
3. Click **"Select Wallet"** and connect Phantom/Solflare
4. Choose your role:
   - **Client:** Register (1 SOL), publish projects, assign freelancers
   - **Freelancer:** Register (free), receive assignments, submit tasks

---

## Quick Commands Reference

| Action | Command |
|--------|---------|
| Check balance | `solana balance` |
| Get test SOL | `solana airdrop 2` |
| Check network | `solana config get` |
| Build program | `cd anchor && anchor build` |
| Deploy to devnet | `anchor deploy --provider.cluster devnet` |
| Start frontend | `pnpm dev` |
| View logs | `solana logs` |

---

## Troubleshooting

### ❌ "Airdrop failed"

```bash
# Wait 1-2 minutes (rate limiting)
# Or use web faucet: https://faucet.solana.com/
```

### ❌ "Account not found"

```bash
# Ensure program is deployed
anchor deploy --provider.cluster devnet

# Run migration script
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com \
ANCHOR_WALLET=~/.config/solana/id.json \
npx ts-node migration_script/migrate.ts
```

### ❌ "Insufficient funds"

```bash
# Check balance
solana balance

# Request more SOL
solana airdrop 2
```

### ❌ "Transaction simulation failed"

- Ensure wallet is on Devnet (not Mainnet)
- Check the cluster selector shows "devnet"
- Verify you have enough SOL for the transaction

### ❌ "Wallet not connecting"

1. Refresh the page
2. Check wallet extension is enabled
3. Ensure wallet is set to Devnet
4. Try disconnecting and reconnecting

### ❌ "Program deployment failed"

```bash
# Ensure you have enough SOL (need ~4 SOL)
solana balance

# Rebuild before redeploying
anchor build
anchor deploy --provider.cluster devnet
```

---

## Verify Deployment on Solana Explorer

After deployment, you can verify your program on Solana Explorer:

1. Go to [https://explorer.solana.com/](https://explorer.solana.com/)
2. Select **Devnet** in the network dropdown
3. Search for your Program ID
4. You should see your deployed program

---

## Demo Workflow

### As a Client:

1. **Register** → Pay 1 SOL registration fee
2. **Publish Project** → Name, description, URL, budget
3. **View Freelancers** → Browse registered freelancers
4. **Assign Project** → Select freelancer, finalize budget, set tasks
5. **Review Tasks** → Approve or reject submitted work
6. **Complete/Withdraw** → Close project or refund

### As a Freelancer:

1. **Register** → Free registration
2. **Wait for Assignment** → Client assigns you a project
3. **View Project** → See project details in "My Projects"
4. **Submit Task** → Enter URL of completed work
5. **Receive Payment** → SOL transferred on approval

---

## Environment Variables (Optional)

Create `.env.local` in project root for custom configuration:

```bash
# Custom RPC endpoint (optional)
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Program ID (if different from default)
NEXT_PUBLIC_PROGRAM_ID=HQY5kLNtUJkEiArKxDyrkCKHBtK8pDFGUBifrGFjtLDt
```

---

## Reset for Fresh Demo

To start fresh (clear all accounts):

```bash
# Redeploy the program (creates new PDAs)
cd anchor
anchor build
anchor deploy --provider.cluster devnet

# Run migration again
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com \
ANCHOR_WALLET=~/.config/solana/id.json \
npx ts-node migration_script/migrate.ts
```

---

## Next Steps

- 📖 Read the full [README.md](./README.md) for architecture details
- 🔧 Check [Anchor.toml](./anchor/Anchor.toml) for configuration
- 🐛 Report issues on GitHub

---

**Happy Building! 🚀**

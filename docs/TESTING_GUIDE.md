# ChainHire Testing Guide

A comprehensive guide to test all features of the ChainHire decentralized freelancing platform.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Environment Setup](#2-environment-setup)
3. [Test Accounts Setup](#3-test-accounts-setup)
4. [Testing Flow](#4-testing-flow)
5. [Feature Testing Checklist](#5-feature-testing-checklist)
6. [Common Issues & Troubleshooting](#6-common-issues--troubleshooting)

---

## 1. Prerequisites

Before testing, ensure you have:

- [ ] **Node.js** v18+ installed
- [ ] **pnpm** package manager installed
- [ ] **Solana CLI** installed
- [ ] **Two Solana wallets** (Phantom or Solflare recommended)
  - One for **Client** role
  - One for **Freelancer** role
- [ ] **SOL tokens** on Devnet (free via airdrop)

---

## 2. Environment Setup

### 2.1 Clone and Install

```bash
git clone https://github.com/Varun9490/Chain_hire.git
cd Chain_hire
pnpm install
```

### 2.2 Start the Development Server

```bash
pnpm dev
```

The app will be available at: **http://localhost:3000**

### 2.3 Configure Solana CLI for Devnet

```bash
# Set CLI to use Devnet
solana config set --url https://api.devnet.solana.com

# Verify configuration
solana config get
```

---

## 3. Test Accounts Setup

### 3.1 Create Two Wallets

You need **two separate wallets** to test the full workflow:

| Role | Purpose |
|------|---------|
| **Wallet 1 (Client)** | Register as client, create projects, assign freelancers, approve tasks |
| **Wallet 2 (Freelancer)** | Register as freelancer, receive project assignments, submit tasks |

#### Option A: Use Phantom Browser Extension
1. Install Phantom from https://phantom.app
2. Create a new wallet (save the seed phrase!)
3. For second wallet, click the profile icon → "Add / Connect Wallet" → "Create new wallet"

#### Option B: Use Solana CLI
```bash
# Create Client wallet
solana-keygen new --outfile ~/.config/solana/client-wallet.json

# Create Freelancer wallet
solana-keygen new --outfile ~/.config/solana/freelancer-wallet.json
```

### 3.2 Get Devnet SOL (Free Test Tokens)

Each wallet needs SOL for transactions. Get free Devnet SOL:

#### Via Solana CLI:
```bash
# For Client wallet (needs 2+ SOL for registration)
solana airdrop 2 <CLIENT_WALLET_ADDRESS>
solana airdrop 2 <CLIENT_WALLET_ADDRESS>

# For Freelancer wallet (needs small amount for transactions)
solana airdrop 1 <FREELANCER_WALLET_ADDRESS>
```

#### Via Solana Faucet Website:
1. Go to https://faucet.solana.com
2. Select "Devnet"
3. Paste your wallet address
4. Click "Request Airdrop"

### 3.3 Configure Wallets for Devnet

#### Phantom:
1. Open Phantom → Settings (gear icon)
2. Go to "Developer Settings"
3. Enable "Testnet Mode"
4. Select "Devnet"

#### Solflare:
1. Open Solflare
2. Click the network selector (top)
3. Choose "Devnet"

---

## 4. Testing Flow

Follow this sequence to test the complete platform:

```
┌─────────────────────────────────────────────────────────────────┐
│                     COMPLETE TEST FLOW                          │
└─────────────────────────────────────────────────────────────────┘

Step 1: Freelancer Registration (Wallet 2)
         ↓
Step 2: Client Registration (Wallet 1) - costs 1 SOL
         ↓
Step 3: Create Project (Client)
         ↓
Step 4: Assign Freelancer to Project (Client)
         ↓
Step 5: Submit Task for Review (Freelancer)
         ↓
Step 6: Review & Approve/Reject Task (Client)
         ↓
Step 7: [Optional] Transfer Project or Withdraw
         ↓
Step 8: Complete Project (all tasks approved)
```

---

## 5. Feature Testing Checklist

### 📋 Test Case 1: Freelancer Registration

**Wallet:** Freelancer Wallet  
**Expected Cost:** Free (only transaction fee ~0.000005 SOL)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open http://localhost:3000 | Dashboard loads |
| 2 | Click "I'm a Freelancer" card | Redirects to /freelancer |
| 3 | Click "Select Wallet" → Connect Freelancer wallet | Wallet connected, address shown |
| 4 | Fill registration form: | |
| | - Name: "Test Freelancer" | |
| | - Domain: "Web Development" | |
| | - Skills: "React, Solana, TypeScript" | |
| | - Contact: "test@email.com" | |
| 5 | Click "Register as Freelancer" | Transaction confirmation popup |
| 6 | Approve transaction in wallet | Success message, registration complete |
| 7 | Verify profile shows on dashboard | ✅ Freelancer registered |

**Save the Freelancer Wallet Address** - you'll need it for assigning projects!

---

### 📋 Test Case 2: Client Registration

**Wallet:** Client Wallet  
**Expected Cost:** 1 SOL (registration fee) + transaction fee

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open http://localhost:3000 | Dashboard loads |
| 2 | Click "I'm a Client" card | Redirects to /client |
| 3 | Click "Select Wallet" → Connect Client wallet | Wallet connected |
| 4 | Fill registration form: | |
| | - Name: "Test Client" | |
| | - Domain: "E-commerce" | |
| | - Required Skills: "Full-stack development" | |
| | - Contact: "client@company.com" | |
| 5 | Click "Register as Client" | Transaction confirmation (1 SOL) |
| 6 | Approve transaction in wallet | Success message |
| 7 | Verify 1 SOL deducted from wallet | ✅ Client registered |

---

### 📋 Test Case 3: Create Project

**Wallet:** Client Wallet

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to Client dashboard | Registration form replaced with project creation |
| 2 | Fill project form: | |
| | - Project Name: "E-commerce Website" | |
| | - Description: "Build a modern e-commerce site" | |
| | - URL: "https://figma.com/design/..." | |
| | - Budget: 5 (SOL) | |
| 3 | Click "Create Project" | Transaction confirmation |
| 4 | Approve transaction | Success message |
| 5 | Navigate to "My Projects" | ✅ Project visible in list |

---

### 📋 Test Case 4: Assign Freelancer to Project

**Wallet:** Client Wallet

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Go to "My Projects" | List of client projects shown |
| 2 | Click on the project card | Modal opens with project details |
| 3 | In "Assign Freelancer" section: | |
| | - Freelancer Wallet: Paste Freelancer's wallet address | |
| | - Finalized Budget: 5 (SOL) | |
| | - Total Tasks: 3 | |
| 4 | Click "Assign Freelancer & Fund Escrow" | Transaction for 5 SOL |
| 5 | Approve transaction | Escrow created, vault funded |
| 6 | Verify project status changes to "In Progress" | ✅ Freelancer assigned |

**Note:** The 5 SOL is now locked in a vault. It will be released to the freelancer proportionally upon each task approval (5 SOL / 3 tasks = ~1.67 SOL per task).

---

### 📋 Test Case 5: Submit Task for Review (Freelancer)

**Wallet:** Freelancer Wallet

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Switch to Freelancer wallet in Phantom | Wallet changed |
| 2 | Refresh the page | Page reloads with freelancer context |
| 3 | Go to "My Projects" | Project assigned by client visible |
| 4 | Click on the project card | Modal opens with project details |
| 5 | In "Submit Task for Review" section: | |
| | - Task URL: "https://github.com/user/repo/pull/1" | |
| 6 | Click "Request Task Review" | Transaction confirmation |
| 7 | Approve transaction | Success message |
| 8 | Verify status changes to "Pending Review" | ✅ Task submitted |

---

### 📋 Test Case 6: Review & Approve Task (Client)

**Wallet:** Client Wallet

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Switch to Client wallet in Phantom | Wallet changed |
| 2 | Refresh the page | Page reloads |
| 3 | Go to "My Projects" | Project shows "Review Pending" badge |
| 4 | Click on the project card | Modal shows task review section |
| 5 | Review the submitted URL | Task URL visible |
| 6a | **To Approve:** Click "✓ Approve" | |
| | Approve transaction | ~1.67 SOL transferred to freelancer |
| 6b | **To Reject:** Click "✗ Reject" | |
| | Approve transaction | No payment, freelancer can resubmit |
| 7 | Check escrow stats update | Tasks Completed: 1/3 |
| 8 | Repeat until all tasks completed | ✅ Project complete when 3/3 |

---

### 📋 Test Case 7: Transfer Project (Optional)

**Wallet:** Client Wallet  
**Use Case:** Reassign project to a different freelancer

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open project modal | Project details shown |
| 2 | Click "Transfer" button | Transfer modal opens |
| 3 | Enter new freelancer wallet address | Valid Solana address |
| 4 | Click "Transfer Project" | Transaction confirmation |
| 5 | Approve transaction | Project transferred |
| 6 | Verify new freelancer sees project | ✅ Transfer successful |

---

### 📋 Test Case 8: Withdraw Project (Optional)

**Wallet:** Client Wallet  
**Use Case:** Cancel project and get refund

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open project modal | Project details shown |
| 2 | Click "Withdraw" button | Transaction confirmation |
| 3 | Approve transaction | Project cancelled |
| 4 | Verify refund received | Remaining vault balance returned |
| 5 | Project status shows "Completed" | ✅ Withdrawal successful |

---

## 6. Common Issues & Troubleshooting

### Issue: "403 Access Forbidden" Error

**Cause:** Solana public RPC rate limit  
**Solution:** 
1. Clear browser localStorage
2. Refresh the page
3. Try again after a few minutes
4. Or use a dedicated RPC (Helius free tier)

```javascript
// In cluster-data-access.tsx, the endpoint is already configured to use Helius
endpoint: 'https://devnet.helius-rpc.com/?api-key=YOUR_KEY'
```

---

### Issue: "Invalid public key input" Error

**Cause:** Empty or invalid wallet address entered  
**Solution:** 
- Ensure you paste a valid 44-character Solana wallet address
- The button should be disabled if address is invalid
- Copy the address directly from Phantom

---

### Issue: "Insufficient funds" Error

**Cause:** Not enough SOL in wallet  
**Solution:**
```bash
# Get more Devnet SOL
solana airdrop 2 <YOUR_WALLET_ADDRESS>
```

---

### Issue: "Account not found" Error

**Cause:** Program state not initialized  
**Solution:**
```bash
cd anchor
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com \
ANCHOR_WALLET=~/.config/solana/id.json \
npx ts-node migration_script/migrate.ts
```

---

### Issue: Wallet Not Connecting

**Cause:** Browser extension issue  
**Solution:**
1. Ensure Phantom/Solflare extension is installed
2. Check wallet is set to Devnet
3. Try clicking wallet button while extension is open
4. Refresh the page

---

### Issue: Transaction Keeps Failing

**Cause:** Network congestion or stale blockhash  
**Solution:**
1. Wait 30 seconds
2. Refresh the page
3. Try the transaction again

---

## Quick Reference: Wallet Addresses

During testing, keep track of your wallet addresses:

| Role | Wallet Address |
|------|---------------|
| Client | `___________________________________` |
| Freelancer | `___________________________________` |

---

## Test Results Log

Use this table to track your testing progress:

| Test Case | Status | Notes |
|-----------|--------|-------|
| Freelancer Registration | ⬜ | |
| Client Registration | ⬜ | |
| Create Project | ⬜ | |
| Assign Freelancer | ⬜ | |
| Submit Task | ⬜ | |
| Approve Task | ⬜ | |
| Reject Task | ⬜ | |
| Transfer Project | ⬜ | |
| Withdraw Project | ⬜ | |
| Complete Project | ⬜ | |

---

## Video Walkthrough

For a visual demonstration, record your testing session using:
- **Loom** (https://loom.com)
- **OBS Studio** (https://obsproject.com)
- **Windows Game Bar** (Win + G)

---

## Support

If you encounter issues not covered in this guide:

1. Check the browser console for errors (F12 → Console)
2. Check the Solana Explorer for transaction details
3. Review the GitHub issues: https://github.com/Varun9490/Chain_hire/issues

---

*Testing Guide for ChainHire v1.0.0*  
*Last Updated: January 31, 2025*

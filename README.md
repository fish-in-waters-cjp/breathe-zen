# Breathe Zen - Blockchain Meditation Recording App

A blockchain-based meditation recording application that allows users to permanently record their meditation time on the blockchain and receive token rewards.

## Tech Stack

- Frontend: Next.js + TypeScript + wagmi
- Smart Contracts: Solidity + Hardhat
- Blockchain: Ethereum (Hardhat Local Network)

## Quick Start

### 1. Install Dependencies

First, clone the project and install dependencies:

```bash
# Install smart contract dependencies
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Start Local Blockchain

In the `blockchain` directory:

```bash
# Start local Hardhat node
npx hardhat node

# Open a new terminal and deploy contracts
npx hardhat run scripts/deploy.js --network localhost
```

### 3. Configure MetaMask

1. Add local network in MetaMask:
   - Network Name: Hardhat
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 1337
   - Currency Symbol: ETH

2. Import test account:
   - Copy any private key from Hardhat node output
   - Click "Import Account" in MetaMask
   - Paste the private key

### 4. Start Frontend Application

In the `frontend` directory:

```bash
npm run dev
```

Visit http://localhost:3000 to start using the application.

## Usage Instructions

1. Ensure MetaMask is connected to the Hardhat local network
2. Click "Start Meditation" on the homepage
3. After meditation, the system will automatically record it on the blockchain
4. Receive token rewards upon successful recording

## Important Notes

- This is a demonstration project for showcase purposes only
- Make sure MetaMask is properly configured and connected to the local network
- If issues occur, try resetting the MetaMask account transaction history

## License

MIT License 
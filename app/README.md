# PLASMA Token Presale Frontend

This is a frontend application for the PLASMA Token Presale Solana program. It allows users to participate in the token presale by buying tokens and later claiming them after the lock period.

## Features

- Connect your Solana wallet (Phantom, Solflare, etc.)
- View presale information (price, tokens sold, etc.)
- Buy tokens during the active presale period
- View your locked tokens and unlock date
- Claim tokens after the lock period
- Admin panel for presale management (only accessible to the presale creator)

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- A Solana wallet (e.g., Phantom, Solflare)

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Connecting to Different Networks

The application connects to the Solana devnet by default. To connect to a different network, you can modify the network in the `_app.tsx` file:

```typescript
// Can be set to 'devnet', 'testnet', or 'mainnet-beta'
const network = WalletAdapterNetwork.Devnet;
```

## Technical Details

This application interfaces with the PLASMA Token Presale Solana program deployed at `F8F9Ny7p3jXkZctSmzZFfDnpdhrqnCW4tQnbqVYWHcbv`. It uses the following technologies:

- Next.js for the React framework
- Solana Web3.js for blockchain interactions
- Anchor framework for program interface
- Solana Wallet Adapter for wallet connections

## Contract Features Implemented

The frontend provides interfaces to all the Solana program functions:

1. `initialize` - Admin can initialize the presale with pricing and allocation
2. `buyTokens` - Users can purchase tokens during the active presale
3. `claimTokens` - Users can claim tokens after the lock period
4. `togglePresale` - Admin can activate or deactivate the presale

## License

This project is licensed under the ISC License. 
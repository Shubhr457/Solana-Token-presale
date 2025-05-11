import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { usePresaleProgram } from '../hooks/usePresaleProgram';
import { BN } from '@coral-xyz/anchor';

interface BuyTokensProps {
  presaleAccount: any;
}

export default function BuyTokens({ presaleAccount }: BuyTokensProps) {
  const { connected } = useWallet();
  const { buyTokens, isLoading } = usePresaleProgram();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleBuy = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!presaleAccount) {
      setError('Presale data not available');
      return;
    }

    if (!presaleAccount.isActive) {
      setError('Presale is not active');
      return;
    }

    // Convert to token's smallest units
    const tokenAmount = parseInt(amount);
    
    // Calculate cost in lamports
    const pricePerToken = presaleAccount.pricePerToken.toNumber ? 
      presaleAccount.pricePerToken.toNumber() : presaleAccount.pricePerToken;
    
    const cost = pricePerToken * tokenAmount;

    // Check if purchase would exceed allocation
    const totalAllocation = presaleAccount.totalAllocation.toNumber ? 
      presaleAccount.totalAllocation.toNumber() : presaleAccount.totalAllocation;
    
    const tokensSold = presaleAccount.tokensSold.toNumber ? 
      presaleAccount.tokensSold.toNumber() : presaleAccount.tokensSold;
    
    const remainingAllocation = totalAllocation - tokensSold;
    
    if (tokenAmount > remainingAllocation) {
      setError(`Amount exceeds remaining allocation of ${remainingAllocation} tokens`);
      return;
    }

    try {
      setError(null);
      await buyTokens(tokenAmount);
      setAmount('');
    } catch (err: any) {
      console.error('Error buying tokens:', err);
      setError(err.message || 'Failed to buy tokens');
    }
  };

  if (!connected || !presaleAccount) {
    return null;
  }

  // Make sure we handle both BigNumber and regular number values
  const pricePerToken = presaleAccount.pricePerToken.toNumber ? 
    presaleAccount.pricePerToken.toNumber() : presaleAccount.pricePerToken;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Buy Tokens</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount of tokens to buy
          </label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isLoading || !presaleAccount.isActive}
          />
          {amount && (
            <p className="mt-1 text-sm text-gray-500">
              Cost: {(parseFloat(amount) * pricePerToken).toLocaleString()} lamports
              ({(parseFloat(amount) * pricePerToken / 1e9).toLocaleString()} SOL)
            </p>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isLoading || !presaleAccount.isActive
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
          onClick={handleBuy}
          disabled={isLoading || !presaleAccount.isActive}
        >
          {isLoading ? 'Processing...' : 'Buy Tokens'}
        </button>

        {!presaleAccount.isActive && (
          <p className="text-sm text-red-500">
            Presale is currently inactive. Please check back later.
          </p>
        )}
      </div>
    </div>
  );
} 
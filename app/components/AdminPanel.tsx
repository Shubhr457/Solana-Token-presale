import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { usePresaleProgram } from '../hooks/usePresaleProgram';

export default function AdminPanel() {
  const { publicKey } = useWallet();
  const { presaleAccount, togglePresale, initializePresale, isLoading } = usePresaleProgram();
  const [error, setError] = useState<string | null>(null);
  const [treasuryAddress, setTreasuryAddress] = useState('');
  const [pricePerToken, setPricePerToken] = useState('');
  const [totalAllocation, setTotalAllocation] = useState('');

  const handleTogglePresale = async () => {
    if (!presaleAccount) return;
    
    try {
      setError(null);
      await togglePresale(!presaleAccount.isActive);
    } catch (err: any) {
      console.error('Error toggling presale:', err);
      setError(err.message || 'Failed to toggle presale');
    }
  };

  const handleInitializePresale = async () => {
    if (!publicKey) return;
    
    try {
      if (!treasuryAddress || !pricePerToken || !totalAllocation) {
        setError('Please fill all fields');
        return;
      }

      // Validate treasury address
      let treasury: PublicKey;
      try {
        treasury = new PublicKey(treasuryAddress);
      } catch (err) {
        setError('Invalid treasury address');
        return;
      }

      // Validate price and allocation
      const price = parseFloat(pricePerToken);
      const allocation = parseFloat(totalAllocation);
      
      if (isNaN(price) || price <= 0) {
        setError('Invalid price per token');
        return;
      }
      
      if (isNaN(allocation) || allocation <= 0) {
        setError('Invalid allocation');
        return;
      }

      setError(null);
      await initializePresale(price, allocation, treasury);
      
      // Clear form after successful initialization
      setTreasuryAddress('');
      setPricePerToken('');
      setTotalAllocation('');
    } catch (err: any) {
      console.error('Error initializing presale:', err);
      setError(err.message || 'Failed to initialize presale');
    }
  };

  if (!presaleAccount) {
    // Show initialization form if no presale exists
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Initialize Presale</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Treasury Address
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Treasury wallet address"
              value={treasuryAddress}
              onChange={(e) => setTreasuryAddress(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              You can use your own wallet address for testing.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Per Token (lamports)
            </label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., 1000000"
              value={pricePerToken}
              onChange={(e) => setPricePerToken(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              1,000,000 lamports = 0.001 SOL
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Token Allocation
            </label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., 1000000"
              value={totalAllocation}
              onChange={(e) => setTotalAllocation(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
            onClick={handleInitializePresale}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Initialize Presale'}
          </button>
          <p className="text-xs text-gray-500 text-center">
            This is a demo. No actual blockchain transaction will occur.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Controls</h2>
      <div className="space-y-4">
        <div className="p-4 border rounded-md">
          <p className="text-sm text-gray-500">Presale Status</p>
          <p className="text-lg font-medium">
            {presaleAccount.isActive ? (
              <span className="text-green-600">Active</span>
            ) : (
              <span className="text-red-600">Inactive</span>
            )}
          </p>
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
          onClick={handleTogglePresale}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : presaleAccount.isActive ? 'Deactivate Presale' : 'Activate Presale'}
        </button>
        <p className="text-xs text-gray-500 text-center">
          This is a demo. No actual blockchain transaction will occur.
        </p>
      </div>
    </div>
  );
} 
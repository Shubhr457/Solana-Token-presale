import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { usePresaleProgram } from '../hooks/usePresaleProgram';

interface ClaimTokensProps {
  userInfo: any;
}

export default function ClaimTokens({ userInfo }: ClaimTokensProps) {
  const { connected } = useWallet();
  const { claimTokens, isLoading } = usePresaleProgram();
  const [error, setError] = useState<string | null>(null);

  const handleClaim = async () => {
    if (!userInfo) {
      setError('User data not available');
      return;
    }

    if (userInfo.claimed) {
      setError('Tokens have already been claimed');
      return;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const unlockTime = userInfo.unlockTime.toNumber ? 
      userInfo.unlockTime.toNumber() : userInfo.unlockTime;
      
    if (currentTime < unlockTime) {
      setError('Tokens are still locked');
      return;
    }

    try {
      setError(null);
      await claimTokens();
    } catch (err: any) {
      console.error('Error claiming tokens:', err);
      setError(err.message || 'Failed to claim tokens');
    }
  };

  if (!connected || !userInfo) {
    return null;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const unlockTime = userInfo.unlockTime.toNumber ? 
    userInfo.unlockTime.toNumber() : userInfo.unlockTime;
  const isLocked = currentTime < unlockTime;
  const isClaimable = !isLocked && !userInfo.claimed;
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  // Get token amount, handling both BN and number types
  const tokenAmount = userInfo.amount.toNumber ? 
    userInfo.amount.toNumber() : userInfo.amount;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Tokens</h2>
      <div className="space-y-4">
        <div className="p-4 border rounded-md">
          <p className="text-sm text-gray-500">Amount Reserved</p>
          <p className="text-lg font-medium">{tokenAmount.toString()} tokens</p>
        </div>

        <div className="p-4 border rounded-md">
          <p className="text-sm text-gray-500">Status</p>
          <p className="text-lg font-medium">
            {userInfo.claimed ? (
              <span className="text-green-600">Claimed</span>
            ) : isLocked ? (
              <span className="text-orange-500">Locked</span>
            ) : (
              <span className="text-green-600">Unlocked - Ready to Claim</span>
            )}
          </p>
        </div>

        {!userInfo.claimed && (
          <div className="p-4 border rounded-md">
            <p className="text-sm text-gray-500">Unlock Date</p>
            <p className="text-lg font-medium">{formatDate(unlockTime)}</p>
            {isLocked && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ 
                      width: `${Math.min(
                        (currentTime / unlockTime) * 100, 
                        100
                      )}%` 
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isLoading || !isClaimable
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
          onClick={handleClaim}
          disabled={isLoading || !isClaimable}
        >
          {isLoading ? 'Processing...' : userInfo.claimed ? 'Tokens Claimed' : isLocked ? 'Tokens Still Locked' : 'Claim Tokens'}
        </button>
      </div>
    </div>
  );
} 
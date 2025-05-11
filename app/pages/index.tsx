import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey } from '@solana/web3.js';
import Head from 'next/head';
import AdminPanel from '../components/AdminPanel';
import BuyTokens from '../components/BuyTokens';
import ClaimTokens from '../components/ClaimTokens';
import DemoNotice from '../components/DemoNotice';
import { usePresaleProgram } from '../hooks/usePresaleProgram';

export default function Home() {
  const { publicKey, connected } = useWallet();
  const { presaleAccount, userInfo, isLoading, fetchPresaleData, fetchUserInfo } = usePresaleProgram();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (connected && publicKey) {
      fetchPresaleData();
      fetchUserInfo();
    }
  }, [connected, publicKey, fetchPresaleData, fetchUserInfo]);

  useEffect(() => {
    if (presaleAccount && publicKey) {
      setIsAdmin(publicKey.toString() === presaleAccount.authority.toString());
    }
  }, [presaleAccount, publicKey]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>PLASMA Token Presale</title>
        <meta name="description" content="Buy PLASMA tokens in the presale" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-indigo-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">PLASMA Token Presale</h1>
          <WalletMultiButton className="bg-white hover:bg-gray-100 text-indigo-600" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <DemoNotice />
        
        {!connected ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Connect your wallet to participate in the presale</h2>
            <p className="text-gray-600 mb-8">You need to connect a Solana wallet to buy or claim tokens.</p>
          </div>
        ) : isLoading ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h2>
          </div>
        ) : (
          <div className="space-y-8">
            {presaleAccount && (
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Presale Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-md">
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-lg font-medium">
                      {presaleAccount.isActive ? (
                        <span className="text-green-600">Active</span>
                      ) : (
                        <span className="text-red-600">Inactive</span>
                      )}
                    </p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <p className="text-sm text-gray-500">Price per token</p>
                    <p className="text-lg font-medium">
                      {presaleAccount.pricePerToken.toString()} lamports
                    </p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <p className="text-sm text-gray-500">Tokens sold</p>
                    <p className="text-lg font-medium">
                      {presaleAccount.tokensSold.toString()} / {presaleAccount.totalAllocation.toString()}
                    </p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <p className="text-sm text-gray-500">Progress</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div 
                        className="bg-indigo-600 h-2.5 rounded-full" 
                        style={{ 
                          width: `${Math.min(
                            (getNumber(presaleAccount.tokensSold) / getNumber(presaleAccount.totalAllocation)) * 100, 
                            100
                          )}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isAdmin && <AdminPanel />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <BuyTokens presaleAccount={presaleAccount} />
              
              {userInfo && getNumber(userInfo.amount) > 0 && (
                <ClaimTokens userInfo={userInfo} />
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">© 2023 PLASMA Token Presale. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Helper function to get a number from a BN or number
function getNumber(val: any): number {
  if (!val) return 0;
  if (typeof val === 'number') return val;
  if (val.toNumber) return val.toNumber();
  return Number(val.toString());
} 
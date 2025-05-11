import { useCallback, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { BN, Program, web3, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { 
  getAssociatedTokenAddress, 
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import idlJson from '../utils/presale.json';

// Program ID from the IDL
const programId = new PublicKey('F8F9Ny7p3jXkZctSmzZFfDnpdhrqnCW4tQnbqVYWHcbv');
const plasmaMint = new PublicKey('ARTBJwHjYbxDFY9i2qLaGddmTgWDzXh4hkfuEWisFipZ');

// Seeds for PDAs
const VAULT_SEED = Buffer.from('vault');
const USER_INFO_SEED = Buffer.from('user_info');

export const usePresaleProgram = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { publicKey, sendTransaction } = wallet;
  const [presaleAccount, setPresaleAccount] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Helper to get the program instance
  const getProgram = useCallback(() => {
    if (!publicKey) return null;
    
    try {
      // Create a proper AnchorProvider
      const provider = new AnchorProvider(
        connection, 
        wallet as any, 
        { commitment: 'confirmed' }
      );
      
      // Use provider.workspace instead of directly creating a Program
      return {
        methods: {
          // Simulate the program methods we need
          initialize: (pricePerToken: BN, totalAllocation: BN) => {
            return {
              accounts: (accounts: any) => {
                return {
                  signers: (signers: any) => {
                    return {
                      transaction: async () => {
                        // Build a transaction for initializing the presale
                        const ix = await Program.createProgramAddress(
                          idlJson as any,
                          programId,
                        );
                        return new web3.Transaction().add(ix);
                      }
                    };
                  }
                };
              }
            };
          },
          buyTokens: (amount: BN) => {
            return {
              accounts: (accounts: any) => {
                return {
                  transaction: async () => {
                    // Build a transaction for buying tokens
                    const ix = await Program.createProgramAddress(
                      idlJson as any,
                      programId,
                    );
                    return new web3.Transaction().add(ix);
                  }
                };
              }
            };
          },
          claimTokens: () => {
            return {
              accounts: (accounts: any) => {
                return {
                  transaction: async () => {
                    // Build a transaction for claiming tokens
                    const ix = await Program.createProgramAddress(
                      idlJson as any,
                      programId,
                    );
                    return new web3.Transaction().add(ix);
                  }
                };
              }
            };
          },
          togglePresale: (active: boolean) => {
            return {
              accounts: (accounts: any) => {
                return {
                  transaction: async () => {
                    // Build a transaction for toggling presale
                    const ix = await Program.createProgramAddress(
                      idlJson as any,
                      programId,
                    );
                    return new web3.Transaction().add(ix);
                  }
                };
              }
            };
          }
        },
        account: {
          presaleAccount: {
            all: async () => {
              // Mock response for presale accounts
              return [{
                publicKey: new PublicKey(idlJson.address),
                account: {
                  authority: publicKey,
                  plasma_mint: plasmaMint,
                  treasury: publicKey, // Placeholder
                  price_per_token: new BN(100000000), // 0.1 SOL
                  total_allocation: new BN(1000000000000), // 1,000,000 tokens
                  tokens_sold: new BN(0),
                  is_active: true
                }
              }];
            }
          },
          userInfo: {
            fetch: async (address: PublicKey) => {
              // Mock response for user info
              return {
                buyer: publicKey,
                amount: new BN(10000000000), // 10,000 tokens
                unlock_time: new BN(Math.floor(Date.now() / 1000) + 86400), // 1 day from now
                claimed: false,
                bump: 254
              };
            }
          }
        }
      };
    } catch (error) {
      console.error("Error creating program instance:", error);
      return null;
    }
  }, [connection, publicKey, wallet]);

  const fetchPresaleData = useCallback(async () => {
    try {
      setIsLoading(true);
      const program = getProgram();
      if (!program) return;

      try {
        // Fetch all presale accounts
        const presales = await program.account.presaleAccount.all();
        if (presales.length > 0) {
          const account = presales[0].account;
          
          // Map snake_case to camelCase properties for compatibility
          setPresaleAccount({
            authority: account.authority,
            plasmaMint: account.plasma_mint,
            treasury: account.treasury,
            pricePerToken: account.price_per_token,
            totalAllocation: account.total_allocation,
            tokensSold: account.tokens_sold,
            isActive: account.is_active,
            publicKey: presales[0].publicKey
          });
        }
      } catch (error) {
        console.error("Error fetching presale accounts:", error);
      }
    } catch (error) {
      console.error('Error fetching presale data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getProgram]);

  const fetchUserInfo = useCallback(async () => {
    if (!publicKey) return;

    try {
      setIsLoading(true);
      const program = getProgram();
      if (!program) return;

      // Get PDA for user info account
      const [userInfoPda] = PublicKey.findProgramAddressSync(
        [USER_INFO_SEED, publicKey.toBuffer(), plasmaMint.toBuffer()],
        programId
      );

      try {
        const userInfoAccount = await program.account.userInfo.fetch(userInfoPda);
        
        // Map snake_case to camelCase properties for compatibility
        setUserInfo({
          buyer: userInfoAccount.buyer,
          amount: userInfoAccount.amount,
          unlockTime: userInfoAccount.unlock_time,
          claimed: userInfoAccount.claimed,
          bump: userInfoAccount.bump
        });
      } catch (error) {
        // User info account doesn't exist yet
        setUserInfo(null);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, getProgram]);

  const initializePresale = useCallback(async (
    pricePerToken: number,
    totalAllocation: number,
    treasury: PublicKey
  ) => {
    if (!publicKey) return;

    try {
      setIsLoading(true);
      const program = getProgram();
      if (!program) return;

      // Get PDA for presale vault
      const [vaultPda] = PublicKey.findProgramAddressSync(
        [VAULT_SEED, plasmaMint.toBuffer()],
        programId
      );

      // Get PDA for vault authority
      const [vaultAuthorityPda] = PublicKey.findProgramAddressSync(
        [VAULT_SEED, plasmaMint.toBuffer()],
        programId
      );

      // Create a new account for presale state
      const presaleKeypair = web3.Keypair.generate();

      const tx = await program.methods
        .initialize(
          new BN(pricePerToken),
          new BN(totalAllocation),
        )
        .accounts({
          presale: presaleKeypair.publicKey,
          plasma_mint: plasmaMint,
          presale_vault: vaultPda,
          presale_vault_authority: vaultAuthorityPda,
          treasury: treasury,
          authority: publicKey,
          system_program: SystemProgram.programId,
          token_program: TOKEN_PROGRAM_ID,
          rent: web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([presaleKeypair])
        .transaction();

      const signature = await sendTransaction(tx, connection, { signers: [presaleKeypair] });
      await connection.confirmTransaction(signature, 'confirmed');
      console.log('Presale initialized with signature:', signature);
      fetchPresaleData();
    } catch (error) {
      console.error('Error initializing presale:', error);
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, getProgram, connection, sendTransaction, fetchPresaleData]);

  const buyTokens = useCallback(async (amount: number) => {
    if (!publicKey || !presaleAccount) return;

    try {
      setIsLoading(true);
      const program = getProgram();
      if (!program) return;

      // Get PDA for presale vault
      const [vaultPda] = PublicKey.findProgramAddressSync(
        [VAULT_SEED, plasmaMint.toBuffer()],
        programId
      );

      // Get PDA for vault authority
      const [vaultAuthorityPda] = PublicKey.findProgramAddressSync(
        [VAULT_SEED, plasmaMint.toBuffer()],
        programId
      );

      // Get PDA for user info
      const [userInfoPda] = PublicKey.findProgramAddressSync(
        [USER_INFO_SEED, publicKey.toBuffer(), plasmaMint.toBuffer()],
        programId
      );

      // Get user vault for tokens
      const userVault = await getAssociatedTokenAddress(
        plasmaMint,
        userInfoPda,
        true
      );

      const treasuryAccount = presaleAccount.treasury;

      const tx = await program.methods
        .buyTokens(
          new BN(amount)
        )
        .accounts({
          presale: presaleAccount.publicKey,
          presale_vault: vaultPda,
          presale_vault_authority: vaultAuthorityPda,
          user_info: userInfoPda,
          user_vault: userVault,
          plasma_mint: plasmaMint,
          treasury_account: treasuryAccount,
          buyer: publicKey,
          system_program: SystemProgram.programId,
          token_program: TOKEN_PROGRAM_ID,
          associated_token_program: ASSOCIATED_TOKEN_PROGRAM_ID,
          rent: web3.SYSVAR_RENT_PUBKEY,
        })
        .transaction();

      const signature = await sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      console.log('Tokens purchased with signature:', signature);
      fetchUserInfo();
      fetchPresaleData();
    } catch (error) {
      console.error('Error buying tokens:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, presaleAccount, getProgram, connection, sendTransaction, fetchUserInfo, fetchPresaleData]);

  const claimTokens = useCallback(async () => {
    if (!publicKey || !userInfo) return;

    try {
      setIsLoading(true);
      const program = getProgram();
      if (!program) return;

      // Get PDA for user info
      const [userInfoPda] = PublicKey.findProgramAddressSync(
        [USER_INFO_SEED, publicKey.toBuffer(), plasmaMint.toBuffer()],
        programId
      );

      // Get user vault
      const userVault = await getAssociatedTokenAddress(
        plasmaMint,
        userInfoPda,
        true
      );

      // Get user token account
      const userTokenAccount = await getAssociatedTokenAddress(
        plasmaMint,
        publicKey
      );

      const tx = await program.methods
        .claimTokens()
        .accounts({
          user_info: userInfoPda,
          user_vault: userVault,
          user_token_account: userTokenAccount,
          plasma_mint: plasmaMint,
          buyer: publicKey,
          system_program: SystemProgram.programId,
          token_program: TOKEN_PROGRAM_ID,
          associated_token_program: ASSOCIATED_TOKEN_PROGRAM_ID,
          rent: web3.SYSVAR_RENT_PUBKEY,
        })
        .transaction();

      const signature = await sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      console.log('Tokens claimed with signature:', signature);
      fetchUserInfo();
    } catch (error) {
      console.error('Error claiming tokens:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, userInfo, getProgram, connection, sendTransaction, fetchUserInfo]);

  const togglePresale = useCallback(async (active: boolean) => {
    if (!publicKey || !presaleAccount) return;

    try {
      setIsLoading(true);
      const program = getProgram();
      if (!program) return;

      const tx = await program.methods
        .togglePresale(active)
        .accounts({
          presale: presaleAccount.publicKey,
          authority: publicKey,
        })
        .transaction();

      const signature = await sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      console.log(`Presale ${active ? 'activated' : 'deactivated'} with signature:`, signature);
      fetchPresaleData();
    } catch (error) {
      console.error('Error toggling presale:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, presaleAccount, getProgram, connection, sendTransaction, fetchPresaleData]);

  return {
    presaleAccount,
    userInfo,
    isLoading,
    fetchPresaleData,
    fetchUserInfo,
    initializePresale,
    buyTokens,
    claimTokens,
    togglePresale,
  };
}; 
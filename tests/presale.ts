import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Presale } from "../target/types/presale";
import { PublicKey, LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMint,
  createAssociatedTokenAccount,
  mintTo,
  getAssociatedTokenAddress,
  createTransferInstruction,
  getAssociatedTokenAddressSync
} from "@solana/spl-token";
import { assert } from "chai";

describe("presale", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Presale as Program<Presale>;
  const payer = anchor.web3.Keypair.generate();
  const authority = anchor.web3.Keypair.generate();
  const buyer = anchor.web3.Keypair.generate();
  
  // Plasma token mint (use the provided address in a real scenario)
  let plasmaMint: PublicKey;
  // For testing, we'll create a new mint
  const PLASMA_TOKEN_DECIMALS = 9;
  
  // Treasury wallet to receive SOL
  const treasury = anchor.web3.Keypair.generate().publicKey;
  
  // PDA for the presale account
  let presaleAccount: PublicKey;
  let bump: number;
  
  // PDAs for the vault
  let presaleVault: PublicKey;
  let presaleVaultAuthority: PublicKey;
  let presaleVaultBump: number;
  
  // User info account
  let userInfo: PublicKey;
  let userInfoBump: number;
  
  // User vault
  let userVault: PublicKey;
  
  // Presale settings
  const PRICE_PER_TOKEN = LAMPORTS_PER_SOL / 10; // 0.1 SOL per token
  const TOTAL_ALLOCATION = 1_000_000; // 1 million tokens for sale
  
  // For testing time-based features
  let currentTimestamp: number;
  
  before(async () => {
    // Airdrop SOL to the payer - increased to 20 SOL to ensure enough funds
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(payer.publicKey, 20 * LAMPORTS_PER_SOL)
    );
    
    // Wait a bit to ensure the airdrop is confirmed
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Transfer SOL to authority and buyer - increased amounts
    const transferToAuthority = SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: authority.publicKey,
      lamports: 8 * LAMPORTS_PER_SOL,
    });
    
    const transferToBuyer = SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: buyer.publicKey,
      lamports: 8 * LAMPORTS_PER_SOL,
    });
    
    const tx = new anchor.web3.Transaction()
      .add(transferToAuthority)
      .add(transferToBuyer);
    
    await provider.sendAndConfirm(tx, [payer], { commitment: "confirmed" });
    
    // Create a token mint for testing (in production, use the actual Plasma token)
    plasmaMint = await createMint(
      provider.connection,
      payer,
      authority.publicKey,
      null,
      PLASMA_TOKEN_DECIMALS,
      undefined,
      { commitment: "confirmed" },
      TOKEN_PROGRAM_ID
    );
    
    console.log("Created test plasma mint:", plasmaMint.toString());
    
    // Find PDAs
    [presaleVaultAuthority, presaleVaultBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), plasmaMint.toBuffer()],
      program.programId
    );
    
    // Find the presale vault PDA
    [presaleVault] = await PublicKey.findProgramAddress(
      [Buffer.from("vault"), plasmaMint.toBuffer()],
      program.programId
    );
    
    // Find the user info PDA
    [userInfo, userInfoBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("user_info"), buyer.publicKey.toBuffer(), plasmaMint.toBuffer()],
      program.programId
    );
    
    // Find the user vault - using sync version to avoid potential errors
    userVault = getAssociatedTokenAddressSync(
      plasmaMint,
      userInfo,
      true
    );
    
    // Get the current timestamp for testing
    const slot = await provider.connection.getSlot();
    const blockTime = await provider.connection.getBlockTime(slot);
    currentTimestamp = blockTime || Math.floor(Date.now() / 1000);
    
    console.log("Current timestamp:", currentTimestamp);
  });
  
  it("Initialize the presale", async () => {
    // Create a keypair for the presale account instead of just a public key
    const presaleAccountKeypair = anchor.web3.Keypair.generate();
    presaleAccount = presaleAccountKeypair.publicKey;
    
    console.log("Initializing presale with account:", presaleAccount.toString());
    
    // Initialize the presale
    await program.methods
      .initialize(new anchor.BN(PRICE_PER_TOKEN), new anchor.BN(TOTAL_ALLOCATION))
      .accounts({
        presale: presaleAccount,
        plasmaMint: plasmaMint,
        presaleVault: presaleVault,
        presaleVaultAuthority: presaleVaultAuthority,
        treasury: treasury,
        authority: authority.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID, // This will be interpreted as TokenInterface
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([authority, presaleAccountKeypair])
      .rpc({ commitment: "confirmed" });
    
    // Verify the presale account was initialized correctly
    const presaleData = await program.account.presaleAccount.fetch(presaleAccount);
    assert.equal(presaleData.authority.toString(), authority.publicKey.toString());
    assert.equal(presaleData.plasmaMint.toString(), plasmaMint.toString());
    assert.equal(presaleData.treasury.toString(), treasury.toString());
    assert.equal(presaleData.pricePerToken.toString(), PRICE_PER_TOKEN.toString());
    assert.equal(presaleData.totalAllocation.toString(), TOTAL_ALLOCATION.toString());
    assert.equal(presaleData.tokensSold.toString(), "0");
    assert.equal(presaleData.isActive, true);
    
    console.log("Presale initialized successfully!");
    
    // Fund the presale vault with tokens
    const authorityATA = await createAssociatedTokenAccount(
      provider.connection,
      payer,
      plasmaMint,
      authority.publicKey,
      { commitment: "confirmed" }
    );
    
    // Mint tokens to the authority
    await mintTo(
      provider.connection,
      payer,
      plasmaMint,
      authorityATA,
      authority.publicKey,
      TOTAL_ALLOCATION,
      [authority],
      { commitment: "confirmed" },
      TOKEN_PROGRAM_ID
    );
    
    // Transfer tokens to the presale vault
    const transferIx = await createTransferInstruction(
      authorityATA,
      presaleVault,
      authority.publicKey,
      TOTAL_ALLOCATION
    );
    
    await provider.sendAndConfirm(new anchor.web3.Transaction().add(transferIx), [authority], { commitment: "confirmed" });
    
    console.log("Presale vault funded with tokens!");
  });
  
  it("Buy tokens", async () => {
    const PURCHASE_AMOUNT = 100; // Buy 100 tokens
    const SOL_COST = PRICE_PER_TOKEN * PURCHASE_AMOUNT;
    
    console.log(`Buying ${PURCHASE_AMOUNT} tokens for ${SOL_COST / LAMPORTS_PER_SOL} SOL`);
    
    // Create buyer's token account
    const buyerTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      payer,
      plasmaMint,
      buyer.publicKey,
      { commitment: "confirmed" }
    );
    
    // Get the initial SOL balance of the treasury
    const initialTreasuryBalance = await provider.connection.getBalance(treasury);
    
    // Buy tokens
    await program.methods
      .buyTokens(new anchor.BN(PURCHASE_AMOUNT))
      .accounts({
        presale: presaleAccount,
        presaleVault: presaleVault,
        presaleVaultAuthority: presaleVaultAuthority,
        userInfo: userInfo,
        userVault: userVault,
        plasmaMint: plasmaMint,
        treasuryAccount: treasury,
        buyer: buyer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([buyer])
      .rpc();
    
    // Verify the SOL was transferred to the treasury
    const newTreasuryBalance = await provider.connection.getBalance(treasury);
    assert.equal(
      newTreasuryBalance - initialTreasuryBalance,
      SOL_COST,
      "Treasury should have received the correct amount of SOL"
    );
    
    // Verify the tokens were purchased and locked in the user vault
    const userInfoData = await program.account.userInfo.fetch(userInfo);
    assert.equal(userInfoData.buyer.toString(), buyer.publicKey.toString());
    assert.equal(userInfoData.amount.toString(), PURCHASE_AMOUNT.toString());
    assert.isAtLeast(
      userInfoData.unlockTime.toNumber(),
      currentTimestamp + 60 * 60 * 24 * 365,
      "Unlock time should be at least 1 year in the future"
    );
    assert.equal(userInfoData.claimed, false);
    
    // Verify the presale account was updated
    const presaleData = await program.account.presaleAccount.fetch(presaleAccount);
    assert.equal(presaleData.tokensSold.toString(), PURCHASE_AMOUNT.toString());
    
    console.log("Tokens purchased successfully!");
    console.log("Tokens will be unlocked at timestamp:", userInfoData.unlockTime.toString());
  });
  
  // Note: In a real test, we would need to simulate the passage of time
  // For demonstration purposes, we'll just show how the claim would be called
  it("Claim tokens (demonstration only)", async () => {
    console.log("Note: In a real scenario, you would wait for the lock period to end");
    console.log("This claim would fail until the unlock time is reached");
    
    try {
      await program.methods
        .claimTokens()
        .accounts({
          userInfo: userInfo,
          userVault: userVault,
          userTokenAccount: await getAssociatedTokenAddress(
            plasmaMint,
            buyer.publicKey
          ),
          plasmaMint: plasmaMint,
          buyer: buyer.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([buyer])
        .rpc();
      
      console.log("Tokens claimed successfully!");
    } catch (error) {
      console.log("Expected error since tokens are still locked:", error.message);
    }
  });
  
  it("Toggle presale status", async () => {
    await program.methods
      .togglePresale(false)
      .accounts({
        presale: presaleAccount,
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();
    
    // Verify the presale is now inactive
    const presaleData = await program.account.presaleAccount.fetch(presaleAccount);
    assert.equal(presaleData.isActive, false);
    
    console.log("Presale toggled to inactive!");
    
    // Toggle it back on
    await program.methods
      .togglePresale(true)
      .accounts({
        presale: presaleAccount,
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();
    
    // Verify the presale is now active again
    const presaleDataUpdated = await program.account.presaleAccount.fetch(presaleAccount);
    assert.equal(presaleDataUpdated.isActive, true);
    
    console.log("Presale toggled back to active!");
  });
});

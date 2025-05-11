# Solana-Token-presale

A Solana presale contract for the Plasma Token (Token-2022) with a 1-year time lock.

## Features

- Buy Plasma Tokens with SOL
- Automatic 1-year time lock for purchased tokens
- Secure token vaulting during the lock period
- Token claiming after lock period
- Admin controls to manage the presale

## Contract Information

- Plasma Token Mint Address: `ARTBJwHjYbxDFY9i2qLaGddmTgWDzXh4hkfuEWisFipZ`
- Program ID: `F8F9Ny7p3jXkZctSmzZFfDnpdhrqnCW4tQnbqVYWHcbv`

## Contract Structure

The presale contract implements the following functionality:

1. **Initialize**: Set up the presale with token price and allocation
2. **Buy Tokens**: Users can purchase tokens with SOL which go into a time-locked vault
3. **Claim Tokens**: After the 1-year lock period, users can claim their tokens
4. **Toggle Presale**: Admin can enable/disable the presale

## How to Deploy

1. Build the program:
   ```bash
   cd presale
   anchor build
   ```

2. Deploy to Solana:
   ```bash
   anchor deploy
   ```

3. Run tests:
   ```bash
   anchor test
   ```

## How to Use

### For Admins

1. Initialize the presale:
   ```javascript
   await program.methods
     .initialize(pricePerToken, totalAllocation)
     .accounts({
       presale: presaleAccount,
       plasmaMint: plasmaMint,
       presaleVault: presaleVault,
       presaleVaultAuthority: presaleVaultAuthority,
       treasury: treasury,
       authority: wallet.publicKey,
       systemProgram: SystemProgram.programId,
       tokenProgram: TOKEN_PROGRAM_ID,
       rent: SYSVAR_RENT_PUBKEY,
     })
     .rpc();
   ```

2. Fund the presale vault with tokens

3. Toggle presale state:
   ```javascript
   await program.methods
     .togglePresale(isActive)
     .accounts({
       presale: presaleAccount,
       authority: wallet.publicKey,
     })
     .rpc();
   ```

### For Buyers

1. Buy tokens:
   ```javascript
   await program.methods
     .buyTokens(amount)
     .accounts({
       presale: presaleAccount,
       presaleVault: presaleVault,
       presaleVaultAuthority: presaleVaultAuthority,
       userInfo: userInfo,
       userVault: userVault,
       plasmaMint: plasmaMint,
       treasuryAccount: treasury,
       buyer: wallet.publicKey,
       systemProgram: SystemProgram.programId,
       tokenProgram: TOKEN_PROGRAM_ID,
       associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
       rent: SYSVAR_RENT_PUBKEY,
     })
     .rpc();
   ```

2. Claim tokens after lock period:
   ```javascript
   await program.methods
     .claimTokens()
     .accounts({
       userInfo: userInfo,
       userVault: userVault,
       userTokenAccount: userTokenAccount,
       plasmaMint: plasmaMint,
       buyer: wallet.publicKey,
       systemProgram: SystemProgram.programId,
       tokenProgram: TOKEN_PROGRAM_ID,
       associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
       rent: SYSVAR_RENT_PUBKEY,
     })
     .rpc();
   ```

## Security Considerations

- The contract uses PDAs for secure token vaulting
- Time locks are enforced at the contract level
- Admin functions are protected with authority checks
- Built with the Anchor framework for enhanced security

## Development

To modify this contract, update the `lib.rs` file in the `programs/presale/src` directory and rebuild using Anchor.
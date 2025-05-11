use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, system_instruction};
use anchor_spl::{
    token_interface::{self as token_interface, Mint, TokenAccount, TokenInterface, Transfer},
    associated_token::AssociatedToken
};

declare_id!("F8F9Ny7p3jXkZctSmzZFfDnpdhrqnCW4tQnbqVYWHcbv");

// Constants for the presale
pub const PLASMA_TOKEN_MINT: &str = "ARTBJwHjYbxDFY9i2qLaGddmTgWDzXh4hkfuEWisFipZ";
pub const LOCK_DURATION: i64 = 60 * 60 * 24 * 365; // 1 year in seconds
pub const VAULT_SEED: &[u8] = b"vault";
pub const USER_INFO_SEED: &[u8] = b"user_info";

#[program]
pub mod presale {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        price_per_token: u64,
        total_allocation: u64,
    ) -> Result<()> {
        let presale = &mut ctx.accounts.presale;
        
        // Initialize presale account
        presale.authority = ctx.accounts.authority.key();
        presale.plasma_mint = ctx.accounts.plasma_mint.key();
        presale.treasury = ctx.accounts.treasury.key();
        presale.price_per_token = price_per_token;
        presale.total_allocation = total_allocation;
        presale.tokens_sold = 0;
        presale.is_active = true;
        
        msg!("Presale initialized with price {} lamports per token", price_per_token);
        Ok(())
    }

    pub fn buy_tokens(
        ctx: Context<BuyTokens>,
        amount: u64
    ) -> Result<()> {
        let presale = &mut ctx.accounts.presale;
        require!(presale.is_active, PresaleError::PresaleInactive);
        require!(presale.tokens_sold + amount <= presale.total_allocation, PresaleError::ExceedsAllocation);
        
        // Calculate SOL cost
        let cost = presale.price_per_token.checked_mul(amount).ok_or(PresaleError::CalculationError)?;
        
        // Transfer SOL from buyer to treasury
        invoke(
            &system_instruction::transfer(
                ctx.accounts.buyer.key,
                &presale.treasury,
                cost,
            ),
            &[
                ctx.accounts.buyer.to_account_info(),
                ctx.accounts.treasury_account.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;
        
        // Create user vault if it doesn't exist
        let user_info = &mut ctx.accounts.user_info;
        if user_info.buyer == Pubkey::default() {
            user_info.buyer = ctx.accounts.buyer.key();
            user_info.amount = 0;
            user_info.unlock_time = Clock::get()?.unix_timestamp + LOCK_DURATION;
            user_info.claimed = false;
            user_info.bump = ctx.bumps.user_info;
        }
        
        // Transfer tokens from presale vault to user vault
        let vault_bump = ctx.bumps.presale_vault;
        let mint_key = presale.plasma_mint;
        
        let seeds = &[
            VAULT_SEED, 
            mint_key.as_ref(),
            &[vault_bump]
        ];
        let signer = &[&seeds[..]];
        
        token_interface::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.presale_vault.to_account_info(),
                    to: ctx.accounts.user_vault.to_account_info(),
                    authority: ctx.accounts.presale_vault_authority.to_account_info(),
                },
                signer,
            ),
            amount,
        )?;
        
        // Update state
        presale.tokens_sold = presale.tokens_sold.checked_add(amount).ok_or(PresaleError::CalculationError)?;
        user_info.amount = user_info.amount.checked_add(amount).ok_or(PresaleError::CalculationError)?;
        
        msg!("User purchased {} tokens locked until timestamp {}", amount, user_info.unlock_time);
        Ok(())
    }

    pub fn claim_tokens(
        ctx: Context<ClaimTokens>
    ) -> Result<()> {
        let current_time = Clock::get()?.unix_timestamp;
        
        require!(!ctx.accounts.user_info.claimed, PresaleError::AlreadyClaimed);
        require!(current_time >= ctx.accounts.user_info.unlock_time, PresaleError::TokensStillLocked);
        
        // Transfer tokens from user vault to user's wallet
        let user_info_bump = ctx.bumps.user_info;
        let mint_key = ctx.accounts.plasma_mint.key();
        let buyer_key = ctx.accounts.user_info.buyer;
        
        let seeds = &[
            USER_INFO_SEED,
            buyer_key.as_ref(),
            mint_key.as_ref(),
            &[user_info_bump],
        ];
        let signer = &[&seeds[..]];
        
        let amount = ctx.accounts.user_info.amount;
        
        token_interface::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.user_vault.to_account_info(),
                    to: ctx.accounts.user_token_account.to_account_info(),
                    authority: ctx.accounts.user_info.to_account_info(),
                },
                signer,
            ),
            amount,
        )?;
        
        // Mark as claimed
        ctx.accounts.user_info.claimed = true;
        
        msg!("User claimed {} tokens after lock period", amount);
        Ok(())
    }

    pub fn toggle_presale(ctx: Context<TogglePresale>, active: bool) -> Result<()> {
        let presale = &mut ctx.accounts.presale;
        presale.is_active = active;
        
        msg!("Presale is now {}", if active { "active" } else { "inactive" });
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + PresaleAccount::LEN)]
    pub presale: Account<'info, PresaleAccount>,
    
    pub plasma_mint: InterfaceAccount<'info, Mint>,
    
    #[account(
        init,
        payer = authority,
        seeds = [VAULT_SEED, plasma_mint.key().as_ref()],
        bump,
        token::mint = plasma_mint,
        token::authority = presale_vault_authority,
    )]
    pub presale_vault: InterfaceAccount<'info, TokenAccount>,
    
    /// CHECK: This is the PDA that will own the presale vault
    #[account(
        seeds = [VAULT_SEED, plasma_mint.key().as_ref()],
        bump,
    )]
    pub presale_vault_authority: UncheckedAccount<'info>,
    
    /// CHECK: This is the treasury account that will receive SOL
    pub treasury: UncheckedAccount<'info>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct BuyTokens<'info> {
    #[account(mut)]
    pub presale: Account<'info, PresaleAccount>,
    
    #[account(
        mut,
        seeds = [VAULT_SEED, presale.plasma_mint.as_ref()],
        bump,
    )]
    pub presale_vault: InterfaceAccount<'info, TokenAccount>,
    
    /// CHECK: This is the PDA that owns the presale vault
    #[account(
        seeds = [VAULT_SEED, presale.plasma_mint.as_ref()],
        bump,
    )]
    pub presale_vault_authority: UncheckedAccount<'info>,
    
    #[account(
        init_if_needed,
        payer = buyer,
        seeds = [USER_INFO_SEED, buyer.key().as_ref(), presale.plasma_mint.as_ref()],
        bump,
        space = 8 + UserInfo::LEN,
    )]
    pub user_info: Account<'info, UserInfo>,
    
    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = plasma_mint,
        associated_token::authority = user_info,
    )]
    pub user_vault: InterfaceAccount<'info, TokenAccount>,
    
    pub plasma_mint: InterfaceAccount<'info, Mint>,
    
    /// CHECK: This is the treasury account that will receive SOL
    #[account(mut, address = presale.treasury)]
    pub treasury_account: UncheckedAccount<'info>,
    
    #[account(mut)]
    pub buyer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct ClaimTokens<'info> {
    #[account(
        mut,
        seeds = [USER_INFO_SEED, user_info.buyer.as_ref(), plasma_mint.key().as_ref()],
        bump,
        has_one = buyer,
    )]
    pub user_info: Account<'info, UserInfo>,
    
    #[account(
        mut,
        associated_token::mint = plasma_mint,
        associated_token::authority = user_info,
    )]
    pub user_vault: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = plasma_mint,
        associated_token::authority = buyer,
    )]
    pub user_token_account: InterfaceAccount<'info, TokenAccount>,
    
    pub plasma_mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub buyer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct TogglePresale<'info> {
    #[account(mut, has_one = authority)]
    pub presale: Account<'info, PresaleAccount>,
    
    pub authority: Signer<'info>,
}

#[account]
pub struct PresaleAccount {
    pub authority: Pubkey,         // 32
    pub plasma_mint: Pubkey,       // 32
    pub treasury: Pubkey,          // 32
    pub price_per_token: u64,      // 8
    pub total_allocation: u64,     // 8
    pub tokens_sold: u64,          // 8
    pub is_active: bool,           // 1
}

impl PresaleAccount {
    pub const LEN: usize = 32 + 32 + 32 + 8 + 8 + 8 + 1;
}

#[account]
pub struct UserInfo {
    pub buyer: Pubkey,             // 32
    pub amount: u64,               // 8
    pub unlock_time: i64,          // 8
    pub claimed: bool,             // 1
    pub bump: u8,                  // 1
}

impl UserInfo {
    pub const LEN: usize = 32 + 8 + 8 + 1 + 1;
}

#[error_code]
pub enum PresaleError {
    #[msg("Presale is not active")]
    PresaleInactive,
    
    #[msg("Purchase exceeds remaining allocation")]
    ExceedsAllocation,
    
    #[msg("Tokens are still locked")]
    TokensStillLocked,
    
    #[msg("Tokens have already been claimed")]
    AlreadyClaimed,
    
    #[msg("Calculation error occurred")]
    CalculationError,
}

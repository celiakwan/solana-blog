use anchor_lang::prelude::*;

declare_id!("9muDycj4AvNNTKpMVdZJZfhS72YLRFAt2ZwEQDWKoDom");

#[program]
pub mod solana_blog {
    use super::*;
    
    pub fn initialize(ctx: Context<Initialize>, bump: u8) -> ProgramResult {
        ctx.accounts.blog_account.bump = bump;
        ctx.accounts.blog_account.user = *ctx.accounts.user.key;
        Ok(())
    }

    pub fn create_post(ctx: Context<CreatePost>, bump: u8, title: String, body: String) -> ProgramResult {
        ctx.accounts.blog_account.post_count += 1;
        ctx.accounts.post_account.bump = bump;
        ctx.accounts.post_account.user = *ctx.accounts.user.key;
        ctx.accounts.post_account.title = title;
        ctx.accounts.post_account.body = body;
        Ok(())
    }

    pub fn update_post(ctx: Context<UpdatePost>, title: String, body: String) -> ProgramResult {
        ctx.accounts.post_account.title = title;
        ctx.accounts.post_account.body = body;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct Initialize<'info> {
    #[account(
        init,
        seeds = [b"blog".as_ref(), user.key().as_ref()],
        bump = bump,
        payer = user
    )]
    pub blog_account: Account<'info, Blog>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct CreatePost<'info> {
    #[account(mut, has_one = user)]
    pub blog_account: Account<'info, Blog>,
    #[account(
        init,
        seeds = [b"post".as_ref(), blog_account.key().as_ref(), [blog_account.post_count].as_ref()],
        bump = bump,
        payer = user,
        space = 10000
    )]
    pub post_account: Account<'info, Post>,
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct UpdatePost<'info> {
    #[account(has_one = user)]
    pub blog_account: Account<'info, Blog>,
    #[account(mut, has_one = user)]
    pub post_account: Account<'info, Post>,
    pub user: Signer<'info>
}

#[account]
#[derive(Default)]
pub struct Blog {
    pub bump: u8,
    pub user: Pubkey,
    pub post_count: u8
}

#[account]
#[derive(Default)]
pub struct Post {
    pub bump: u8,
    pub user: Pubkey,
    pub title: String,
    pub body: String
}

use anchor_lang::prelude::*;

declare_id!("5hGETq3RRTk5S6AufnVRrMvJznyEmEUYT4afQMNVFJYM");

#[program]
pub mod tweet_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn sendtweet(ctx: Context<SendTweet>, msg: String) -> Result<()> {
        let tweet_account = &mut ctx.accounts.tweet_account;

        tweet_account.author = ctx.accounts.user.key();
        tweet_account.time = Clock::get()?.unix_timestamp;
        tweet_account.message = msg;

        msg!("Tweet Saved!!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
pub struct SendTweet<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 8 + 280 + 32,
    )]
    pub tweet_account: Account<'info, Tweet>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct Tweet {
    pub author: Pubkey,
    pub message: String,
    pub time: i64,
}

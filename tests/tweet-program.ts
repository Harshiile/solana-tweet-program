import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TweetProgram } from "../target/types/tweet_program";
import { Keypair, PublicKey } from "@solana/web3.js";
import { BN } from "bn.js";

describe("tweet-program", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.tweetProgram as Program<TweetProgram>;
  const walletPubKey = provider.wallet.publicKey;
  const t1 = anchor.web3.Keypair.generate();
  const t2 = anchor.web3.Keypair.generate();

  const fetchTweets = async () => {
    const x = await program.account.tweet.all([
      {
        memcmp: {
          offset: 8,
          bytes: walletPubKey.toBase58()
        }
      }
    ]);

    console.table(x.map(item => {
      return {
        message: item.account.message,
        time: item.account.time
      }
    }));
  }


  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program
      .methods
      .initialize()
      .rpc();

    console.log("Your transaction signature", tx);
  });


  it('Send Tweet', async () => {

    await program
      .methods
      .sendtweet("Hello First Tweet")
      .accounts({
        user: walletPubKey,
        tweetAccount: t1.publicKey,
      })
      .signers([t1])
      .rpc();


    await program
      .methods
      .sendtweet("Hello Second Tweet")
      .accounts({
        user: walletPubKey,
        tweetAccount: t2.publicKey
      })
      .signers([t2])
      .rpc();

  });

  it('fetching-tweets-after-sending', async () => {
    fetchTweets()
  })

  it('Update Tweet', async () => {
    await program
      .methods
      .updatetweet("Updated Tweet")
      .accounts({
        user: walletPubKey,
        tweetAccount: t1.publicKey
      })
      .rpc();
  })

  it('fetching-tweets-after-update', async () => {
    fetchTweets()
  })

  it('Delete Tweet', async () => {
    await program
      .methods
      .deletetweet()
      .accounts({
        tweetAccount: t1.publicKey,
        user: walletPubKey
      })
      .rpc();
  })

  it('fetching-tweets-after-delete', async () => {
    fetchTweets()
  })

})

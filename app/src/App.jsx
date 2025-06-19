import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getProgram } from "./utils";
import * as anchor from "@coral-xyz/anchor";

export const App = () => {
    const [message, setMessage] = useState("");
    const [tweets, setTweets] = useState([]);
    const wallet = useWallet();
    const [buttonText, setButtonText] = useState('Get Tweets')
    const [sendText, setSendText] = useState('Send')
    const [tweetText, setTweetText] = useState('No tweets fetched yet.')
    const program = getProgram(wallet);

    const sendTweet = async () => {
        if (!message) return alert("Enter a message first");
        if (!wallet.connected || !wallet.publicKey) {
            return alert("Connect wallet first");
        }
        setSendText('Sending ...')
        const tweetAccount = anchor.web3.Keypair.generate();

        await program.methods
            .sendtweet(message)
            .accounts({
                tweetAccount: tweetAccount.publicKey,
                user: wallet.publicKey,
            })
            .signers([tweetAccount])
            .rpc();

        setSendText('Send');
        window.location.reload()
    };

    useEffect(() => {
        if (wallet.connected || wallet.publicKey) {

            ; (async () => {
                setButtonText('Loading ...')
                const allTweets = await program.account.tweet.all([
                    {
                        memcmp: {
                            offset: 8,
                            bytes: wallet.publicKey.toBase58()
                        }
                    }
                ]);
                setButtonText('Get Tweets')
                allTweets.length == 0 && setTweetText('0 Tweets')

                const tweets = allTweets.map(item => {
                    return {
                        message: item.account.message,
                        time: item.account.time
                    }
                });

                setTweets(tweets);
            })()
        }
    }, [wallet])

    return (
        <div className="mt-10 space-y-7 flex flex-col items-center">
            <div className="flex gap-x-4">
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter Message"
                    className="border p-3 w-64 rounded"
                />
                <button
                    onClick={sendTweet}
                    className="border px-9 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    {sendText}
                </button>
            </div>

            <div className="border border-white w-[30vw] min-h-[30vh] flex flex-col items-center py-4 rounded">
                {tweets.length === 0 ? (
                    <p className="text-gray-400">{tweetText}</p>
                ) : (
                    <ul className="space-y-2">
                        {tweets.map((tweet, idx) => (
                            <li key={idx} className="border p-2 rounded bg-gray-100 text-black w-[20vw]">
                                <div className="font-semibold">{tweet.message}</div>
                                <div className="text-sm text-gray-500">
                                    {new Date(tweet.time.toNumber() * 1000).toLocaleString()}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

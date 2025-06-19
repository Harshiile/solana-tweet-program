import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getProgram } from "./utils";
import * as anchor from "@coral-xyz/anchor";

export const App = () => {
    const [message, setMessage] = useState("");
    const [tweets, setTweets] = useState([]);
    const [sendText, setSendText] = useState("Send");
    const [buttonText, setButtonText] = useState("Get Tweets");
    const [tweetText, setTweetText] = useState("No tweets fetched yet.");
    const [editMode, setEditMode] = useState(false);
    const [selectedTweet, setSelectedTweet] = useState(null);
    const [newMessage, setNewMessage] = useState("");

    const wallet = useWallet();
    const program = getProgram(wallet);

    const fetchAllTweets = async () => {
        if (!wallet.publicKey) return;
        setButtonText("Loading...");
        const allTweets = await program.account.tweet.all([
            {
                memcmp: {
                    offset: 8,
                    bytes: wallet.publicKey.toBase58(),
                },
            },
        ]);

        setButtonText("Get Tweets");
        allTweets.length === 0 && setTweetText("0 Tweets");

        const tweets = allTweets.map((item) => ({
            message: item.account.message,
            time: item.account.time,
            pubkey: item.publicKey,
        }));
        setTweets(tweets);
    };

    const sendTweet = async () => {
        if (!message) return alert("Enter a message first");
        if (!wallet.connected || !wallet.publicKey) {
            return alert("Connect wallet first");
        }

        setSendText("Sending...");
        const tweetAccount = anchor.web3.Keypair.generate();

        await program.methods
            .sendtweet(message)
            .accounts({
                tweetAccount: tweetAccount.publicKey,
                user: wallet.publicKey,
            })
            .signers([tweetAccount])
            .rpc();

        setSendText("Send");
        setMessage("");
        fetchAllTweets();
    };

    const deleteTweet = async (pubkey) => {
        await program.methods
            .deletetweet()
            .accounts({
                tweetAccount: pubkey,
                user: wallet.publicKey,
            })
            .rpc();

        fetchAllTweets();
    };

    const updateTweet = async () => {
        if (!newMessage || !selectedTweet) return;

        await program.methods
            .updatetweet(newMessage)
            .accounts({
                tweetAccount: selectedTweet.pubkey,
                user: wallet.publicKey,
            })
            .rpc();

        setEditMode(false);
        setNewMessage("");
        setSelectedTweet(null);
        fetchAllTweets();
    };

    useEffect(() => {
        if (wallet.connected && wallet.publicKey) {
            fetchAllTweets();
        }
    }, [wallet]);

    return (
        <div className="mt-10 space-y-7 flex flex-col items-center">
            {/* Input Form */}
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

            {/* Tweets Display */}
            <div className="border border-white w-[30vw] min-h-[30vh] flex flex-col items-center py-4 rounded">
                <button
                    onClick={fetchAllTweets}
                    className="mb-3 px-4 py-1 border bg-green-600 text-white rounded"
                >
                    {buttonText}
                </button>

                {tweets.length === 0 ? (
                    <p className="text-gray-400">{tweetText}</p>
                ) : (
                    <ul className="space-y-2">
                        {tweets.map((tweet, idx) => (
                            <li
                                key={idx}
                                className="border p-3 rounded bg-gray-100 text-black w-[22vw] space-y-1"
                            >
                                <div className="font-semibold">{tweet.message}</div>
                                <div className="text-sm text-gray-500">
                                    {new Date(tweet.time.toNumber() * 1000).toLocaleString()}
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={() => {
                                            setEditMode(true);
                                            setSelectedTweet(tweet);
                                            setNewMessage(tweet.message);
                                        }}
                                        className="px-2 py-1 bg-yellow-400 text-black rounded text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteTweet(tweet.pubkey)}
                                        className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Edit Dialog */}
            {editMode && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded w-96 space-y-4">
                        <h2 className="text-xl font-bold text-black">Edit Tweet</h2>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-black"
                            placeholder="Enter new tweet"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditMode(false)}
                                className="px-4 py-1 bg-gray-400 text-white rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={updateTweet}
                                className="px-4 py-1 bg-blue-600 text-white rounded"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

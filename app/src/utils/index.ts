import { Connection } from '@solana/web3.js'
import * as anchor from "@coral-xyz/anchor";
import { Idl } from './idl'

export const getProvider = (wallet) => {
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    return new anchor.AnchorProvider(connection, wallet, {
        preflightCommitment: "processed",
    });
}

export const getProgram = (wallet) => {
    const provider = getProvider(wallet);
    return new anchor.Program(Idl, provider)
}
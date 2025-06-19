/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/tweet_program.json`.
 */
export const Idl = {
    "address": "2naNy35AmR4hgg4sXqe7vwBtkQDciHGtFbmfheCVo8vp",
    "metadata": {
        "name": "tweetProgram",
        "version": "0.1.0",
        "spec": "0.1.0",
        "description": "Created with Anchor"
    },
    "instructions": [
        {
            "name": "deletetweet",
            "discriminator": [
                196,
                20,
                89,
                184,
                66,
                117,
                25,
                64
            ],
            "accounts": [
                {
                    "name": "tweetAccount",
                    "writable": true
                },
                {
                    "name": "author",
                    "writable": true,
                    "signer": true,
                    "relations": [
                        "tweetAccount"
                    ]
                }
            ],
            "args": []
        },
        {
            "name": "initialize",
            "discriminator": [
                175,
                175,
                109,
                31,
                13,
                152,
                155,
                237
            ],
            "accounts": [],
            "args": []
        },
        {
            "name": "sendtweet",
            "discriminator": [
                211,
                101,
                164,
                148,
                175,
                125,
                196,
                97
            ],
            "accounts": [
                {
                    "name": "tweetAccount",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "user",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "msg",
                    "type": "string"
                }
            ]
        },
        {
            "name": "updatetweet",
            "discriminator": [
                110,
                138,
                191,
                168,
                48,
                143,
                189,
                22
            ],
            "accounts": [
                {
                    "name": "tweetAccount",
                    "writable": true
                },
                {
                    "name": "author",
                    "writable": true,
                    "signer": true,
                    "relations": [
                        "tweetAccount"
                    ]
                }
            ],
            "args": [
                {
                    "name": "newMsg",
                    "type": "string"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "tweet",
            "discriminator": [
                229,
                13,
                110,
                58,
                118,
                6,
                20,
                79
            ]
        }
    ],
    "types": [
        {
            "name": "tweet",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "author",
                        "type": "pubkey"
                    },
                    {
                        "name": "message",
                        "type": "string"
                    },
                    {
                        "name": "time",
                        "type": "i64"
                    }
                ]
            }
        }
    ]
};
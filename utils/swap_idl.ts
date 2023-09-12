export type Swap = {
  "version": "0.0.0",
  "name": "swap",
  "instructions": [
    {
      "name": "IxClosePool",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenAVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenBVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "authBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "IxCreatePool",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mintA",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintB",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenAVault",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenBVault",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolInfo",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lpMint",
          "type": "publicKey"
        },
        {
          "name": "minLiquidity",
          "type": "u64"
        },
        {
          "name": "feeRate",
          "type": "u64"
        }
      ]
    },
    {
      "name": "IxDeposit",
      "accounts": [
        {
          "name": "depositor",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpMintAuth",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenB",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenLiquidity",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenBVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amountA",
          "type": "u64"
        },
        {
          "name": "amountB",
          "type": "u64"
        },
        {
          "name": "mintAuthBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "IxTrade",
      "accounts": [
        {
          "name": "trader",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenB",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenBVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "offeredAmount",
          "type": "u64"
        },
        {
          "name": "expectedAmount",
          "type": "u64"
        },
        {
          "name": "inverse",
          "type": "bool"
        },
        {
          "name": "vaultAuthBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "IxWithdraw",
      "accounts": [
        {
          "name": "depositor",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenB",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenLiquidity",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenBVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "vaultAuthBump",
          "type": "u8"
        }
      ]
    }
  ]
};

export const IDL: Swap = {
  "version": "0.0.0",
  "name": "swap",
  "instructions": [
    {
      "name": "IxClosePool",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenAVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenBVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "authBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "IxCreatePool",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mintA",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintB",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenAVault",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenBVault",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolInfo",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lpMint",
          "type": "publicKey"
        },
        {
          "name": "minLiquidity",
          "type": "u64"
        },
        {
          "name": "feeRate",
          "type": "u64"
        }
      ]
    },
    {
      "name": "IxDeposit",
      "accounts": [
        {
          "name": "depositor",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpMintAuth",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenB",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenLiquidity",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenBVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amountA",
          "type": "u64"
        },
        {
          "name": "amountB",
          "type": "u64"
        },
        {
          "name": "mintAuthBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "IxTrade",
      "accounts": [
        {
          "name": "trader",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenB",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenBVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "offeredAmount",
          "type": "u64"
        },
        {
          "name": "expectedAmount",
          "type": "u64"
        },
        {
          "name": "inverse",
          "type": "bool"
        },
        {
          "name": "vaultAuthBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "IxWithdraw",
      "accounts": [
        {
          "name": "depositor",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenB",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenLiquidity",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenBVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "vaultAuthBump",
          "type": "u8"
        }
      ]
    }
  ]
};

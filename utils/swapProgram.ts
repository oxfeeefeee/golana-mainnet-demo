import { Signer, Keypair, SystemProgram, Transaction, PublicKey, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, createMint, mintTo, getAccount, getAssociatedTokenAddressSync, getOrCreateAssociatedTokenAccount, Account, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import BN from 'bn.js';
import {AnchorProvider,Program, initProvider} from 'golana';
import { IDL, Swap } from './swap_idl';

export class SwapProgram {
    private program: Program<Swap>;

    private vaultA: Keypair;
    private vaultB: Keypair;
    private infoAccount: Keypair;

    private vaultAPubKey: PublicKey;
    private vaultBPubKey: PublicKey;
    private infoAccountPubKey: PublicKey;

    private creator: PublicKey;
    private depositor: PublicKey;
    private trader: PublicKey;

    private depositorTokenAccountA: PublicKey;
    private depositorTokenAccountB: PublicKey;
    private depositorTokenAccountLP: PublicKey;

    private traderTokenAccountA: PublicKey;
    private traderTokenAccountB: PublicKey;

    private mintA: PublicKey;
    private mintB: PublicKey;
    private mintLP: PublicKey;

    private vault_authority_pda: PublicKey;
    private vault_authority_bump: number;
    private lp_token_mint_auth_pda: PublicKey;
    private lp_token_mint_auth_bump: number;
    
    public static async createLpMint(provider: AnchorProvider, programAuth: PublicKey) {
        //7cAHvYHXdkq416UZoAT5aVCvQzwMzxQTv5SwpUHinvRf
        const privateKeyUint8Array = new Uint8Array([0,239,183,30,56,112,14,194,128,132,120,114,115,127,81,93,154,74,145,150,108,199,79,17,37,255,227,173,238,186,45,134,98,39,244,196,105,150,18,188,135,30,193,59,160,246,215,83,120,247,63,128,225,223,131,232,29,37,113,183,228,144,22,226]);
        const payer = Keypair.fromSecretKey(privateKeyUint8Array);

        const program = await Program.create<Swap>(IDL, programAuth);
        const [lp_token_mint_auth_pda, _] = await program.findAddr("mint-auth");
        const mintLP = await createMint(
            provider.connection,
            payer,
            lp_token_mint_auth_pda,
            null,
            6
        );
        console.log("Created LP mint:", mintLP.toBase58());
    }

    public static async create(provider: AnchorProvider, programAuth: PublicKey, creator: PublicKey, depositor: PublicKey, trader: PublicKey,
        mintA:PublicKey, mintB:PublicKey, mintLP:PublicKey,
        vaultAPubKey?:PublicKey, vaultBPubKey?:PublicKey, infoAccountPubKey?:PublicKey ): Promise<SwapProgram> {
        const swapProgram = new SwapProgram();

        swapProgram.program = await Program.create<Swap>(IDL, programAuth);
        [swapProgram.vault_authority_pda, swapProgram.vault_authority_bump] = await swapProgram.program.findAddr("vault-auth");
        [swapProgram.lp_token_mint_auth_pda, swapProgram.lp_token_mint_auth_bump] = await swapProgram.program.findAddr("mint-auth");
        
        swapProgram.mintA = mintA;
        swapProgram.mintB = mintB;
        swapProgram.mintLP = mintLP;

        if (vaultAPubKey === undefined) {
            swapProgram.vaultA = new Keypair();
            vaultAPubKey = swapProgram.vaultA.publicKey;
        }
        swapProgram.vaultAPubKey = vaultAPubKey;
        if (vaultBPubKey === undefined) {
            swapProgram.vaultB = new Keypair();
            vaultBPubKey = swapProgram.vaultB.publicKey;
        }
        swapProgram.vaultBPubKey = vaultBPubKey;
        if (infoAccountPubKey === undefined) {
            swapProgram.infoAccount = new Keypair();
            infoAccountPubKey = swapProgram.infoAccount.publicKey;
        }
        swapProgram.infoAccountPubKey = infoAccountPubKey;
        console.log("vaultA:", swapProgram.vaultAPubKey.toBase58());
        console.log("vaultB:", swapProgram.vaultBPubKey.toBase58());
        console.log("infoAccount:", swapProgram.infoAccountPubKey.toBase58());
        
        swapProgram.creator = creator;
        swapProgram.depositor = depositor;
        swapProgram.trader = trader;

        swapProgram.depositorTokenAccountA = getAssociatedTokenAddressSync(mintA, depositor);
        swapProgram.depositorTokenAccountB = getAssociatedTokenAddressSync(mintB, depositor);
        swapProgram.depositorTokenAccountLP = getAssociatedTokenAddressSync(mintLP, depositor);
        swapProgram.traderTokenAccountA = getAssociatedTokenAddressSync(mintA, trader);
        swapProgram.traderTokenAccountB = getAssociatedTokenAddressSync(mintB, trader);
        
        return swapProgram;
    }

    public async IxCreatePool(minLiqudity: BN = new BN(1000000), fee: BN = new BN(100)): Promise<string> {
        return await this.program.methods
            .IxCreatePool(this.mintLP, minLiqudity, fee)
            .accounts({
                creator: this.creator,
                mintA: this.mintA,
                mintB: this.mintB,
                tokenAVault: this.vaultAPubKey,
                tokenBVault: this.vaultBPubKey,
                poolInfo: this.infoAccountPubKey,
                systemProgram: SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .signers([this.vaultA, this.vaultB, this.infoAccount])
            .rpc();
    }

    public async IxDeposite(amountA: BN, amountB: BN): Promise<string> {
        return await this.program.methods
            .IxDeposit(amountA, amountB, this.lp_token_mint_auth_bump)
            .accounts({
                depositor: this.depositor,
                lpMint:this. mintLP,
                lpMintAuth: this.lp_token_mint_auth_pda,
                tokenA: this.depositorTokenAccountA,
                tokenB: this.depositorTokenAccountB,
                tokenLiquidity: this.depositorTokenAccountLP,
                tokenAVault: this.vaultAPubKey,
                tokenBVault: this.vaultBPubKey,
                vaultAuthority: this.vault_authority_pda,
                poolInfo: this.infoAccountPubKey,
                systemProgram: SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            })
            .signers([])
            .rpc();
    }

    public async IxTrade(amountA: BN, amountB: BN, inverse: boolean): Promise<string> {
        return await this.program.methods
            .IxTrade(amountA, amountB,inverse, this.vault_authority_bump)
            .accounts({
                trader: this.trader,
                tokenA: this.traderTokenAccountA,
                tokenB: this.traderTokenAccountB,
                tokenAVault: this.vaultAPubKey,
                tokenBVault: this.vaultBPubKey,
                vaultAuthority: this.vault_authority_pda,
                poolInfo: this.infoAccountPubKey,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .signers([])
            .rpc();
    }

    public async IxWithdraw(amount: BN): Promise<string> {
        return await this.program.methods
            .IxWithdraw(amount, this.vault_authority_bump)
            .accounts({
                depositor: this.depositor,
                lpMint: this.mintLP,
                tokenA: this.depositorTokenAccountA,
                tokenB: this.depositorTokenAccountB,
                tokenLiquidity: this.depositorTokenAccountLP,
                tokenAVault: this.vaultAPubKey,
                tokenBVault: this.vaultBPubKey,
                vaultAuthority: this.vault_authority_pda,
                poolInfo: this.infoAccountPubKey,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .signers([])
            .rpc();
    }

    public async IxClosePool(): Promise<string> {
        return await this.program.methods
            .IxClosePool(this.vault_authority_bump)
            .accounts({
                creator: this.creator,
                tokenAVault: this.vaultAPubKey,
                tokenBVault: this.vaultBPubKey,
                vaultAuthority: this.vault_authority_pda,
                poolInfo: this.infoAccountPubKey,
                systemProgram: SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .signers([])
            .rpc();
    }

    public async logDepositorAccounts() {
        const connection = this.program.provider.connection;
        const _depositorA = await getAccount(connection, this.depositorTokenAccountA);
        console.log("depositorA", _depositorA.amount.toString());
        const _depositorB = await getAccount(connection, this.depositorTokenAccountB);
        console.log("depositorB", _depositorB.amount.toString());
        const _lpAccount = await getAccount(connection, this.depositorTokenAccountLP);
        console.log("depositorLP", _lpAccount.amount.toString());

        const _vaultA = await getAccount(connection, this.vaultAPubKey);
        console.log("vaultA", _vaultA.amount.toString());
        const _vaultB = await getAccount(connection, this.vaultBPubKey);
        console.log("vaultB", _vaultB.amount.toString());
    }

    public async logTraderAccounts() {
        const connection = this.program.provider.connection;
        const _traderA = await getAccount(connection, this.traderTokenAccountA);
        console.log("Trade token A:", _traderA.amount.toString());
        const _traderB = await getAccount(connection, this.traderTokenAccountB);
        console.log("Trade token B:", _traderB.amount.toString());
    }
}





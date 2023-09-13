import { useConnection, useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { IDL, Swap } from '../utils/swap_idl';
import {SwapProgram} from '../utils/swapProgram';
import {Program, initProvider} from 'golana';
import {ComputeBudgetProgram, Keypair, PublicKey, SystemProgram, Transaction, VersionedTransactionResponse } from '@solana/web3.js';
import React, { FC, useCallback, useState } from 'react';
import BN from 'bn.js';
import Link from 'next/link'

function getLogStr(response?: VersionedTransactionResponse, somethingElse: string = ''): string {
  return JSON.stringify(response?.meta?.logMessages ?? "Failed to get transaction log, it may or may not have failed", null, 2);
}

export const SwapComp: FC = () => {
    const golanaLoaderID = "HE7R2wfjpgjHnxfA9bS6fSLJzm7nucFfBXQhhxTCWMZs";
    const programAuth = new PublicKey("7iuukgrteZuquJB6ikGD9sPxpdZSze7QaLPywH3Zqa1s");
    const mintA = new PublicKey("7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"); //SAMO
    const mintB = new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"); //BONK
    const ten = new BN(10);
    const tokenADecimal = ten.pow(new BN(9));
    const tokenBDecimal = ten.pow(new BN(5));
    const lpTokenDecimal = ten.pow(new BN(6));
    //const mintLP = "46nMTqv6psfguCtgnPri3TdVQwMLXiZMVbNW1eTNF1PB"; //testnet
    const mintLP = new PublicKey("jSJXKXXbEqnWEHLy722nj97NNoWStxsx2iK5jPYd2Ut") //mainnet
    const valutA = new PublicKey("7X3ehEH1fKzXkGpwZXb33jovZAPS3tkacvNXXz3pSfJm");
    const valutB = new PublicKey("DQ3yz1K738fjBszhSm1F6gJvyedeQp2dWioQaLwofF6K");
    const infoAccount = new PublicKey("FrA4a5K7Pu1wFmwk1UzncrkWmWM1xMLEJsS32prjqSDF");

    const wallet = useAnchorWallet();
    const {connection} = useConnection();
    const provider = initProvider(connection, wallet, golanaLoaderID);

    const { publicKey } = useWallet();
    const [logs, setLogs] = useState<string>(''); // initialize logs state


    const [depositeA, setDepositeA] = useState<number>(0);
    const [depositeB, setDepositeB] = useState<number>(0);

    const [withdraw, setWithdraw] = useState<number>(0);

    const [tradeA, setTradeA] = useState<number>(0);
    const [forB, setForB] = useState<number>(0);

    const [tradeB, setTradeB] = useState<number>(0);
    const [forA, setForA] = useState<number>(0);

    const handleInit = useCallback(async () => {
        //await SwapProgram.createLpMint(provider, new PublicKey(programAuth));
        //await SwapProgram.createInfoAccount(provider, new PublicKey(programAuth));
        setLogs("Init Done!");
      },[wallet, provider, setLogs]);

    const handleCreatePool = useCallback(async () => {
      const swap = await SwapProgram.create(provider, programAuth, provider.publicKey,provider.publicKey,provider.publicKey, 
        mintA, mintB, mintLP);
        const trans = await swap.IxCreatePool();
        await printLog(trans);
    },[wallet, provider]);

    const handleDeposite = useCallback(async () => {
        const swap = await SwapProgram.create(provider, programAuth, provider.publicKey,provider.publicKey,provider.publicKey, 
          mintA, mintB, mintLP, valutA, valutB, infoAccount);
        
          const trans = await swap.IxDeposite(new BN(depositeA).mul(tokenADecimal), new BN(depositeB).mul(tokenBDecimal));
        await printLog(trans);
        await swap.logDepositorAccounts();
    },[wallet, provider, depositeA, depositeB]);
    
    const handleWithdraw = useCallback(async () => {
        const swap = await SwapProgram.create(provider, programAuth, provider.publicKey,provider.publicKey,provider.publicKey, 
          mintA, mintB, mintLP, valutA, valutB, infoAccount);
          
        const trans = await swap.IxWithdraw(new BN(withdraw).mul(lpTokenDecimal));
        await printLog(trans);
        await swap.logDepositorAccounts();
    },[wallet, provider, withdraw]);

    const handleTrade1 = useCallback(async () => {
        const swap = await SwapProgram.create(provider, programAuth, provider.publicKey,provider.publicKey,provider.publicKey, 
          mintA, mintB, mintLP, valutA, valutB, infoAccount);

        const trans = await swap.IxTrade(new BN(tradeA).mul(tokenADecimal), new BN(forB).mul(tokenBDecimal), false);
        await printLog(trans);
        await swap.logTraderAccounts();
    },[wallet, provider, tradeA, forB]);

    const handleTrade2 = useCallback(async () => {
        const swap = await SwapProgram.create(provider, programAuth, provider.publicKey,provider.publicKey,provider.publicKey, 
          mintA, mintB, mintLP, valutA, valutB, infoAccount);
          
        const trans = await swap.IxTrade(new BN(tradeB).mul(tokenBDecimal), new BN(forA).mul(tokenADecimal), true);
        await printLog(trans);
        await swap.logTraderAccounts();
  },[wallet, provider, tradeB, forA]);

    const handleClosePool = useCallback(async () => {
        const swap = await SwapProgram.create(provider, programAuth, provider.publicKey,provider.publicKey,provider.publicKey, 
          mintA, mintB, mintLP, valutA, valutB, infoAccount);

        const trans = await swap.IxClosePool();
        await printLog(trans);
    },[wallet, provider]);

    const printLog = async function (response: string) {
        const result = await provider.connection.getTransaction(response,{
            maxSupportedTransactionVersion: 0,
          });
        console.log(result)
        setLogs(() => `Transaction logs: ${getLogStr(result)}\n`); // update logs state
    }

    return (
    <div>
      <h1 style={{ fontSize: '2rem' }}>Dogswap mainnet demo</h1>
      <p style={{ fontSize: '1rem' }}>A uniswap v2 style swap made with Golana for you to swap dog coins.</p>
      <p style={{ fontSize: '1rem' }}>Please use a burner wallet, as this is just a demo site and we cannot fully trust its security measures.</p>
      <p>
      <Link href="https://github.com/oxfeeefeee/golana-mainnet-demo" style={{ color: '#000', textDecoration: 'underline' }}> Source of this website </Link>
      <br/>
      <Link href="https://github.com/oxfeeefeee/golana/tree/main/examples/swap" style={{ color: '#000', textDecoration: 'underline' }}> Source of the on-chain program </Link>
      </p>
      <hr style={{ margin: '40px 0' }} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* <button className={`big-button bg-green-500 text-white hover:bg-green-700 ${!publicKey ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleInit} disabled={!publicKey} style={{ borderRadius: '5px', width: '200px', fontSize: '1.5rem', marginBottom: '20px' }}> Init </button> */}
        {/* <button className={`big-button bg-green-500 text-white hover:bg-green-700 ${!publicKey ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleCreatePool} disabled={!publicKey} style={{ borderRadius: '5px', width: '200px', fontSize: '1.5rem', marginBottom: '20px' }}> Create Pool </button> */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <label style={{ fontSize: '1.2rem', marginRight: '10px' }}>Trade SAMO</label>
          <input type="number" id="greet-count" value={tradeA} onChange={(e) => setTradeA(parseInt(e.target.value))} style={{ borderRadius: '5px', width: '200px', fontSize: '1.2rem', backgroundColor: '#f5f5f5', border: '1px solid #ccc', padding: '5px' }} />
          <label style={{ fontSize: '1.2rem', marginRight: '10px' }}>For BONK</label>
          <input type="number" id="greet-count" value={forB} onChange={(e) => setForB(parseInt(e.target.value))} style={{ borderRadius: '5px', width: '200px', fontSize: '1.2rem', backgroundColor: '#f5f5f5', border: '1px solid #ccc', padding: '5px' }} />
        </div>
        <button className={`big-button bg-green-500 text-white hover:bg-green-700 ${!publicKey ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleTrade1} disabled={!publicKey} style={{ borderRadius: '5px', width: '200px', fontSize: '1.5rem', marginBottom: '20px' }}> Trade </button>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <label style={{ fontSize: '1.2rem', marginRight: '10px' }}>Trade BONK</label>
          <input type="number" id="greet-count" value={tradeB} onChange={(e) => setTradeB(parseInt(e.target.value))} style={{ borderRadius: '5px', width: '200px', fontSize: '1.2rem', backgroundColor: '#f5f5f5', border: '1px solid #ccc', padding: '5px' }} />
          <label style={{ fontSize: '1.2rem', marginRight: '10px' }}>For SAMO</label>
          <input type="number" id="greet-count" value={forA} onChange={(e) => setForA(parseInt(e.target.value))} style={{ borderRadius: '5px', width: '200px', fontSize: '1.2rem', backgroundColor: '#f5f5f5', border: '1px solid #ccc', padding: '5px' }} />
        </div>
        <button className={`big-button bg-green-500 text-white hover:bg-green-700 ${!publicKey ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleTrade2} disabled={!publicKey} style={{ borderRadius: '5px', width: '200px', fontSize: '1.5rem', marginBottom: '20px' }}> Trade </button>
        {/*  Add a seperation line and some vertial space here: */}
        <hr style={{ margin: '40px 0' }} />
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <label style={{ fontSize: '1.2rem', marginRight: '10px' }}>Deposite: SAMO</label>
          <input type="number" id="greet-count" value={depositeA} onChange={(e) => setDepositeA(parseInt(e.target.value))} style={{ borderRadius: '5px', width: '200px', fontSize: '1.2rem', backgroundColor: '#f5f5f5', border: '1px solid #ccc', padding: '5px' }} />
          <label style={{ fontSize: '1.2rem', marginRight: '10px' }}>BONK</label>
          <input type="number" id="greet-count" value={depositeB} onChange={(e) => setDepositeB(parseInt(e.target.value))} style={{ borderRadius: '5px', width: '200px', fontSize: '1.2rem', backgroundColor: '#f5f5f5', border: '1px solid #ccc', padding: '5px' }} />
        </div>
        <button className={`big-button bg-green-500 text-white hover:bg-green-700 ${!publicKey ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleDeposite} disabled={!publicKey} style={{ borderRadius: '5px', width: '200px', fontSize: '1.5rem', marginBottom: '20px' }}> Deposite </button>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <label style={{ fontSize: '1.2rem', marginRight: '10px' }}>Withdraw:</label>
          <input type="number" id="greet-count" value={withdraw} onChange={(e) => setWithdraw(parseInt(e.target.value))} style={{ borderRadius: '5px', width: '200px', fontSize: '1.2rem', backgroundColor: '#f5f5f5', border: '1px solid #ccc', padding: '5px' }} />
        </div>
        <button className={`big-button bg-green-500 text-white hover:bg-green-700 ${!publicKey ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleWithdraw} disabled={!publicKey} style={{ borderRadius: '5px', width: '200px', fontSize: '1.5rem', marginBottom: '20px' }}> Withdraw </button>
        <p style={{ fontSize: '1.2rem', marginRight: '10px' }}>LP Token: {mintLP.toBase58()}</p>
        {/* <button className={`big-button bg-green-500 text-white hover:bg-green-700 ${!publicKey ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleClosePool} disabled={!publicKey} style={{ borderRadius: '5px', width: '200px', fontSize: '1.5rem', marginBottom: '20px' }}> Close Pool </button> */}
        {/* <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <label style={{ fontSize: '1.5rem', marginRight: '10px' }}>Set Initial Greet Count:</label>
          <input type="number" id="greet-count" value={greetCount} onChange={(e) => setGreetCount(parseInt(e.target.value))} style={{ borderRadius: '5px', width: '200px', fontSize: '1.5rem', backgroundColor: '#f5f5f5', border: '1px solid #ccc', padding: '5px' }} />
        </div>
        <button className={`big-button bg-green-500 text-white hover:bg-green-700 ${!publicKey ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleIxInit} disabled={!publicKey} style={{ borderRadius: '5px', width: '200px', fontSize: '1.5rem', marginBottom: '20px' }}> Send IxInit </button>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <label htmlFor="your-name" style={{ fontSize: '1.5rem', marginRight: '10px' }}>Set Your Name:</label>
          <input type="text" id="your-name" value={yourName} onChange={(e) => setYourName(e.target.value)} style={{ borderRadius: '5px', width: '200px', fontSize: '1.5rem', backgroundColor: '#f5f5f5', border: '1px solid #ccc', padding: '5px' }} />
        </div>
        <button className={`big-button bg-green-500 text-white hover:bg-green-700 ${!publicKey ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleIxGreet} disabled={!publicKey} style={{ borderRadius: '5px', width: '200px', fontSize: '1.5rem' }}> Send IxGreet </button> */}
      </div>
      <br/>
      <textarea
        value={logs}
        readOnly
        style={{ 
          width: '100%', 
          height: '300px', 
          fontFamily: 'monospace',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          resize: 'none'
        }}
      />
    </div>
  )
}

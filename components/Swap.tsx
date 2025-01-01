import React, { useState } from 'react';
import { getTokenInfo, checkAllowance, approveToken, executeSwap } from '../lib/sunswap-interactions';
import tronWeb from '../lib/tronweb-setup';

export default function Swap() {
    const [tokenIn, setTokenIn] = useState('');
    const [tokenOut, setTokenOut] = useState('');
    const [amountIn, setAmountIn] = useState('');
    const [amountOutMin, setAmountOutMin] = useState('');

    const handleSwap = async () => {
        try {
            const allowance = await checkAllowance(tokenIn, tronWeb.defaultAddress.base58);
            if (allowance < amountIn) {
                await approveToken(tokenIn, amountIn);
            }

            const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
            const transaction = await executeSwap(
                tokenIn,
                tokenOut,
                amountIn,
                amountOutMin,
                tronWeb.defaultAddress.base58,
                deadline
            );

            console.log('Swap executed:', transaction);
        } catch (error) {
            console.error('Swap failed:', error);
        }
    };

    return (
        <div>
            <input value={tokenIn} onChange={(e) => setTokenIn(e.target.value)} placeholder="Token In Address" />
            <input value={tokenOut} onChange={(e) => setTokenOut(e.target.value)} placeholder="Token Out Address" />
            <input value={amountIn} onChange={(e) => setAmountIn(e.target.value)} placeholder="Amount In" />
            <input value={amountOutMin} onChange={(e) => setAmountOutMin(e.target.value)} placeholder="Minimum Amount Out" />
            <button onClick={handleSwap}>Swap</button>
        </div>
    );
}


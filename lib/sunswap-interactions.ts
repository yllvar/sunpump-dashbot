import tronWeb from './tronweb-setup';
import { SUNPUMP_CONTRACT_ADDRESS } from './constants';

const SUNSWAP_ROUTER_ADDRESS = 'TKzxdSv2FZKQrEqkKVgp5DcwEXBEKMg2Ax'; // Example address, replace with actual

export async function getTokenInfo(tokenAddress: string) {
  const contract = await tronWeb.contract().at(tokenAddress);
  const name = await contract.name().call();
  const symbol = await contract.symbol().call();
  const decimals = await contract.decimals().call();
  return { name, symbol, decimals };
}

export async function checkAllowance(tokenAddress: string, ownerAddress: string) {
  const contract = await tronWeb.contract().at(tokenAddress);
  const allowance = await contract.allowance(ownerAddress, SUNSWAP_ROUTER_ADDRESS).call();
  return tronWeb.toDecimal(allowance);
}

export async function approveToken(tokenAddress: string, amount: string) {
  const contract = await tronWeb.contract().at(tokenAddress);
  const transaction = await contract.approve(SUNSWAP_ROUTER_ADDRESS, amount).send();
  return transaction;
}

export async function getSwapRoutes(fromToken: string, toToken: string, amount: string) {
  // Note: This is a simplified version. In reality, you might need to interact with a SunSwap API or smart contract to get actual routes
  const amountIn = tronWeb.toBigNumber(amount);
  const estimatedOut = amountIn.multipliedBy(0.98); // Simulating a 2% slippage
  return [
    {
      route: [fromToken, toToken],
      expectedOutput: estimatedOut.toString(),
      fee: amountIn.multipliedBy(0.003).toString(),
      priceImpact: '2%',
      exchangeRate: estimatedOut.dividedBy(amountIn).toString()
    }
  ];
}

export async function executeSwap(
  tokenInAddress: string,
  tokenOutAddress: string,
  amountIn: string,
  amountOutMin: string,
  to: string,
  deadline: number
) {
  const sunswapRouter = await tronWeb.contract().at(SUNSWAP_ROUTER_ADDRESS);
  const transaction = await sunswapRouter.swapExactTokensForTokens(
      amountIn,
      amountOutMin,
      [tokenInAddress, tokenOutAddress],
      to,
      deadline
  ).send();
  return transaction;
}

export async function executeSunpumpSwap(address: string, amountTRX: number) {
  try {
    const sunpumpContract = await tronWeb.contract().at(SUNPUMP_CONTRACT_ADDRESS);
    const transaction = await sunpumpContract.purchaseToken(address, '0').send({
      feeLimit: 1000 * 10 ** 6, // maximum fee, 1000 TRX for now
      callValue: amountTRX * 10 ** 6, // Add decimals to TRX amount
    });
    return transaction;
  } catch (error) {
    console.error("Error executing Sunpump swap:", error);
    throw error;
  }
}


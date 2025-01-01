import tronWeb from './tronWeb';
import { SUNPUMP_CONTRACT_ADDRESS } from './constants';
import SUNPUMP_ABI from './abi/sunpump-launchpad.json';
import TOKEN_ABI from './abi/token-abi.json';

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

async function retryOperation(operation: () => Promise<any>, retries: number = MAX_RETRIES): Promise<any> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      console.log(`Operation failed, retrying in ${RETRY_DELAY / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return retryOperation(operation, retries - 1);
    } else {
      throw error;
    }
  }
}

export async function listenForTokenLaunches(callback: (event: any) => void) {
  try {
    const contract = await retryOperation(() => tronWeb.contract(SUNPUMP_ABI, SUNPUMP_CONTRACT_ADDRESS));
    
    contract.TokenCreate().watch((err: any, event: any) => {
      if (err) {
        console.error('Error on token launch event:', err);
        return;
      }
      
      processTokenLaunchEvent(event, callback);
    });

    console.log('Listening for new token launches...');
  } catch (error) {
    console.error('Failed to set up event listener:', error);
  }
}

async function processTokenLaunchEvent(event: any, callback: (event: any) => void) {
  try {
    const tokenAddress = event.result.tokenAddress;
    const tokenContract = await retryOperation(() => tronWeb.contract(TOKEN_ABI, tokenAddress));
    
    const [name, symbol, totalSupply, decimals] = await Promise.all([
      tokenContract.name().call(),
      tokenContract.symbol().call(),
      tokenContract.totalSupply().call(),
      tokenContract.decimals().call()
    ]);

    const tokenInfo = {
      address: tokenAddress,
      name,
      symbol,
      totalSupply: tronWeb.fromSun(totalSupply),
      decimals: parseInt(decimals),
      launchDate: new Date(),
    };

    callback(tokenInfo);
  } catch (error) {
    console.error('Error processing token launch event:', error);
  }
}

export async function getTokenAnalytics(tokenAddress: string) {
  try {
    const tokenContract = await retryOperation(() => tronWeb.contract(TOKEN_ABI, tokenAddress));
    
    const [totalSupply, decimals] = await Promise.all([
      tokenContract.totalSupply().call(),
      tokenContract.decimals().call()
    ]);

    // For this example, we'll use a mock price. In a real-world scenario, you'd fetch this from an oracle or exchange.
    const mockPrice = 0.01; // TRX
    const marketCap = (parseInt(totalSupply) / Math.pow(10, parseInt(decimals))) * mockPrice;

    // Fetch recent transfers as a proxy for trading volume
    const transfers = await retryOperation(() => 
      tronWeb.getEventResult(tokenAddress, {
        eventName: 'Transfer',
        size: 50,
        onlyConfirmed: true
      })
    );

    const volume = transfers.reduce((acc: number, transfer: any) => {
      return acc + parseInt(transfer.result.value) / Math.pow(10, parseInt(decimals));
    }, 0);

    return {
      marketCap,
      volume,
      price: mockPrice,
      recentTransfers: transfers
    };
  } catch (error) {
    console.error('Error fetching token analytics:', error);
    throw error;
  }
}


import { NextResponse } from 'next/server';
import { log } from '@/lib/logger';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function fetchWithRetry(url: string, retries: number = MAX_RETRIES): Promise<Response> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      log.warn(`Retrying fetch, attempts left: ${retries - 1}`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
}

export async function GET() {
  log.info('Fetching King of the Hill data from Sunpump API');
  try {
    const response = await fetchWithRetry('https://api-v2.sunpump.meme/pump-api/token/getKingOfHill');
    const data = await response.json();
    log.info('Received response from Sunpump API', { data });

    if (data.code !== 0 || data.msg !== "SUCCESS" || !data.data.tokens || data.data.tokens.length === 0) {
      throw new Error('Invalid API response structure');
    }

    const token = data.data.tokens[0];
    
    const kingData = {
      kingAddress: token.ownerAddress,
      kingAmount: token.virtualLiquidity.toString(),
      totalAmount: token.marketCap.toString(),
      symbol: token.symbol,
      name: token.name,
      priceInTrx: token.priceInTrx,
      holders: token.holders,
    };

    log.info('Successfully processed King of the Hill data', { kingData });
    return NextResponse.json(kingData);
  } catch (error) {
    log.error('Failed to fetch King of the Hill data', { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: 'Failed to fetch King of the Hill data', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}


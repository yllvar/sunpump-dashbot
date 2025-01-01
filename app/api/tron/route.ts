import { NextRequest, NextResponse } from 'next/server';
import { getTronWebInstance } from '@/lib/server-tronweb';

export async function POST(req: NextRequest) {
  try {
    const { action, params } = await req.json();
    const tronWeb = await getTronWebInstance();

    switch (action) {
      case 'getAccount':
        const account = await tronWeb.trx.getAccount(params.address);
        return NextResponse.json(account);
      case 'getTokenInfo':
        const contract = await tronWeb.contract().at(params.tokenAddress);
        const name = await contract.name().call();
        const symbol = await contract.symbol().call();
        const decimals = await contract.decimals().call();
        return NextResponse.json({ name, symbol, decimals });
      // Add more cases for other TronWeb operations as needed
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('TronWeb operation failed:', error);
    return NextResponse.json({ error: 'TronWeb operation failed' }, { status: 500 });
  }
}


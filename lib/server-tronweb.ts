import TronWeb from 'tronweb';

let tronWebInstance: TronWeb | null = null;

export async function getTronWebInstance(): Promise<TronWeb> {
  if (tronWebInstance) {
    return tronWebInstance;
  }

  const HttpProvider = TronWeb.providers.HttpProvider;
  const fullNode = new HttpProvider(process.env.NEXT_PUBLIC_TRON_FULL_HOST);
  const solidityNode = new HttpProvider(process.env.NEXT_PUBLIC_TRON_FULL_HOST);
  const eventServer = process.env.NEXT_PUBLIC_TRON_FULL_HOST;

  tronWebInstance = new TronWeb(
    fullNode,
    solidityNode,
    eventServer,
    process.env.TRON_PRIVATE_KEY // Make sure this is set in your environment variables
  );

  // Set up API key for TronGrid (if using TronGrid as the full node)
  if (process.env.TRON_API_KEY) {
    tronWebInstance.setHeader({"TRON-PRO-API-KEY": process.env.TRON_API_KEY});
  }

  return tronWebInstance;
}


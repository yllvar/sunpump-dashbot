import TronWeb from 'tronweb';

const fullNode = process.env.NEXT_PUBLIC_TRON_FULL_HOST;
const solidityNode = process.env.NEXT_PUBLIC_TRON_FULL_HOST;
const eventServer = process.env.NEXT_PUBLIC_TRON_FULL_HOST;
const privateKey = process.env.TRON_PRIVATE_KEY;

const tronWeb = new TronWeb(
  fullNode,
  solidityNode,
  eventServer,
  privateKey
);

// Set up API key for TronGrid (if using TronGrid as the full node)
tronWeb.setHeader({"TRON-PRO-API-KEY": process.env.TRON_API_KEY});

export default tronWeb;


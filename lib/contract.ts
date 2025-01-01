import tronWeb from './tronweb-setup';
import { SUNPUMP_CONTRACT_ADDRESS } from './constants';
import SUNPUMP_ABI from './abi/sunpump-launchpad.json';

export async function getSunpumpContract() {
  return await tronWeb.contract(SUNPUMP_ABI, SUNPUMP_CONTRACT_ADDRESS);
}


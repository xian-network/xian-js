import { MasternodeAPI } from "../lib/masternode-api";
import { I_NetworkSettings } from "../types";

async function main() {
	let network_info: I_NetworkSettings = {
		chain_id: "xian-testnet-1",
		type: "testnet",
		masternode_hosts: ["http://135.181.96.77:26657"]
	};

	const masternode_api = new MasternodeAPI(network_info);

	const contract = await masternode_api.getContractInfo("currency");
	console.log({ contract });
}

main();

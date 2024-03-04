import { MasternodeAPI } from "xian-js";
import type { I_NetworkSettings } from "xian-js";

async function main() {
	let network_info: I_NetworkSettings = {
		chain_id: "xian-testnet-2",
		type: "testnet",
		masternode_hosts: ["https://testnet.xian.org"]
	};

	const masternode_api = new MasternodeAPI(network_info);

	const methods = await masternode_api.getContractMethods("currency");
	console.log({methods})
}

main();

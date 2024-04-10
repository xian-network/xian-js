import { MasternodeAPI } from "xian-js";
import type { I_NetworkSettings } from "xian-js";

async function main() {
	let network_info: I_NetworkSettings = {
		chain_id: "xian-testnet-1",
		type: "testnet",
		masternode_hosts: ["https://testnet.xian.org"]
	};

	const masternode_api = new MasternodeAPI(network_info);

	const methods = await masternode_api.getContractMethods("con_multisend");
	console.log({methods})
}

main();

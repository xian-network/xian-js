import { MasternodeAPI } from "../src/lib/masternode-api";
import { I_NetworkSettings } from "../src/types";

async function main() {
	let network_info: I_NetworkSettings = {
		chain_id: "xian-testnet-1",
		type: "testnet",
		masternode_hosts: ["http://135.181.96.77:26657"]
	};

	const masternode_api = new MasternodeAPI(network_info);

	const balance = await masternode_api.getCurrencyBalance("ee06a34cf08bf72ce592d26d36b90c79daba2829ba9634992d034318160d49f9");

	console.log({ balance: balance.toString() });
}

main();

import { TransactionBuilder, Wallet } from "xian-js";
import type { I_NetworkSettings, I_TxInfo } from "xian-js";

async function main() {
	const wallet = Wallet.create_wallet({ sk: "cd6cc45ffe7cebf09c6c6025575d50bb42c6c70c07e1dbc5150aaadc98705c2b" });

	const sk = wallet.sk;
	const vk = wallet.vk;

	console.log({ sk, vk });

	let network_info: I_NetworkSettings = {
		chain_id: "xian-testnet-1",
		masternode_hosts: ["http://testnet.xian.org"]
	};

	let tx_info: I_TxInfo = {
		senderVk: wallet.vk,
		chain_id: network_info.chain_id,
		contractName: "currency",
		methodName: "approve",
		kwargs: {
			to: "burn",
			amount: 1
		},
		stampLimit: 50000 // Max stamps to be used. Could use less, won't use more.
	};
	const transaction = new TransactionBuilder(network_info, tx_info);
	const send_res = await transaction.send(sk);
	console.log({ send_res });
}

main();

import { decodeInt, decodeObj, decodeQuery, decodeStr, stringifyTransaction } from "./helpers";
import { I_BroadcastTxResult, I_NetworkSettings, I_SendTxResult, I_Transaction } from "../types";
import { Encoder } from "./encoder";

export class MasternodeAPI {
	hosts: string[];

	constructor(network_settings: I_NetworkSettings) {
		if (typeof network_settings !== "object" || Object.keys(network_settings).length === 0)
			throw new Error(`Expected Object and got Type: ${typeof network_settings}`);
		if (!Array.isArray(network_settings.masternode_hosts) || network_settings.masternode_hosts.length === 0)
			throw new Error(`HOSTS Required (Type: Array)`);
		this.hosts = this.validateHosts(network_settings.masternode_hosts);
	}

	validateProtocol(host: string) {
		let protocols = ["https://", "http://"];
		if (protocols.map((protocol) => host.includes(protocol)).includes(true)) return host;
		throw new Error("Host String must include http:// or https://");
	}

	validateHosts(hosts: string[]) {
		return hosts.map((host) => this.validateProtocol(host.toLowerCase()));
	}

	get host() {
		const host = this.hosts[Math.floor(Math.random() * this.hosts.length)]
		return host;
	}

	get url() {
		return this.host;
	}

	async getContractInfo(contractName: string) {
		const response = await fetch(`${this.host}/abci_query?path="/contract/${contractName}"`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = await response.json();
		return decodeQuery(data.result.response);
	}

	async getVariable(contract: string, variable: string) {
		let path = `/get/${contract}.${variable}/`;
		const url = `${this.host}/abci_query?path="${path}"`;
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = await response.json();
		const result = data.result.response;
		let decoded = decodeQuery(result);
		return decoded;
	}

	async getContractMethods(contractName) {
		const response = await fetch(`${this.host}/abci_query?path="/contract_methods/${contractName}"`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = await response.json();
		return JSON.parse(decodeQuery(data.result.response) as string);
	}

	async getContractVariables(contractName) {
		const response = await fetch(`${this.host}/abci_query?path="/contract_vars/${contractName}"`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = await response.json();
		return JSON.parse(decodeQuery(data.result.response) as string);
	}

	async pingServer() {
		const response = await fetch(`${this.host}/abci_query?path="/ping/"`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = await response.json();
		return JSON.parse(decodeQuery(data.result.response) as string);
	}

	async getCurrencyBalance(vk: string) {
		let balanceRes = await this.getVariable("currency", `balances:${vk}`);
		if (!balanceRes) return Encoder("bigNumber", 0);
		if (balanceRes) return Encoder("bigNumber", balanceRes);
		return Encoder("bigNumber", balanceRes.toString());
	}

	async contractExists(contractName) {
		const contract = await this.getContractInfo(contractName);
		if (contract) return true;
		return false;
	}

	async broadcastTx(tx: I_Transaction): Promise<I_SendTxResult> {
		const tx_string = stringifyTransaction(tx);
		const url = `${this.host}/broadcast_tx_commit?tx="${tx_string}"`;
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = await response.json();

		// Catch RPC errors
		if (data.error) {
			return { success: false, error: data.error?.data || data.error };
		}

		const { check_tx, tx_result, hash } = data.result as I_BroadcastTxResult;

		// Catch check_tx errors
		const check_tx_ok = check_tx.code === 0;
		if (!check_tx_ok) {
			return { success: false, error: check_tx.log };
		}

		// Catch tx_result errors
		const result_data = tx_result.data ? decodeObj(tx_result.data) : null;
		const check = check_tx.code === 0;
		const deliver = tx_result.code === 0;

		return { success: check && deliver, data: result_data, hash };
	}

	async broadcastTxAsync(tx: I_Transaction): Promise<I_SendTxResult>{
		const tx_string = stringifyTransaction(tx);
		const url = `${this.host}/broadcast_tx_sync?tx="${tx_string}"`;
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = await response.json();

		// Catch RPC errors
		if (data.error) {
			return { success: false, error: data.error?.data || data.error };
		}

		const check_tx_ok = data.result?.code === 0;
		const hash = data.result?.hash;

		// Catch check_tx errors
		if (!check_tx_ok) {
			return { success: false, error: data.result?.log };
		}

		// Retrieve TX result
		const tx_result = await this.getTxResultAsync(hash);

		// Catch tx_result errors
		const result_data = tx_result.data ? decodeObj(tx_result.data) : null;
		const deliver_tx_ok = tx_result.code === 0;
		return { success: check_tx_ok && deliver_tx_ok, data: result_data, hash };
	}

	async simulateTxn(tx: I_Transaction) {
		const tx_string = stringifyTransaction(tx);
		const url = `${this.host}/abci_query?path="/estimate_stamps/${tx_string}"`;
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = await response.json();
		return JSON.parse(decodeQuery(data.result.response) as string);
	}

	async getTxResultAsync(hash: string) {
		let retries = 0;
		let timeout = 1000;
		while (retries < 5) {
			try {
				const { result } = await this.getTxResult(hash);
				if (result.error) throw new Error(result.error.data);
				return result?.tx_result;
			} catch (e) {
				await new Promise(resolve => setTimeout(resolve, timeout));
				timeout *= 2; // exponential back-off
				retries++;
			}
		}
		return { code: 1, log: "Failed to get transaction result" };
	}

	async getTxResult(hash: string) {
		const response = await fetch(`${this.host}/tx?hash=0x${hash}&prove=true`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = await response.json();
		return data
	}

	async getNonce(vk: string) {
		const path = `/abci_query?path="/get_next_nonce/${vk}"`;
		const url = `${this.host}${path}`;
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = await response.json();
		const value = data.result.response.value;
		if (value === "AA==") return 0;
		const decoded = decodeInt(value);
		return decoded;
	}

	getTransaction(hash: string) {
		return fetch(`${this.host}/tx?hash="0x${hash}"`).then(response => response.json());
	}

	getNodeInfo() {
		return fetch(`${this.host}/status`).then(response => response.json());
	}

	async getLastetBlock() {
		const response = await fetch(`${this.host}/block`);
		return response.json();
	}
}

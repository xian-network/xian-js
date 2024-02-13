
import axios from "axios";
import { decodeInt, decodeObj, stringifyTransaction } from "./helpers";
import { I_BroadcastTxResult, I_NetworkSettings, I_SendTxResult, I_Transaction } from "../types";

export class MasternodeAPI {
	hosts: string[];

	constructor(networkInfoObj: I_NetworkSettings) {
		if (typeof networkInfoObj !== "object" || Object.keys(networkInfoObj).length === 0)
			throw new Error(`Expected Object and got Type: ${typeof networkInfoObj}`);
		if (!Array.isArray(networkInfoObj.masternode_hosts) || networkInfoObj.masternode_hosts.length === 0)
			throw new Error(`HOSTS Required (Type: Array)`);
		this.hosts = this.validateHosts(networkInfoObj.masternode_hosts);
	}
	validateProtocol(host: string) {
		let protocols = ["https://", "http://"];
		if (protocols.map((protocol) => host.includes(protocol)).includes(true)) return host;
		throw new Error("Host String must include http:// or https://");
	}

	validateHosts(hosts) {
		return hosts.map((host) => this.validateProtocol(host.toLowerCase()));
	}

	get host() {
		return this.hosts[Math.floor(Math.random() * this.hosts.length)];
	}

	get url() {
		return this.host;
	}

	// async getContractInfo(contractName) {
	// 	const returnInfo = (res) => {
	// 		try {
	// 			if (res.name) return res;
	// 		} catch (e) {}
	// 		return { error: `${contractName} does not exist` };
	// 	};
	// 	let path = `/contracts/${contractName}`;
	// 	return this.send("GET", path, {}, undefined, (res, err) => returnInfo(res)).then((res) => returnInfo(res));
	// }

	// async getVariable(contract, variable, key = "") {
	// 	let parms = {};
	// 	if (validateTypes.isStringWithValue(key)) parms.key = key;

	// 	let path = `/contracts/${contract}/${variable}/`;

	// 	const returnValue = (res) => {
	// 		try {
	// 			if (res.value) return res.value;
	// 		} catch (e) {}
	// 		return null;
	// 	};
	// 	return this.send("GET", path, { parms }, undefined, (res, err) => returnValue(res)).then((res) => returnValue(res));
	// }

	// async getContractMethods(contract) {
	// 	const getMethods = (res) => {
	// 		try {
	// 			if (res.methods) return res.methods;
	// 		} catch (e) {}
	// 		return [];
	// 	};
	// 	let path = `/contracts/${contract}/methods`;
	// 	return this.send("GET", path, {}, undefined, (res, err) => getMethods(res)).then((res) => getMethods(res));
	// }

	// async getContractVariables(contract) {
	// 	const getVariables = (res) => {
	// 		try {
	// 			if (res.variables) return res;
	// 		} catch (e) {}
	// 		return {};
	// 	};
	// 	let path = `/contracts/${contract}/variables`;
	// 	return this.send("GET", path, {}, undefined, (res, err) => getVariables(res)).then((res) => getVariables(res));
	// }

	// async pingServer() {
	// 	const getStatus = (res) => {
	// 		try {
	// 			if (res.status) return true;
	// 		} catch (e) {}
	// 		return false;
	// 	};
	// 	let response = await this.send("GET", "/ping", {}, undefined, (res, err) => getStatus(res));
	// 	return getStatus(response);
	// }

	// async getCurrencyBalance(vk) {
	// 	let balanceRes = await this.getVariable("currency", "balances", vk);
	// 	if (!balanceRes) return Encoder("bigNumber", 0);
	// 	if (balanceRes.__fixed__) return Encoder("bigNumber", balanceRes.__fixed__);
	// 	return Encoder("bigNumber", balanceRes.toString());
	// }

	// async contractExists(contractName) {
	// 	const exists = (res) => {
	// 		try {
	// 			if (res.name) return true;
	// 		} catch (e) {}
	// 		return false;
	// 	};
	// 	let path = `/contracts/${contractName}`;
	// 	return this.send("GET", path, {}, undefined, (res, err) => exists(res)).then((res) => exists(res));
	// }

	async broadcastTx(tx: I_Transaction): Promise<I_SendTxResult> {
		const txString = stringifyTransaction(tx);
		const url = `${this.host}/broadcast_tx_commit?tx="${txString}"`;
		const { data } = await axios.get(url);
		const { check_tx, deliver_tx, hash } = data.result as I_BroadcastTxResult;
		const result_data = deliver_tx.data ? decodeObj(deliver_tx.data) : null;
		const check = check_tx.code === 0;
		const deliver = deliver_tx.code === 0;
		return { success: check && deliver, data: result_data, hash };
	}

	async getNonce(vk: string) {
		const path = `/abci_query?path="/get_next_nonce/${vk}"`;
		const url = `${this.host}${path}`;
		const { data } = await axios.post(url);
		const value = data.result.response.value;
		if (value === "AA==") return 0;
		const decoded = decodeInt(value);
		return decoded;
	}

	getTransaction(hash: string) {
		return axios.get(`${this.host}/tx?hash="0x${hash}"`);
	}

	getNodeInfo() {
		return axios.get(`${this.host}/status`);
	}

	async getLastetBlock() {
		return axios.get(`${this.host}/block`);
	}
}

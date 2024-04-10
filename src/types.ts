/**
 * Used when instantiating a TransactionBuilder class.
 */

export interface I_NetworkSettings {
	chain_id: string; // unique id of the chain
	type: T_NetworkType; // testnet | mainnet
	masternode_hosts: string[];
}

export type T_NetworkType = "mainnet" | "testnet";

/**
 * Used when instantiating a TransactionBuilder class.
 */

export interface I_TxInfo {
	senderVk: string;
	chain_id: string;
	contractName: string;
	methodName: string;
	kwargs: { [key: string]: any };
	stampLimit: number;
	nonce?: number;
}

/**
 * Tendermint return schema for broadcast_tx_commit
 */

export interface I_BroadcastTxResult {
	check_tx: I_CheckTx;
	tx_result: I_DeliverTx;
	hash: string;
	height: string;
}

export interface I_CheckTx {
	code: number;
	data: null | string;
	log: string;
	info: string;
	gas_wanted: string;
	gas_used: string;
	events: any[];
	codespace: string;
	sender: string;
	priority: string;
	mempoolError: string;
}

export interface I_DeliverTx {
	code: number;
	data: string;
	log: string;
	info: string;
	gas_wanted: string;
	gas_used: string;
	events: any[];
	codespace: string;
}

export interface I_SendTxResult {
	success: boolean;
	data?: any;
	hash?: string;
	error?: string;
}

export interface I_CreateWalletArgs {
	sk: string;
	keepPrivate: boolean;
	seed: string;
}

export interface I_Payload {
	sender: string;
	contract: string;
	function: string;
	kwargs: { [key: string]: any };
	stamps_supplied: number;
	chain_id: string;
	nonce: number;
}

export interface I_PayloadSorted {
	orderedPayload: I_Payload;
	json: string;
}

export interface I_Transaction {
	metadata: {
		signature: string;
	};
	payload: I_Payload;
}

export type T_QueryResponseDataType = "str" | "int" | "decimal"

export interface I_CreateWallet {
	sk?: string;
	keepPrivate?: boolean;
	seed?: string;
}

import * as wallet from "./wallet";
import { makePayload, makeTransaction } from "./helpers";
import { I_NetworkSettings, I_Payload, I_PayloadSorted, I_SendTxResult, I_TxInfo } from "../types";
import { MasternodeAPI } from "./masternode-api";

export class TransactionBuilder {
	uid: string;
	sender: string;
	contract: string;
	method: string;
	kwargs: object = {};
	stampLimit: number;
	nonce: number;
	signature: string;
	transactionSigned: boolean = false;
	txSendResult: { hash?: string; errors: string[] } = { errors: [] };
	txBlockResult: object = {};
	txHash: string;
	chain_id: string;
	resultInfo: any;
	payload: I_Payload;
	sortedPayload: I_PayloadSorted;
	masternodeApi: MasternodeAPI;

	constructor(networkSettings: I_NetworkSettings, txInfo: I_TxInfo, txData?: any) {
		/**
		 * Validate Data
		 */

		if (typeof txInfo !== "object" || Object.keys(txInfo).length === 0) throw new Error(`txInfo object not found`);
		if (typeof txInfo.chain_id !== "string") throw new Error(`chain_id must be provided (Type: String)`);
		if (typeof txInfo.senderVk !== "string" || !/^[0-9a-fA-F]+$/.test(txInfo.senderVk))
			throw new Error(`Sender Public Key Required (Type: Hex String)`);
		if (typeof txInfo.contractName !== "string" || txInfo.contractName.trim() === "")
			throw new Error(`Contract Name Required (Type: String)`);
		if (typeof txInfo.methodName !== "string" || txInfo.methodName.trim() === "") throw new Error(`Method Required (Type: String)`);
		if (typeof txInfo.stampLimit !== "number" || !Number.isInteger(txInfo.stampLimit))
			throw new Error(`Stamps Limit Required (Type: Integer)`);
		if (txInfo.nonce) {
			if (!Number.isInteger(txInfo.nonce))
				throw new Error(`arg[6] Nonce is required to be an Integer, type ${typeof txInfo.nonce} was given`);
			this.nonce = txInfo.nonce;
		}
		this.sender = txInfo.senderVk;
		this.masternodeApi = new MasternodeAPI(networkSettings);
		this.contract = txInfo.contractName;
		this.method = txInfo.methodName;
		if (typeof txInfo.kwargs === "object") {
			this.kwargs = txInfo.kwargs;
		}
		this.stampLimit = txInfo.stampLimit;
		this.chain_id = networkSettings.chain_id;

		this.nonce = txInfo.nonce !== undefined ? txInfo.nonce : undefined;  // user may set the nonce manually.
		this.payload = {
			sender: txInfo.senderVk,
			contract: txInfo.contractName,
			function: txInfo.methodName,
			kwargs: txInfo.kwargs,
			stamps_supplied: txInfo.stampLimit,
			chain_id: txInfo.chain_id,
			nonce: this.nonce
		};

		if (txData) {
			if (txData.uid) this.uid = txData.uid;
			if (txData.txSendResult && typeof txData.txSendResult === "object" && Object.keys(txData.txSendResult).length > 0)
				this.txSendResult = txData.txSendResult;
			if (txData.txSendResult && typeof txData.txSendResult === "object" && Object.keys(txData.txSendResult).length > 0) {
				this.txSendResult = txData.txSendResult;
				if (this.txSendResult.hash) this.txHash = this.txSendResult.hash;
			}
			if (txData.txBlockResult && typeof txData.txBlockResult === "object" && Object.keys(txData.txBlockResult).length > 0)
				this.txBlockResult = txData.txBlockResult;
			if (txData.resultInfo && typeof txData.resultInfo === "object" && Object.keys(txData.resultInfo).length > 0)
				this.resultInfo = txData.resultInfo;
		}
	}

	private sign(sk: string, sortedPayload: I_PayloadSorted) {
		const stringBuffer = Buffer.from(sortedPayload.json);
		const stringArray = new Uint8Array(stringBuffer);
		return wallet.sign(sk, stringArray);
	}

	public async send(sk: string): Promise<I_SendTxResult> {
		try {
			// If the user didn't supply a nonce, get one from a node.
			if (!this.payload.nonce) {
				this.payload.nonce = await this.masternodeApi.getNonce(this.sender);
			}
			this.sortedPayload = makePayload(this.payload);
			// Sign the transaction
			const signature = this.sign(sk, this.sortedPayload);
			//Serialize transaction
			const tx = makeTransaction(signature, this.sortedPayload);
			//Send transaction to the masternode
			let response = await this.masternodeApi.broadcastTx(tx);
			return response;
		} catch (e) {
			return {
				success: false,
				error: e
			};
		}
	}

	public async getNonce(): Promise<number> {
		return await this.masternodeApi.getNonce(this.sender);
	}
}
